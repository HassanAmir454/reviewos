from fastapi import APIRouter, Query

from app.schemas.analytics import VelocityDataPoint, HeatmapCell, ContributorStats
from app.services.analytics_service import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/velocity", response_model=list[VelocityDataPoint])
async def get_velocity(
    repo: str = Query(..., description="owner/repo"),
    days: int = Query(28, ge=7, le=90),
):
    owner, name = repo.split("/", 1)
    return await analytics_service.get_velocity(owner, name, days)


@router.get("/heatmap", response_model=list[HeatmapCell])
async def get_heatmap(
    repo: str = Query(..., description="owner/repo"),
    weeks: int = Query(12, ge=4, le=52),
):
    owner, name = repo.split("/", 1)
    return await analytics_service.get_heatmap(owner, name, weeks)


@router.get("/team", response_model=list[ContributorStats])
async def get_team(
    repo: str = Query(..., description="owner/repo"),
):
    owner, name = repo.split("/", 1)
    return await analytics_service.get_team_stats(owner, name)
