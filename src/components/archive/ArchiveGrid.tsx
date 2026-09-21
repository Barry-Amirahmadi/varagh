"use client";

import { useState } from "react";
import type { ArchiveItem } from "@/types/content";
import { archivePage } from "@/content/sections";
import { ui } from "@/content/ui";
import { figure } from "@/lib/digits";
import { Plate } from "@/components/ui/Plate";
import { Lightbox } from "@/components/gallery/GalleryLightbox";

/**
 * The archive — a uniform grid.
 *
 * Every plate is the same square, in the same grid, with its code in the same
 * corner. The engine's gallery composed three uneven bands with a deliberately
 * ragged top edge; this is the opposite move, and it is the right one for
 * process shots: the variation is in what is photographed, not in how the page
 * arranges it.
 *
 * Each tile is a real `<button>` — it does something rather than going
 * somewhere — which also means it is reachable by keyboard and announces
 * itself correctly with no ARIA patching. It computes `cursor: pointer`, and
 * the smoke pass asserts that: the engine's own gallery tiles compute
 * `cursor: default`, a known open defect there that is easy to inherit
 * without noticing.
 */
export function ArchiveGrid({ items }: { items: ArchiveItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul
        className="grid grid-cols-1 gap-[var(--grid-gap)] sm:grid-cols-2 lg:grid-cols-3"
        aria-label={archivePage.listLabel}
      >
        {items.map((item, i) => (
          <li key={item.id}>
            <button type="button" onClick={() => setOpen(i)} className="archive-tile">
              <span className="img-frame archive-tile__plate">
                <Plate
                  media={item.image}
                  alt=""
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </span>
              {/* The code is visible; the description is not. Together they
                  are the button's whole accessible name, which is why the
                  picture inside carries `alt=""`. */}
              <span className="archive-tile__code t-figure">{figure(item.code)}</span>
              <span className="sr-only">
                {ui.lightbox.open} — {item.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        items={items.map((item) => ({
          id: item.id,
          mark: item.code,
          image: item.image,
        }))}
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
      />
    </>
  );
}
