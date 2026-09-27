export interface NavItem {
  to: string;
  label: string;
}

export const primaryNav: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/getting-started", label: "Getting Started" },
  { to: "/core-concepts", label: "Core Concepts" },
  { to: "/custom-commands", label: "Custom Commands" },
  { to: "/built-in-commands", label: "Built-ins" },
  { to: "/examples", label: "Examples" },
  { to: "/playground", label: "Playground" },
  { to: "/cheat-sheet", label: "Cheat Sheet" },
];

export interface PageSection {
  id: string;
  label: string;
}

export const gettingStartedSections: PageSection[] = [
  { id: "install", label: "1. Install" },
  { id: "verify", label: "2. Verify" },
  { id: "editor-version", label: "3. Check your Editor version" },
  { id: "create-project", label: "4. Create a new project" },
  { id: "open-project", label: "5. Find & open a project" },
  { id: "pipeline", label: "6. Enable custom commands" },
  { id: "first-command", label: "7. Run your first command" },
  { id: "agent", label: "8. Connect an AI agent" },
  { id: "essentials", label: "Essential commands" },
  { id: "next-steps", label: "Next steps" },
];

export const customCommandsSections: PageSection[] = [
  { id: "mental-model", label: "Mental model" },
  { id: "prerequisites", label: "Prerequisites" },
  { id: "anatomy", label: "Anatomy at a glance" },
  { id: "clicommand", label: "[CliCommand]" },
  { id: "cliarg", label: "[CliArg]" },
  { id: "validation", label: "Validation & errors" },
  { id: "safe-mutation", label: "Doing work safely" },
  { id: "return-values", label: "Return values" },
  { id: "walkthrough", label: "Full walkthrough" },
  { id: "invocation", label: "Invocation cheat" },
  { id: "next-steps", label: "Next steps" },
];
