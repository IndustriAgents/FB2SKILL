import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { ApiError, convertProject } from "../api/client";
import type { ConvertResponse } from "../types/api";
import TtlViewer from "../components/TtlViewer";
import ZipUploader from "../components/ZipUploader";

interface FormState {
  endpoint_url: string;
  base_iri: string;
  resource: string;
  namespace_index: number;
  only: string;
  opcua_xml_rel_path: string;
}

const DEFAULTS: FormState = {
  endpoint_url: "opc.tcp://host.docker.internal:4840",
  base_iri: "http://www.ltu.se/aut/ontologies/FESTO_DS_skills",
  resource: "soft_dPAC_PLC1",
  namespace_index: 2,
  only: "",
  opcua_xml_rel_path: "",
};

export default function ConvertPage() {
  const location = useLocation();
  const handoff = location.state as { only?: string } | null;

  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<ConvertResponse | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  useEffect(() => {
    if (handoff?.only) setForm((f) => ({ ...f, only: handoff.only! }));
  }, [handoff]);

  async function submit() {
    if (!file) {
      setErr("Pick a zip first");
      return;
    }
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      const r = await convertProject(file, form);
      setResult(r);
      setActiveSkill(r.skills[0]?.name ?? null);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function download(name: string, ttl: string) {
    const blob = new Blob([ttl], { type: "text/turtle" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.ttl`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    if (!result) return;
    result.skills.forEach((s) => download(s.name, s.ttl));
  }

  const activeTtl = result?.skills.find((s) => s.name === activeSkill)?.ttl;

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Convert</h1>
      <p className="text-sm text-slate-600 mb-6">
        Upload an IEC 61499 project zip and render one CaSk skill TTL per detected{" "}
        <code>BasicSKILL</code> function block.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <ZipUploader onFile={setFile} file={file} />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="OPC UA endpoint URL"
              value={form.endpoint_url}
              onChange={(v) => setForm({ ...form, endpoint_url: v })}
            />
            <Field
              label="Resource name"
              value={form.resource}
              onChange={(v) => setForm({ ...form, resource: v })}
            />
            <Field
              label="Base IRI"
              value={form.base_iri}
              onChange={(v) => setForm({ ...form, base_iri: v })}
              wide
            />
            <Field
              label="Namespace index"
              value={String(form.namespace_index)}
              onChange={(v) =>
                setForm({ ...form, namespace_index: parseInt(v) || 2 })
              }
            />
            <Field
              label="Only (CSV filter)"
              value={form.only}
              onChange={(v) => setForm({ ...form, only: v })}
              placeholder="skLoad,skPush"
            />
            <Field
              label="opcua_xml_rel_path (optional)"
              value={form.opcua_xml_rel_path}
              onChange={(v) => setForm({ ...form, opcua_xml_rel_path: v })}
              placeholder="auto-detect under bin/Deploy/"
              wide
            />
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={busy || !file}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:bg-slate-300 hover:bg-indigo-700"
          >
            {busy ? "Converting…" : "Convert"}
          </button>
          {err && <div className="text-sm text-rose-600">{err}</div>}
        </div>

        <div>
          {result ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm">
                  <span className="font-medium">{result.skills.length}</span>{" "}
                  skills rendered
                  {result.failures.length > 0 && (
                    <span className="text-slate-500">
                      {" · "}
                      {result.failures.length} failed
                    </span>
                  )}
                </div>
                {result.skills.length > 0 && (
                  <button
                    type="button"
                    onClick={downloadAll}
                    className="text-xs px-2 py-1 border rounded hover:bg-slate-100"
                  >
                    Download all
                  </button>
                )}
              </div>

              {result.skills.length > 0 && (
                <>
                  <div className="flex gap-1 border-b border-slate-200 mb-2 overflow-x-auto">
                    {result.skills.map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setActiveSkill(s.name)}
                        className={`px-3 py-1 text-sm whitespace-nowrap ${
                          activeSkill === s.name
                            ? "border-b-2 border-indigo-600 text-indigo-700 font-medium"
                            : "text-slate-600"
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                  {activeTtl && <TtlViewer ttl={activeTtl} />}
                  {activeSkill && (
                    <button
                      type="button"
                      onClick={() => download(activeSkill, activeTtl!)}
                      className="mt-2 text-xs px-2 py-1 border rounded hover:bg-slate-100"
                    >
                      Download {activeSkill}.ttl
                    </button>
                  )}
                </>
              )}

              {result.failures.length > 0 && (
                <details className="mt-4 text-sm">
                  <summary className="cursor-pointer text-slate-600">
                    Failures ({result.failures.length})
                  </summary>
                  <ul className="mt-1 space-y-1 text-xs">
                    {result.failures.map((f) => (
                      <li key={f.name}>
                        <span className="font-medium">{f.name}:</span> {f.error}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {result.warnings.length > 0 && (
                <ul className="mt-3 text-xs text-amber-700">
                  {result.warnings.map((w, i) => (
                    <li key={i}>⚠ {w}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-400 border border-dashed border-slate-300 rounded p-8 text-center">
              Conversion output will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <label className="block text-xs font-medium text-slate-600 mb-0.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
