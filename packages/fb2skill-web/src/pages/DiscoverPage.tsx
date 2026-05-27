import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ApiError, discoverSkills } from "../api/client";
import type { SkillListResponse } from "../types/api";
import ZipUploader from "../components/ZipUploader";

export default function DiscoverPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<SkillListResponse | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  async function submit() {
    if (!file) {
      setErr("Pick a zip first");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const r = await discoverSkills(file);
      setResult(r);
      setSelected(new Set(r.skills));
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function toggle(name: string) {
    const next = new Set(selected);
    if (next.has(name)) next.delete(name);
    else next.add(name);
    setSelected(next);
  }

  function renderSelected() {
    if (!result) return;
    const only = Array.from(selected).join(",");
    navigate("/", { state: { only } });
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Discover</h1>
      <p className="text-sm text-slate-600 mb-6">
        Cheap preview — lists detected <code>BasicSKILL</code> function blocks
        without rendering TTL. Useful for picking a subset before committing to
        a full <code>/convert</code>.
      </p>

      <div className="space-y-4">
        <ZipUploader onFile={setFile} file={file} />
        <button
          type="button"
          onClick={submit}
          disabled={busy || !file}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:bg-slate-300 hover:bg-indigo-700"
        >
          {busy ? "Discovering…" : "Discover skills"}
        </button>
        {err && <div className="text-sm text-rose-600">{err}</div>}

        {result && (
          <div className="border border-slate-200 rounded p-4 bg-white">
            <div className="text-sm font-medium mb-2">
              Detected {result.skills.length} skill function block
              {result.skills.length === 1 ? "" : "s"}
            </div>
            {result.skills.length === 0 ? (
              <div className="text-sm text-slate-500">
                {result.warnings[0] ?? "no BasicSKILL instances found"}
              </div>
            ) : (
              <>
                <ul className="space-y-1 mb-3">
                  {result.skills.map((name) => (
                    <li key={name} className="text-sm">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected.has(name)}
                          onChange={() => toggle(name)}
                        />
                        <code>{name}</code>
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={renderSelected}
                  disabled={selected.size === 0}
                  className="text-sm px-3 py-1 border rounded hover:bg-slate-100 disabled:opacity-50"
                >
                  Render {selected.size} selected →
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
