"""Walk an IEC 61499 project: find .fbt skill files + the deployment OPC UA XML."""
from pathlib import Path

from .fbt_parser import ParsedFbt, parse_fbt


def discover_skill_fbts(project_root: Path) -> list[ParsedFbt]:
    """Recursively find every .fbt under ``project_root`` whose FBNetwork
    contains a ``<FB Type="BasicSKILL"/>`` and return the parsed objects."""
    skills: list[ParsedFbt] = []
    for fbt in sorted(project_root.rglob("*.fbt")):
        # Skip anything under build artifact folders.
        parts = {p.lower() for p in fbt.parts}
        if "bin" in parts or "obj" in parts:
            continue
        parsed = parse_fbt(fbt)
        if parsed is not None:
            skills.append(parsed)
    return skills


def find_deployment_opcua_xml(project_root: Path) -> Path | None:
    """Locate the auto-generated ``System.<resource>.opcua.xml`` under
    ``<project_root>/**/bin/Deploy/**/``. Returns the most recently modified
    match if several exist; ``None`` if nothing is found."""
    candidates = list(project_root.rglob("bin/Deploy/*/System.*.opcua.xml"))
    if not candidates:
        candidates = list(project_root.rglob("System.*.opcua.xml"))
    if not candidates:
        return None
    return max(candidates, key=lambda p: p.stat().st_mtime)
