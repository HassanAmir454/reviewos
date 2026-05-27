from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class PRListItem(BaseModel):
    number: int
    title: str
    state: Literal["open", "closed", "draft"]
    review_state: Literal["pending", "in_review", "approved", "changes_requested", "conflicts"]
    author: str
    author_avatar: str
    created_at: datetime
    updated_at: datetime
    additions: int
    deletions: int
    changed_files: int
    base_branch: str
    head_branch: str
    labels: list[str]
    complexity_score: float | None = None
    ai_risk_level: Literal["low", "medium", "high", "critical"] | None = None


class FileChange(BaseModel):
    filename: str
    status: Literal["added", "modified", "removed", "renamed"]
    additions: int
    deletions: int
    patch: str


class PRComment(BaseModel):
    id: int
    author: str
    author_avatar: str
    body: str
    created_at: datetime
    path: str | None = None
    line: int | None = None


class AIReviewSummary(BaseModel):
    id: str
    created_at: datetime
    risk_level: Literal["low", "medium", "high", "critical"] | None = None
    issue_count: int
    model: str


class PRDetail(PRListItem):
    body: str = ""
    diff: str = ""
    files: list[FileChange] = []
    comments: list[PRComment] = []
    reviews: list[AIReviewSummary] = []
