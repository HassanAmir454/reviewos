import asyncio
import re

from google import genai

from app.config import settings
from app.routers.ws import manager
from app.services.github_service import github_service


def _extract_risk_level(text: str) -> str:
    m = re.search(r'RISK LEVEL.*?(LOW|MEDIUM|HIGH|CRITICAL)', text, re.IGNORECASE | re.DOTALL)
    if m:
        return m.group(1).lower()
    return "medium"


def _build_prompt(pr_number: int, repo: str, title: str, body: str,
                  base_branch: str, changed_files: int, diff_text: str) -> str:
    # Truncate diff to ~6000 chars to keep inside token budget
    if len(diff_text) > 6000:
        diff_text = diff_text[:6000] + "\n\n... [diff truncated for length] ..."

    return f"""You are a senior code reviewer. Analyze this pull request diff and provide structured feedback.

PR Title: {title}
PR Description: {body or 'No description provided.'}
Base Branch: {base_branch}
Files Changed: {changed_files}
Repository: {repo}
PR Number: #{pr_number}

DIFF:
{diff_text}

Provide your review in this exact structure:

## SUMMARY
[2-3 sentence overall assessment of this pull request]

## ISSUES
For each issue use exactly: [CRITICAL|WARNING|INFO] filename:line_number - description
List all issues found. If none, write "No issues found."

## POSITIVES
List what was done well, one item per line starting with "- "

## SUGGESTIONS
Concrete, actionable code suggestions (one per line starting with "- ")

## RISK LEVEL
[LOW|MEDIUM|HIGH|CRITICAL] - one line justification
"""


class AIReviewService:
    def __init__(self) -> None:
        if settings.gemini_api_key:
            self.client = genai.Client(api_key=settings.gemini_api_key)
        else:
            self.client = None

    async def stream_review(
        self,
        repo: str,
        pr_number: int,
        review_id: str,
        client_id: str,
    ) -> None:
        full_text = ""

        try:
            # Try to fetch real diff from GitHub
            diff_text = ""
            title = f"PR #{pr_number}"
            body = ""
            base_branch = "main"
            changed_files = 0

            try:
                owner, name = repo.split("/", 1)
                pr_detail = await github_service.get_pr_detail(owner, name, pr_number)
                diff_text = pr_detail.diff
                title = pr_detail.title
                body = pr_detail.body
                base_branch = pr_detail.base_branch
                changed_files = pr_detail.changed_files
            except Exception:
                diff_text = "Diff unavailable — performing review based on PR metadata only."

            prompt = _build_prompt(pr_number, repo, title, body, base_branch, changed_files, diff_text)

            if not self.client:
                # Demo mock stream
                mock = [
                    "## SUMMARY\n",
                    "This pull request introduces changes to the codebase. ",
                    "Overall structure looks reasonable but requires closer inspection.\n\n",
                    "## ISSUES\n",
                    "[WARNING] src/index.ts:42 - Consider adding null checks before property access\n",
                    "[INFO] src/utils.ts:15 - Magic number should be extracted to a named constant\n\n",
                    "## POSITIVES\n",
                    "- Good separation of concerns\n",
                    "- Tests are included\n\n",
                    "## SUGGESTIONS\n",
                    "- Add error boundary around async calls\n",
                    "- Extract repeated logic into a shared utility\n\n",
                    "## RISK LEVEL\n",
                    "MEDIUM - Minor issues found, none blocking merge.",
                ]
                for token in mock:
                    await asyncio.sleep(0.08)
                    full_text += token
                    await manager.send_to_client(client_id, {
                        "type": "review.token",
                        "data": {"reviewId": review_id, "token": token},
                    })
            else:
                response_stream = await self.client.aio.models.generate_content_stream(
                    model="gemini-2.5-flash",
                    contents=prompt,
                )
                async for chunk in response_stream:
                    token = chunk.text
                    if token:
                        full_text += token
                        await manager.send_to_client(client_id, {
                            "type": "review.token",
                            "data": {"reviewId": review_id, "token": token},
                        })

            await manager.send_to_client(client_id, {
                "type": "review.complete",
                "data": {"reviewId": review_id, "fullText": full_text},
            })

        except Exception as exc:
            await manager.send_to_client(client_id, {
                "type": "review.error",
                "data": {"reviewId": review_id, "message": str(exc)},
            })


ai_review_service = AIReviewService()
