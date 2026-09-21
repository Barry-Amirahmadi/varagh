import { site } from "@/content/site";
import { contact } from "@/content/sections";

/**
 * Band 5 — one screen, one address.
 *
 * The largest interactive thing on the site is the email address, and it is
 * sized to say so. Under it, Instagram. Nothing else: no form, no phone, no
 * "let's work together" paragraph, no pair of buttons, no map.
 *
 * The address wraps rather than overflowing. At 8vw on a 390px screen the
 * string is wider than the gutters allow, and the choice is between a two-line
 * address and a page that scrolls sideways — the first is a design decision,
 * the second is a defect. `overflow-wrap: anywhere` on `.contact-mail` is what
 * makes that choice; do not remove it without re-measuring at 390px.
 */
export function ContactBand() {
  return (
    <section
      id="contact"
      className="ground-dark on-dark screen-full flex flex-col justify-center"
      aria-labelledby="contact-heading"
    >
      <div className="container py-[var(--section-y)]">
        <h2 id="contact-heading" className="t-mono">
          {contact.heading}
        </h2>

        <p className="mt-6">
          <a href={`mailto:${site.contact.email}`} className="contact-mail">
            {site.contact.email}
          </a>
        </p>

        <p className="mt-10">
          <a
            href={site.contact.instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="t-h3 link-hard"
            dir="ltr"
          >
            {site.contact.instagram.handle}
          </a>
        </p>
      </div>
    </section>
  );
}
