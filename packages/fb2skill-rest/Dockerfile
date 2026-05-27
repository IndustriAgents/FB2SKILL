FROM python:3.11-slim AS builder

# Bring in uv from its official image — pinned for reproducibility.
COPY --from=ghcr.io/astral-sh/uv:0.5 /uv /uvx /usr/local/bin/

ENV UV_COMPILE_BYTECODE=1 \
    UV_LINK_MODE=copy \
    UV_PYTHON_DOWNLOADS=never

WORKDIR /app

# Copy workspace manifests + sources. The build context is the repo root
# (see docker-compose.yml `context: ../..`).
COPY pyproject.toml uv.lock README.md ./
COPY packages/ ./packages/

# Install only fb2skill-rest and its transitive deps; no dev deps.
RUN uv sync --frozen --no-dev --package fb2skill-rest

EXPOSE 8000

ENV FB2SKILL_HOST=0.0.0.0 \
    FB2SKILL_PORT=8000 \
    FB2SKILL_LOG_LEVEL=info

CMD ["uv", "run", "--no-dev", "--package", "fb2skill-rest", "fb2skill-rest"]
