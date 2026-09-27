import type { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export function Card({ children, className, ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={clsx("rounded-xl border border-border bg-card text-card-foreground shadow-lg shadow-black/20", className)}
      {...rest}
    >
      {children}
    </div>
  );
}
