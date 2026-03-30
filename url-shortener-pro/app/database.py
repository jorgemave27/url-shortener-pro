"""
Configuración de base de datos con SQLAlchemy.

- Crea conexión a PostgreSQL
- Define sesión para queries
- Define Base para modelos ORM
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 🔥 URL de conexión a PostgreSQL (Docker)
DATABASE_URL = "postgresql://postgres:postgres@localhost:5433/url_shortener"

# 🔥 Engine = conexión principal
engine = create_engine(DATABASE_URL)

# 🔥 Sesión de base de datos
SessionLocal = sessionmaker(bind=engine)

# 🔥 Base para modelos ORM
Base = declarative_base()