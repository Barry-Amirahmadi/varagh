"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { routePath } from "@/lib/nav";
import { Wordmark } from "@/components/ui/Wordmark";
import { MobileMenu } from "./MobileMenu";

/**
 * RTL navigation.
 *
 * Reading order is wordmark → sections → address, which in an RTL document
 * places the wordmark at the right edge and the email at the left. That is the
 * natural arrangement here, not a mirrored LTR header: the studio's name sits
 * where a Persian reader starts.
 *
 * The bar is opaque and separated by a 2px rule. No blur, no scrolled state,
 * no fading border — and therefore no scroll listener at all, which is the
 * second reason to do it this way.
 *
 * `aria-current` is only ever `"page"` here. The engine tracked the reader's
 * position within a page as well, via an IntersectionObserver over the nav's
 * in-page anchors; this site's nav has no in-page anchors, so that whole
 * mechanism is gone rather than left running over an empty list.
 */
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const here = routePath(usePathname() ?? "/");

  return (
    <>
      <header className="site-header">
        <div className="container flex items-center justify-between gap-4 py-3">
          <Wordmark />

          <nav aria-label={ui.nav.primary} className="hidden md:block">
            <ul className="flex items-center">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link"
                    aria-current={routePath(item.href) === here ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* The conversion path, in the header, as itself. There is no
                "get in touch" button anywhere on this site: a studio is
                reached by writing to it, and the address is shorter than any
                euphemism for the address. */}
            <a href={`mailto:${site.contact.email}`} className="header-mail hidden sm:inline-flex">
              {site.contact.email}
            </a>

            <button
              type="button"
              className="menu-toggle md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label={ui.nav.openMenu}
              aria-expanded={menuOpen}
            >
              <span className="flex w-6 flex-col gap-[5px]">
                <span className="menu-toggle__bar w-full" />
                <span className="menu-toggle__bar w-full" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
