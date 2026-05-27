"""Parse IEC 61499 .fbt (CommonXML) files and detect the BasicSKILL marker.

A function block counts as a skill iff its <FBNetwork> instantiates an
<FB ... Type="BasicSKILL" />. This mirrors PLC2Skill's "extends PLC2Skill.Skill"
marker rule from PLC2SkillMappingRules.ttl.
"""
from dataclasses import dataclass
from pathlib import Path

from lxml import etree


@dataclass(frozen=True)
class ParsedFbt:
    name: str
    fbt_path: Path
    basic_skill_instance: str
    input_vars: tuple[tuple[str, str], ...]   # (name, iec_type)
    output_vars: tuple[tuple[str, str], ...]


_PARSER = etree.XMLParser(load_dtd=False, no_network=True, resolve_entities=False)


def parse_fbt(fbt_path: Path) -> ParsedFbt | None:
    try:
        tree = etree.parse(str(fbt_path), parser=_PARSER)
    except etree.XMLSyntaxError:
        return None
    root = tree.getroot()
    if root.tag != "FBType":
        return None
    basic = root.xpath('./FBNetwork/FB[@Type="BasicSKILL"]')
    if not basic:
        return None
    iface = root.find("./InterfaceList")
    if iface is None:
        return None
    in_vars = tuple(
        (v.get("Name"), v.get("Type"))
        for v in iface.findall("./InputVars/VarDeclaration")
    )
    out_vars = tuple(
        (v.get("Name"), v.get("Type"))
        for v in iface.findall("./OutputVars/VarDeclaration")
    )
    return ParsedFbt(
        name=root.get("Name"),
        fbt_path=fbt_path,
        basic_skill_instance=basic[0].get("Name"),
        input_vars=in_vars,
        output_vars=out_vars,
    )
