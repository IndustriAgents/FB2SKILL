import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { health } from "../api/client";

interface NavItem {
  to: string;
  label: string;
  section: "tools" | "reference";
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: "/", label: "Convert", section: "tools", end: true },
  { to: "/discover", label: "Discover", section: "tools" },
  { to: "/ontology", label: "Ontology", section: "reference" },
  { to: "/visualize", label: "State machine", section: "reference" },
];

const pageMeta: Record<string, { title: string; crumb: string }> = {
  "/": { title: "Convert", crumb: "Tools / Convert" },
  "/discover": { title: "Discover", crumb: "Tools / Discover" },
  "/ontology": { title: "CaSkMan ontology", crumb: "Reference / Ontology" },
  "/visualize": { title: "ISA-88 state machine", crumb: "Reference / State machine" },
};

export default function Layout() {
  const location = useLocation();
  const [healthy, setHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    function poll() {
      health()
        .then(() => !cancelled && setHealthy(true))
        .catch(() => !cancelled && setHealthy(false));
    }
    poll();
    const id = setInterval(poll, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const meta = pageMeta[location.pathname] ?? { title: "fb2skill", crumb: "" };
  const tools = navItems.filter((n) => n.section === "tools");
  const reference = navItems.filter((n) => n.section === "reference");

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sb-brand">
          <div className="sb-brand-logo" aria-hidden>
            <img src="/logo-mark.svg" alt="" />
          </div>
          <div className="sb-brand-text">
            <span className="name">
              IndustriAgents<em>®</em>
            </span>
            <span className="product">fb2skill</span>
          </div>
        </div>

        <div className="sb-section">Tools</div>
        <nav className="sb-nav">
          {tools.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `sb-link${isActive ? " is-active" : ""}`
              }
            >
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sb-section">Reference</div>
        <nav className="sb-nav">
          {reference.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `sb-link${isActive ? " is-active" : ""}`
              }
            >
              <span>{n.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sb-footer">
          <div className="api-row">
            <span
              className={`dot ${
                healthy === null ? "idle" : healthy ? "ok" : "alert"
              }`}
            />
            <span>
              API ·{" "}
              <span className="muted">
                {healthy === null
                  ? "checking…"
                  : healthy
                  ? "healthy"
                  : "unreachable"}
              </span>
            </span>
          </div>
          <div className="muted">IEC 61499 → CaSk TTL</div>
          <div className="muted">v0.1 · industriagents.com</div>
        </div>
      </aside>

      <header className="topbar">
        <div className="tb-left">
          <div className="tb-crumb">
            <b>fb2skill</b>
            {meta.crumb ? ` · ${meta.crumb}` : ""}
          </div>
        </div>
        <div className="tb-right">
          <span className="tb-pill">
            <span
              className={`live-dot ${
                healthy === null ? "idle" : healthy ? "ok" : "alert"
              }`}
            />
            {healthy === null
              ? "Connecting"
              : healthy
              ? "Live · API"
              : "API offline"}
          </span>
          <span className="tb-pill">CaSkMan v4.3.0</span>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
