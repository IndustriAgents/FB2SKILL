"""Render-time configuration shared by all fb2skill-core consumers.

CLI-only concerns (out_dir, verify, project_root, opcua_xml) live in
``fb2skill_cli.config.CliConfig``; this dataclass holds only the fields a
template needs to render a TTL.
"""
from dataclasses import dataclass


@dataclass(frozen=True)
class RenderConfig:
    endpoint_url: str
    base_iri: str
    resource: str
    namespace_index: int = 2
    # Provenance metadata for the header template. CLI passes
    # ``str(project_root)`` / ``opcua_xml.name``; REST passes the upload
    # filename / detected XML basename.
    project_label: str = ""
    source_label: str = ""
    only: tuple[str, ...] = ()
