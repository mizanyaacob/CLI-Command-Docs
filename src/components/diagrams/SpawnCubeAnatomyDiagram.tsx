interface Stage {
  hotspotId: string;
  title: string;
  detail: string;
}

const stages: Stage[] = [
  { hotspotId: "registration", title: "Register", detail: "[CliCommand] + [CliArg]s" },
  { hotspotId: "validation", title: "Validate", detail: "guard clauses throw" },
  { hotspotId: "loop-create", title: "Mutate", detail: "create & configure cubes" },
  { hotspotId: "wrap-up", title: "Undo · Dirty · Select", detail: "make it a normal edit" },
  { hotspotId: "return", title: "Return", detail: "result string" },
];

export function SpawnCubeAnatomyDiagram({ onSelect, activeId }: { onSelect: (id: string) => void; activeId: string | null }) {
  const boxWidth = 148;
  const gap = 20;
  const totalWidth = stages.length * boxWidth + (stages.length - 1) * gap;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} 110`}
      className="h-auto w-full"
      role="group"
      aria-label="Anatomy of SpawnCube, five stages — activate a stage to jump to it in the walkthrough below"
    >
      <defs>
        <marker id="scad-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="var(--color-border)" />
        </marker>
      </defs>

      {stages.map((stage, i) => {
        const x = i * (boxWidth + gap);
        const active = stage.hotspotId === activeId;
        return (
          <g key={stage.hotspotId}>
            {i > 0 && (
              <line
                x1={x - gap}
                y1="35"
                x2={x - 2}
                y2="35"
                stroke="var(--color-border)"
                strokeWidth="1.5"
                markerEnd="url(#scad-arrow)"
              />
            )}
            <foreignObject x={x} y="0" width={boxWidth} height="70">
              <button
                type="button"
                onClick={() => onSelect(stage.hotspotId)}
                aria-pressed={active}
                className={`h-full w-full cursor-pointer rounded-xl border px-3 py-2 text-left transition-colors duration-150 ${
                  active ? "border-accent bg-accent/15" : "border-border bg-card hover:border-foreground/40"
                }`}
              >
                <span className="block font-mono text-[13px]" style={{ color: active ? "var(--color-accent)" : "var(--color-foreground)" }}>
                  {stage.title}
                </span>
                <span className="mt-0.5 block text-[10.5px] text-muted-foreground">{stage.detail}</span>
              </button>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
}
