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
    <div style={{ maxWidth: 980 }}>
      <div className="view-head">
        <div>
          <h1>
            <em>Discover</em> skills
          </h1>
          <p className="view-sub">
            Cheap preview — lists detected <code>BasicSKILL</code> function
            blocks without rendering TTL. Useful for picking a subset before
            committing to a full <code>/convert</code>.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 18,
        }}
      >
        <div className="card">
          <div className="card-head">
            <h3>Source</h3>
            <span className="card-meta">POST /skills</span>
          </div>
          <div
            className="card-body"
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <ZipUploader onFile={setFile} file={file} />
            <button
              type="button"
              className="btn is-primary"
              onClick={submit}
              disabled={busy || !file}
            >
              {busy ? "Discovering…" : "Discover skills"}
            </button>
            {err && (
              <div
                className="text-mono"
                style={{
                  fontSize: 12,
                  color: "var(--alert)",
                  background: "rgba(255,87,96,0.06)",
                  border: "1px solid rgba(255,87,96,0.3)",
                  borderRadius: 8,
                  padding: "8px 12px",
                }}
              >
                {err}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>
              {result
                ? `Detected ${result.skills.length} skill${
                    result.skills.length === 1 ? "" : "s"
                  }`
                : "Detected skills"}
            </h3>
            {result && (
              <span className="card-meta">
                {selected.size} of {result.skills.length} selected
              </span>
            )}
          </div>
          <div className="card-body">
            {!result ? (
              <div
                style={{
                  padding: "44px 8px",
                  textAlign: "center",
                  color: "var(--cream-faint)",
                  fontSize: 13,
                }}
              >
                Upload a project to preview its skill function blocks.
              </div>
            ) : result.skills.length === 0 ? (
              <div
                style={{
                  padding: "30px 8px",
                  textAlign: "center",
                  color: "var(--cream-dim)",
                  fontSize: 13,
                }}
              >
                {result.warnings[0] ?? "no BasicSKILL instances found"}
              </div>
            ) : (
              <>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    marginBottom: 16,
                  }}
                >
                  {result.skills.map((name) => (
                    <li key={name}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "7px 10px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontFamily: "var(--mono)",
                          fontSize: 12.5,
                          color: "var(--cream)",
                          background: selected.has(name)
                            ? "rgba(255,226,43,0.05)"
                            : "transparent",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selected.has(name)}
                          onChange={() => toggle(name)}
                          style={{ accentColor: "var(--accent)" }}
                        />
                        <span>{name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="btn is-primary is-sm"
                  onClick={renderSelected}
                  disabled={selected.size === 0}
                >
                  Render {selected.size} selected →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
