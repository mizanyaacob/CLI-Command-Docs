import type { BuiltinCategory } from "../../types/builtin";
import { CodeBlock } from "../code/CodeBlock";
import { Card } from "../ui/Card";
import { BuiltinCommandTable } from "./BuiltinCommandTable";

export function BuiltinCategorySection({ category }: { category: BuiltinCategory }) {
  const exampleCode = category.example.steps
    .map((step) => (step.note ? `${step.command}  # ${step.note}` : step.command))
    .join("\n");

  return (
    <section id={category.id} className="scroll-mt-24">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-semibold">{category.title}</h2>
        <span className="font-mono text-xs text-muted-foreground">
          {category.commands.length} command{category.commands.length === 1 ? "" : "s"}
        </span>
      </div>
      <p className="mt-2 mb-4 text-sm text-muted-foreground">{category.intro}</p>

      <BuiltinCommandTable commands={category.commands} />

      <Card className="mt-4 border-accent/30 bg-accent/5 p-5">
        <p className="font-mono text-xs tracking-wide text-accent uppercase">Worked example</p>
        <h3 className="mt-1 text-base font-semibold">{category.example.title}</h3>
        <p className="mt-2 mb-4 text-sm text-muted-foreground">{category.example.narrative}</p>
        <CodeBlock lang="bash" code={exampleCode} filename="terminal" />
      </Card>
    </section>
  );
}
