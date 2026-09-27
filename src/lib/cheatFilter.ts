import type { CheatRow, CheatSection } from "../data/cheatsheet";

export function filterRows(section: CheatSection, query: string): CheatRow[] {
  const q = query.trim().toLowerCase();
  if (!q) return section.rows;
  if (section.title.toLowerCase().includes(q)) return section.rows;
  return section.rows.filter(
    (row) => row.primary.toLowerCase().includes(q) || row.secondary.toLowerCase().includes(q) || row.snippet?.toLowerCase().includes(q),
  );
}
