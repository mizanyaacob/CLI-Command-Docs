import { Link } from "react-router-dom";
import { CodeBlock } from "../components/code/CodeBlock";
import { RequestFlowDiagram } from "../components/diagrams/RequestFlowDiagram";
import { Card } from "../components/ui/Card";

export function CoreConceptsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Core concepts</h1>
      <p className="mt-3 text-muted-foreground">The mental model behind everything else on this site.</p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">unity vs. unity run vs. unity command</h2>
        <div className="mt-4 space-y-3">
          <Card className="p-4">
            <p className="font-mono text-sm text-accent">unity &lt;subcommand&gt;</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Everyday CLI operations that don't need a live Editor: installing versions, managing projects, checking auth.
            </p>
          </Card>
          <Card className="p-4">
            <p className="font-mono text-sm text-accent">unity command &lt;Name&gt; [--flags]</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Calls a <code className="font-mono">[CliCommand]</code> —{" "}
              <Link to="/built-in-commands" className="text-accent hover:underline">
                built-in
              </Link>{" "}
              or{" "}
              <Link to="/custom-commands" className="text-accent hover:underline">
                custom
              </Link>{" "}
              — on a running Editor that's already open, live, on your machine.
            </p>
          </Card>
          <Card className="p-4">
            <p className="font-mono text-sm text-accent">unity run &lt;project&gt; --command &lt;Name&gt; -- [--flags]</p>
            <p className="mt-1 text-sm text-muted-foreground">
              A one-shot form: spins up a temporary headless Editor, runs a single command, exits. This is what CI uses.
            </p>
          </Card>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">The Pipeline package</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          <code className="font-mono">com.unity.pipeline</code> is what makes a project's Editor CLI-reachable at all. It's what
          scans your <code className="font-mono">Editor</code> folders for <code className="font-mono">[CliCommand]</code>{" "}
          methods, opens the connection the CLI talks to, and marshals calls onto the main thread when a command needs it.
          Install it once per project:
        </p>
        <div className="mt-3">
          <CodeBlock lang="bash" code={"unity pipeline install"} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">How a call actually gets there</h2>
        <p className="mt-2 mb-4 text-sm text-muted-foreground">Same destination, two starting points.</p>
        <Card className="p-6">
          <RequestFlowDiagram />
        </Card>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Flags &amp; argument conventions</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Every <code className="font-mono">[CliArg]</code> becomes an optional{" "}
          <code className="font-mono">--flagName value</code> pair. Omit a flag and the C# parameter's own default value is used
          — there's no separate configuration step for defaults. This is covered in depth in the Custom Commands tutorial.
        </p>
      </section>
    </div>
  );
}
