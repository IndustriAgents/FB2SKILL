import pytest

from .conftest import requires_festo
from fb2skill_core.opcua_nodes import (
    SkillResolutionError,
    load_node_set,
    resolve_bindings,
)
from fb2skill_core.project import discover_skill_fbts, find_deployment_opcua_xml


@requires_festo
def test_deployed_skills_resolve(festo_root):
    ns = load_node_set(find_deployment_opcua_xml(festo_root))
    by_name = {p.name: p for p in discover_skill_fbts(festo_root)}

    for name in ("skLoad", "skPush", "skTransfer"):
        sk = resolve_bindings(by_name[name], ns)
        assert sk.interface_node.node_id_guid
        assert sk.skill_command.browse_name == "SKILL_CMD"
        assert sk.current_state.browse_name == "CURRENT_STATE"
        assert [v.name for v in sk.parameters] == ["IN1"]
        assert [v.name for v in sk.outputs] == ["OUT1"]


@requires_festo
def test_nested_only_skills_fail_resolution(festo_root):
    ns = load_node_set(find_deployment_opcua_xml(festo_root))
    by_name = {p.name: p for p in discover_skill_fbts(festo_root)}
    # These FBs are nested inside skTransfer; not exposed as top-level UAObjects.
    for name in ("skPick", "skPlace", "skGoToLeft", "skGoToRight"):
        with pytest.raises(SkillResolutionError):
            resolve_bindings(by_name[name], ns)


@requires_festo
def test_skload_interface_guid_matches_exemplar(festo_root):
    ns = load_node_set(find_deployment_opcua_xml(festo_root))
    by_name = {p.name: p for p in discover_skill_fbts(festo_root)}
    sk = resolve_bindings(by_name["skLoad"], ns)
    # GUID literally present in the hand-written skLoad.ttl on line 83
    assert sk.interface_node.node_id_guid == "4f64cbe3-17dc-1e03-4dc2-625d524e2966"
