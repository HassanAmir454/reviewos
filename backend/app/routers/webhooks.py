import hashlib
import hmac
import json

from fastapi import APIRouter, Header, HTTPException, Request

from app.config import settings
from app.services.webhook_service import webhook_service

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


def _verify_signature(body: bytes, signature: str) -> bool:
    if not settings.github_webhook_secret:
        return True  # Skip verification in dev with no secret set
    mac = hmac.new(
        settings.github_webhook_secret.encode(),
        body,
        hashlib.sha256,
    )
    expected = "sha256=" + mac.hexdigest()
    return hmac.compare_digest(expected, signature)


@router.post("/github")
async def github_webhook(
    request: Request,
    x_hub_signature_256: str = Header(default=""),
    x_github_event: str = Header(default=""),
):
    body = await request.body()

    if not _verify_signature(body, x_hub_signature_256):
        raise HTTPException(status_code=401, detail="Invalid webhook signature")

    try:
        payload = json.loads(body)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    await webhook_service.handle(x_github_event, payload)
    return {"ok": True}
