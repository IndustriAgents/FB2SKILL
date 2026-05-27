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

const terminalStates = new Set([
  "Idle",
  "Complete",
  "Stopped",
  "Aborted",
  "Held",
  "Suspended",
]);

const COLOR = {
  bg: "#161616",
  border: "rgba(250,250,250,0.18)",
  text: "#fafafa",
  accent: "#FFE22B",
  ok: "#2fe6a1",
  alert: "#ff5760",
  muted: "rgba(250,250,250,0.62)",
  edge: "#FFE22B",
  edgeAuto: "rgba(250,250,250,0.36)",
};

function nodeStyle(name: string): Partial<Node["style"]> {
  if (name === "Execute") {
    return {
      background: "rgba(47,230,161,0.12)",
      border: `1px solid ${COLOR.ok}`,
      color: COLOR.text,
    };
  }
  if (name === "Idle") {
    return {
      background: "rgba(255,226,43,0.12)",
      border: `1px solid ${COLOR.accent}`,
      color: COLOR.text,
    };
  }
  if (name === "Aborted" || name === "Aborting") {
    return {
      background: "rgba(255,87,96,0.12)",
      border: `1px solid ${COLOR.alert}`,
      color: COLOR.text,
    };
  }
  if (terminalStates.has(name)) {
    return {
      background: "#1a1a1a",
      border: `1px solid ${COLOR.border}`,
      color: COLOR.muted,
    };
  }
  return {
    background: COLOR.bg,
    border: `1px solid ${COLOR.border}`,
    color: COLOR.text,
  };
}

export default function VisualizePage() {
  const nodes: Node[] = useMemo(
    () =>
      STATES.map((name) => ({
        id: name,
        position: STATE_POSITIONS[name],
        data: { label: name },
        style: {
          padding: 8,
          borderRadius: 7,
          fontSize: 12,
          fontFamily: "var(--mono)",
          letterSpacing: "0.02em",
          ...nodeStyle(name),
        },
      })),
    []
  );

  const edges: Edge[] = useMemo(() => {
    const out: Edge[] = [];
    for (const [src, trans] of Object.entries(STATE_OUTGOING)) {
      for (const t of trans) {
        const target = transitionTarget(t);
        if (!target) continue;
        const isAuto = !(t in {
          StartCommand: 1,
          ResetCommand: 1,
          HoldCommand: 1,
          UnholdCommand: 1,
          SuspendCommand: 1,
          UnsuspendCommand: 1,
          ClearCommand: 1,
          StopCommand: 1,
          AbortCommand: 1,
        });
        out.push({
          id: `${src}--${t}`,
          source: src,
          target,
          label: transitionLabel(t),
          labelStyle: {
            fontSize: 10,
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fill: isAuto ? COLOR.muted : COLOR.accent,
          },
          labelBgStyle: { fill: "#0a0a0a", fillOpacity: 0.85 },
          labelBgPadding: [3, 3],
          style: isAuto
            ? { stroke: COLOR.edgeAuto, strokeDasharray: "4 4", strokeWidth: 1 }
            : { stroke: COLOR.edge, strokeWidth: 1.4 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: isAuto ? COLOR.edgeAuto : COLOR.edge,
          },
        });
      }
    }
    return out;
  }, []);

  return (
    <div style={{ height: "calc(100vh - var(--topbar-h) - 90px)", display: "flex", flexDirection: "column" }}>
      <div className="view-head" style={{ marginBottom: 14 }}>
        <div>
          <h1>
            ISA-88 / PackML <em>state machine</em>
          </h1>
          <p className="view-sub">
            17 states · {edges.length} transitions ·{" "}
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 2,
                background: COLOR.accent,
                verticalAlign: "middle",
                marginRight: 4,
              }}
            />
            command edge ·{" "}
            <span
              style={{
                display: "inline-block",
                width: 14,
                verticalAlign: "middle",
                borderTop: `1.5px dashed ${COLOR.edgeAuto}`,
                marginRight: 4,
              }}
            />
            auto transition
          </p>
        </div>
      </div>
      <div className="flow-shell" style={{ flex: 1, minHeight: 420 }}>
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
          <Background gap={18} size={1} color="rgba(255,255,255,0.06)" />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
