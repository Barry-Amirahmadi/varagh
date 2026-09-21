import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publishedProducts, products } from "@/content/products";
import { relatedProducts } from "@/content/relatedProducts";
import { workSchema } from "@/content/schema";
import { pageMetadata } from "@/lib/seo";
import { WorkMasthead } from "@/components/work/WorkMasthead";
import { WorkSpecs } from "@/components/work/WorkSpecs";
import { WorkPlates } from "@/components/work/WorkPlates";
import { RelatedWorks } from "@/components/work/RelatedWorks";
import { JsonLd } from "@/components/seo/JsonLd";

/**
 * Work detail.
 *
 * Four movements, in the order a register reads: what it is, what the facts
 * are, what it looks like, what comes next.
 *
 *   MASTHEAD  breadcrumb, catalogue number, title at display scale, statement
 *   SPECS     the four-row table, with the body text beside it
 *   PLATES    the primary and its two views, stacked full bleed, no captions
 *   RELATED   two more rows of the register, and the way back
 *
 * The pictures come after the facts on purpose. The engine opens a detail page
 * with a full-bleed image under an ambient colour wash; a catalogue states
 * what a thing is before showing it, and that inversion is most of what makes
 * this page read as a register rather than as a product page.
 *
 * What it does not have is as deliberate as what it does: no price, no stock
 * state, no client logo, no testimonial, no award strip, no "start a project"
 * band. None of that exists in the content model, and a portfolio piece that
 * fabricates credentials to look complete is the one mistake in this genre a
 * designer spots immediately.
 */
export function generateStaticParams() {
  return publishedProducts.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = products.find((w) => w.slug === slug);
  if (!work) return {};

  return pageMetadata({
    title: work.seo?.title ?? work.name,
    /**
     * Statement *and* description, not one or the other. Either alone is about
     * fifty characters — a search snippet is truncated at roughly a hundred
     * and sixty — and both together are what the studio already says about the
     * work. Nothing is composed that the copy deck does not contain.
     */
    description:
      work.seo?.description ?? [work.statement, work.description].filter(Boolean).join(" "),
    path: `/products/${work.slug}/`,
  });
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = publishedProducts.find((w) => w.slug === slug);
  if (!work) notFound();

  const related = relatedProducts(work, publishedProducts);

  return (
    <>
      <WorkMasthead work={work} />
      <WorkSpecs work={work} />
      <WorkPlates work={work} />
      <RelatedWorks works={related} />

      {/* Structured data. A `CreativeWork`, not a `Product` — see
          src/content/schema.ts for what is left out and why. */}
      <JsonLd data={workSchema(work)} />
    </>
  );
}
