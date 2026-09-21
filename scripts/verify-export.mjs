/**
 * Full-site verification sweep against the **served static export**.
 *
 * Walks every route at both review widths and prints the numbers the build
 * report has to quote. It asserts nothing and exits non-zero only on a hard
 * failure — the point is to produce measurements, not a green tick.
 *
 * Everything here is text. There is no screenshot step and there should never
 * be one: `scrollWidth` against `clientWidth` catches an overflow a picture
 * would not, and a picture costs a hundred times more to look at.
 *
 *   npm run build:pages
 *   npm run preview:pages        # in another shell
 *   node scripts/verify-export.mjs
 */
import { chromium } from "@playwright/test";

const PORT = process.env.PORT ?? "4321";
const BASE = process.env.SMOKE_BASE_PATH ?? "/varagh";
const origin = `http://localhost:${PORT}`;

const ROUTES = [
  "/",
  "/products/",
  "/products/kart-o-kaghaz/",
  "/products/neshane-o-sath/",
  "/products/ketab-baz/",
  "/products/form-chapi/",
  "/products/jabe-navari/",
  "/products/shishe-o-lule/",
  "/gallery/",
  "/about/",
  "/definitely-not-a-page/",
];

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 900 },
];

const browser = await chromium.launch();
let hardFailures = 0;

for (const vp of VIEWPORTS) {
  console.log(`\n=== ${vp.name} · ${vp.width}px ===`);
  console.log(
    "route".padEnd(34) +
      "status".padEnd(8) +
      "scrollW".padEnd(9) +
      "clientW".padEnd(9) +
      "overflow".padEnd(10) +
      "imgKB".padEnd(8) +
      "broken  errors",
  );

  for (const route of ROUTES) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    const consoleErrors = [];
    const imageBytes = new Map();

    page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
    page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
    page.on("response", async (r) => {
      const type = r.request().resourceType();
      if (type !== "image") return;
      try {
        const len = Number(r.headers()["content-length"] ?? 0);
        imageBytes.set(r.url(), len || (await r.body()).length);
      } catch {
        /* a response body can be gone by the time this runs; skip it */
      }
    });

    const response = await page.goto(`${origin}${BASE}${route}`, { waitUntil: "networkidle" });

    // Walk the page so everything lazy has been asked for before measuring.
    await page.evaluate(async () => {
      const height = document.body.scrollHeight;
      for (let y = 0; y < height; y += 400) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 40));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForLoadState("networkidle");

    const { scrollWidth, clientWidth, broken } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      broken: [...document.querySelectorAll("img")].filter(
        (i) => i.complete && i.naturalWidth === 0,
      ).length,
    }));

    const status = response?.status() ?? 0;
    const expected = route === "/definitely-not-a-page/" ? 404 : 200;
    const imgKB = Math.round([...imageBytes.values()].reduce((a, b) => a + b, 0) / 1024);
    const overflow = scrollWidth - clientWidth;

    // The probe's own 404 is the assertion, not a defect.
    const errors = consoleErrors.filter(
      (c) => !(expected === 404 && /Failed to load resource.*404/.test(c)),
    );

    const bad = status !== expected || overflow > 1 || broken > 0 || errors.length > 0;
    if (bad) hardFailures += 1;

    console.log(
      route.padEnd(34) +
        String(status).padEnd(8) +
        String(scrollWidth).padEnd(9) +
        String(clientWidth).padEnd(9) +
        String(overflow).padEnd(10) +
        String(imgKB).padEnd(8) +
        String(broken).padEnd(8) +
        (errors.length ? errors.join(" | ") : "0"),
    );

    await page.close();
  }
}

await browser.close();

console.log(
  hardFailures === 0
    ? "\nEvery route: expected status, no horizontal overflow, no broken image, no console error."
    : `\n${hardFailures} route/viewport combinations failed.`,
);
process.exit(hardFailures === 0 ? 0 : 1);
