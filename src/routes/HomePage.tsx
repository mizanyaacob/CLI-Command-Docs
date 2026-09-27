import { ArrowRight, BookOpen, Library, Puzzle, Sparkles, Terminal } from "lucide-react";
import { Link } from "react-router-dom";
import { CodeBlock } from "../components/code/CodeBlock";
import { RequestFlowDiagram } from "../components/diagrams/RequestFlowDiagram";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { flagshipExample, galleryExamples } from "../data/examples";

export function HomePage() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24">
        <span className="glow-accent mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
          <Sparkles size={13} aria-hidden="true" />
          Interactive Unity CLI reference
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Drive Unity from the command line — and teach it new tricks.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          A tutorial and quick reference for the Unity CLI: how to connect to a running Editor, and how to wrap your own C# actions
          as custom <code className="font-mono text-foreground">[CliCommand]</code> tools you can call by name.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/custom-commands">
            <Button icon={<Puzzle size={16} aria-hidden="true" />}>Learn custom commands</Button>
          </Link>
          <Link to="/cheat-sheet">
            <Button variant="outline" icon={<BookOpen size={16} aria-hidden="true" />}>
              Open the cheat sheet
            </Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <CodeBlock lang="bash" code={flagshipExample.usageLines.join("\n")} filename="terminal" />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="p-6">
            <Puzzle size={20} className="mb-3 text-accent" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Write your own commands</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A hands-on, annotated walkthrough of a real <code className="font-mono">[CliCommand]</code> — click through every
              region of the code to see what it does and how it becomes CLI syntax.
            </p>
            <Link to="/custom-commands" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
              Start the tutorial <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </Card>
          <Card className="p-6">
            <Library size={20} className="mb-3 text-accent" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Explore what's built in</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              164 ready-made commands for GameObjects, assets, builds, tests and more — organized like onboarding material, not an
              alphabetical wall of text.
            </p>
            <Link to="/built-in-commands" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
              Browse built-ins <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </Card>
          <Card className="p-6">
            <Terminal size={20} className="mb-3 text-accent" aria-hidden="true" />
            <h2 className="text-xl font-semibold">Keep it as a reference</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Global flags, exit codes, environment variables and the recipes you'll reach for most — condensed onto one
              searchable page.
            </p>
            <Link to="/cheat-sheet" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
              Open the cheat sheet <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="text-xl font-semibold">How a command reaches the Editor</h2>
        <p className="mt-2 mb-6 max-w-2xl text-sm text-muted-foreground">
          Whether an Editor is already open or you're running headless in CI, the path looks the same.
        </p>
        <Card className="p-6">
          <RequestFlowDiagram />
        </Card>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl font-semibold">More worked examples</h2>
          <Link to="/examples" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleryExamples.map((example) => (
            <Link key={example.slug} to={`/examples/${example.slug}`}>
              <Card className="h-full p-5 transition-colors duration-150 hover:border-accent/50">
                <p className="font-mono text-sm text-accent">{example.commandName}</p>
                <p className="mt-2 text-sm text-muted-foreground">{example.tagline}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
