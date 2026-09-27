import type { CSSProperties } from "react";

const nodeStyle = {
  fill: "var(--color-card)",
  stroke: "var(--color-border)",
  strokeWidth: 1.5,
};

const labelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 13,
  fill: "var(--color-foreground)",
};

const subLabelStyle: CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontSize: 11,
  fill: "var(--color-muted-foreground)",
};

// All positions are derived from these few constants instead of hardcoded
// per-element, so widening/narrowing a box can't silently make two other
// elements overlap (which is what broke this diagram previously).
const boxW = 190;
const boxH = 64;
const gapX = 26;
const startX = 20;
const startY = 40;
const centerY = startY + boxH / 2;

const mainNodes = [
  { label: "Terminal (you)", sub: "unity command Spawn-Cube" },
  { label: "unity CLI", sub: "parses args & flags" },
  { label: "com.unity.pipeline", sub: "routes to [CliCommand]" },
  { label: "Running Editor", sub: "main thread" },
].map((node, i) => ({ ...node, x: startX + i * (boxW + gapX) }));

const lastNode = mainNodes[mainNodes.length - 1];
const resultW = 130;
const resultX = lastNode.x + boxW + gapX;

const branchNode = mainNodes[1]; // "unity CLI" — where the one-shot path splits off
const oneShotY = 168;
const oneShotW = 560;
const oneShotH = 92;
const oneShotX = mainNodes[2].x; // align under "com.unity.pipeline" — the one-shot path is routed through it too

const viewBoxW = resultX + resultW + startX;
const viewBoxH = oneShotY + oneShotH + 24;

function MultilineText({ x, y, lines, lineHeight = 15, style }: { x: number; y: number; lines: string[]; lineHeight?: number; style: CSSProperties }) {
  return (
    <text x={x} y={y} style={style}>
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function RequestFlowDiagram() {
  return (
    <svg viewBox={`0 0 ${viewBoxW} ${viewBoxH}`} className="h-auto w-full" role="img" aria-labelledby="rfd-title rfd-desc">
      <title id="rfd-title">How a command reaches the Unity Editor</title>
      <desc id="rfd-desc">
        Terminal sends a command to the unity CLI, which hands it to the Pipeline package, which runs it on the Editor&apos;s main
        thread and returns a result. A second path shows unity run spinning up a temporary headless Editor for one-shot commands.
      </desc>

      <defs>
        <marker id="rfd-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="var(--color-accent)" />
        </marker>
      </defs>

      {/* Main path: already-open Editor */}
      {mainNodes.map((node, i) => (
        <g key={node.label} transform={`translate(${node.x}, ${startY})`}>
          <rect width={boxW} height={boxH} rx="12" style={nodeStyle} />
          <text x="16" y="28" style={labelStyle}>
            {node.label}
          </text>
          <text x="16" y="47" style={subLabelStyle}>
            {node.sub}
          </text>
          {i < mainNodes.length - 1 && (
            <line x1={boxW} y1={boxH / 2} x2={boxW + gapX - 2} y2={boxH / 2} stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#rfd-arrow)" />
          )}
        </g>
      ))}

      <line x1={lastNode.x + boxW} y1={centerY} x2={resultX - 2} y2={centerY} stroke="var(--color-accent)" strokeWidth="2" markerEnd="url(#rfd-arrow)" />
      <g transform={`translate(${resultX}, ${startY})`}>
        <rect width={resultW} height={boxH} rx="12" fill="var(--color-accent)" opacity="0.12" stroke="var(--color-accent)" strokeWidth="1.5" />
        <text x="14" y="28" style={{ ...labelStyle, fill: "var(--color-accent)" }}>
          Result
        </text>
        <text x="14" y="47" style={subLabelStyle}>
          printed to stdout
        </text>
      </g>

      {/* Branch: unity run one-shot */}
      <line x1={branchNode.x} y1={centerY} x2={branchNode.x} y2={oneShotY - 18} stroke="var(--color-border)" strokeWidth="1.5" strokeDasharray="4 4" />
      <line
        x1={branchNode.x}
        y1={oneShotY - 18}
        x2={oneShotX - 2}
        y2={oneShotY - 18}
        stroke="var(--color-border)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        markerEnd="url(#rfd-arrow)"
      />
      <text x={branchNode.x + 8} y={oneShotY - 24} style={{ ...subLabelStyle, fontStyle: "italic" }}>
        one-shot path
      </text>

      <g transform={`translate(${oneShotX}, ${oneShotY})`}>
        <rect width={oneShotW} height={oneShotH} rx="12" fill="var(--color-secondary)" opacity="0.5" stroke="var(--color-border)" strokeWidth="1.5" />
        <text x="16" y="26" style={labelStyle}>
          unity run ./MyGame --command X --
        </text>
        <MultilineText
          x={16}
          y={46}
          style={subLabelStyle}
          lines={["spins up a temporary headless Editor, runs one command,", "exits — no Editor needs to already be open"]}
        />
      </g>
    </svg>
  );
}
