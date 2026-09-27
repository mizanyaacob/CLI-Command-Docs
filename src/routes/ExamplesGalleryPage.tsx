import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { examples, flagshipExample, galleryExamples } from "../data/examples";

const categoryLabel: Record<string, string> = {
  mutating: "Mutating",
  "read-only": "Read-only",
  settings: "Settings",
  batch: "Batch",
  build: "Build",
  testing: "Testing",
  async: "Async",
};

export function ExamplesGalleryPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Examples gallery</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {examples.length} worked <code className="font-mono">[CliCommand]</code> examples, covering the shapes a custom command
        usually takes: mutating the scene, reading it, flipping a setting, batch-processing assets, building the player, running
        a pre-flight test, or kicking off an async job of your own.
      </p>

      <Link to="/custom-commands" className="mt-8 block">
        <Card className="border-accent/40 p-6 transition-colors duration-150 hover:border-accent">
          <div className="flex items-center gap-2">
            <Badge variant="accent">Flagship</Badge>
            <Badge variant="muted">{categoryLabel[flagshipExample.category]}</Badge>
          </div>
          <p className="mt-3 font-mono text-lg text-accent">{flagshipExample.commandName}</p>
          <p className="mt-1 text-sm text-muted-foreground">{flagshipExample.tagline}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            Full annotated walkthrough <ArrowRight size={14} aria-hidden="true" />
          </p>
        </Card>
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleryExamples.map((example) => (
          <Link key={example.slug} to={`/examples/${example.slug}`}>
            <Card className="h-full p-5 transition-colors duration-150 hover:border-accent/50">
              <Badge variant="muted">{categoryLabel[example.category]}</Badge>
              <p className="mt-3 font-mono text-base text-accent">{example.commandName}</p>
              <p className="mt-2 text-sm text-muted-foreground">{example.tagline}</p>
              <p className="mt-3 text-xs text-muted-foreground">{example.args.length} argument{example.args.length === 1 ? "" : "s"}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
