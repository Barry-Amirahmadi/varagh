import type { Product } from "@/types/content";

/**
 * Discipline grouping, derived rather than authored.
 *
 * `category` already exists on every work as free Persian text and that is
 * deliberately left alone: inventing a parallel `disciplineSlug` field, a
 * registry and landing routes would be building a taxonomy system for six
 * works. What the collection page needs is a *break* — which disciplines
 * exist, in what order, and which works sit under each — and all three can be
 * read off the work list itself.
 *
 * The shape returned is the shape a real taxonomy would expose, so growing
 * into one later is a change behind this function rather than a redesign of
 * the page that consumes it.
 */

export interface DisciplineGroup {
  /** The Persian label exactly as an editor wrote it on the work. */
  name: string;
  /** Element id of the group's heading, so a link can jump to it. */
  anchor: string;
  works: Product[];
}

/** The one place a work's on-page element id is spelled. */
export function workAnchor(slug: string): string {
  return `work-${slug}`;
}

/** The one place a discipline's on-page element id is spelled. */
export function disciplineAnchor(name: string, position: number): string {
  // Persian labels do not survive a round trip through a URL fragment
  // readably, and a slug derived from them would be percent-encoded noise.
  // The position is stable for as long as the editor's order is.
  return `discipline-${position + 1}`;
}

/**
 * Disciplines in the order the editor's own sequence introduces them — never
 * alphabetical. The register reports the collection as it is actually ordered.
 */
export function groupByDiscipline(list: readonly Product[]): DisciplineGroup[] {
  const groups: DisciplineGroup[] = [];

  for (const work of list) {
    const existing = groups.find((group) => group.name === work.category);
    if (existing) {
      existing.works.push(work);
      continue;
    }
    groups.push({
      name: work.category,
      anchor: disciplineAnchor(work.category, groups.length),
      works: [work],
    });
  }

  return groups;
}
