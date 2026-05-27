# Where fb2skill diverges from PLC2Skill — and what it costs

## 1. Mapping engine: RML → Jinja (`render.py`, `templates/`)

PLC2Skill is **declarative**: `PLC2SkillMappingRules.ttl` is the source of truth, executed by RMLMapper 6.1.3 at runtime. fb2skill is **imperative**: Python dataclasses → Jinja2 → string.

- **Win:** easier to debug, no `be.ugent.rml` JVM dependency, output matches hand-written exemplars triple-for-triple (the templates were clearly back-fitted to the exemplars).
- **Loss:** no shared mapping artifact with PLC2Skill. If the CaSk ontology changes, both projects must be patched independently — fb2skill cannot reuse `PLC2SkillMappingRules.ttl`. The user's own memory says "mirror PLC2Skill's structure where possible" ([[user-domain]]); the engine swap is the biggest deviation from that principle.

## 2. State machine: static TTL → Python tables (`state_machine.py:9-106`)

PLC2Skill keeps ISA-88 as `PLCStateMachine.ttl` with `${skillName}` placeholders — one canonical artifact. fb2skill encodes the 17 states, 9 commands, and transition map as Python dicts in `state_machine.py`.

- **Drift risk:** if PLC2Skill ever fixes a transition (e.g. `Clearing_State_Complete → Stopped`), fb2skill won't notice. The ISA-88 model is duplicated.
- **Suggested fix:** parse `PLCStateMachine.ttl` at startup and emit it per-skill, the way PLC2Skill does. Would eliminate ~100 lines of `state_machine.py` and several Jinja sub-templates.

## 3. OPC UA: live browse → offline XML (`opcua_nodes.py`)

This is fb2skill's **best architectural decision** and worth highlighting positively. PLC2Skill mandates a running server (`-e` is required + Eclipse Milo browse). fb2skill parses `System.<resource>.opcua.xml` from `bin/Deploy/`. GUIDs are already there.

- **Win:** CI-friendly, offline, deterministic, no auth flags.
- **Hidden coupling:** requires that someone has deployed the project once; surfaces as a generic `error: could not locate deployment OPC UA XML` (`cli.py:49`). A clearer hint ("did you build the project in nxtControl?") would help.
- **Fragile spot:** `primary_prefix = min(cmd_paths, key=lambda p: p.count("."))` (`opcua_nodes.py:143`) picks the "shortest path" SKILL_CMD for composite skills like `skTransfer`. This works on the FESTO example but is a heuristic — if two skills are nested at equal depth, results are undefined. Worth a comment explaining the invariant or, better, an explicit assertion.
