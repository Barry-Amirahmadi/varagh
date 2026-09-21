import Link from "next/link";
import type { Product } from "@/types/content";
import { workPage } from "@/content/sections";
import { IndexRow } from "./IndexRow";

/**
 * The foot of a work page: two more rows of the register, and the way back.
 *
 * Rows, not cards. The whole site has one way of listing a work and this is
 * it — a reader who has scrolled through the index on the homepage already
 * knows how to read these two lines, and inventing a second presentation for
 * the same object at the bottom of a page is how a design starts to have
 * dialects.
 *
 * The heading is «ادامهٔ فهرست», not «کارهای مرتبط». With two works per
 * discipline the relation is real but thin, and a heading that claims more
 * than the rule delivers is the kind of small dishonesty a reader notices.
 */
export function RelatedWorks({ works }: { works: Product[] }) {
  if (works.length === 0) return null;

  return (
    <section className="ground-light bleed py-[var(--section-y-tight)]" aria-labelledby="related-heading">
      <div className="container">
        <h2 id="related-heading" className="t-mono">
          {workPage.relatedHeading}
        </h2>
      </div>

      <ul className="index-list mt-4">
        {works.map((work) => (
          <IndexRow key={work.id} work={work} />
        ))}
      </ul>

      <div className="container mt-8">
        <Link href="/products/" className="t-h3 link-hard">
          {workPage.backLabel}
        </Link>
      </div>
    </section>
  );
}
