import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { health } from "../api/client";

const navItems = [
  { to: "/", label: "Convert", end: true },
  { to: "/discover", label: "Discover" },
  { to: "/ontology", label: "Ontology" },
  { to: "/visualize", label: "State machine" },
];

export default function Layout() {
  const [healthy, setHealthy] = useState<boolean | null>(null);
  useEffect(() => {
    health()
      .then(() => setHealthy(true))
      .catch(() => setHealthy(false));
  }, []);

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-slate-900 text-slate-100 p-4 flex flex-col">
        <div className="mb-6">
          <div className="text-lg font-semibold">fb2skill</div>
          <div className="text-xs text-slate-400">IEC 61499 → CaSk TTL</div>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          {navItems.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "hover:bg-slate-800 text-slate-200"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-4 text-xs text-slate-400">
          API:{" "}
          {healthy === null ? (
            "checking…"
          ) : healthy ? (
            <span className="text-emerald-400">● healthy</span>
          ) : (
            <span className="text-rose-400">● unreachable</span>
          )}
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
