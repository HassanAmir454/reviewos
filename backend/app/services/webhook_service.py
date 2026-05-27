from app.routers.ws import manager
from app.tasks.process_webhook import process_webhook_task


class WebhookService:
    """Process raw GitHub webhook payloads and dispatch relevant events."""

    async def handle(self, event: str, payload: dict) -> None:
        if event == "pull_request":
            await self._handle_pull_request(payload)
        elif event == "pull_request_review":
            await self._handle_review(payload)
        elif event == "push":
            await self._handle_push(payload)

    async def _handle_pull_request(self, payload: dict) -> None:
        action = payload.get("action", "")
        pr_data = payload.get("pull_request", {})

        msg: dict | None = None
        if action == "opened":
            msg = {"type": "pr.opened", "data": self._map_pr(pr_data)}
        elif action in ("edited", "synchronize", "review_requested", "labeled"):
            msg = {"type": "pr.updated", "data": self._map_pr(pr_data)}
        elif action in ("closed",):
            msg = {"type": "pr.closed", "data": {"number": pr_data.get("number")}}

        if msg:
            await manager.broadcast(msg)

        # Offload heavy sync to Celery
        process_webhook_task.delay(payload)

    async def _handle_review(self, payload: dict) -> None:
        pr_data = payload.get("pull_request", {})
        msg = {"type": "pr.updated", "data": self._map_pr(pr_data)}
        await manager.broadcast(msg)

    async def _handle_push(self, payload: dict) -> None:
        await manager.broadcast({
            "type": "sync.status",
            "data": {"message": "New commits pushed", "progress": 1.0},
        })

    @staticmethod
    def _map_pr(pr: dict) -> dict:
        return {
            "number": pr.get("number"),
            "title": pr.get("title", ""),
            "state": "draft" if pr.get("draft") else pr.get("state", "open"),
            "reviewState": "pending",
            "author": pr.get("user", {}).get("login", ""),
            "authorAvatar": pr.get("user", {}).get("avatar_url", ""),
            "createdAt": pr.get("created_at", ""),
            "updatedAt": pr.get("updated_at", ""),
            "additions": pr.get("additions", 0),
            "deletions": pr.get("deletions", 0),
            "changedFiles": pr.get("changed_files", 0),
            "baseBranch": pr.get("base", {}).get("ref", "main"),
            "headBranch": pr.get("head", {}).get("ref", ""),
            "labels": [lbl["name"] for lbl in pr.get("labels", [])],
            "complexityScore": None,
            "aiRiskLevel": None,
        }


webhook_service = WebhookService()
