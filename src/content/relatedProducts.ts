import type { Product } from "@/types/content";

/**
 * What to show at the foot of a work page — two more rows of the same
 * register, never a pair of cards.
 *
 * The rule, in order:
 *
 * 1. Start reading from the work *after* this one and wrap around, so each
 *    page shows a different pair. Taking the first two of the list every time
 *    would make four of the six pages point at the same two works.
 * 2. Prefer the same discipline. Unlike in the engine this is live from day
 *    one: every discipline here has exactly two works, so the first row a
 *    reader is offered is always the other half of the pair they are looking
 *    at, and the second is the start of the next discipline.
 */
export function relatedProducts(
  work: Product,
  all: readonly Product[],
  count = 2,
): Product[] {
  const position = all.findIndex((candidate) => candidate.id === work.id);
  if (position === -1) return all.slice(0, count);

  const following = [...all.slice(position + 1), ...all.slice(0, position)];

  return [
    ...following.filter((candidate) => candidate.category === work.category),
    ...following.filter((candidate) => candidate.category !== work.category),
  ].slice(0, count);
}
