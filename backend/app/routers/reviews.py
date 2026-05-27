from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel

from app.services.ai_review_service import ai_review_service
from app.services.github_service import github_service

router = APIRouter(prefix="/reviews", tags=["reviews"])


class TriggerRequest(BaseModel):
    repo: str
    pr_number: int
    client_id: str = "default-client"


class PostReviewRequest(BaseModel):
    repo: str
    pr_number: int
    body: str


@router.post("/trigger")
async def trigger_review(body: TriggerRequest, background_tasks: BackgroundTasks):
    review_id = f"review-{body.repo}-{body.pr_number}"

    background_tasks.add_task(
        ai_review_service.stream_review,
        body.repo,
        body.pr_number,
        review_id,
        body.client_id,
    )

    return {"status": "streaming", "review_id": review_id}


@router.post("/post")
async def post_review_comment(request: PostReviewRequest):
    try:
        owner, name = request.repo.split("/", 1)
        await github_service.post_review_comment(owner, name, request.pr_number, request.body)
        return {"status": "posted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

