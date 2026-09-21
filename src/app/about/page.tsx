import { about, contact } from "@/content/sections";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

/**
 * Studio — one column of running text, and the contact details under it.
 *
 * No image on this page at all, and the measure is deliberately wider than the
 * engine's 34rem. A narrow column in a field of empty paper is the register of
 * a magazine feature; a wide one, hard against the gutters, is the register of
 * a document. This site is the second.
 *
 * The contact block is a hard-ruled definition list rather than a band with a
 * heading and a call to action: the homepage already ends on a full screen
 * whose only content is the address, and repeating that here would be the
 * third time on one site that the reader is asked to make contact.
 */
export const metadata = pageMetadata({
  title: about.seo.title,
  description: about.seo.description,
  path: "/about/",
});

export default function AboutPage() {
  return (
    <section className="ground-light" aria-labelledby="about-heading">
      <div className="container pb-[var(--section-y)] pt-[var(--section-y-tight)]">
        <h1 id="about-heading" className="t-h1">
          {about.heading}
        </h1>

        <hr className="rule-heavy mt-6" />

        <div className="mt-10 flex flex-col gap-6">
          {about.body.map((paragraph, i) => (
            <p key={i} className="t-body">
              {paragraph}
            </p>
          ))}
        </div>

        <div id="contact" className="mt-[var(--section-y-tight)] max-w-[var(--measure)]">
          <h2 className="t-mono border-b-2 border-[var(--color-line)] pb-2">{contact.heading}</h2>
          <dl className="mt-1">
            <div className="spec-row">
              <dt className="t-meta">{contact.labels.city}</dt>
              <dd className="text-[var(--text-sm)]">{site.contact.city}</dd>
            </div>
            <div className="spec-row">
              <dt className="t-meta">{contact.labels.email}</dt>
              <dd>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="text-[var(--text-sm)] link-hard"
                  dir="ltr"
                >
                  {site.contact.email}
                </a>
              </dd>
            </div>
            <div className="spec-row">
              <dt className="t-meta">{contact.labels.instagram}</dt>
              <dd>
                <a
                  href={site.contact.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-sm)] link-hard"
                  dir="ltr"
                >
                  {site.contact.instagram.handle}
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
