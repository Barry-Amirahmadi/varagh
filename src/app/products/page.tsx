import { publishedProducts } from "@/content/products";
import { groupByDiscipline } from "@/content/categories";
import { workIndex } from "@/content/sections";
import { pageMetadata } from "@/lib/seo";
import { toFa } from "@/lib/digits";
import { IndexRow } from "@/components/work/IndexRow";

/**
 * The collection route — the full register, broken by discipline.
 *
 * The homepage band lists the same six works in the editor's own order. This
 * page is the same rows regrouped, and the break is the difference: there, the
 * question is "what is the shape of this body of work"; here it is "what does
 * this studio do, and what has it done in each".
 *
 * No cards. No grid of images. A table — which is also why this page needs no
 * closing call to action: the register ends, the footer starts, and the
 * address is in the header on every screen.
 */
export const metadata = pageMetadata({
  title: workIndex.seo.title,
  description: workIndex.seo.description,
  path: "/products/",
});

export default function CollectionPage() {
  const groups = groupByDiscipline(publishedProducts);

  return (
    <section className="ground-light bleed pb-[var(--section-y)]" aria-labelledby="collection-heading">
      <div className="container pb-8 pt-[var(--section-y-tight)]">
        <h1 id="collection-heading" className="t-h1">
          {workIndex.heading}
        </h1>
        <p className="t-mono mt-4">
          {toFa(publishedProducts.length)} {workIndex.countLabel}
        </p>

        {/* The jump row. A register that breaks into sections needs a way into
            each of them from the top — that is what the first page of a printed
            index is for. Mono labels on a rule, not a row of pills: it is
            navigation furniture and should read as furniture.

            Each href is generated from the same `disciplineAnchor()` that
            writes the break's id, so the two cannot drift apart. A jump link
            pointing at a removed discipline does not error — the page simply
            does not move — which is why the smoke pass asserts every one of
            these resolves to exactly one target. */}
        <nav className="register-jump" aria-label={workIndex.jumpLabel}>
          {groups.map((group) => (
            <a key={group.anchor} href={`#${group.anchor}`} className="t-mono link-hard">
              {group.name}
            </a>
          ))}
        </nav>
      </div>

      {groups.map((group) => (
        <div key={group.name}>
          {/* The break is a ruled line across the register, not a heading over
              a group of cards. `aria-labelledby` ties each list to its own
              break so a screen reader announces which discipline it is in. */}
          <div className="index-break">
            <h2 className="t-mono" id={group.anchor}>
              {group.name}
            </h2>
            <span className="t-mono" aria-hidden="true">
              {toFa(group.works.length)}
            </span>
          </div>
          <ul aria-labelledby={group.anchor}>
            {group.works.map((work) => (
              <IndexRow key={work.id} work={work} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
