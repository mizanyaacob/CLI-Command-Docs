import { Play } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { CodeBlock } from "../components/code/CodeBlock";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { getExampleBySlug } from "../data/examples";

export function ExampleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const example = slug ? getExampleBySlug(slug) : undefined;

  if (slug === "spawn-cube") return <Navigate to="/custom-commands" replace />;
  if (!example) return <Navigate to="/examples" replace />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link to="/examples" className="text-sm text-muted-foreground hover:text-foreground">
        ← All examples
      </Link>

      <div className="mt-4 flex items-center gap-2">
        <Badge variant="muted">{example.category}</Badge>
        {example.mainThreadRequired && <Badge variant="outline">MainThreadRequired</Badge>}
      </div>
      <h1 className="mt-3 font-mono text-3xl font-semibold tracking-tight text-accent">{example.commandName}</h1>
      <p className="mt-2 text-muted-foreground">{example.tagline}</p>

      {example.keyDifferences && example.keyDifferences.length > 0 && (
        <Card className="mt-8 p-5">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">Key differences from Spawn-Cube</h2>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
            {example.keyDifferences.map((diff) => (
              <li key={diff}>{diff}</li>
            ))}
          </ul>
        </Card>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Source</h2>
        <div className="mt-3">
          <CodeBlock code={example.source} lang="csharp" filename={`${example.commandName.replace(/-/g, "")}Command.cs`} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Usage</h2>
        <div className="mt-3">
          <CodeBlock code={example.usageLines.join("\n")} lang="bash" filename="terminal" />
        </div>
      </section>

      {example.args.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold">Arguments</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-muted text-left text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="px-4 py-2.5 font-medium">Flag</th>
                  <th className="px-4 py-2.5 font-medium">Default</th>
                  <th className="px-4 py-2.5 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {example.args.map((arg, i) => (
                  <tr key={arg.name} className={i % 2 === 1 ? "bg-card/40" : undefined}>
                    <td className="px-4 py-2.5 align-top font-mono text-foreground">--{arg.name}</td>
                    <td className="px-4 py-2.5 align-top font-mono text-muted-foreground">{String(arg.default) || '""'}</td>
                    <td className="px-4 py-2.5 align-top text-muted-foreground">{arg.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <Card className="mt-10 border-accent/30 bg-accent/5 p-6">
        <p className="text-sm text-muted-foreground">Try {example.commandName} with your own argument values.</p>
        <Link to={`/playground?command=${example.slug}`} className="mt-4 inline-block">
          <Button icon={<Play size={16} aria-hidden="true" />}>Open in Playground</Button>
        </Link>
      </Card>
    </div>
  );
}
