"""
Manejo de cache con Redis

- Reduce carga a DB
- Mejora performance
"""

import redis

# 🔥 Cliente Redis
redis_client = redis.Redis(
    host="localhost",
    port=6380,
    decode_responses=True
)

def get_cache(key: str):
    """
    Obtiene valor del cache.
    Si Redis falla, no rompe la app.
    """
    try:
        return redis_client.get(key)
    except Exception:
        return None


def set_cache(key: str, value: str):
    """
    Guarda valor en cache con TTL (1 hora).
    """
    try:
        redis_client.setex(key, 3600, value)
    except Exception:
        pass