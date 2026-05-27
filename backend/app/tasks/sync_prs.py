from app.tasks.celery_app import celery_app
import asyncio

@celery_app.task(name="sync_prs_task")
def sync_prs_task(repo_owner: str, repo_name: str):
    """Background task to sync PRs from GitHub to the local database."""
    # Since SQLAlchemy + httpx are async, we need an event loop
    # For demonstration purposes, we will mock the sync process
    # In a real app we'd call github_service.get_pull_requests and save to db
    print(f"Syncing PRs for {repo_owner}/{repo_name}")
    return {"status": "synced", "repo": f"{repo_owner}/{repo_name}"}
