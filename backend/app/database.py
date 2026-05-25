from backend.database import Base, SessionLocal, engine, get_db

__all__ = ["Base", "SessionLocal", "engine", "get_db"]


def init_db() -> None:
    """Create all database tables from the shared metadata."""
    Base.metadata.create_all(bind=engine)
