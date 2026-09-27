import type { ReactNode } from "react";
import clsx from "clsx";

type Variant = "accent" | "muted" | "destructive" | "outline";

const variantClasses: Record<Variant, string> = {
  accent: "bg-accent/15 text-accent border border-accent/30",
  muted: "bg-muted text-muted-foreground border border-border",
  destructive: "bg-destructive/15 text-destructive border border-destructive/40",
  outline: "bg-transparent text-foreground border border-border",
};

export function Badge({ variant = "muted", children, className }: { variant?: Variant; children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium font-mono tracking-tight",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
