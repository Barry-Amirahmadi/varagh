import Image from "next/image";
import type { MediaAsset } from "@/types/content";
import { withBasePath } from "@/lib/basePath";

interface PlateProps {
  media: MediaAsset;
  /** Responsive width hint. Always pass a real one. */
  sizes: string;
  /** Only the first plate on a route should set this. */
  priority?: boolean;
  /**
   * Overrides `media.alt`. Pass `""` when the plate sits inside a control that
   * already carries the description as its accessible name — a button labelled
   * "بزرگ‌نمایی: <description>" wrapping an image with the same description
   * makes a screen reader say it twice.
   */
  alt?: string;
}

/**
 * A full-bleed plate: the picture fills whatever box the caller sized, cropped.
 *
 * No frame, no mat, no settle animation, no zoom on hover. The crop is the
 * composition and the container owns it — every source file on this site is
 * 1:1 and every band it appears in is a different shape, so `object-fit:
 * cover` inside a caller-sized box is the entire image system. That is also
 * why there is exactly one image set: a real photograph replaces a placeholder
 * by filename, at the same square size, with no second crop to produce.
 *
 * Images are served unoptimized: a static host has no optimisation server.
 * That also means Next does not prefix the deployment base path onto the src,
 * so it goes through `withBasePath()` here — the chokepoint every full-bleed
 * image on the site passes through.
 *
 * The caller must establish a positioning context (the plate classes in
 * components.css all do), because `fill` is `position: absolute`.
 */
export function Plate({ media, sizes, priority = false, alt }: PlateProps) {
  return (
    <Image
      src={withBasePath(media.src)}
      alt={alt ?? media.alt}
      fill
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      unoptimized
      className="img-fill"
    />
  );
}
