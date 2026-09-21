import { disciplines } from "@/content/sections";

/**
 * Band 4 — three hard-ruled blocks. Text only.
 *
 * No icons, no illustrations, no numbered badges, no little rules above each
 * title. The discipline name at display size is the whole ornament, and each
 * block is capped at twenty-five words — the shortage of words is what keeps
 * this band from becoming the "our values" ledger it would otherwise be.
 *
 * Three columns at 768 and up, divided by vertical 2px rules; stacked below
 * that, divided by horizontal ones. The rule moves, the design does not.
 */
export function DisciplinesBand() {
  return (
    <section className="ground-light" aria-labelledby="disciplines-heading">
      <div className="container pb-[var(--section-y)]">
        <h2 id="disciplines-heading" className="sr-only">
          {disciplines.heading}
        </h2>

        <div className="md:grid md:grid-cols-3">
          {disciplines.items.map((item) => (
            <article key={item.id} className="discipline-block">
              <h3 className="t-h2">{item.title}</h3>
              <p className="t-body mt-4">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
