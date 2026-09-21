import type { UiStrings } from "@/types/content";

/**
 * Interface strings — accessible names, and the few words the UI says on its
 * own behalf rather than the studio's.
 *
 * Separate from `sections.ts` because the two are edited by different people
 * for different reasons: that file is the copy deck a studio rewrites, this
 * one is what the interface is called.
 *
 * Most of these are read only by a screen reader. That is not a reason to
 * leave them in the markup: the content-architecture rule has no exception for
 * text a sighted reader never sees, and a hardcoded string is one no editor
 * and no translator can reach. Changing a word here must change the page.
 *
 * Only the trade's own vocabulary changed from the engine's set — «کار»
 * instead of a product, «ورق» instead of a page of a catalogue. These are
 * accessible names, not marketing copy, and they are not a place to be clever.
 */
export const ui: UiStrings = {
  skipToContent: "پرش به محتوای اصلی",

  nav: {
    primary: "پیمایش اصلی",
    footer: "پیمایش پانوشت",
    /** Follows the studio name: «ورق — صفحهٔ اصلی». */
    home: "صفحهٔ اصلی",
    openMenu: "گشودن فهرست",
    closeMenu: "بستن فهرست",
    menuDialog: "فهرست اصلی",
  },

  lightbox: {
    label: "نمای بزرگ تصویر",
    close: "بستن نمای بزرگ",
    previous: "تصویر قبلی",
    next: "تصویر بعدی",
    /** Between position and total: «۳ از ۶». */
    counterJoin: "از",
    /** Prefixes the plate's own description on every button that opens the
     *  lightbox, on both the archive and the work pages. */
    open: "بزرگ‌نمایی",
  },
};
