import Link from "next/link";
import { site } from "@/content/site";
import { ui } from "@/content/ui";

/**
 * Footer — a colophon, ruled.
 *
 * Two hard-ruled lists and an oversized wordmark, on the dark ground. The
 * engine's version put the wordmark at 15% opacity as a watermark; here it is
 * at full strength and clipped by the page edge, because a brutalist colophon
 * is a printed block, not a ghost behind one.
 *
 * There is deliberately no newsletter field and no form. A form needs a
 * backend to post to; the engine shipped one with `action="#"` that reloaded
 * the page and put the visitor's typed address into the URL, and into browser
 * history with it. The smoke pass in this repo asserts no such form exists.
 *
 * No social row either. Instagram is one of the two contact channels and is
 * listed as one, rather than appearing twice under two different headings.
 */
export function Footer() {
  return (
    <footer className="ground-dark on-dark">
      <div className="container pb-10 pt-[var(--section-y-tight)]">
        <div className="grid gap-10 md:grid-cols-2">
          <nav aria-label={ui.nav.footer}>
            <h2 className="t-mono mb-3 border-b-2 border-[var(--color-line-dark)] pb-2">
              {site.footer.navHeading}
            </h2>
            <ul className="flex flex-col">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="t-meta footer-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="t-mono mb-3 border-b-2 border-[var(--color-line-dark)] pb-2">
              {site.footer.contactHeading}
            </h2>
            <ul className="flex flex-col">
              <li className="t-meta flex min-h-11 items-center">{site.contact.city}</li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="t-meta footer-link"
                  dir="ltr"
                >
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={site.contact.instagram.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-meta footer-link"
                  dir="ltr"
                >
                  {site.contact.instagram.handle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Colophon. The wordmark is set to overflow the measure and is
            clipped by the page's own `overflow-x: clip` — deliberate, and the
            reason it carries `aria-hidden`: it is a printed block, and the
            name is already announced by the lockup in the header. */}
        <div className="mt-16 border-t-2 border-[var(--color-line-dark)] pt-5">
          <p
            className="t-display leading-none text-[var(--color-varagh)]"
            style={{ fontSize: "var(--text-display)" }}
            aria-hidden="true"
          >
            {site.brand.name}
          </p>
          <p className="t-meta mt-4">{site.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
