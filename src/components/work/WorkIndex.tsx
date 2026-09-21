import type { Product } from "@/types/content";
import Link from "next/link";
import { workIndex } from "@/content/sections";
import { IndexRow } from "./IndexRow";

/**
 * Band 2 — the register. The core of the homepage, and the whole of
 * `/products/`.
 *
 * It replaces both the showcase and the gallery preview the engine's homepage
 * carried, and it carries no image at all. Six lines tell a visitor the shape
 * of a body of work faster than six photographs do; the photographs get their
 * own band immediately after, where three of them are shown properly instead
 * of six being shown small.
 *
 * Full bleed: the rows run gutter to gutter with no container around them, so
 * the hairlines reach the page edges the way rules on a printed page do. The
 * inline padding is on the row itself, which is also what lets the hover
 * inversion cover the full width.
 *
 * The column headings sit above the first rule in the mono face and are
 * `aria-hidden`: they label columns visually, but each row is a single link
 * whose accessible name is already its full text, so announcing four headings
 * before it would only get in the way.
 */
export function WorkIndex({
  works,
  headingId = "index-heading",
  showHeading = true,
}: {
  works: Product[];
  headingId?: string;
  /** False on `/products/`, where the page masthead is already the heading. */
  showHeading?: boolean;
}) {
  return (
    <section className="ground-light bleed py-[var(--section-y-tight)]" aria-labelledby={headingId}>
      <div className="container">
        <h2 id={headingId} className={showHeading ? "t-h1" : "sr-only"}>
          {workIndex.heading}
        </h2>
      </div>

      <div className="index-head mt-8" aria-hidden="true">
        <span className="t-mono">{workIndex.columns.figure}</span>
        <span className="t-mono">{workIndex.columns.title}</span>
        <span className="t-mono">{workIndex.columns.discipline}</span>
        <span className="t-mono">{workIndex.columns.role}</span>
      </div>

      <ul className="index-list" aria-label={workIndex.listLabel}>
        {works.map((work) => (
          <IndexRow key={work.id} work={work} />
        ))}
      </ul>

      {/* The way out of the register and into the discipline-broken one. The
          two pages list the same six works and the break is the difference —
          without this link the collection route is reachable only from the
          nav, and nothing on the page says why it exists. */}
      {showHeading ? (
        <div className="container mt-8">
          <Link href={workIndex.allHref} className="t-h3 link-hard">
            {workIndex.allLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
