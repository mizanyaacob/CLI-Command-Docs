import type { CSSProperties } from "react";

const labelStyle: CSSProperties = { fontFamily: "var(--font-mono)", fontSize: 13, fill: "var(--color-foreground)" };
const subLabelStyle: CSSProperties = { fontFamily: "var(--font-sans)", fontSize: 10.5, fill: "var(--color-muted-foreground)" };

const boxW = 168;
const boxH = 60;
const gapX = 40;
const startX = 20;
const startY = 46;

const stages = [
  { title: "queued / triggered", sub: "you called build, bake_*, package_add…" },
  { title: "running", sub: "poll the matching *_status" },
  { title: "completed", sub: "full result attached to *_status", accent: true },
];

export function JobLifecycleDiagram() {
  const totalW = startX * 2 + stages.length * boxW + (stages.length - 1) * gapX;
  const failedY = startY + boxH + 44;

  return (
    <svg viewBox={`0 0 ${totalW} ${failedY + boxH + 20}`} className="h-auto w-full" role="img" aria-labelledby="jld-title jld-desc">
      <title id="jld-title">The async job lifecycle shared by build, bake, package and test commands</title>
      <desc id="jld-desc">A triggering call returns immediately in a queued state; poll the matching status command until it reports completed or failed.</desc>
      <defs>
        <marker id="jld-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="var(--color-border)" />
        </marker>
      </defs>

      {stages.map((stage, i) => {
        const x = startX + i * (boxW + gapX);
        return (
          <g key={stage.title}>
            <rect
              x={x}
              y={startY}
              width={boxW}
              height={boxH}
              rx="12"
              fill={stage.accent ? "var(--color-accent)" : "var(--color-card)"}
              opacity={stage.accent ? 0.12 : 1}
              stroke={stage.accent ? "var(--color-accent)" : "var(--color-border)"}
              strokeWidth="1.5"
            />
            <text x={x + 14} y={startY + 25} style={{ ...labelStyle, fill: stage.accent ? "var(--color-accent)" : "var(--color-foreground)" }}>
              {stage.title}
            </text>
            <text x={x + 14} y={startY + 42} style={subLabelStyle}>
              {stage.sub}
            </text>
            {i < stages.length - 1 && (
              <line
                x1={x + boxW}
                y1={startY + boxH / 2}
                x2={x + boxW + gapX - 2}
                y2={startY + boxH / 2}
                stroke="var(--color-border)"
                strokeWidth="1.5"
                markerEnd="url(#jld-arrow)"
              />
            )}
          </g>
        );
      })}

      {/* Failure branch, from the "running" box down to a "failed" box */}
      <line
        x1={startX + boxW + gapX + boxW / 2}
        y1={startY + boxH}
        x2={startX + boxW + gapX + boxW / 2}
        y2={failedY - 2}
        stroke="var(--color-destructive)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        markerEnd="url(#jld-arrow)"
      />
      <g transform={`translate(${startX + boxW + gapX / 2}, ${failedY})`}>
        <rect width={boxW + gapX} height={boxH - 8} rx="12" fill="var(--color-destructive)" opacity="0.1" stroke="var(--color-destructive)" strokeWidth="1.5" />
        <text x="14" y="24" style={{ ...labelStyle, fill: "var(--color-destructive)" }}>
          failed
        </text>
        <text x="14" y="40" style={subLabelStyle}>
          error attached to *_status — nothing left running
        </text>
      </g>
    </svg>
  );
}
