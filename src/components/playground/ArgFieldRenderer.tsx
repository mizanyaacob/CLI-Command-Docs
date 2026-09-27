import type { CliArgDef } from "../../types/cli";

interface Props {
  arg: CliArgDef;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}

const fieldClasses =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono text-foreground transition-colors duration-150 focus:border-accent";

export function ArgFieldRenderer({ arg, value, onChange }: Props) {
  const id = `arg-${arg.name}`;

  return (
    <div>
      <label htmlFor={id} className="mb-1 flex items-baseline justify-between gap-2">
        <span className="font-mono text-sm text-foreground">--{arg.name}</span>
        <span className="text-xs text-muted-foreground">
          default: <code className="font-mono">{String(arg.default) || '""'}</code>
        </span>
      </label>

      {arg.type === "boolean" ? (
        <select id={id} className={fieldClasses} value={String(value)} onChange={(e) => onChange(e.target.value === "true")}>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      ) : arg.type === "choice" && arg.choices ? (
        <select id={id} className={fieldClasses} value={String(value)} onChange={(e) => onChange(e.target.value)}>
          {arg.choices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      ) : arg.type === "number" ? (
        <input
          id={id}
          type="number"
          step="any"
          className={fieldClasses}
          value={value as number}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        />
      ) : (
        <input id={id} type="text" className={fieldClasses} value={value as string} onChange={(e) => onChange(e.target.value)} />
      )}

      <p className="mt-1 text-xs text-muted-foreground">{arg.description}</p>
    </div>
  );
}
