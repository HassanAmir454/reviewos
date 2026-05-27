import httpx
from datetime import datetime, timezone
from typing import Any

from app.config import settings
from app.schemas.pr import PRListItem, PRDetail, FileChange, PRComment
from app.schemas.analytics import ContributorStats
from app.utils.diff_parser import parse_diff
from app.utils.complexity import calculate_complexity


class GitHubService:
    BASE = "https://api.github.com"

    def __init__(self) -> None:
        self._headers = {
            "Authorization": f"Bearer {settings.github_token}",
            "Accept": "application/vnd.github.v3+json",
        }

    def _client(self) -> httpx.AsyncClient:
        return httpx.AsyncClient(
            headers=self._headers,
            timeout=30.0,
            follow_redirects=True,
        )

    @staticmethod
    def _parse_dt(s: str) -> datetime:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))

    # ── Pull requests ─────────────────────────────────

    async def get_pull_requests(
        self, owner: str, repo: str, state: str = "open"
    ) -> list[PRListItem]:
        async with self._client() as client:
            resp = await client.get(
                f"{self.BASE}/repos/{owner}/{repo}/pulls",
                params={"state": state, "per_page": 50},
            )
            resp.raise_for_status()
            data: list[dict[str, Any]] = resp.json()

        prs: list[PRListItem] = []
        for pr in data:
            review_state = "pending"
            if pr.get("draft"):
                review_state = "pending"

            prs.append(
                PRListItem(
                    number=pr["number"],
                    title=pr["title"],
                    state="draft" if pr.get("draft") else pr["state"],
                    review_state=review_state,
                    author=pr["user"]["login"],
                    author_avatar=pr["user"]["avatar_url"],
                    created_at=self._parse_dt(pr["created_at"]),
                    updated_at=self._parse_dt(pr["updated_at"]),
                    additions=pr.get("additions", 0),
                    deletions=pr.get("deletions", 0),
                    changed_files=pr.get("changed_files", 0),
                    base_branch=pr["base"]["ref"],
                    head_branch=pr["head"]["ref"],
                    labels=[lbl["name"] for lbl in pr.get("labels", [])],
                )
            )
        return prs

    async def get_pr_detail(
        self, owner: str, repo: str, pr_number: int
    ) -> PRDetail:
        async with self._client() as client:
            # Fetch PR metadata
            pr_resp = await client.get(
                f"{self.BASE}/repos/{owner}/{repo}/pulls/{pr_number}"
            )
            pr_resp.raise_for_status()
            pr = pr_resp.json()

            # Fetch diff
            diff_resp = await client.get(
                f"{self.BASE}/repos/{owner}/{repo}/pulls/{pr_number}",
                headers={**self._headers, "Accept": "application/vnd.github.v3.diff"},
            )
            diff_resp.raise_for_status()
            raw_diff = diff_resp.text

            # Fetch file list
            files_resp = await client.get(
                f"{self.BASE}/repos/{owner}/{repo}/pulls/{pr_number}/files",
                params={"per_page": 100},
            )
            files_resp.raise_for_status()
            files_data: list[dict[str, Any]] = files_resp.json()

        # Compute complexity
        complexity = calculate_complexity(raw_diff)

        files = [
            FileChange(
                filename=f["filename"],
                status=f["status"],
                additions=f["additions"],
                deletions=f["deletions"],
                patch=f.get("patch", ""),
            )
            for f in files_data
        ]

        review_state = "pending"
        if pr.get("draft"):
            review_state = "pending"

        return PRDetail(
            number=pr["number"],
            title=pr["title"],
            state="draft" if pr.get("draft") else pr["state"],
            review_state=review_state,
            author=pr["user"]["login"],
            author_avatar=pr["user"]["avatar_url"],
            created_at=self._parse_dt(pr["created_at"]),
            updated_at=self._parse_dt(pr["updated_at"]),
            additions=pr.get("additions", 0),
            deletions=pr.get("deletions", 0),
            changed_files=pr.get("changed_files", 0),
            base_branch=pr["base"]["ref"],
            head_branch=pr["head"]["ref"],
            labels=[lbl["name"] for lbl in pr.get("labels", [])],
            complexity_score=complexity.total_score,
            body=pr.get("body") or "",
            diff=raw_diff,
            files=files,
            comments=[],
            reviews=[],
        )

    async def get_pr_diff(self, owner: str, repo: str, pr_number: int) -> str:
        async with self._client() as client:
            resp = await client.get(
                f"{self.BASE}/repos/{owner}/{repo}/pulls/{pr_number}",
                headers={**self._headers, "Accept": "application/vnd.github.v3.diff"},
            )
            resp.raise_for_status()
            return resp.text

    # ── Contributor stats ────────────────────────────

    async def get_contributor_stats(
        self, owner: str, repo: str
    ) -> list[ContributorStats]:
        async with self._client() as client:
            resp = await client.get(
                f"{self.BASE}/repos/{owner}/{repo}/contributors",
                params={"per_page": 30},
            )
            if resp.status_code == 202:
                # GitHub is computing stats; return empty for now
                return []
            resp.raise_for_status()
            data: list[dict[str, Any]] = resp.json()

        return [
            ContributorStats(
                username=c["login"],
                avatar_url=c["avatar_url"],
                pr_count=c.get("contributions", 0),
                merged_count=c.get("contributions", 0),
                merge_rate=100.0,
                avg_days_to_merge=2.0,
                lines_added=0,
                lines_removed=0,
                contribution_score=float(c.get("contributions", 0)),
            )
            for c in data
        ]

    # ── Commit activity ───────────────────────────────

    async def get_commit_activity(
        self, owner: str, repo: str
    ) -> list[dict[str, Any]]:
        async with self._client() as client:
            resp = await client.get(
                f"{self.BASE}/repos/{owner}/{repo}/stats/commit_activity"
            )
            if resp.status_code in (202, 204):
                return []
            resp.raise_for_status()
            return resp.json()

    # ── Post review comment ──────────────────────────

    async def post_review_comment(
        self, owner: str, repo: str, pr_number: int, body: str
    ) -> None:
        async with self._client() as client:
            resp = await client.post(
                f"{self.BASE}/repos/{owner}/{repo}/issues/{pr_number}/comments",
                json={"body": body},
            )
            resp.raise_for_status()


github_service = GitHubService()
