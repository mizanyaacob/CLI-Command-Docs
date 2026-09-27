import { ChevronDown } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import type { BuiltinCommand } from "../../types/builtin";
import { Badge } from "../ui/Badge";
import { Collapsible } from "../ui/Collapsible";

export function BuiltinCommandRow({ command }: { command: BuiltinCommand }) {
  const [open, setOpen] = useState(false);
  const requiresConfirm = command.args.some((a) => a.name === "confirm");

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-start justify-between gap-4 px-4 py-3 text-left transition-colors duration-150 hover:bg-muted/40"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-accent">{command.name}</span>
            {command.async && <Badge variant="outline">async job</Badge>}
            {command.notUndoable && <Badge variant="destructive">not undoable</Badge>}
            {requiresConfirm && !command.notUndoable && <Badge variant="muted">confirm required</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{command.summary}</p>
        </div>
        <ChevronDown size={16} className={clsx("mt-1 shrink-0 text-muted-foreground transition-transform duration-150", open && "rotate-180")} aria-hidden="true" />
      </button>

      <Collapsible open={open}>
        <div className="px-4 pb-4">
          {command.args.length === 0 ? (
            <p className="text-xs text-muted-foreground">No arguments.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-muted text-left tracking-wide text-muted-foreground uppercase">
                    <th className="px-3 py-2 font-medium">Flag</th>
                    <th className="px-3 py-2 font-medium">Type</th>
                    <th className="px-3 py-2 font-medium">Default</th>
                    <th className="px-3 py-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {command.args.map((arg, i) => (
                    <tr key={arg.name} className={i % 2 === 1 ? "bg-card/40" : undefined}>
                      <td className="px-3 py-2 align-top font-mono whitespace-nowrap text-foreground">
                        --{arg.name}
                        {arg.required && <span className="ml-1 text-destructive">*</span>}
                      </td>
                      <td className="px-3 py-2 align-top font-mono whitespace-nowrap text-muted-foreground">{arg.type}</td>
                      <td className="px-3 py-2 align-top font-mono whitespace-nowrap text-muted-foreground">{arg.defaultValue ?? "—"}</td>
                      <td className="px-3 py-2 align-top text-muted-foreground">{arg.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Collapsible>
    </div>
  );
}
