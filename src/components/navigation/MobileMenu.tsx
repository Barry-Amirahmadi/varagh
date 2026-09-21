"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { Wordmark } from "@/components/ui/Wordmark";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen navigation for small viewports.
 *
 * It appears; it does not arrive. The engine's panel slid in from the reading
 * edge and staggered its links in at 60ms intervals — a sequence that belongs
 * to a softer site. Here the panel is simply there, in 160ms, and the links
 * are already in place when it is.
 *
 * Focus is moved in on open, trapped while open, and returned to the trigger
 * on close. Every control that leaves the panel closes it — the lockup and the
 * email included, not only the nav links, which is the defect the engine
 * shipped and fixed.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previousOverflow;
      restoreTo.current?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      className="menu-panel on-dark"
      data-open={open}
      role="dialog"
      aria-modal="true"
      aria-label={ui.nav.menuDialog}
    >
      <div className="container flex items-center justify-between py-3">
        <Wordmark onClick={onClose} />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="menu-toggle"
          aria-label={ui.nav.closeMenu}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Same accessible name as the header's nav, and correctly so: the panel
          carries `visibility: hidden` while closed, so only ever one of the
          two is in the accessibility tree. */}
      <nav className="container flex-1 overflow-y-auto pt-6" aria-label={ui.nav.primary}>
        <ul>
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} onClick={onClose} className="menu-panel__link">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container flex flex-col gap-3 pb-10 pt-8">
        <a
          href={`mailto:${site.contact.email}`}
          onClick={onClose}
          className="t-mono link-hard"
          dir="ltr"
        >
          {site.contact.email}
        </a>
        <a
          href={site.contact.instagram.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="t-mono link-hard"
          dir="ltr"
        >
          {site.contact.instagram.handle}
        </a>
      </div>
    </div>
  );
}
