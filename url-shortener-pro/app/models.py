"""
Modelo de base de datos (tabla URLs)

Representa cada URL acortada.
"""

from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from .database import Base

class URL(Base):
    __tablename__ = "urls"

    # 🔥 ID único
    id = Column(Integer, primary_key=True, index=True)

    # 🔥 URL original
    original_url = Column(String, nullable=False)

    # 🔥 Código corto (ej: abc123)
    short_code = Column(String, unique=True, index=True)

    # 🔥 Número de clicks
    clicks = Column(Integer, default=0)

    # 🔥 Fecha de creación
    created_at = Column(DateTime, default=datetime.utcnow)