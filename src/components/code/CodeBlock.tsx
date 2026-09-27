import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { HighlightLang } from "../../lib/highlighter";
import { useHighlightedHtml } from "../../lib/useHighlight";

interface CodeBlockProps {
  code: string;
  lang: HighlightLang;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, lang, filename, className }: CodeBlockProps) {
  const html = useHighlightedHtml(code, lang);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — nothing to fall back to in a sandboxed preview
    }
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-border bg-card ${className ?? ""}`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/70" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" aria-hidden="true" />
          {filename && <span className="ml-2 font-mono text-xs text-muted-foreground">{filename}</span>}
        </div>
        <button
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check size={14} className="text-accent" aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="thin-scrollbar overflow-x-auto px-4 py-3 text-[13px] leading-relaxed font-mono [&_pre]:whitespace-pre [&_pre]:!bg-transparent">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="text-muted-foreground">{code}</pre>
        )}
      </div>
    </div>
  );
}
