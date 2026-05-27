from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class AIReviewRequest(BaseModel):
    repo: str
    pr_number: int
    client_id: str = "default-client"


class AIReviewResponse(BaseModel):
    review_id: str
    status: Literal["streaming", "complete", "error"]


class StoredReview(BaseModel):
    id: str
    pr_number: int
    repo: str
    full_text: str
    risk_level: Literal["low", "medium", "high", "critical"]
    issue_count: int
    created_at: datetime
    model_used: str
