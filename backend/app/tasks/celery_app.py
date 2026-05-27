from celery import Celery
from app.config import settings

celery_app = Celery(
    "reviewos_tasks",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.tasks.sync_prs", "app.tasks.process_webhook"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,
)
