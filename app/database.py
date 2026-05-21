from contextlib import contextmanager

from sqlmodel import Session, SQLModel, create_engine

DATABASE_NAME = "cyberarena.db"
DATABASE_URL = f"sqlite:///{DATABASE_NAME}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)


def init_db() -> None:
    """Initialize the database schema and create tables."""
    SQLModel.metadata.create_all(engine)


@contextmanager

def get_session():
    """Yield a database session and close it automatically."""
    with Session(engine) as session:
        yield session
