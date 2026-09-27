import { ArrowRight, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AnnotatedCodeWalkthrough } from "../components/code/AnnotatedCodeWalkthrough";
import { CodeBlock } from "../components/code/CodeBlock";
import { AttributeMappingDiagram } from "../components/diagrams/AttributeMappingDiagram";
import { SpawnCubeAnatomyDiagram } from "../components/diagrams/SpawnCubeAnatomyDiagram";
import { SiteSidebar } from "../components/layout/SiteSidebar";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { customCommandsSections } from "../data/navigation";
import { flagshipExample } from "../data/examples";
import { spawnCubeHotspots } from "../data/spawnCubeHotspots";

export function CustomCommandsTutorialPage() {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  function selectFromAnatomy(id: string) {
    setActiveHotspot(id);
    document.getElementById("walkthrough")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[200px_1fr]">
        <aside className="hidden lg:block">
          <SiteSidebar sections={customCommandsSections} />
        </aside>

        <div className="min-w-0 max-w-3xl space-y-16">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Writing custom CLI commands</h1>
            <p className="mt-3 text-muted-foreground">
              Turn any static C# method into a command Unity's CLI can call by name — using{" "}
              <code className="font-mono">SpawnCubeCommand.cs</code> as the running example throughout.
            </p>
          </div>

          <section id="mental-model" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">Mental model</h2>
            <p className="mt-3 text-muted-foreground">
              A custom command is nothing exotic: a <code className="font-mono">static</code> C# method, decorated with{" "}
              <code className="font-mono">[CliCommand]</code>, sitting in an <code className="font-mono">Editor</code> folder. The
              Pipeline package scans for methods like this, registers each one under the name you give it, and exposes it to{" "}
              <code className="font-mono">unity command</code>. There's no separate manifest or registration step to remember.
            </p>
          </section>

          <section id="prerequisites" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">Prerequisites</h2>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted-foreground">
              <li>
                The Pipeline package is installed: <code className="font-mono">unity pipeline install</code>
              </li>
              <li>
                Your script lives in a folder named <code className="font-mono">Editor</code> (e.g.{" "}
                <code className="font-mono">Assets/Editor/</code>) so it only compiles into the Editor build.
              </li>
              <li>
                The method — and the class, conventionally — is <code className="font-mono">static</code>.
              </li>
            </ul>
          </section>

          <section id="anatomy" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">Anatomy at a glance</h2>
            <p className="mt-3 mb-6 text-muted-foreground">
              Five stages, every custom command follows this shape. Select a stage to jump to it in the full walkthrough below.
            </p>
            <Card className="p-6">
              <SpawnCubeAnatomyDiagram onSelect={selectFromAnatomy} activeId={activeHotspot} />
            </Card>
          </section>

          <section id="clicommand" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">
              <code className="font-mono">[CliCommand]</code>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Registers the method as a command. Takes a name (what you type after <code className="font-mono">unity command</code>
              ), a one-line description shown in <code className="font-mono">--help</code>, and an optional{" "}
              <code className="font-mono">MainThreadRequired</code> flag. Set it to <code className="font-mono">true</code> for
              anything that touches the scene, assets, or other main-thread-only Editor APIs — the Pipeline package then marshals
              the call onto the main thread for you before it runs.
            </p>
          </section>

          <section id="cliarg" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">
              <code className="font-mono">[CliArg]</code>
            </h2>
            <p className="mt-3 text-muted-foreground">
              Each parameter decorated with <code className="font-mono">[CliArg]</code> becomes an optional{" "}
              <code className="font-mono">--name value</code> flag. The C# default value is exactly what's used when the flag is
              omitted — string, float, int and bool parameters all work out of the box. For a restricted set of choices (see{" "}
              <Link to="/examples/set-build-target" className="text-accent hover:underline">
                Set-BuildTarget
              </Link>
              ), express it as a string plus an explicit allow-list check, or use a real C# enum.
            </p>
            <div className="mt-4">
              <AttributeMappingDiagram />
            </div>
          </section>

          <section id="validation" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">Validation &amp; errors</h2>
            <p className="mt-3 text-muted-foreground">
              Throw a regular <code className="font-mono">ArgumentException</code> (or any exception) to reject bad input. The
              Pipeline package catches it, reports the message back to the CLI caller, and exits non-zero — that's the entire
              error-handling contract. See{" "}
              <Link to="/examples/get-missing-references" className="text-accent hover:underline">
                Get-MissingReferences
              </Link>{" "}
              for an error path driven by project state rather than a bad argument.
            </p>
          </section>

          <section id="safe-mutation" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">Doing work safely</h2>
            <p className="mt-3 text-muted-foreground">
              When a command mutates the scene, three calls make it behave like a normal, undoable Editor edit:{" "}
              <code className="font-mono">Undo.IncrementCurrentGroup</code> /{" "}
              <code className="font-mono">Undo.CollapseUndoOperations</code> group everything into one Ctrl+Z step,{" "}
              <code className="font-mono">EditorSceneManager.MarkSceneDirty</code> makes sure Save actually saves it, and{" "}
              <code className="font-mono">Selection.objects</code> highlights the result in the Hierarchy. Not every command needs
              this — see{" "}
              <Link to="/examples/toggle-debug-overlay" className="text-accent hover:underline">
                Toggle-DebugOverlay
              </Link>
              , which touches a setting, not the scene, and skips all three.
            </p>
          </section>

          <section id="return-values" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">Return values</h2>
            <p className="mt-3 text-muted-foreground">
              Whatever string the method returns is printed back to you as the command's result — handy for a human glancing at
              the terminal, and just as useful for a CI script that pipes or greps it.
            </p>
          </section>

          <section id="walkthrough" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">Full walkthrough: SpawnCubeCommand.cs</h2>
            <p className="mt-3 mb-6 text-muted-foreground">
              Click a numbered pill, or a highlighted line, to see what that region does and how it maps to the CLI.
            </p>
            <AnnotatedCodeWalkthrough
              source={flagshipExample.source}
              hotspots={spawnCubeHotspots}
              activeId={activeHotspot}
              onSelect={(id) => setActiveHotspot(id || null)}
            />
          </section>

          <section id="invocation" className="scroll-mt-24">
            <h2 className="text-xl font-semibold">Invocation cheat</h2>
            <p className="mt-3 mb-4 text-muted-foreground">Straight from the source comment — every way to call it.</p>
            <CodeBlock lang="bash" code={flagshipExample.usageLines.join("\n")} filename="terminal" />
          </section>

          <section id="next-steps" className="scroll-mt-24">
            <Card className="border-accent/30 bg-accent/5 p-6">
              <h2 className="text-lg font-semibold">Try it yourself</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Play with Spawn-Cube's arguments in the interactive playground — no real Editor required.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/playground?command=spawn-cube">
                  <Button icon={<Play size={16} aria-hidden="true" />}>Open in Playground</Button>
                </Link>
                <Link to="/examples">
                  <Button variant="outline" icon={<ArrowRight size={16} aria-hidden="true" />}>
                    See more examples
                  </Button>
                </Link>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
