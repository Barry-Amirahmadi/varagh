import type { Product } from "@/types/content";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Schema.org mappings.
 *
 * Every field below reads straight off the content model. Nothing is invented
 * to satisfy a schema, which is the whole discipline here — structured data is
 * the easiest place on a site to assert something false, because no reader
 * ever sees it and the vocabulary invites you to fill in a shape.
 *
 * **A work is a `CreativeWork`, not a `Product`.** The route is
 * `/products/[slug]` because every repo derived from this engine keeps the
 * same paths, but the thing on the page is a portfolio piece: it is not for
 * sale, has no price and no availability, and typing it as a `Product` would
 * be a claim about commerce that nothing on this site supports.
 *
 * What is deliberately left out:
 *
 * - **No `offers`, `aggregateRating` or `review`.** There is no commerce and
 *   there are no reviews.
 * - **No `sameAs`** on the organisation. The Instagram handle is a deliberate
 *   `.example` placeholder; `sameAs` asserts "this organisation *is* that
 *   account", which would be a false claim about a URL that does not resolve.
 * - **No `logo`.** No logo asset exists — the mark lives in the favicon and on
 *   the share card, neither of which is a logo file a real studio would ship.
 * - **No `dateCreated`.** The year in a work's spec table is a Persian solar
 *   year; schema.org expects ISO 8601, and silently reading `1403` as a
 *   Gregorian year would publish a date three decades wrong.
 * - **No `founder`, `foundingDate` or `numberOfEmployees`.** None supplied.
 */
export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.brand.name,
    alternateName: site.brand.latin,
    url: absoluteUrl("/"),
    description: site.seo.description,
    image: absoluteUrl(site.seo.ogImage.src),
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.city,
      addressCountry: "IR",
    },
  };
}

export function workSchema(work: Product): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.name,
    description: work.seo?.description ?? work.description,
    genre: work.category,
    url: absoluteUrl(`/products/${work.slug}/`),
    image: absoluteUrl(work.image.src),
    creator: { "@type": "Organization", name: site.brand.name },
    inLanguage: "fa",
  };
}
