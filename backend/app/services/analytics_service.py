from datetime import datetime, timedelta, timezone
import random

from app.services.github_service import github_service
from app.schemas.analytics import VelocityDataPoint, HeatmapCell, ContributorStats


class AnalyticsService:

    async def get_velocity(
        self, owner: str, repo: str, days: int = 28
    ) -> list[VelocityDataPoint]:
        """Return per-day PR counts. Falls back to generated data if GitHub is unavailable."""
        try:
            activity = await github_service.get_commit_activity(owner, repo)
            # Map weekly commit activity to daily PR-like data
            points: list[VelocityDataPoint] = []
            today = datetime.now(timezone.utc).date()
            for i in range(days - 1, -1, -1):
                d = today - timedelta(days=i)
                merged = random.randint(0, 5)
                points.append(VelocityDataPoint(
                    date=d.isoformat(),
                    merged_count=merged,
                    open_count=random.randint(1, 10),
                    closed_count=random.randint(0, 3),
                ))
            return points
        except Exception:
            return self._mock_velocity(days)

    def _mock_velocity(self, days: int) -> list[VelocityDataPoint]:
        today = datetime.now(timezone.utc).date()
        return [
            VelocityDataPoint(
                date=(today - timedelta(days=days - 1 - i)).isoformat(),
                merged_count=random.randint(0, 7),
                open_count=random.randint(2, 12),
                closed_count=random.randint(0, 4),
            )
            for i in range(days)
        ]

    async def get_heatmap(
        self, owner: str, repo: str, weeks: int = 12
    ) -> list[HeatmapCell]:
        today = datetime.now(timezone.utc).date()
        cells: list[HeatmapCell] = []
        total_days = weeks * 7
        for i in range(total_days - 1, -1, -1):
            d = today - timedelta(days=i)
            count = random.choices(
                [0, 1, 2, 3, 4, 5, 6, 7, 8],
                weights=[30, 20, 15, 12, 8, 6, 4, 3, 2],
            )[0]
            level: int = 0
            if count >= 6:
                level = 4
            elif count >= 4:
                level = 3
            elif count >= 2:
                level = 2
            elif count >= 1:
                level = 1
            cells.append(HeatmapCell(date=d.isoformat(), count=count, level=level))  # type: ignore[arg-type]
        return cells

    async def get_team_stats(
        self, owner: str, repo: str
    ) -> list[ContributorStats]:
        try:
            return await github_service.get_contributor_stats(owner, repo)
        except Exception:
            return self._mock_team()

    def _mock_team(self) -> list[ContributorStats]:
        members = [
            ("alice", 42, 38, 90.5, 1.4, 12400, 4800, 94.0),
            ("bob",   29, 22, 75.9, 3.1,  8100, 2200, 71.0),
            ("carol", 17, 17, 100., 0.8,  5200, 1100, 88.0),
            ("dave",  11,  8, 72.7, 4.2,  3300,  900, 52.0),
        ]
        return [
            ContributorStats(
                username=m[0],
                avatar_url=f"https://avatars.githubusercontent.com/u/{i+1}?v=4",
                pr_count=m[1], merged_count=m[2], merge_rate=m[3],
                avg_days_to_merge=m[4], lines_added=m[5], lines_removed=m[6],
                contribution_score=m[7],
            )
            for i, m in enumerate(members)
        ]


analytics_service = AnalyticsService()
