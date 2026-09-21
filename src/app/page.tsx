import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { publishedProducts } from "@/content/products";
import { groupByDiscipline } from "@/content/categories";
import { StatementBand } from "@/components/bands/StatementBand";
import { WorkIndex } from "@/components/work/WorkIndex";
import { SelectedBand } from "@/components/bands/SelectedBand";
import { DisciplinesBand } from "@/components/bands/DisciplinesBand";
import { ContactBand } from "@/components/bands/ContactBand";

/**
 * Homepage — five bands.
 *
 *   STATEMENT    one screen, six words, no image at all
 *   INDEX        all six works as a numbered register, no image
 *   SELECTED     three works, full-bleed plates, label butted into the corner
 *   DISCIPLINES  three ruled text blocks, no icons
 *   CONTACT      one screen, one address
 *
 * WHAT IS NOT HERE, and it is the point of this repo: no hero image, no brand
 * story band, no values band, no closing CTA band. The engine this is built on
 * opens hero → statement → showcase → brand → values → gallery → CTA, and five
 * sites already ship that sequence. Reusing it here — even with every token,
 * face and word replaced — would have failed the build outright, because the
 * whole reason this one exists is to show that the engine is not the design.
 *
 * The three selected works are the first of each discipline. An editorial rule
 * rather than a hand-picked list, so adding a fourth discipline changes the
 * band without anyone remembering to.
 */
export const metadata = pageMetadata({
  description: site.seo.description,
  path: "/",
});

export default function HomePage() {
  const works = publishedProducts;
  const selectedWorks = groupByDiscipline(works).map((group) => group.works[0]);

  return (
    <>
      <StatementBand />
      <WorkIndex works={works} />
      <SelectedBand works={selectedWorks} />
      <DisciplinesBand />
      <ContactBand />
    </>
  );
}
