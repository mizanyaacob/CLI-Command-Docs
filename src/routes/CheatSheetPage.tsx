import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheatSheetSearch } from "../components/cheatsheet/CheatSheetSearch";
import { CheatSheetTable } from "../components/cheatsheet/CheatSheetTable";
import { CodeBlock } from "../components/code/CodeBlock";
import { Card } from "../components/ui/Card";
import { customCommandRecap, envVars, exitCodes, globalFlags, workflows } from "../data/cheatsheet";
import { filterRows } from "../lib/cheatFilter";

const sections = [globalFlags, exitCodes, envVars, workflows];

export function CheatSheetPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => sections.map((section) => ({ section, rows: filterRows(section, query) })), [query]);
  const totalMatches = filtered.reduce((sum, f) => sum + f.rows.length, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Cheat sheet</h1>
      <p className="mt-3 text-muted-foreground">
        The condensed stuff you'll actually reach for. For the full custom-command story, see the{" "}
        <Link to="/custom-commands" className="text-accent hover:underline">
          tutorial
        </Link>
        .
      </p>

      <div className="mt-8 max-w-md">
        <CheatSheetSearch value={query} onChange={setQuery} />
      </div>

      <div className="mt-10 space-y-12">
        {totalMatches === 0 ? (
          <p className="text-sm text-muted-foreground">No matches for "{query}".</p>
        ) : (
          filtered.map(({ section, rows }) => <CheatSheetTable key={section.id} section={section} rows={rows} />)
        )}

        <section id="custom-command-recap" className="scroll-mt-24">
          <h2 className="text-lg font-semibold">{customCommandRecap.title}</h2>
          <p className="mt-1 mb-4 text-sm text-muted-foreground">
            The shape every custom command follows — see the{" "}
            <Link to="/custom-commands" className="text-accent hover:underline">
              full tutorial
            </Link>{" "}
            for the line-by-line version.
          </p>
          <CodeBlock lang="csharp" code={customCommandRecap.code} />
        </section>
      </div>

      <Card className="mt-12 p-5">
        <p className="text-sm text-muted-foreground">
          Looking for every built-in command grouped by category? This site keeps the reference intentionally condensed —{" "}
          <code className="font-mono text-foreground">unity command</code> and <code className="font-mono text-foreground">unity --help</code>{" "}
          are the source of truth for the full set.
        </p>
      </Card>
    </div>
  );
}
