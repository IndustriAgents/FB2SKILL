from dataclasses import dataclass, field
from pathlib import Path


@dataclass(frozen=True)
class OpcUaNode:
    node_id_guid: str
    namespace_idx: int
    browse_name: str
    data_type: str
    rt_path: str

    @property
    def node_id_str(self) -> str:
        return f"ns={self.namespace_idx};g={self.node_id_guid}"


@dataclass(frozen=True)
class SkillVariable:
    name: str
    direction: str  # "input" | "output"
    iec_type: str
    sk_type: str
    default: str
    required: bool
    opcua: OpcUaNode


@dataclass
class Skill:
    name: str
    fbt_path: Path
    interface_node: OpcUaNode
    skill_command: OpcUaNode
    current_state: OpcUaNode
    parameters: list[SkillVariable] = field(default_factory=list)
    outputs: list[SkillVariable] = field(default_factory=list)
