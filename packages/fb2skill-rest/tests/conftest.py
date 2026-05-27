import io
import zipfile
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from fb2skill_rest.app import create_app

FESTO_ROOT = Path("D:/FESTO_DS_skills/IEC61499")
EXEMPLARS_DIR = (
    Path(__file__).resolve().parent.parent.parent
    / "fb2skill-core" / "tests" / "exemplars"
)


def _have_festo() -> bool:
    return FESTO_ROOT.is_dir() and (FESTO_ROOT / "bin/Deploy").exists()


requires_festo = pytest.mark.skipif(
    not _have_festo(),
    reason="FESTO_DS_skills project not available at D:\\FESTO_DS_skills",
)


@pytest.fixture
def client() -> TestClient:
    return TestClient(create_app())


@pytest.fixture
def exemplars_dir() -> Path:
    return EXEMPLARS_DIR


@pytest.fixture
def festo_zip() -> bytes:
    """Pack D:/FESTO_DS_skills/IEC61499 into an in-memory zip with top-level dir IEC61499/."""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for p in FESTO_ROOT.rglob("*"):
            if not p.is_file():
                continue
            arcname = Path("IEC61499") / p.relative_to(FESTO_ROOT)
            zf.write(p, arcname.as_posix())
    return buf.getvalue()
