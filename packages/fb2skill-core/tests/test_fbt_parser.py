from .conftest import requires_festo
from fb2skill_core.project import discover_skill_fbts


@requires_festo
def test_discovers_seven_skills(festo_root):
    skills = discover_skill_fbts(festo_root)
    names = {p.name for p in skills}
    assert names >= {"skLoad", "skPush", "skTransfer", "skPick", "skPlace",
                     "skGoToLeft", "skGoToRight"}


@requires_festo
def test_basic_skill_instance_names(festo_root):
    by_name = {p.name: p for p in discover_skill_fbts(festo_root)}
    # All atomic skills wrap a BasicSKILL named Skill_Commands;
    # the composite skill skTransfer wraps it as Skill_Head.
    assert by_name["skLoad"].basic_skill_instance == "Skill_Commands"
    assert by_name["skTransfer"].basic_skill_instance == "Skill_Head"
