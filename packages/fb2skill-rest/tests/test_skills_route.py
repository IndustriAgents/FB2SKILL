from .conftest import requires_festo


@requires_festo
def test_discover_returns_festo_skills(client, festo_zip):
    r = client.post(
        "/skills/discover",
        files={"project_zip": ("festo.zip", festo_zip, "application/zip")},
    )
    assert r.status_code == 200, r.text
    names = set(r.json()["skills"])
    assert names >= {"skLoad", "skPush", "skTransfer",
                     "skPick", "skPlace", "skGoToLeft", "skGoToRight"}
