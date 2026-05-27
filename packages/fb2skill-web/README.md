# fb2skill-web

React/Vite SPA frontend for fb2skill. Consumes the REST API in `packages/fb2skill-rest`.

## Features

- **Convert** — upload a project zip, fill in the OPC UA endpoint + IRI fields, render TTL per skill, download.
- **Discover** — preview detected FBs before committing to a render. Hands off via `only=` filter.
- **Ontology** — browse the bundled CaSkMan v4.3.0 ontology with Turtle syntax highlighting.
- **Visualize** — interactive ISA-88 / PackML state machine graph (17 states, 9 commands, 11 auto-transitions).

## Dev

```
# from this directory
npm install
npm run dev
# vite serves on http://localhost:5173 and proxies /convert etc. to http://127.0.0.1:8000

# from repo root, run the backend separately
uv run fb2skill-rest
```

## Production build

```
npm run build
# produces dist/ — fb2skill-rest auto-mounts this at / when present
```
