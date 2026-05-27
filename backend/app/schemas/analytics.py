from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class VelocityDataPoint(BaseModel):
    date: str
    merged_count: int
    open_count: int
    closed_count: int


class HeatmapCell(BaseModel):
    date: str
    count: int
    level: Literal[0, 1, 2, 3, 4]


class ContributorStats(BaseModel):
    username: str
    avatar_url: str
    pr_count: int
    merged_count: int
    merge_rate: float
    avg_days_to_merge: float
    lines_added: int
    lines_removed: int
    contribution_score: float
