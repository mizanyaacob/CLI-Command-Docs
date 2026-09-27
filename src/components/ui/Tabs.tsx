import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import clsx from "clsx";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

/** WAI-ARIA tabs pattern: arrow-key navigation between tabs, one tabpanel visible at a time. */
export function Tabs({ items, defaultId, idPrefix }: { items: TabItem[]; defaultId?: string; idPrefix: string }) {
  const [active, setActive] = useState(defaultId ?? items[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (index + 1) % items.length;
    if (e.key === "ArrowLeft") nextIndex = (index - 1 + items.length) % items.length;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = items.length - 1;
    if (nextIndex !== null) {
      e.preventDefault();
      setActive(items[nextIndex].id);
      tabRefs.current[nextIndex]?.focus();
    }
  }

  const activeItem = items.find((item) => item.id === active) ?? items[0];

  return (
    <div>
      <div role="tablist" aria-label={idPrefix} className="flex flex-wrap gap-1 border-b border-border">
        {items.map((item, index) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={`${idPrefix}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${idPrefix}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={clsx(
                "cursor-pointer rounded-t-md px-4 py-2 text-sm font-medium font-mono transition-colors duration-150",
                selected ? "border-b-2 border-accent text-accent" : "border-b-2 border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${idPrefix}-panel-${item.id}`}
          aria-labelledby={`${idPrefix}-tab-${item.id}`}
          hidden={item.id !== activeItem.id}
          className="pt-4"
        >
          {item.id === activeItem.id ? item.content : null}
        </div>
      ))}
    </div>
  );
}
