"use client";

import { useState } from "react";
import type { Product } from "@/types/content";
import { ui } from "@/content/ui";
import { workPage } from "@/content/sections";
import { Plate } from "@/components/ui/Plate";
import { Lightbox } from "@/components/gallery/GalleryLightbox";

/**
 * A work's plates: the primary, then its extra views, stacked full bleed.
 *
 * No frames and no captions overlaying them. The selected band on the
 * homepage butts a label into the corner of a plate because there the picture
 * has to say which work it is; here the reader already knows, and a caption
 * would be repeating the masthead over the photograph.
 *
 * Every plate opens the lightbox and every plate is therefore a real
 * `<button>` with an accessible name from `ui.ts`, computing `cursor:
 * pointer`. The engine's own gallery tiles compute `cursor: default` — a known
 * open defect there, and exactly the kind of thing a derivative inherits
 * without noticing, so the smoke pass asserts against it.
 */
export function WorkPlates({ work }: { work: Product }) {
  const [open, setOpen] = useState<number | null>(null);

  const plates = [work.image, ...(work.views ?? [])];

  return (
    <section className="ground-light bleed pb-[var(--section-y-tight)]">
      <h2 className="sr-only">{workPage.viewsHeading}</h2>

      <ul>
        {plates.map((media, i) => (
          <li key={media.src} className={i > 0 ? "mt-2" : undefined}>
            <button type="button" onClick={() => setOpen(i)} className="work-plate">
              {/* alt="" — the button's own accessible name below carries the
                  description, and repeating it would say it twice. */}
              <Plate media={media} alt="" sizes="100vw" priority={i === 0} />
              <span className="sr-only">
                {ui.lightbox.open} — {media.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Lightbox
        items={plates.map((media, i) => ({
          id: media.src,
          // The primary keeps the work's own figure; the views are lettered
          // off it, so a reader who opens the third plate can see where in
          // the work they are without a caption.
          mark: i === 0 ? work.figure : `${work.figure}${String.fromCharCode(64 + i)}`,
          image: media,
        }))}
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
      />
    </section>
  );
}
