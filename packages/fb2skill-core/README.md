# fb2skill-core

Domain logic for converting IEC 61499 function blocks into CaSk/CaSkMan skill TTL.

Pure library — no CLI, no HTTP. Consumed by `fb2skill-cli` and `fb2skill-rest`.

## Public API

```python
from fb2skill_core.config import RenderConfig
from fb2skill_core.project import discover_skill_fbts, find_deployment_opcua_xml
from fb2skill_core.opcua_nodes import load_node_set, resolve_bindings, SkillResolutionError
from fb2skill_core.render import render_skill
```

## Bundled assets

- `templates/*.j2` — Jinja templates for the TTL output
- `data/CaSkMan_v4.3.0.ttl` — bundled CaSkMan ontology (served by `fb2skill-rest`'s `/ontology` endpoint)
