"""TTL verification helpers backed by rdflib."""
from pathlib import Path

import rdflib
from rdflib.compare import isomorphic, to_isomorphic, graph_diff


def parse_ttl(text: str) -> rdflib.Graph:
    g = rdflib.Graph()
    g.parse(data=text, format="turtle")
    return g


def parse_file(path: Path) -> rdflib.Graph:
    g = rdflib.Graph()
    g.parse(str(path), format="turtle")
    return g


def graphs_isomorphic(a: rdflib.Graph, b: rdflib.Graph) -> bool:
    return isomorphic(to_isomorphic(a), to_isomorphic(b))


def diff_report(a: rdflib.Graph, b: rdflib.Graph, limit: int = 20) -> str:
    """Human-readable summary of the symmetric difference between two graphs."""
    _, in_first, in_second = graph_diff(to_isomorphic(a), to_isomorphic(b))
    lines = []
    only_a = list(in_first)
    only_b = list(in_second)
    lines.append(f"in A only: {len(only_a)} triples")
    for t in only_a[:limit]:
        lines.append(f"  - {t}")
    lines.append(f"in B only: {len(only_b)} triples")
    for t in only_b[:limit]:
        lines.append(f"  + {t}")
    return "\n".join(lines)
