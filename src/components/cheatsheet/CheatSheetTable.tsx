import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { CheatRow, CheatSection } from "../../data/cheatsheet";

function SnippetCopy({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : `Copy ${text}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // clipboard API unavailable — nothing to fall back to in a sandboxed preview
        }
      }}
      className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-2.5 py-1.5 text-left font-mono text-xs whitespace-nowrap text-muted-foreground transition-colors duration-150 hover:border-accent/50 hover:text-foreground"
    >
      <span>{text}</span>
      {copied ? (
        <Check size={13} className="shrink-0 text-accent" aria-hidden="true" />
      ) : (
        <Copy size={13} className="shrink-0" aria-hidden="true" />
      )}
    </button>
  );
}

export function CheatSheetTable({ section, rows }: { section: CheatSection; rows: CheatRow[] }) {
  if (rows.length === 0) return null;

  return (
    <section id={section.id} className="scroll-mt-24">
      <h2 className="text-lg font-semibold">{section.title}</h2>
      <p className="mt-1 mb-4 text-sm text-muted-foreground">{section.description}</p>
      <div className="thin-scrollbar overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-muted text-left text-xs tracking-wide text-muted-foreground uppercase">
              <th className="px-4 py-2.5 font-medium whitespace-nowrap">{section.columns[0]}</th>
              <th className="px-4 py-2.5 font-medium">{section.columns[1]}</th>
              {rows.some((r) => r.snippet) && <th className="px-4 py-2.5 font-medium whitespace-nowrap">Try it</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i % 2 === 1 ? "bg-card/40" : undefined}>
                <td className="px-4 py-2.5 align-top font-mono whitespace-nowrap text-foreground">{row.primary}</td>
                <td className="px-4 py-2.5 align-top text-muted-foreground">{row.secondary}</td>
                {rows.some((r) => r.snippet) && (
                  <td className="px-4 py-2.5 align-top">{row.snippet && <SnippetCopy text={row.snippet} />}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
