"""fb2skill-core: domain logic for IEC 61499 -> CaSk/CaSkMan skill TTL."""
from .config import RenderConfig
from .model import OpcUaNode, Skill, SkillVariable
from .opcua_nodes import (
    NodeSet,
    SkillResolutionError,
    load_node_set,
    resolve_bindings,
)
from .project import discover_skill_fbts, find_deployment_opcua_xml
from .render import render_skill

__version__ = "0.1.0"

__all__ = [
    "RenderConfig",
    "OpcUaNode",
    "Skill",
    "SkillVariable",
    "NodeSet",
    "SkillResolutionError",
    "load_node_set",
    "resolve_bindings",
    "discover_skill_fbts",
    "find_deployment_opcua_xml",
    "render_skill",
    "__version__",
]
