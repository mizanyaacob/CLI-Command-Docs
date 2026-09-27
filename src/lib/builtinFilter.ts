import type { BuiltinCategory } from "../types/builtin";

export function filterBuiltinCategories(categories: BuiltinCategory[], query: string): BuiltinCategory[] {
  const q = query.trim().toLowerCase();
  if (!q) return categories;

  return categories
    .map((category) => {
      if (category.title.toLowerCase().includes(q)) return category;
      const commands = category.commands.filter(
        (cmd) => cmd.name.toLowerCase().includes(q) || cmd.summary.toLowerCase().includes(q),
      );
      return commands.length > 0 ? { ...category, commands } : null;
    })
    .filter((c): c is BuiltinCategory => c !== null);
}
