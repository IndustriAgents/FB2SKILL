# fb2skill-rest

FastAPI server exposing the fb2skill conversion pipeline over HTTP.

## Endpoints

- `GET  /health` — liveness check
- `POST /convert` — multipart upload of an IEC 61499 project zip → JSON `{skills, warnings, failures}`
- `POST /skills/discover` — same input, returns only the detected skill names
- `GET  /ontology` — bundled CaSkMan ontology as `text/turtle`

## Run locally

```
uv run fb2skill-rest
# server on http://0.0.0.0:8000
```

## Docker

```
docker compose -f packages/fb2skill-rest/docker-compose.yml up --build
```
