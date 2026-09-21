import type { Product } from "@/types/content";
import { workPage } from "@/content/sections";
import { cn } from "@/lib/cn";

/** The rows whose value is a catalogue year and therefore stays Latin. */
const FIGURE_LABELS = new Set(["سال"]);

/**
 * The spec table: کارفرما · سال · نقش · تحویلی.
 *
 * A definition list, ruled, label at the start edge and value at the end —
 * the way a colophon sets it. Not a card, not a two-column grid of boxes.
 *
 * The list is authored per work rather than derived from a fixed schema, so a
 * work missing one of the four simply has one fewer row. A table that is
 * uniformly filled is a table with invented rows in it.
 *
 * «سال» is the one value that renders in Latin digits, in the mono face —
 * a catalogue year is a mark, not a quantity. The full reasoning, and the
 * scope of that exception, is in `src/lib/digits.ts`.
 */
export function WorkSpecs({ work }: { work: Product }) {
  if (!work.details?.length && !work.body?.length) return null;

  return (
    <section className="ground-light" aria-labelledby="work-specs-heading">
      <div className="container grid gap-10 pb-[var(--section-y-tight)] lg:grid-cols-2 lg:gap-[var(--space-9)]">
        <div>
          <h2 id="work-specs-heading" className="t-mono border-b-2 border-[var(--color-line)] pb-2">
            {workPage.detailsHeading}
          </h2>
          {work.details?.length ? (
            <dl className="mt-1">
              {work.details.map((row) => (
                <div key={row.label} className="spec-row">
                  <dt className="t-meta">{row.label}</dt>
                  <dd className={cn("text-[var(--text-sm)]", FIGURE_LABELS.has(row.label) && "t-figure")}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {work.body?.length ? (
          <div className="flex flex-col gap-5">
            {work.body.map((paragraph, i) => (
              <p key={i} className="t-body">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
