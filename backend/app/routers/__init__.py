from fastapi import APIRouter
from app.routers import prs, ws, reviews, analytics, repos, webhooks

api_router = APIRouter()
api_router.include_router(prs.router)
api_router.include_router(ws.router)
api_router.include_router(reviews.router)
api_router.include_router(analytics.router)
api_router.include_router(repos.router)
api_router.include_router(webhooks.router)
