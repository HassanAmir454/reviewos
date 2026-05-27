from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class PullRequest(Base):
    __tablename__ = "pull_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    repo: Mapped[str] = mapped_column(String, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    state: Mapped[str] = mapped_column(String(20), nullable=False)
    author: Mapped[str] = mapped_column(String, nullable=False)
    complexity_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    ai_risk_level: Mapped[str | None] = mapped_column(String(20), nullable=True)
    additions: Mapped[int] = mapped_column(Integer, default=0)
    deletions: Mapped[int] = mapped_column(Integer, default=0)
    changed_files: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    synced_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
