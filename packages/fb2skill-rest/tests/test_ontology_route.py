import rdflib


def test_ontology_returns_turtle(client):
    r = client.get("/ontology")
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/turtle")
    # Body must parse as Turtle.
    g = rdflib.Graph()
    g.parse(data=r.content, format="turtle")
    assert len(g) > 0
