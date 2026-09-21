import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * robots.txt — disallow everything.
 *
 * This is a presented template rather than a business, and it should not be
 * indexed. The matching `robots: { index: false, follow: false }` is set in
 * the root layout's metadata.
 *
 * **Which of the two actually works, and it is worth knowing before reading
 * anything into this file:** a crawler only ever fetches `/robots.txt` from
 * the *origin root*. On a GitHub Pages project site the deployment owns
 * `user.github.io/varagh/`, not `user.github.io/`, so the file generated here
 * is served at `/varagh/robots.txt` and no crawler will look for it there. The
 * rules that apply come from whatever sits at the origin root, which this
 * repository does not control. The meta tag travels with the page and is the
 * mechanism that holds.
 *
 * It is generated anyway because it is correct for the two deployments where
 * it would be read — a custom domain, and a user or organisation site — and
 * nothing here needs changing if the site ever moves to one.
 */
/** Required under `output: "export"` — see the note in `sitemap.ts`. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
