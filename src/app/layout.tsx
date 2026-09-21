import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Vazirmatn } from "next/font/google";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { organizationSchema } from "@/content/schema";
import { siteRoot } from "@/lib/seo";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

/**
 * Both faces are fetched at build time and served from this origin — next/font
 * self-hosts rather than linking to Google. That matters for a site aimed at
 * Iranian users: no third-party font request to be slow or blocked, and no
 * layout shift while a webfont negotiates.
 *
 * VAZIRMATN carries the entire page: 900 for display, 400 for body. One
 * grotesque at an extreme weight contrast is a legitimate brutalist move and
 * it sidesteps the real constraint, which is that Persian has no good
 * brutalist display face on Google Fonts. It is a variable font, so no
 * `weight` is passed — the full 100–900 range is loaded and `font-weight: 900`
 * resolves against it.
 *
 * Both subsets on Vazirmatn. Do not "optimise" it down to `arabic`: Google
 * splits these faces by unicode range and the arabic subset does not contain
 * `U+0020`. The space character, the em dash and the rest of general
 * punctuation live in the latin subset, and every Persian heading on this site
 * has spaces in it — so the browser downloads that file either way. Dropping
 * the subset only removes its preload, turning an early parallel fetch into a
 * late one discovered after layout.
 *
 * JETBRAINS MONO is loaded with the `latin` subset alone, which is the whole
 * point of choosing it: work numbers, archive codes, years and Latin
 * micro-labels are the only things set in it, and a Latin-only face carries no
 * Persian glyph risk at all. Where a mono line does contain Persian — the
 * metadata line under the statement — the `--font-mono` stack falls through to
 * Vazirmatn before the system monospace, so those glyphs land on the face the
 * rest of the site uses rather than on Consolas.
 */
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

/**
 * Site-wide defaults only. Every route composes its own title, description,
 * canonical and social card through `pageMetadata` — see `src/lib/seo.ts` for
 * why that is centralised rather than written per page.
 *
 * `metadataBase` carries the base path, unlike the bare origin the deploy
 * workflow supplies, so any relative URL Next resolves for itself lands inside
 * the deployed site rather than at the root of the host.
 *
 * `robots: { index: false }` is the one that actually does the work. This is a
 * presented template, not a business, and it should not be indexed. There is
 * also a `robots.ts` disallowing everything — but on GitHub Pages a
 * `robots.txt` under a project subpath is never fetched by a crawler, which
 * only ever reads the one at the origin root. The meta tag travels with the
 * page and is therefore the mechanism; the file is correctness for a future
 * root deployment. Set both, rely on the meta.
 */
export const metadata: Metadata = {
  metadataBase: new URL(`${siteRoot}/`),
  title: {
    default: site.seo.title,
    template: site.seo.titleTemplate,
  },
  description: site.seo.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f2f2f0",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* No `data-js` bootstrap script. The engine stamped one before
            hydration so that scroll reveals could fail open if the bundle
            never ran; there are no reveals here, so nothing on this site is
            hidden until JavaScript says otherwise and the script has nothing
            to guard. Every page is fully readable with the bundle blocked. */}
        <a href="#main" className="skip-link">
          {ui.skipToContent}
        </a>

        <Header />
        <main id="main">{children}</main>
        <Footer />

        {/* Studio-level structured data, on every page because the
            organisation is a property of the site rather than of any route. */}
        <JsonLd data={organizationSchema()} />
      </body>
    </html>
  );
}
