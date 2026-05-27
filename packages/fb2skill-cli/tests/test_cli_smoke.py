from pathlib import Path

import pytest

from fb2skill_cli.cli import main

FESTO_ROOT = Path("D:/FESTO_DS_skills/IEC61499")
requires_festo = pytest.mark.skipif(
    not (FESTO_ROOT.is_dir() and (FESTO_ROOT / "bin/Deploy").exists()),
    reason="FESTO_DS_skills project not available",
)


def test_help_exits_zero():
    with pytest.raises(SystemExit) as exc:
        main(["--help"])
    assert exc.value.code == 0


def test_missing_project_returns_2(tmp_path):
    code = main([
        "-f", str(tmp_path / "nope"),
        "-o", str(tmp_path / "out"),
        "-e", "opc.tcp://x",
        "-bI", "http://x",
        "-rI", "x",
    ])
    assert code == 2


@requires_festo
def test_festo_end_to_end(tmp_path):
    code = main([
        "-f", str(FESTO_ROOT),
        "-o", str(tmp_path),
        "-e", "opc.tcp://host.docker.internal:4840",
        "-bI", "http://www.ltu.se/aut/ontologies/FESTO_DS_skills",
        "-rI", "soft_dPAC_PLC1",
        "--verify",
    ])
    assert code == 0
    for name in ("skLoad", "skPush", "skTransfer"):
        assert (tmp_path / f"{name}.ttl").is_file()
