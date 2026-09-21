/**
 * Content model.
 *
 * These types are the contract between the UI and whatever supplies content.
 * Today the supplier is a set of TypeScript files under `src/content`; a CMS
 * can replace them without a component changing, because every component reads
 * only from these shapes and every field below maps to a CMS field.
 *
 * NAMING, read this before renaming anything. The route is `/products/[slug]`
 * and the type is `Product`, but on this site the thing is a «کار» — a piece
 * of work in a studio's portfolio, not something for sale. The route paths are
 * deliberately identical to the engine's so that every repo derived from it
 * stays structurally the same, and a Persian-speaking visitor never reads a URL
 * segment. `Product` follows the route. The Persian word an editor sees is in
 * `src/content/ui.ts` and `src/content/sections.ts`, where it belongs.
 */

/** Fixed aspect ratios. Crops are part of the art direction, not per-image
 *  guesswork — an editor picks one, never a raw pixel size. */
export type Ratio = "1/1" | "4/5" | "3/4" | "4/3" | "8/5" | "16/9";

export interface MediaAsset {
  /** Path today, CMS asset URL later. */
  src: string;
  /** Describes the picture for someone who cannot see it. Never the filename. */
  alt: string;
  ratio: Ratio;
  /** Optional editorial caption shown under or over the image. */
  caption?: string;
}

export interface Product {
  id: string;
  /** URL segment — /products/[slug]. */
  slug: string;
  /** Persian title of the work. */
  name: string;
  /** Latin transliteration, used only for mono micro-labels. */
  latin: string;
  /**
   * Catalogue number, as it is printed: `01`–`06`, Latin digits, two figures.
   *
   * A string rather than a number, and that is deliberate. The leading zero is
   * part of how the mark is set — `1` is a quantity, `01` is a catalogue
   * position — and a numeric field would lose it at the first `String(n)`.
   */
  figure: string;
  /** Persian discipline label, e.g. «هویت بصری». Groups the index. */
  category: string;
  /** The studio's role on this work, one short phrase. */
  role: string;
  /** Short Persian description — one line, at most 12 words. */
  description: string;
  /**
   * Detail-page copy. All optional: a work can be published with nothing but
   * the fields above, and the detail page degrades to the listing copy.
   *
   * These are *editorial copy* — not claims. There is deliberately no client
   * name, no award, no press mention and no result: none has been supplied,
   * and inventing one is what the engine's §44.1 forbids.
   */
  statement?: string;
  /** Body paragraphs. An array so the editor controls the breaks, not a regex. */
  body?: string[];
  /**
   * The spec table: کارفرما · سال · نقش · تحویلی.
   *
   * Label/value pairs rather than a fixed schema, so a work missing one of
   * them simply has one fewer row instead of an empty cell. «کارفرما» names a
   * *kind* of client — «ناشر مستقل», «کافه» — never a company. That is what
   * lets one demo be shown to a photographer and to a motion designer without
   * a word changing.
   */
  details?: { label: string; value: string }[];
  /** The primary plate. Required, and every index row, related row and share
   *  card reads it — nothing else should be substituted for it. */
  image: MediaAsset;
  /**
   * Extra plates, shown stacked below the primary on the detail page and
   * opened in the same lightbox as the archive.
   *
   * Optional, and separate from `image` on purpose: `image` is the one asset
   * every surface can rely on existing, so a CMS editor adding a second view
   * can never accidentally leave a row on the index with nothing to show.
   */
  views?: MediaAsset[];
  status: "published" | "draft";
  seo?: {
    title?: string;
    description?: string;
  };
}

/**
 * One archive plate.
 *
 * `code` is the printed mark — `A01`–`A06`, Latin, in the mono face — and it
 * is authored rather than derived from `order`, so reordering the archive
 * never silently renumbers a plate someone has already referred to.
 */
export interface ArchiveItem {
  id: string;
  code: string;
  /** Accessible description of the plate. There are no visible captions. */
  alt: string;
  image: MediaAsset;
  /** Manual sort position, as an editor would set it. */
  order: number;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteContent {
  brand: {
    name: string;
    latin: string;
    /** One line, used in the footer and as the meta description base. */
    line: string;
  };
  /**
   * Document-level metadata for the site as a whole. Per-route titles live on
   * the section that owns the route; these are the default and the wrapper.
   */
  seo: {
    /** The homepage <title>, and the fallback for any route without its own. */
    title: string;
    /** `%s` is the route's own title. */
    titleTemplate: string;
    /** The homepage meta description. */
    description: string;
    /** The share card. `src` is root-relative; the absolute URL is composed
     *  at build time, because Open Graph requires one. */
    ogImage: { src: string; alt: string; width: number; height: number };
  };
  nav: NavItem[];
  /**
   * How the studio is reached. Two channels and no more.
   *
   * There is no phone, no WhatsApp and no form. A studio is reached by email;
   * a phone number on a page like this is either a real number nobody answers
   * or a placeholder that makes the demo look unfinished. The engine's contact
   * model carried `phone`, `phoneHref` and `whatsapp` — all three are gone
   * from this type rather than left in place holding zeros.
   */
  contact: {
    city: string;
    email: string;
    instagram: { handle: string; href: string };
  };
  /** Column headings in the footer. Brand copy, not structure. */
  footer: {
    navHeading: string;
    contactHeading: string;
  };
  copyright: string;
}

/* -------------------------------------------------------------------------- */
/*  Section copy                                                              */
/* -------------------------------------------------------------------------- */

/** Per-route metadata, on the section that owns the route. */
export interface SeoFields {
  title: string;
  description: string;
}

/**
 * The statement band.
 *
 * `text` is the whole first screen: 6–10 Persian words, nothing else. `meta`
 * is the single line under the rule — city, disciplines, and a dash standing
 * in for a founding year the studio has not claimed.
 */
export interface StatementContent {
  text: string;
  meta: string[];
}

/** The index band, and the collection route that repeats it in full. */
export interface IndexContent {
  heading: string;
  /** Accessible name of the list itself. */
  listLabel: string;
  /** Column headings on the register, above the first rule. */
  columns: { figure: string; title: string; discipline: string; role: string };
  /** Follows the rendered count on the collection masthead: «۶ کار». */
  countLabel: string;
  /** Accessible name of the discipline jump row on `/products/`. */
  jumpLabel: string;
  /** The way from the homepage register into the discipline-broken one. */
  allLabel: string;
  allHref: string;
  seo: SeoFields;
}

export interface SelectedContent {
  heading: string;
  /** Accessible name of the list of plates. */
  listLabel: string;
}

export interface DisciplineItem {
  id: string;
  title: string;
  /** At most 25 words. The shortage of words is the design. */
  body: string;
}

export interface DisciplinesContent {
  heading: string;
  items: DisciplineItem[];
}

export interface ContactContent {
  heading: string;
  instagramLabel: string;
  emailLabel: string;
  /** Row labels of the hard-ruled details list on the about page. */
  labels: { city: string; email: string; instagram: string };
}

export interface WorkPageContent {
  detailsHeading: string;
  viewsHeading: string;
  relatedHeading: string;
  backLabel: string;
  breadcrumbHome: string;
  breadcrumbCollection: string;
  breadcrumbLabel: string;
}

export interface ArchivePageContent {
  heading: string;
  lead: string;
  listLabel: string;
  seo: SeoFields;
}

export interface AboutContent {
  heading: string;
  /** Body paragraphs. At most 3, at most 60 words each. */
  body: string[];
  seo: SeoFields;
}

export interface NotFoundContent {
  figure: string;
  heading: string;
  lead: string;
  action: NavItem;
}

/* -------------------------------------------------------------------------- */
/*  Interface strings                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Accessible names, and the few words the interface says on its own behalf
 * rather than the studio's.
 *
 * Modelled for the same reason the copy deck is: a string a component
 * hardcodes is a string no editor and no translator can reach, and there is no
 * exception for text only a screen reader hears.
 */
export interface UiStrings {
  /** First focusable element on every page. */
  skipToContent: string;
  nav: {
    primary: string;
    footer: string;
    /** Trailing half of the wordmark's accessible name, after the studio name. */
    home: string;
    openMenu: string;
    closeMenu: string;
    menuDialog: string;
  };
  lightbox: {
    label: string;
    close: string;
    previous: string;
    next: string;
    /** Joins position and total: «۳ از ۶». */
    counterJoin: string;
    /** Accessible name of any plate that opens the lightbox. Followed by the
     *  plate's own description. */
    open: string;
  };
}
