from pathlib import Path

import pytest

FESTO_ROOT = Path("D:/FESTO_DS_skills/IEC61499")
EXEMPLARS_DIR = Path(__file__).resolve().parent / "exemplars"


def _have_festo() -> bool:
    return FESTO_ROOT.is_dir() and (FESTO_ROOT / "bin/Deploy").exists()


requires_festo = pytest.mark.skipif(
    not _have_festo(),
    reason="FESTO_DS_skills project not available at D:\\FESTO_DS_skills",
)


@pytest.fixture
def festo_root() -> Path:
    return FESTO_ROOT


@pytest.fixture
def exemplars_dir() -> Path:
    return EXEMPLARS_DIR
