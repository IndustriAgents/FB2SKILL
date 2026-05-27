from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


def _default_web_dist() -> Path | None:
    """Look for the built fb2skill-web SPA at packages/fb2skill-web/dist."""
    here = Path(__file__).resolve()
    for parent in here.parents:
        cand = parent / "packages" / "fb2skill-web" / "dist"
        if cand.is_dir():
            return cand
    return None


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="FB2SKILL_", env_file=".env", extra="ignore")
    host: str = "0.0.0.0"
    port: int = 8000
    log_level: str = "info"
    max_upload_mb: int = 50
    # CSV list of CORS origins; defaults to the Vite dev server.
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    # Path to the built fb2skill-web dist; auto-detected at repo root if present.
    web_dist_path: Path | None = None

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def effective_web_dist(self) -> Path | None:
        return self.web_dist_path or _default_web_dist()
