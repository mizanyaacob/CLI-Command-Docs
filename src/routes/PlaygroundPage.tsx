import { CliPlayground } from "../components/playground/CliPlayground";

export function PlaygroundPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Playground</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Pick a command, adjust its arguments, and see the exact invocation plus a simulated result. Nothing here talks to a real
        Unity Editor — every output is a canned, best-effort mock of what the real command would print.
      </p>

      <div className="mt-10">
        <CliPlayground />
      </div>
    </div>
  );
}
