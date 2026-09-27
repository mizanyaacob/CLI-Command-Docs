export interface CheatRow {
  id: string;
  primary: string;
  secondary: string;
  snippet?: string;
}

export interface CheatSection {
  id: string;
  title: string;
  description: string;
  columns: [string, string];
  rows: CheatRow[];
}

export const globalFlags: CheatSection = {
  id: "global-flags",
  title: "Global flags",
  description: "Work on (almost) every unity command.",
  columns: ["Flag", "Does"],
  rows: [
    { id: "help", primary: "--help, -h", secondary: "Show help for the current command.", snippet: "unity --help" },
    { id: "version", primary: "--version", secondary: "Print the installed CLI version.", snippet: "unity --version" },
    { id: "json", primary: "--json", secondary: "Emit machine-readable JSON instead of formatted text.", snippet: "unity status --json" },
    { id: "verbose", primary: "--verbose, -v", secondary: "Print extra diagnostic output.", snippet: "unity command Spawn-Cube --verbose" },
    { id: "quiet", primary: "--quiet", secondary: "Suppress non-essential output.", snippet: "unity command Spawn-Cube --quiet" },
    { id: "project-path", primary: "--project-path <path>", secondary: "Target a specific open Editor when more than one is running.", snippet: "unity status --project-path ./MyGame" },
    { id: "editor-version", primary: "--editor-version <ver>", secondary: "Pin the Editor version for install/open/run.", snippet: "unity open ./MyGame --editor-version 6000.0.47f1" },
    { id: "timeout", primary: "--timeout <seconds>", secondary: "Fail instead of hanging past this many seconds.", snippet: "unity run ./MyGame --timeout 120 -- -batchmode" },
    { id: "no-color", primary: "--no-color", secondary: "Disable ANSI color in output (good for CI logs).", snippet: "unity command Spawn-Cube --no-color" },
  ],
};

export const exitCodes: CheatSection = {
  id: "exit-codes",
  title: "Exit codes",
  description: "What the process exit code tells a calling script.",
  columns: ["Code", "Meaning"],
  rows: [
    { id: "0", primary: "0", secondary: "Success." },
    { id: "1", primary: "1", secondary: "General/unclassified error." },
    { id: "2", primary: "2", secondary: "Invalid arguments — bad flags or values." },
    { id: "3", primary: "3", secondary: "Could not connect to a running Unity Editor." },
    { id: "4", primary: "4", secondary: "Command not found — no [CliCommand] with that name." },
    { id: "5", primary: "5", secondary: "Timed out before the command completed." },
  ],
};

export const envVars: CheatSection = {
  id: "env-vars",
  title: "Environment variables",
  description: "Configure the CLI without passing flags every time.",
  columns: ["Variable", "Does"],
  rows: [
    { id: "home", primary: "UNITY_CLI_HOME", secondary: "Overrides where the CLI stores its local state.", snippet: "export UNITY_CLI_HOME=~/.unity-cli" },
    { id: "license", primary: "UNITY_LICENSE", secondary: "License content/path used for headless activation.", snippet: "export UNITY_LICENSE=./ci/unity_license.ulf" },
    { id: "log-level", primary: "UNITY_CLI_LOG_LEVEL", secondary: "Sets verbosity: error, warn, info, debug.", snippet: "export UNITY_CLI_LOG_LEVEL=debug" },
    { id: "no-telemetry", primary: "UNITY_CLI_NO_TELEMETRY", secondary: "Set to 1 to disable anonymous usage telemetry.", snippet: "export UNITY_CLI_NO_TELEMETRY=1" },
  ],
};

export const workflows: CheatSection = {
  id: "workflows",
  title: "Common workflows",
  description: "Copy-paste recipes for the things you'll do most often.",
  columns: ["Task", "Command"],
  rows: [
    { id: "install-verify", primary: "Install + verify", secondary: "Install the CLI, then confirm it's on PATH.", snippet: "unity --version" },
    { id: "create-project", primary: "Create a new project", secondary: "Name, parent folder, Editor version and template in one call.", snippet: 'unity projects create "MyGame" --path ~/UnityProjects --editor-version lts --template com.unity.template.3d' },
    { id: "list-projects", primary: "List projects on this machine", secondary: "See every project the CLI/Hub knows about.", snippet: "unity projects list --all" },
    { id: "pipeline-install", primary: "Install the Pipeline package", secondary: "Required once per project before custom commands work.", snippet: "unity pipeline install" },
    { id: "list-commands", primary: "List discoverable commands", secondary: "See every [CliCommand] the connected Editor exposes.", snippet: "unity command" },
    { id: "run-oneshot", primary: "One-shot command, no open Editor", secondary: "Spins up a headless Editor, runs one command, exits.", snippet: "unity run ./MyGame --command Spawn-Cube -- --name Crate" },
    { id: "auth-status", primary: "Check auth / license status", secondary: "Confirm you're signed in before a CI job runs.", snippet: "unity status" },
  ],
};

export const essentialCommands: CheatSection = {
  id: "essential-commands",
  title: "Essential commands for beginners",
  description: "If you only remember a handful of unity commands on day one, make it these.",
  columns: ["Command", "What it does"],
  rows: [
    { id: "version", primary: "unity --version", secondary: "Confirm the CLI itself is installed, and which version.", snippet: "unity --version" },
    {
      id: "editors-installed",
      primary: "unity editors --installed",
      secondary: "List every Unity Editor version already on this machine.",
      snippet: "unity editors --installed",
    },
    {
      id: "releases",
      primary: "unity releases --lts",
      secondary: "Browse available Editor versions you could install.",
      snippet: "unity releases --lts --limit 5",
    },
    {
      id: "install",
      primary: "unity install lts",
      secondary: "Install the latest LTS Editor, accepting the EULA non-interactively.",
      snippet: "unity install lts --yes --accept-eula",
    },
    {
      id: "projects-create",
      primary: "unity projects create <name>",
      secondary: "Create a new project — name, parent folder, Editor version and template in one call.",
      snippet: 'unity projects create "MyGame" --path ~/UnityProjects --editor-version lts --template com.unity.template.3d',
    },
    {
      id: "projects-list",
      primary: "unity projects list",
      secondary: "See every Unity project this machine knows about — the Hub's project list, from the terminal.",
      snippet: "unity projects list --all",
    },
    {
      id: "open",
      primary: "unity open <path>",
      secondary: "Open a project in the Editor — warns if the required version isn't installed.",
      snippet: "unity open ./MyProject",
    },
    {
      id: "status",
      primary: "unity status",
      secondary: 'Confirm a connected, running Editor — look for state "ready".',
      snippet: "unity status",
    },
    {
      id: "command-list",
      primary: "unity command",
      secondary: "List every command the connected Editor exposes, built-in and custom.",
      snippet: "unity command",
    },
    {
      id: "command-run",
      primary: "unity command <Name>",
      secondary: "Run one of those commands.",
      snippet: "unity command Spawn-Cube",
    },
    {
      id: "pipeline-install",
      primary: "unity pipeline install",
      secondary: "Enable custom [CliCommand] support for the open project (once per project).",
      snippet: "unity pipeline install",
    },
  ],
};

export const customCommandRecap = {
  title: "Custom command syntax, at a glance",
  code: `[CliCommand("Command-Name", "One-line description", MainThreadRequired = true)]
public static string CommandName(
    [CliArg("argName", "What it does")] string argName = "default")
{
    // validate → do the work → return a result string
    return "Done.";
}`,
};
