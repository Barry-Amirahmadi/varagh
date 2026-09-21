"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import type { MediaAsset } from "@/types/content";
import { ui } from "@/content/ui";
import { toFa, figure } from "@/lib/digits";
import { withBasePath } from "@/lib/basePath";

/**
 * What the lightbox needs to show one plate.
 *
 * Deliberately not the archive's own type: the work pages open the same
 * lightbox over a work's `views`, and those are not archive items. `mark` is
 * whatever catalogue figure the caller wants printed — `A01` from the archive,
 * `01` from a work page.
 */
export interface LightboxItem {
  id: string;
  mark: string;
  image: MediaAsset;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}

/**
 * Enlarged view.
 *
 * KEPT FROM THE ENGINE, mechanics unchanged. Built on `<dialog>`, which
 * supplies the modal semantics, the focus trap, the inert background and
 * Escape for free — roughly a hundred lines of hand-rolled accessibility code
 * that would otherwise need writing and testing. Every effect below is the
 * engine's, and the reasoning in each comment still holds; what changed is
 * only what the chrome says, because this site's plates have no titles and no
 * captions to print under them.
 *
 * Arrow keys follow the reading direction: in Persian, Left advances.
 */
export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const open = index !== null;
  const item = open ? items[index] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  /**
   * Backdrop dismiss.
   *
   * Attached natively rather than as a React `onClick` on the <dialog>: as a
   * JSX prop it reads as making a non-interactive element clickable, which is
   * a real defect when there is no keyboard equivalent — and here there is
   * one, because <dialog> answers Escape itself and routes it to onClose. The
   * listener goes on the element that actually receives backdrop clicks.
   */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;

    const onBackdropClick = (event: MouseEvent) => {
      if (event.target === dialog) onClose();
    };
    dialog.addEventListener("click", onBackdropClick);
    return () => dialog.removeEventListener("click", onBackdropClick);
  }, [open, onClose]);

  // showModal() makes the page inert but does not stop it scrolling behind the
  // dialog, which reads as the lightbox drifting over a moving background.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onNavigate((index + delta + items.length) % items.length);
    },
    [index, items.length, onNavigate],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(1); // left is forward in RTL
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        step(-1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, step]);

  return (
    <dialog
      ref={dialogRef}
      className="lightbox on-dark"
      aria-label={ui.lightbox.label}
      onClose={onClose}
    >
      {item ? (
        <div className="flex h-full flex-col">
          <div className="container flex items-center justify-between gap-4 border-b-2 border-[var(--color-line-dark)] py-3">
            {/* The mark is a catalogue figure and stays Latin; the counter is
                a quantity and goes through toFa(). Both rules, side by side,
                on one line — see src/lib/digits.ts. */}
            <p className="t-figure text-[var(--text-micro)]">{figure(item.mark)}</p>
            <p className="t-meta">
              {toFa(index! + 1)} {ui.lightbox.counterJoin} {toFa(items.length)}
            </p>
            {/* No autoFocus: showModal() already focuses the first focusable
                descendant, which is this button. The prop was redundant, and
                autofocus outside a modal is an accessibility problem — keeping
                it here trains the habit of writing it everywhere. */}
            <button
              type="button"
              onClick={onClose}
              className="menu-toggle"
              aria-label={ui.lightbox.close}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                <path d="M3 3l14 14M17 3L3 17" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <div className="relative min-h-0 flex-1">
            <Image
              key={item.id}
              src={withBasePath(item.image.src)}
              alt={item.image.alt}
              fill
              sizes="100vw"
              unoptimized
              className="object-contain p-4"
            />
          </div>

          <div className="container flex items-center justify-end gap-1 border-t-2 border-[var(--color-line-dark)] py-3">
            {/* Previous sits on the right, next on the left — the order a
                Persian reader expects from a pair of stepper controls. */}
            <button
              type="button"
              onClick={() => step(-1)}
              className="menu-toggle"
              aria-label={ui.lightbox.previous}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" fill="none">
                <path d="M2 8h12M14 8l-5-5M14 8l-5 5" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="menu-toggle"
              aria-label={ui.lightbox.next}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true" fill="none">
                <path d="M14 8H2M2 8l5-5M2 8l5 5" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
