import { useEffect, useState } from "react";
import clsx from "clsx";
import type { PageSection } from "../../data/navigation";
import { useReducedMotion } from "../../lib/motion";

export function SiteSidebar({ sections }: { sections: PageSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const reduced = useReducedMotion();

  useEffect(() => {
    const elements = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  return (
    <nav aria-label="On this page" className="thin-scrollbar sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 text-sm">
      <p className="mb-3 font-mono text-xs tracking-wide text-muted-foreground uppercase">On this page</p>
      <ul className="space-y-1 border-l border-border">
        {sections.map((section) => {
          const active = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active ? "location" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  jumpTo(section.id);
                }}
                className={clsx(
                  "-ml-px block border-l-2 py-1.5 pl-3 transition-colors duration-150",
                  active ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
