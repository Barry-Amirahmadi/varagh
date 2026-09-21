import Link from "next/link";
import type { Product } from "@/types/content";
import { selected } from "@/content/sections";
import { figure } from "@/lib/digits";
import { Plate } from "@/components/ui/Plate";

/**
 * Band 3 — three works, full bleed, stacked.
 *
 * Exactly three. The register above already lists all six, so this band is not
 * a catalogue: it is the moment the page stops listing and shows something.
 * Six would make it the catalogue again.
 *
 * The plate is a band, not a square. Every source file on this site is 1:1 and
 * the crop is CSS — `aspect-ratio` on the container, `object-fit: cover` on
 * the picture — so there is no wide version of any photograph to produce, and
 * a real image replaces a placeholder by filename alone.
 *
 * The label is butted into the bottom corner of the plate on a solid ink
 * block, not centred over the middle of it. That is the difference between a
 * caption pressed onto a contact sheet and a title card floating on a hero
 * image, and it is most of what separates this band from the five sites this
 * engine has already produced.
 */
export function SelectedBand({ works }: { works: Product[] }) {
  return (
    <section
      className="ground-light bleed pb-[var(--section-y)]"
      aria-labelledby="selected-heading"
    >
      <div className="container pb-6 pt-[var(--section-y-tight)]">
        <h2 id="selected-heading" className="t-h1">
          {selected.heading}
        </h2>
      </div>

      <ul aria-label={selected.listLabel}>
        {works.map((work, i) => (
          <li key={work.id} className={i > 0 ? "mt-2" : undefined}>
            <Link href={`/products/${work.slug}/`} className="selected-item">
              <div className="selected-item__plate">
                {/* alt="" — the link's own text is the accessible name, and
                    repeating the description here would say it twice. */}
                <Plate media={work.image} alt="" sizes="100vw" priority={i === 0} />
              </div>
              <span className="selected-item__label">
                <span className="t-figure text-[var(--text-micro)]">{figure(work.figure)}</span>
                <span className="selected-item__title">{work.name}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
