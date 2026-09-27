import { CodeBlock } from "./CodeBlock";
import { Tabs } from "../ui/Tabs";
import type { HighlightLang } from "../../lib/highlighter";

export interface OsSnippet {
  id: string;
  label: string;
  lang: HighlightLang;
  code: string;
}

export function TabbedCodeExample({ snippets, idPrefix }: { snippets: OsSnippet[]; idPrefix: string }) {
  return (
    <Tabs
      idPrefix={idPrefix}
      items={snippets.map((snippet) => ({
        id: snippet.id,
        label: snippet.label,
        content: <CodeBlock code={snippet.code} lang={snippet.lang} />,
      }))}
    />
  );
}
