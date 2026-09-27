import type { CliExample } from "../types/cli";

export type ArgValues = Record<string, string | number | boolean>;

export function defaultArgValues(example: CliExample): ArgValues {
  const values: ArgValues = {};
  for (const arg of example.args) values[arg.name] = arg.default;
  return values;
}

/** Builds the real `unity command Name --flag value` string, omitting args left at their default. */
export function buildInvocation(example: CliExample, values: ArgValues): string {
  const parts = [`unity command ${example.commandName}`];
  for (const arg of example.args) {
    const current = values[arg.name];
    if (current === arg.default || current === undefined) continue;
    if (arg.type === "boolean") {
      parts.push(`--${arg.name} ${current}`);
    } else if (typeof current === "string" && current.includes(" ")) {
      parts.push(`--${arg.name} "${current}"`);
    } else {
      parts.push(`--${arg.name} ${current}`);
    }
  }
  return parts.join(" ");
}

/** String args that mean "nothing to do" when left blank — checked generically across every example. */
const requiredStringArgs = ["name", "names", "target", "outputPath"];

export interface SimulationResult {
  ok: boolean;
  output: string;
}

/** Pure, client-side simulation — never talks to a real Unity Editor. */
export function simulateCommand(example: CliExample, values: ArgValues): SimulationResult {
  for (const arg of example.args) {
    const current = values[arg.name];
    if (arg.type === "number" && typeof current === "number") {
      if (arg.min !== undefined && current < arg.min) {
        return { ok: false, output: matchingError(example, arg.name) ?? `ArgumentException: ${arg.name} is below the minimum of ${arg.min}` };
      }
      if (arg.max !== undefined && current > arg.max) {
        return { ok: false, output: matchingError(example, arg.name) ?? `ArgumentException: ${arg.name} is above the maximum of ${arg.max}` };
      }
    }
    if (requiredStringArgs.includes(arg.name) && typeof current === "string" && current.trim() === "") {
      return { ok: false, output: matchingError(example, arg.name) ?? `ArgumentException: ${arg.name} must not be empty` };
    }
    if (arg.name === "color" && typeof current === "string" && current !== "" && !/^#([0-9a-fA-F]{6})$/.test(current)) {
      return { ok: false, output: `ArgumentException: '${current}' is not a valid color. Use a hex value like #FF8800.` };
    }
    if (arg.type === "choice" && arg.choices && typeof current === "string" && !arg.choices.includes(current)) {
      return { ok: false, output: `ArgumentException: '${current}' is not a valid ${arg.name}. Choose one of: ${arg.choices.join(", ")}` };
    }
  }

  return { ok: true, output: example.successTemplate(values) };
}

function matchingError(example: CliExample, argName: string): string | undefined {
  const match = example.errorCases.find((c) => argName in c.args);
  return match?.error;
}
