import { Search } from "lucide-react";

export function CheatSheetSearch({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter flags, exit codes, workflows…"
        aria-label="Filter the cheat sheet"
        className="w-full rounded-lg border border-border bg-card py-2.5 pr-3 pl-9 text-sm text-foreground focus:border-accent"
      />
    </div>
  );
}
