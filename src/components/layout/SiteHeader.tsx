import { Menu, TerminalSquare, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { primaryNav } from "../../data/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-mono text-sm font-semibold" onClick={() => setOpen(false)}>
          <TerminalSquare size={20} className="text-accent" aria-hidden="true" />
          <span>
            unity <span className="text-accent">cli</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                clsx(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isActive ? "text-accent" : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex cursor-pointer items-center justify-center rounded-md p-2 text-foreground lg:hidden"
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border px-4 pb-4 lg:hidden" aria-label="Primary">
          {primaryNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                clsx("block rounded-md px-3 py-2.5 text-sm font-medium", isActive ? "text-accent" : "text-muted-foreground")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
