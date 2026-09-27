import { Link } from "react-router-dom";
import { CheatSheetTable } from "../components/cheatsheet/CheatSheetTable";
import { CodeBlock } from "../components/code/CodeBlock";
import { TabbedCodeExample } from "../components/code/TabbedCodeExample";
import { SiteSidebar } from "../components/layout/SiteSidebar";
import { Card } from "../components/ui/Card";
import { essentialCommands } from "../data/cheatsheet";
import { gettingStartedSections } from "../data/navigation";

export function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[200px_1fr]">
        <aside className="hidden lg:block">
          <SiteSidebar sections={gettingStartedSections} />
        </aside>

        <div className="min-w-0 max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight">Getting started</h1>
          <p className="mt-3 text-muted-foreground">
            Install the CLI, learn the handful of commands you'll use every day, and open your first project.
          </p>

          <section id="install" className="mt-10 scroll-mt-24">
            <h2 className="text-lg font-semibold">1. Install</h2>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">Pick your platform.</p>
            <TabbedCodeExample
              idPrefix="install"
              snippets={[
                {
                  id: "mac-linux",
                  label: "macOS / Linux",
                  lang: "bash",
                  code: `curl -fsSL https://public-cdn.cloud.unity3d.com/hub/prod/cli/install.sh | UNITY_CLI_CHANNEL=beta bash`,
                },
                {
                  id: "windows",
                  label: "Windows (PowerShell)",
                  lang: "powershell",
                  code: `$env:UNITY_CLI_CHANNEL='beta'; irm https://public-cdn.cloud.unity3d.com/hub/prod/cli/install.ps1 | iex`,
                },
              ]}
            />
          </section>

          <section id="verify" className="mt-10 scroll-mt-24">
            <h2 className="text-lg font-semibold">2. Verify</h2>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">
              Open a new shell so <code className="font-mono">unity</code> is on PATH, then confirm it works:
            </p>
            <CodeBlock lang="bash" code={"unity --version"} filename="terminal" />
          </section>

          <section id="editor-version" className="mt-10 scroll-mt-24">
            <h2 className="text-lg font-semibold">3. Check your Editor version</h2>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">
              The <code className="font-mono">unity</code> CLI is separate from the Unity <em>Editor</em> itself — see which Editor
              versions are already installed on this machine:
            </p>
            <CodeBlock lang="bash" code={"unity editors --installed"} filename="terminal" />
            <p className="mt-4 mb-4 text-sm text-muted-foreground">
              Don't have the version you need? Browse what's available and install it — <code className="font-mono">lts</code> and{" "}
              <code className="font-mono">latest</code> work as aliases anywhere a version is expected:
            </p>
            <CodeBlock lang="bash" code={"unity releases --lts --limit 5\nunity install lts --yes --accept-eula"} filename="terminal" />
          </section>

          <section id="create-project" className="mt-10 scroll-mt-24">
            <h2 className="text-lg font-semibold">4. Create a new project</h2>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">
              Don't have a project yet? See the real template ids this Editor offers — don't guess them — then create the project.
              The first positional argument is the project <em>name</em>; <code className="font-mono">--path</code> sets the parent
              directory it's created in:
            </p>
            <CodeBlock lang="bash" code={"unity templates list --editor lts"} filename="terminal" />
            <div className="mt-4">
              <CodeBlock
                lang="bash"
                code={'unity projects create "MyGame" --path ~/UnityProjects \\\n  --editor-version lts --template com.unity.template.3d'}
                filename="terminal"
              />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Already have a project? Skip ahead to finding and opening it below.
            </p>
          </section>

          <section id="open-project" className="mt-10 scroll-mt-24">
            <h2 className="text-lg font-semibold">5. Find and open a project</h2>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">
              See every Unity project the CLI knows about on this machine — this is the Hub's project list, from the terminal:
            </p>
            <CodeBlock lang="bash" code={"unity projects list"} filename="terminal" />
            <p className="mt-4 mb-4 text-sm text-muted-foreground">
              It pages 10 at a time in an interactive terminal — pass <code className="font-mono">--all</code> to print every
              project in one go, or <code className="font-mono">--format json</code> to script against the output:
            </p>
            <CodeBlock lang="bash" code={"unity projects list --all\nunity projects list --format json"} filename="terminal" />
            <p className="mt-4 mb-4 text-sm text-muted-foreground">
              Not sure which Editor version a project needs? Ask it before opening:
            </p>
            <CodeBlock lang="bash" code={"unity projects info ./MyProject"} filename="terminal" />
            <p className="mt-4 mb-4 text-sm text-muted-foreground">
              Then open it — the CLI warns you if the required version isn't installed yet:
            </p>
            <CodeBlock lang="bash" code={"unity open ./MyProject"} filename="terminal" />
            <Card className="mt-4 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Shorthand:</span>{" "}
                <code className="font-mono text-foreground">unity &lt;version&gt; [path]</code> is the same as{" "}
                <code className="font-mono text-foreground">unity open [path] --editor-version &lt;version&gt;</code>. Works with{" "}
                <code className="font-mono text-foreground">lts</code>, <code className="font-mono text-foreground">latest</code>,
                or a full version string:
              </p>
              <div className="mt-3">
                <CodeBlock lang="bash" code={"unity lts ./MyProject"} />
              </div>
            </Card>
          </section>

          <section id="pipeline" className="mt-10 scroll-mt-24">
            <h2 className="text-lg font-semibold">6. Enable custom commands in a project</h2>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">
              Custom <code className="font-mono">[CliCommand]</code> support comes from the Pipeline package — install it once per
              project (Unity 6.0+):
            </p>
            <CodeBlock lang="bash" code={"unity pipeline install"} filename="terminal" />
          </section>

          <section id="first-command" className="mt-10 scroll-mt-24">
            <h2 className="text-lg font-semibold">7. Run your first command</h2>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">
              With the project open (or headless via <code className="font-mono">unity run</code>), confirm the connection and see
              what's discoverable:
            </p>
            <CodeBlock lang="bash" code={"unity status\nunity command"} filename="terminal" />
            <p className="mt-4 text-sm text-muted-foreground">
              Once you see a command listed, run it the same way — <code className="font-mono">unity command &lt;Name&gt;</code>.
            </p>
          </section>

          <section id="agent" className="mt-10 scroll-mt-24">
            <h2 className="text-lg font-semibold">8. Connect an AI coding agent</h2>
            <p className="mt-2 mb-4 text-sm text-muted-foreground">
              Everything on this page so far is you typing <code className="font-mono">unity</code> commands by hand. An agent like{" "}
              <span className="text-foreground">Claude Code</span>, Cursor, or any other{" "}
              <abbr title="Model Context Protocol" className="no-underline">
                MCP
              </abbr>
              -compatible client can drive the same live Editor connection directly — calling <code className="font-mono">unity status</code>,{" "}
              <code className="font-mono">unity command</code>, and your own custom commands as tools, instead of you relaying every
              step yourself. (This site's own tutorial content was written by an agent connected exactly this way.)
            </p>
            <p className="mb-4 text-sm text-muted-foreground">Wire your agent up to the Unity CLI's MCP server:</p>
            <CodeBlock lang="bash" code={"unity mcp configure"} filename="terminal" />
            <p className="mt-4 mb-4 text-sm text-muted-foreground">
              Exact flags vary per client, so check what your tool needs before running it for real:
            </p>
            <CodeBlock lang="bash" code={"unity mcp --help\nunity mcp configure --help"} filename="terminal" />
            <p className="mt-4 mb-4 text-sm text-muted-foreground">
              Optional but worth doing: install this CLI's own agent skill into your client too, so it knows the CLI's conventions
              (like the ones on this site) instead of guessing from the raw tool list alone:
            </p>
            <CodeBlock lang="bash" code={"unity skill install <client> --local"} filename="terminal" />
            <Card className="mt-4 border-accent/30 bg-accent/5 p-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">This is local, not remote access.</span> The agent runs on your own
                machine, in your own user account, against your own open Editor — it gets no privilege you don't already have at
                your own terminal.
              </p>
            </Card>
            <p className="mt-4 text-sm text-muted-foreground">
              To check it worked, ask your agent to run <code className="font-mono">unity status</code> — a connected Editor should
              come back with state <code className="font-mono">"ready"</code>.
            </p>
          </section>

          <section id="essentials" className="mt-10 scroll-mt-24">
            <p className="mb-4 text-sm text-muted-foreground">
              Everything above, as a single reference table you can come back to. The full{" "}
              <Link to="/cheat-sheet" className="text-accent hover:underline">
                cheat sheet
              </Link>{" "}
              has flags, exit codes and more workflows beyond these basics.
            </p>
            <CheatSheetTable section={essentialCommands} rows={essentialCommands.rows} />
          </section>

          <section id="next-steps" className="mt-10 scroll-mt-24">
            <Card className="border-accent/30 bg-accent/5 p-5">
              <p className="text-sm text-muted-foreground">
                Comfortable with the basics? Head to{" "}
                <Link to="/core-concepts" className="font-medium text-foreground hover:underline">
                  Core Concepts
                </Link>{" "}
                for the mental model, or straight to the{" "}
                <Link to="/custom-commands" className="font-medium text-foreground hover:underline">
                  Custom Commands
                </Link>{" "}
                tutorial to write your own.
              </p>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
