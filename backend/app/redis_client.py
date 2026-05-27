import redis.asyncio as aioredis

from app.config import settings

redis_pool: aioredis.Redis | None = None


async def get_redis() -> aioredis.Redis:
    global redis_pool
    if redis_pool is None:
        redis_pool = aioredis.from_url(settings.redis_url, decode_responses=True)
    return redis_pool


async def close_redis() -> None:
    global redis_pool
    if redis_pool:
        await redis_pool.aclose()
        redis_pool = None
