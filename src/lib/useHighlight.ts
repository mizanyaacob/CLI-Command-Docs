import { useEffect, useState } from "react";
import type { ThemedToken } from "shiki";
import { highlightToHtml, highlightToLines, type HighlightLang } from "./highlighter";

export function useHighlightedHtml(code: string, lang: HighlightLang): string | null {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    highlightToHtml(code, lang).then((result) => {
      if (!cancelled) setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return html;
}

export function useHighlightedLines(code: string, lang: HighlightLang): ThemedToken[][] | null {
  const [lines, setLines] = useState<ThemedToken[][] | null>(null);

  useEffect(() => {
    let cancelled = false;
    highlightToLines(code, lang).then((result) => {
      if (!cancelled) setLines(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, lang]);

  return lines;
}
