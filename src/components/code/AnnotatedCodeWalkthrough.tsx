import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import type { CodeHotspot } from "../../types/cli";
import { useHighlightedLines } from "../../lib/useHighlight";
import { motionTransition, useReducedMotion } from "../../lib/motion";

interface Props {
  source: string;
  filename?: string;
  hotspots: CodeHotspot[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function AnnotatedCodeWalkthrough({ source, filename = "SpawnCubeCommand.cs", hotspots, activeId, onSelect }: Props) {
  const lines = useHighlightedLines(source, "csharp");
  const reduced = useReducedMotion();
  const active = hotspots.find((h) => h.id === activeId) ?? null;

  function hotspotForLine(lineNumber: number): CodeHotspot | undefined {
    return hotspots.find((h) => lineNumber >= h.lineStart && lineNumber <= h.lineEnd);
  }

  function select(id: string) {
    onSelect(activeId === id ? "" : id);
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
      <div>
        <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Jump to a code region">
          {hotspots.map((h, i) => (
            <button
              key={h.id}
              type="button"
              onClick={() => select(h.id)}
              aria-pressed={activeId === h.id}
              className={clsx(
                "cursor-pointer rounded-full border px-3 py-1 text-xs font-mono transition-colors duration-150",
                activeId === h.id
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
              )}
            >
              <span className="mr-1 opacity-60">{i + 1}</span>
              {h.label}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/70" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" aria-hidden="true" />
            <span className="ml-2 font-mono text-xs text-muted-foreground">{filename}</span>
          </div>
          <div className="thin-scrollbar overflow-x-auto px-2 py-3 text-[13px] leading-relaxed font-mono">
            {lines ? (
              <table className="w-full border-collapse">
                <tbody>
                  {lines.map((lineTokens, idx) => {
                    const lineNumber = idx + 1;
                    const hotspot = hotspotForLine(lineNumber);
                    const isActive = hotspot?.id === activeId;
                    return (
                      <tr
                        key={lineNumber}
                        onClick={() => hotspot && select(hotspot.id)}
                        className={clsx(
                          "transition-colors duration-150",
                          hotspot && "cursor-pointer",
                          isActive && "bg-accent/10",
                          hotspot && !isActive && "hover:bg-muted/60",
                        )}
                      >
                        <td
                          className={clsx(
                            "w-10 select-none border-l-2 pr-3 pl-2 text-right align-top text-muted-foreground/60",
                            isActive ? "border-accent" : "border-transparent",
                          )}
                        >
                          {lineNumber}
                        </td>
                        <td className="whitespace-pre align-top">
                          {lineTokens.length === 0
                            ? " "
                            : lineTokens.map((token, tokenIndex) => (
                                <span key={tokenIndex} style={{ color: token.color }}>
                                  {token.content}
                                </span>
                              ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <pre className="whitespace-pre text-muted-foreground">{source}</pre>
            )}
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-24">
        <div className="rounded-xl border border-border bg-card p-4">
          <AnimatePresence mode="wait">
            {active ? (
              <motion.div
                key={active.id}
                initial={reduced ? undefined : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -6 }}
                transition={motionTransition(reduced)}
              >
                <p className="mb-2 font-mono text-xs tracking-wide text-accent uppercase">
                  Lines {active.lineStart}–{active.lineEnd}
                </p>
                <h3 className="mb-2 text-base font-semibold">{active.label}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{active.explanation}</p>
                {active.cliMapping && (
                  <p className="mt-3 rounded-lg bg-background px-3 py-2 font-mono text-xs text-accent">→ {active.cliMapping}</p>
                )}
              </motion.div>
            ) : (
              <motion.p key="empty" initial={reduced ? undefined : { opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-muted-foreground">
                Select a highlighted region below — or one of the numbered pills above the code — to see what it does and how it maps to the CLI.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
