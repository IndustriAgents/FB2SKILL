"""CLI-only execution configuration (where to write, what to verify)."""
from dataclasses import dataclass
from pathlib import Path

from fb2skill_core.config import RenderConfig


@dataclass(frozen=True)
class CliConfig:
    project_root: Path
    out_dir: Path
    opcua_xml: Path
    render: RenderConfig
    verify: bool = False
