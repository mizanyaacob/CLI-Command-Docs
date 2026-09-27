import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CommandLinePreview({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const [head, ...rest] = command.split(" ");
  const tail = rest.join(" ");

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — nothing to fall back to in a sandboxed preview
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-4 py-3 font-mono text-sm">
      <div className="min-w-0 flex-1 overflow-x-auto whitespace-pre text-foreground">
        <span className="text-accent" aria-hidden="true">
          ${" "}
        </span>
        <span className="text-accent">{head}</span>
        {tail && <span className="text-muted-foreground"> {tail}</span>}
      </div>
      <button
        onClick={copy}
        aria-label={copied ? "Copied command" : "Copy command"}
        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
      >
        {copied ? <Check size={14} className="text-accent" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
