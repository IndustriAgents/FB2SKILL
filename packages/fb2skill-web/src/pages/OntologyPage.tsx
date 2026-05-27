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
    ttl
      .split(/\.\s*\n/)
      .forEach((stmt) => {
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
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold mb-2">CaSkMan ontology</h1>
      <p className="text-sm text-slate-600 mb-6">
        Bundled <code>CaSkMan_v4.3.0.ttl</code> served by{" "}
        <code>GET /ontology</code>.
      </p>

      {err && <div className="text-sm text-rose-600">{err}</div>}

      {stats && (
        <div className="grid grid-cols-4 gap-3 mb-4">
          <Stat label="Size" value={`${(stats.bytes / 1024).toFixed(0)} KB`} />
          <Stat label="@prefix lines" value={stats.prefixCount} />
          <Stat label="owl:Class refs" value={stats.classCount} />
          <Stat label="Subjects (approx.)" value={stats.subjectCount} />
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-slate-600">Turtle source</div>
        {ttl && (
          <button
            type="button"
            onClick={download}
            className="text-xs px-2 py-1 border rounded hover:bg-slate-100"
          >
            Download .ttl
          </button>
        )}
      </div>

      {ttl ? (
        <TtlViewer ttl={ttl} maxHeight="75vh" />
      ) : !err ? (
        <div className="text-sm text-slate-500">Loading…</div>
      ) : null}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-slate-200 rounded p-3 bg-white">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
