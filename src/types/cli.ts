export type CliArgType = "string" | "number" | "boolean" | "choice";

export interface CliArgDef {
  name: string;
  description: string;
  type: CliArgType;
  default: string | number | boolean;
  choices?: string[];
  min?: number;
  max?: number;
}

export interface SampleInvocation {
  args: Record<string, string | number | boolean>;
  note?: string;
}

export interface CliExample {
  slug: string;
  commandName: string;
  title: string;
  tagline: string;
  category: "mutating" | "read-only" | "settings" | "batch" | "build" | "testing" | "async";
  mainThreadRequired: boolean;
  args: CliArgDef[];
  source: string;
  successTemplate: (args: Record<string, string | number | boolean>) => string;
  errorCases: {
    label: string;
    args: Record<string, string | number | boolean>;
    error: string;
  }[];
  keyDifferences?: string[];
  usageLines: string[];
  flagship?: boolean;
}

export interface CodeHotspot {
  id: string;
  label: string;
  lineStart: number;
  lineEnd: number;
  cliMapping?: string;
  explanation: string;
}
