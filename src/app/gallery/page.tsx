import { sortedArchive } from "@/content/archive";
import { archivePage } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";
import { ArchiveGrid } from "@/components/archive/ArchiveGrid";

/**
 * The archive.
 *
 * Process shots at one ratio in one grid, coded `A01`–`A06`, with no captions
 * at all. The engine's gallery page composed the same six images as uneven
 * plates with a deliberately ragged top edge; here the arrangement is uniform
 * and the variation is entirely in what was photographed, which is the right
 * treatment for a contact sheet.
 *
 * The route path stays `/gallery/` even though nothing on the page says
 * "gallery": every repo built on this engine keeps the same paths, and a
 * Persian-speaking reader never sees the segment.
 */
export const metadata = pageMetadata({
  title: archivePage.seo.title,
  description: archivePage.seo.description,
  path: "/gallery/",
});

export default function ArchivePage() {
  return (
    <section className="ground-light" aria-labelledby="archive-heading">
      <div className="container pb-[var(--section-y)] pt-[var(--section-y-tight)]">
        <h1 id="archive-heading" className="t-h1">
          {archivePage.heading}
        </h1>
        <p className="t-mono mt-4">{archivePage.lead}</p>

        <hr className="rule-heavy mt-6 mb-8" />

        <ArchiveGrid items={sortedArchive} />
      </div>
    </section>
  );
}
