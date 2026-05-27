import json
from typing import Any

from app.redis_client import get_redis


class CacheService:
    async def get(self, key: str) -> Any | None:
        redis = await get_redis()
        raw = await redis.get(key)
        if raw is None:
            return None
        return json.loads(raw)

    async def set(self, key: str, value: Any, ttl_seconds: int = 60) -> None:
        redis = await get_redis()
        await redis.setex(key, ttl_seconds, json.dumps(value, default=str))

    async def delete(self, key: str) -> None:
        redis = await get_redis()
        await redis.delete(key)

    async def invalidate_prefix(self, prefix: str) -> None:
        redis = await get_redis()
        keys = await redis.keys(f"{prefix}*")
        if keys:
            await redis.delete(*keys)


cache_service = CacheService()
