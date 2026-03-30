"""
Schemas (Pydantic)

Sirven para:
- Validar requests
- Formatear responses
"""

from pydantic import BaseModel

# 🔥 Request para crear URL
class URLCreate(BaseModel):
    original_url: str

# 🔥 Response de la API
class URLResponse(BaseModel):
    short_code: str
    original_url: str
    clicks: int

    # 🔥 Permite mapear desde SQLAlchemy
    class Config:
        from_attributes = True