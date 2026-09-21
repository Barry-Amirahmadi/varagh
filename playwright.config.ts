import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke pass against the **exported static output**, never against `next dev`.
 *
 * That distinction is the whole point: every defect Task 1 found — unprefixed
 * image paths, breadcrumbs escaping the site, 404ing RSC payloads — was
 * invisible in dev and only appeared once the export was served off disk by a
 * host with no router.
 *
 * The suite runs under the real deployment base path for the same reason.
 *
 *   npm run build:pages   # export with the deployed base path
 *   npm run test:smoke
 */
/**
 * Matches the repository name. Overridable so a repo rename is a one-env-var
 * fix — and so CI can pass whatever `actions/configure-pages` reports rather
 * than testing a path the deployment does not use. That value is "/" for a
 * user/org site or a custom domain, which normalises to no base path at all.
 */
const raw = process.env.SMOKE_BASE_PATH ?? "/varagh";
const BASE_PATH = raw === "/" ? "" : raw.replace(/\/+$/, "");
const PORT = 4321;

/**
 * Where the suite points. Defaults to the local static server; set
 * `SMOKE_ORIGIN` to run the same assertions against the deployed site:
 *
 *   SMOKE_ORIGIN=https://barry-amirahmadi.github.io npm run test:smoke
 *
 * Worth doing once after a deploy. A green workflow says the artifact
 * uploaded; it does not say the host serves it correctly, and the two have
 * disagreed before — a 200 on every route with the base path dropped from
 * every asset looks identical to success from inside CI.
 */
const ORIGIN = process.env.SMOKE_ORIGIN ?? `http://localhost:${PORT}`;
const isLocal = ORIGIN.includes("localhost");

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // In CI, annotate the failing lines *and* leave an html report behind — the
  // deploy workflow uploads it on failure, and an annotation alone does not say
  // what the page actually looked like when it failed.
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"]],

  use: {
    // Origin only. A path passed to page.goto() that starts with "/" replaces
    // the whole path of baseURL, so folding the base path in here would
    // silently drop it from every request. The tests spell it out instead.
    baseURL: ORIGIN,
    trace: "retain-on-failure",
  },

  /**
   * The two widths every route is walked at. Both are pinned rather than taken
   * from a device descriptor: `Pixel 7` is 412px wide, and 390 is the number
   * that matters — it is the narrowest mainstream phone still in wide use, and
   * a four-column register that fits 412 can still overflow it. The rest of
   * the descriptor is kept, so mobile is a real touch device with a phone user
   * agent rather than a narrow desktop window.
   */
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
  ],

  // Skipped entirely when pointed at a deployed origin — there is nothing to
  // start, and Playwright would otherwise wait 30s for a server it does not need.
  webServer: isLocal
    ? {
        // The base is passed without its leading slash: Git Bash on Windows
        // rewrites a leading-slash argument into a native path, which would
        // 404 every route.
        command: `node scripts/serve-static.mjs --port ${PORT} --base ${BASE_PATH.slice(1)}`,
        url: `http://localhost:${PORT}${BASE_PATH}/`,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
      }
    : undefined,
});
