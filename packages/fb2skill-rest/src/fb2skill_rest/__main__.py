import uvicorn

from .settings import Settings


def main() -> None:
    s = Settings()
    uvicorn.run(
        "fb2skill_rest.app:app",
        host=s.host,
        port=s.port,
        log_level=s.log_level,
    )


if __name__ == "__main__":
    main()
