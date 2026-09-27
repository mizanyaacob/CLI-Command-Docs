import { createHighlighterCore, type HighlighterCore, type ThemedToken } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import githubDarkDefault from "shiki/themes/github-dark-default.mjs";
import csharp from "shiki/langs/csharp.mjs";
import bash from "shiki/langs/bash.mjs";
import powershell from "shiki/langs/powershell.mjs";
import json from "shiki/langs/json.mjs";

const THEME = "github-dark-default";

export type HighlightLang = "csharp" | "bash" | "powershell" | "json" | "text";

let highlighterPromise: Promise<HighlighterCore> | null = null;

/**
 * A minimal, fine-grained Shiki instance — only the four languages this site
 * actually uses, on the pure-JS regex engine (no WASM download).
 */
export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [githubDarkDefault],
      langs: [csharp, bash, powershell, json],
      engine: createJavaScriptRegexEngine(),
    });
  }
  return highlighterPromise;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function highlightToHtml(code: string, lang: HighlightLang): Promise<string> {
  if (lang === "text") {
    return `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
  }
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, { lang, theme: THEME });
}

export async function highlightToLines(code: string, lang: HighlightLang): Promise<ThemedToken[][]> {
  if (lang === "text") {
    return code.split("\n").map((line) => [{ content: line, offset: 0 } as ThemedToken]);
  }
  const highlighter = await getHighlighter();
  const result = highlighter.codeToTokens(code, { lang, theme: THEME });
  return result.tokens;
}
