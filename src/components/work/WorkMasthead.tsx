import Link from "next/link";
import type { Product } from "@/types/content";
import { workPage } from "@/content/sections";
import { figure } from "@/lib/digits";

/**
 * The head of a work page: the catalogue number and the title, at display
 * scale, over a breadcrumb.
 *
 * No photograph up here. The engine opened a product page with a full-bleed
 * image under an ambient colour wash; on this site the plates come after the
 * facts, because a register page states what a thing is before showing it.
 */
export function WorkMasthead({ work }: { work: Product }) {
  return (
    <section className="ground-light" aria-labelledby="work-heading">
      <div className="container pb-8 pt-6">
        <nav aria-label={workPage.breadcrumbLabel}>
          <ol className="flex flex-wrap items-center gap-x-3">
            <li>
              <Link href="/" className="t-meta crumb">
                {workPage.breadcrumbHome}
              </Link>
            </li>
            <li className="t-meta" aria-hidden="true">
              ·
            </li>
            <li>
              <Link href="/products/" className="t-meta crumb">
                {workPage.breadcrumbCollection}
              </Link>
            </li>
          </ol>
        </nav>

        <hr className="rule-heavy mt-2" />

        <p className="t-figure mt-6 text-[var(--text-micro)]">{figure(work.figure)}</p>
        <h1 id="work-heading" className="t-display mt-2">
          {work.name}
        </h1>
        {work.statement ? <p className="t-lead mt-6">{work.statement}</p> : null}
      </div>
    </section>
  );
}
