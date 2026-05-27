from app.tasks.celery_app import celery_app

@celery_app.task(name="process_webhook_task")
def process_webhook_task(payload: dict):
    """Background task to process long-running webhook logic."""
    print("Processing webhook in background...")
    return {"status": "processed"}
