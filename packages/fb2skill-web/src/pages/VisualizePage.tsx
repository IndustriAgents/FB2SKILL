import { useMemo } from "react";
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  STATE_OUTGOING,
  STATE_POSITIONS,
  STATES,
  transitionLabel,
  transitionTarget,
} from "../state_machine";

const terminalStates = new Set(["Idle", "Complete", "Stopped", "Aborted", "Held", "Suspended"]);

function nodeStyle(name: string): Partial<Node["style"]> {
  if (name === "Execute") return { background: "#dcfce7", border: "1px solid #16a34a" };
  if (name === "Idle") return { background: "#e0e7ff", border: "1px solid #4f46e5" };
  if (name === "Aborted" || name === "Aborting")
    return { background: "#fee2e2", border: "1px solid #dc2626" };
  if (terminalStates.has(name)) return { background: "#f1f5f9", border: "1px solid #64748b" };
  return { background: "#ffffff", border: "1px solid #cbd5e1" };
}

export default function VisualizePage() {
  const nodes: Node[] = useMemo(
    () =>
      STATES.map((name) => ({
        id: name,
        position: STATE_POSITIONS[name],
        data: { label: name },
        style: { padding: 6, borderRadius: 6, fontSize: 12, ...nodeStyle(name) },
      })),
    []
  );

  const edges: Edge[] = useMemo(() => {
    const out: Edge[] = [];
    for (const [src, trans] of Object.entries(STATE_OUTGOING)) {
      for (const t of trans) {
        const target = transitionTarget(t);
        if (!target) continue;
        const isAuto = !(t in { StartCommand: 1, ResetCommand: 1, HoldCommand: 1,
          UnholdCommand: 1, SuspendCommand: 1, UnsuspendCommand: 1,
          ClearCommand: 1, StopCommand: 1, AbortCommand: 1 });
        out.push({
          id: `${src}--${t}`,
          source: src,
          target,
          label: transitionLabel(t),
          labelStyle: { fontSize: 10, fill: isAuto ? "#475569" : "#1e3a8a" },
          labelBgStyle: { fill: "#ffffff", fillOpacity: 0.85 },
          labelBgPadding: [2, 2],
          style: isAuto
            ? { stroke: "#94a3b8", strokeDasharray: "4 4" }
            : { stroke: "#4f46e5" },
          markerEnd: { type: MarkerType.ArrowClosed, color: isAuto ? "#94a3b8" : "#4f46e5" },
        });
      }
    }
    return out;
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <h1 className="text-2xl font-bold mb-1">ISA-88 / PackML state machine</h1>
      <p className="text-sm text-slate-600 mb-2">
        17 states · {edges.length} transitions ·{" "}
        <span className="inline-block w-3 h-3 align-middle bg-indigo-600 rounded"></span>{" "}
        command edge ·{" "}
        <span
          className="inline-block w-4 align-middle border-t-2 border-slate-400"
          style={{ borderStyle: "dashed" }}
        ></span>{" "}
        auto transition
      </p>
      <div className="flex-1 border border-slate-200 rounded bg-white">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={16} size={1} color="#e2e8f0" />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
