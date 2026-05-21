import os

from app.database import init_db


def main() -> None:
    """Verify that the local SQLite database can be initialized."""
    try:
        init_db()
        database_exists = os.path.exists("cyberarena.db")
        if database_exists:
            print("SUCCESS: Database file 'cyberarena.db' was created successfully.")
        else:
            print("ERROR: init_db() completed but 'cyberarena.db' was not found on disk.")
    except Exception as error:
        print(f"ERROR: Failed to initialize database: {error}")


if __name__ == "__main__":
    main()
