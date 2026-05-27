from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, Float
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class AIReview(Base):
    __tablename__ = "ai_reviews"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    pr_number: Mapped[int] = mapped_column(Integer, nullable=False)
    repo: Mapped[str] = mapped_column(String, nullable=False)
    full_text: Mapped[str] = mapped_column(Text, nullable=False)
    risk_level: Mapped[str] = mapped_column(String(20), nullable=True)
    issue_count: Mapped[int] = mapped_column(Integer, default=0)
    model_used: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
