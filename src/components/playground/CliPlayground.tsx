import { AlertTriangle, Play, TerminalSquare } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { examples } from "../../data/examples";
import type { CliExample } from "../../types/cli";
import { buildInvocation, defaultArgValues, simulateCommand, type ArgValues } from "../../lib/simulateCommand";
import { motionTransition, useReducedMotion } from "../../lib/motion";
import { ArgFieldRenderer } from "./ArgFieldRenderer";
import { CommandLinePreview } from "../code/CommandLinePreview";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

export function CliPlayground() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSlug = searchParams.get("command") ?? examples[0].slug;
  const [slug, setSlug] = useState(examples.find((e) => e.slug === initialSlug)?.slug ?? examples[0].slug);
  const example = examples.find((e) => e.slug === slug) ?? examples[0];

  const [values, setValues] = useState<ArgValues>(() => defaultArgValues(example));
  const [result, setResult] = useState<{ ok: boolean; output: string } | null>(null);
  const [loadedSlug, setLoadedSlug] = useState(slug);
  const reduced = useReducedMotion();

  if (slug !== loadedSlug) {
    setLoadedSlug(slug);
    setValues(defaultArgValues(example));
    setResult(null);
  }

  function selectCommand(newSlug: string) {
    setSlug(newSlug);
    setSearchParams({ command: newSlug }, { replace: true });
  }

  function run() {
    setResult(simulateCommand(example, values));
  }

  function loadErrorCase(errorCase: CliExample["errorCases"][number]) {
    setValues((prev) => ({ ...prev, ...errorCase.args }));
    // Shown immediately rather than requiring a Run click — some error cases (e.g. an
    // unsaved scene, no scenes enabled) depend on project state with no arg to drive it,
    // so re-deriving them from simulateCommand(values) alone isn't possible.
    setResult({ ok: false, output: errorCase.error });
  }

  const invocation = buildInvocation(example, values);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <div>
        <label htmlFor="playground-command" className="mb-2 block text-xs font-mono tracking-wide text-muted-foreground uppercase">
          Command
        </label>
        <select
          id="playground-command"
          value={slug}
          onChange={(e) => selectCommand(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm font-mono text-foreground focus:border-accent"
        >
          {examples.map((ex) => (
            <option key={ex.slug} value={ex.slug}>
              {ex.commandName}
            </option>
          ))}
        </select>
        <p className="mt-2 text-sm text-muted-foreground">{example.tagline}</p>

        {example.errorCases.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs font-mono tracking-wide text-muted-foreground uppercase">Try an error case</p>
            <div className="flex flex-wrap gap-2">
              {example.errorCases.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => loadErrorCase(c)}
                  className="cursor-pointer rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors duration-150 hover:border-destructive/50 hover:text-destructive"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {example.args.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {example.args.map((arg) => (
              <ArgFieldRenderer key={arg.name} arg={arg} value={values[arg.name]} onChange={(v) => setValues((prev) => ({ ...prev, [arg.name]: v }))} />
            ))}
          </div>
        )}

        <CommandLinePreview command={invocation} />

        <Button onClick={run} icon={<Play size={16} aria-hidden="true" />}>
          Run (simulated)
        </Button>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <TerminalSquare size={16} className="text-muted-foreground" aria-hidden="true" />
            <span className="text-xs font-mono tracking-wide text-muted-foreground uppercase">Output</span>
            <Badge variant="destructive" className="ml-auto">
              <AlertTriangle size={12} aria-hidden="true" />
              Simulated output — no Unity Editor is connected
            </Badge>
          </div>

          {result ? (
            <motion.pre
              key={result.output}
              initial={reduced ? undefined : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={motionTransition(reduced)}
              className={`overflow-x-auto font-mono text-sm whitespace-pre-wrap ${result.ok ? "text-accent" : "text-destructive"}`}
            >
              {result.output}
            </motion.pre>
          ) : (
            <p className="text-sm text-muted-foreground">Press "Run (simulated)" to see a mocked result for these arguments.</p>
          )}
        </div>
      </div>
    </div>
  );
}
