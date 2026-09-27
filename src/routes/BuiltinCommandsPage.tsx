import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BuiltinCategorySection } from "../components/builtin/BuiltinCategorySection";
import { CodeBlock } from "../components/code/CodeBlock";
import { JobLifecycleDiagram } from "../components/diagrams/JobLifecycleDiagram";
import { SiteSidebar } from "../components/layout/SiteSidebar";
import { Card } from "../components/ui/Card";
import { builtinCategories, builtinCommandCount } from "../data/builtinCommands";
import { filterBuiltinCategories } from "../lib/builtinFilter";
import type { PageSection } from "../data/navigation";

const sections: PageSection[] = [
  { id: "overview", label: "Overview" },
  { id: "patterns", label: "Shared patterns" },
  ...builtinCategories.map((c) => ({ id: c.id, label: c.title })),
];

export function BuiltinCommandsPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => filterBuiltinCategories(builtinCategories, query), [query]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <SiteSidebar sections={sections} />
        </aside>

        <div className="min-w-0 max-w-3xl space-y-16">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Built-in commands</h1>
            <p className="mt-3 text-muted-foreground">
              The {builtinCommandCount} <code className="font-mono">[CliCommand]</code> tools the Pipeline package registers on
              every connected Editor, out of the box — no custom C# required. Everything here is called exactly like a{" "}
              <Link to="/custom-commands" className="text-accent hover:underline">
                custom command
              </Link>
              : <code className="font-mono">unity command &lt;Name&gt; [--flags]</code> from a terminal, or as a structured tool
              call from a connected agent.
            </p>
            <div className="mt-6 max-w-md">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter by command name or category…"
                aria-label="Filter built-in commands"
                className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:border-accent"
              />
            </div>
          </div>

          <section id="overview" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">Overview</h2>
            <p className="mt-3 text-muted-foreground">
              Think of these as the standard library that ships with the Pipeline package, sitting right alongside any{" "}
              <Link to="/examples" className="text-accent hover:underline">
                custom commands
              </Link>{" "}
              you write yourself. A new hire doesn't need to memorize all {builtinCommandCount} of them — they need to know the
              handful of shapes below, then reach for this page as a reference whenever they need a specific one.
            </p>
            <CodeBlock lang="bash" code={"unity command\nunity command create_gameobject --name Table --primitive cube"} filename="terminal" />
          </section>

          <section id="patterns" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">Shared patterns</h2>
            <p className="mt-3 mb-6 text-muted-foreground">
              Learn these four conventions once and most of the {builtinCommandCount} commands below stop looking unfamiliar, no
              matter which category they're in.
            </p>

            <div className="space-y-8">
              <div>
                <h3 className="text-base font-semibold">1. References are flexible — pass an "objectref"</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Anywhere an argument's type is <code className="font-mono">objectref</code>, you can pass whatever's most
                  convenient to identify that GameObject or asset: a hierarchy path (<code className="font-mono">/Root/Enemy</code>
                  ), an asset path (<code className="font-mono">Assets/Prefabs/Enemy.prefab</code>), a GUID, a globalId, or an
                  instanceId returned by an earlier call. You rarely need to convert between them.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold">2. Destructive or irreversible? It's gated behind confirm + dry_run</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Any command that deletes something, overwrites project settings, or otherwise can't be undone with Ctrl+Z
                  refuses to run unless you pass <code className="font-mono">--confirm true</code>. Every one of those also takes{" "}
                  <code className="font-mono">--dry_run true</code>, which validates and reports what <em>would</em> happen without
                  actually doing it — always reach for dry_run first when you're not sure.
                </p>
              </div>

              <div>
                <h3 className="text-base font-semibold">3. Long-running work is a job: trigger, then poll</h3>
                <p className="mt-2 mb-4 text-sm text-muted-foreground">
                  Builds, bakes, package operations and test runs don't block waiting for minutes of work — they return
                  immediately in a queued state, and you poll a matching <code className="font-mono">*_status</code> command until
                  it reports <code className="font-mono">completed</code> (or <code className="font-mono">failed</code>).
                </p>
                <Card className="p-6">
                  <JobLifecycleDiagram />
                </Card>
              </div>

              <div>
                <h3 className="text-base font-semibold">4. Chaining several calls? Reach for batch</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Instead of calling <code className="font-mono">create_gameobject</code>, then a separate{" "}
                  <code className="font-mono">find_gameobjects</code> to get its handle back, then a third call to act on it —{" "}
                  <code className="font-mono">batch</code> runs all three as one transactional request, and later steps reference
                  earlier results directly (see the Batch Operations section below). It's the difference between three
                  round-trips and one.
                </p>
              </div>
            </div>
          </section>

          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No commands match "{query}".</p>
          ) : (
            filtered.map((category) => <BuiltinCategorySection key={category.id} category={category} />)
          )}
        </div>
      </div>
    </div>
  );
}
