import type { BuiltinCommand } from "../../types/builtin";
import { BuiltinCommandRow } from "./BuiltinCommandRow";

export function BuiltinCommandTable({ commands }: { commands: BuiltinCommand[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      {commands.map((command) => (
        <BuiltinCommandRow key={command.name} command={command} />
      ))}
    </div>
  );
}
