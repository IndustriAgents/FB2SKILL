import { useEffect, useMemo, useState } from "react";

import { fetchOntology } from "../api/client";
import TtlViewer from "../components/TtlViewer";

export default function OntologyPage() {
  const [ttl, setTtl] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetchOntology()
      .then(setTtl)
      .catch((e) => setErr(String(e)));
  }, []);

  const stats = useMemo(() => {
    if (!ttl) return null;
    const prefixCount = (ttl.match(/^@prefix /gm) || []).length;
    const classCount = (ttl.match(/\b(a|rdf:type)\s+owl:Class\b/g) || []).length;
    const subjects = new Set<string>();
    ttl.split(/\.\s*\n/).forEach((stmt) => {
      const m = stmt.match(/^\s*([:\w][\w:.\-]*)/m);
      if (m) subjects.add(m[1]);
    });
    return {
      bytes: new Blob([ttl]).size,
      prefixCount,
      classCount,
      subjectCount: subjects.size,
    };
  }, [ttl]);

  function download() {
    if (!ttl) return;
    const blob = new Blob([ttl], { type: "text/turtle" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "CaSkMan_v4.3.0.ttl";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="view-head">
        <div>
          <h1>
            <em>CaSkMan</em> ontology
          </h1>
          <p className="view-sub">
            Bundled <code>CaSkMan_v4.3.0.ttl</code> served by{" "}
            <code>GET /ontology</code>.
          </p>
        </div>
        {ttl && (
          <button type="button" className="btn" onClick={download}>
            Download .ttl
          </button>
        )}
      </div>

      {err && (
        <div
          className="text-mono"
          style={{
            fontSize: 12,
            color: "var(--alert)",
            background: "rgba(255,87,96,0.06)",
            border: "1px solid rgba(255,87,96,0.3)",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 16,
          }}
        >
          {err}
        </div>
      )}

      {stats && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <Stat
            label="Size"
            value={(stats.bytes / 1024).toFixed(0)}
            unit="KB"
          />
          <Stat label="@prefix lines" value={stats.prefixCount} />
          <Stat label="owl:Class refs" value={stats.classCount} />
          <Stat label="Subjects (approx.)" value={stats.subjectCount} />
        </div>
      )}

      <div className="card">
        <div className="card-head">
          <h3>Turtle source</h3>
          <span className="card-meta">CaSkMan v4.3.0</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {ttl ? (
            <TtlViewer ttl={ttl} maxHeight="68vh" />
          ) : !err ? (
            <div
              style={{
                padding: "48px 16px",
                textAlign: "center",
                color: "var(--cream-faint)",
                fontSize: 13,
              }}
            >
              Loading ontology…
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  unit,
}: {
  label: string;
  value: string | number;
  unit?: string;
}) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-val">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
    </div>
  );
}
