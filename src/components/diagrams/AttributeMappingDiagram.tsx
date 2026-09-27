import type { CSSProperties } from "react";

const codeStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12.5,
  fill: "var(--color-foreground)",
};

const cliStyle: CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 12.5,
  fill: "var(--color-accent)",
};

const rows: { csharp: string; cli: string }[] = [
  { csharp: '[CliCommand("Spawn-Cube", ...)]', cli: "unity command Spawn-Cube" },
  { csharp: 'MainThreadRequired = true', cli: "runs on the Editor main thread" },
  { csharp: '[CliArg("count", ...)] int count = 1', cli: "--count 5" },
  { csharp: '[CliArg("color", ...)] string color = ""', cli: '--color "#F2B705"' },
];

export function AttributeMappingDiagram() {
  const rowHeight = 74;
  const height = rows.length * rowHeight + 20;

  return (
    <svg viewBox={`0 0 860 ${height}`} className="h-auto w-full" role="img" aria-labelledby="amd-title amd-desc">
      <title id="amd-title">How attributes map to CLI syntax</title>
      <desc id="amd-desc">
        Each C# attribute or parameter default on the left produces the CLI syntax shown on the right.
      </desc>

      <defs>
        <marker id="amd-dot" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="5" markerHeight="5">
          <circle cx="4" cy="4" r="3" fill="var(--color-accent)" />
        </marker>
      </defs>

      {rows.map((row, i) => {
        const y = 10 + i * rowHeight;
        const midY = y + 27;
        return (
          <g key={row.csharp}>
            <rect x="0" y={y} width="380" height="54" rx="10" fill="var(--color-card)" stroke="var(--color-border)" strokeWidth="1.5" />
            <text x="16" y={midY + 5} style={codeStyle}>
              {row.csharp}
            </text>

            <path
              d={`M 380 ${midY} C 440 ${midY}, 420 ${midY}, 480 ${midY}`}
              fill="none"
              stroke="var(--color-border)"
              strokeWidth="1.5"
              strokeDasharray="3 4"
              markerEnd="url(#amd-dot)"
            />

            <rect x="480" y={y} width="380" height="54" rx="10" fill="var(--color-accent)" opacity="0.1" stroke="var(--color-accent)" strokeWidth="1.5" />
            <text x="496" y={midY + 5} style={cliStyle}>
              {row.cli}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
