from fb2skill_core.verify import diff_report, graphs_isomorphic, parse_file, parse_ttl

from .conftest import requires_festo


@requires_festo
def test_convert_matches_exemplars(client, festo_zip, exemplars_dir):
    r = client.post(
        "/convert",
        files={"project_zip": ("festo.zip", festo_zip, "application/zip")},
        data={
            "endpoint_url": "opc.tcp://host.docker.internal:4840",
            "base_iri": "http://www.ltu.se/aut/ontologies/FESTO_DS_skills",
            "resource": "soft_dPAC_PLC1",
            "namespace_index": "2",
        },
    )
    assert r.status_code == 200, r.text
    payload = r.json()
    by_name = {s["name"]: s["ttl"] for s in payload["skills"]}

    for name in ("skLoad", "skPush", "skTransfer"):
        assert name in by_name, f"missing {name} in response"
        actual = parse_ttl(by_name[name])
        expected = parse_file(exemplars_dir / f"{name}.ttl")
        assert graphs_isomorphic(actual, expected), diff_report(actual, expected)

    # Nested-only skills (skPick etc.) should appear in `failures`, not `skills`.
    failure_names = {f["name"] for f in payload["failures"]}
    assert {"skPick", "skPlace", "skGoToLeft", "skGoToRight"} <= failure_names


@requires_festo
def test_convert_with_only_filter(client, festo_zip):
    r = client.post(
        "/convert",
        files={"project_zip": ("festo.zip", festo_zip, "application/zip")},
        data={
            "endpoint_url": "opc.tcp://x",
            "base_iri": "http://x",
            "resource": "soft_dPAC_PLC1",
            "only": "skLoad",
        },
    )
    assert r.status_code == 200
    assert {s["name"] for s in r.json()["skills"]} == {"skLoad"}


def test_convert_rejects_empty_zip(client):
    import io, zipfile
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w") as zf:
        zf.writestr("placeholder.txt", "no fbts here")
    r = client.post(
        "/convert",
        files={"project_zip": ("empty.zip", buf.getvalue(), "application/zip")},
        data={
            "endpoint_url": "opc.tcp://x",
            "base_iri": "http://x",
            "resource": "x",
        },
    )
    # Either 200 with empty skills + warning, or 422 if deploy XML missing — both acceptable.
    assert r.status_code in (200, 422)
    if r.status_code == 200:
        body = r.json()
        assert body["skills"] == []
        assert body["warnings"]
