from importlib.resources import as_file, files
from pathlib import Path

import fb2skill_core

_ONTOLOGY = "data/CaSkMan_v4.3.0.ttl"


def ontology_path() -> Path:
    """Return a filesystem Path to the bundled ontology.

    Works for both editable installs and built wheels. The resource is already
    a real file because fb2skill-core ships it via hatch force-include.
    """
    res = files(fb2skill_core).joinpath(_ONTOLOGY)
    with as_file(res) as p:
        return Path(p)
