import { test, expect, type Page } from "@playwright/test";

/**
 * Smoke pass — deliberately small.
 *
 * Every assertion here corresponds to a defect that actually happened, which
 * is the only reason each one is worth a test. The selectors and counts are
 * this site's; the *classes* of assertion are inherited from the engine and
 * none of them were dropped to make the suite green. Where the architecture
 * moved something — the lightbox is no longer on the homepage, the conversion
 * path is a `mailto:` rather than a chat link — the check moved with it.
 *
 * Three checks are new here, and all three exist because this build was asked
 * to prove them:
 *   · every control that opens the lightbox computes `cursor: pointer`
 *     (the engine's compute `default`, a known open defect carried in its
 *     handoff — reintroducing it silently is the exact failure to prevent);
 *   · the register stays legible at 390px, with no cell below 14px;
 *   · the Persian glyph set renders from Vazirmatn rather than a fallback.
 */

/**
 * The deployment base path. Spelled out rather than folded into `baseURL`:
 * these tests exist largely to catch base-path regressions, so it should be
 * visible at every call site.
 */
const rawBase = process.env.SMOKE_BASE_PATH ?? "/varagh";
const BASE = rawBase === "/" ? "" : rawBase.replace(/\/+$/, "");

/** Every route the export produces, in the order a reader meets them. */
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
];

/** Persian digits back to a number, so a rendered count can be compared. */
function fromFa(text: string): number {
  return Number(text.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/\D/g, ""));
}

/**
 * Every control on the page must have a non-empty accessible name.
 *
 * This exists because the interface strings moved out of the components and
 * into `src/content/ui.ts`. A mistyped path there does not throw and does not
 * render visibly wrong — the button still draws, still works, and simply stops
 * announcing itself, or announces the word "undefined". That is invisible to
 * every other check in this file and to anyone looking at the screen.
 */
async function namelessControls(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll("button, a[href]")]
      .filter((el) => (el as HTMLElement).checkVisibility({ visibilityProperty: true }))
      .filter((el) => el.closest('[aria-hidden="true"]') === null)
      .filter((el) => {
        const label = el.getAttribute("aria-label");
        const name = label === null ? (el.textContent ?? "") : label;
        return name.trim() === "" || name.includes("undefined");
      })
      .map((el) => `${el.tagName.toLowerCase()}.${el.className || "(no class)"}`),
  );
}

/** Collects console errors and failed responses for the lifetime of a page. */
function watch(page: Page) {
  const consoleErrors: string[] = [];
  const failed: string[] = [];

  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });

  return { consoleErrors, failed };
}

/** Scrolls the whole page so anything lazy has been asked for. */
async function walkPage(page: Page) {
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += 400) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
}

/** Images that finished loading with no pixels — the base-path failure mode. */
async function brokenImages(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0).length,
  );
}

/**
 * The two numbers §12.8 asks for. `documentElement.scrollWidth` against
 * `clientWidth` rather than `window.innerWidth`: `innerWidth` includes the
 * scrollbar gutter, so comparing against it hides an overflow exactly as wide
 * as a scrollbar — which is most of them.
 */
async function scrollMetrics(page: Page) {
  return page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
}

test("homepage renders the statement band, is RTL, and loads every asset", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  await page.goto(`${BASE}/`);

  await expect(page.locator("h1")).toHaveText("کار ما روی کاغذ تمام می‌شود");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");

  // Native RTL, not just an attribute — the layout must resolve right-to-left.
  const direction = await page.evaluate(() => getComputedStyle(document.body).direction);
  expect(direction).toBe("rtl");

  // The five bands of the architecture, in order, each with its own heading.
  // Asserted by their labelled sections rather than by looking at the page:
  // if a band is dropped or duplicated during a refactor, this is what says so.
  const bands = await page
    .locator("main section[aria-labelledby]")
    .evaluateAll((els) => els.map((el) => el.getAttribute("aria-labelledby")));
  expect(bands, "the five homepage bands, in order").toEqual([
    "statement-heading",
    "index-heading",
    "selected-heading",
    "disciplines-heading",
    "contact-heading",
  ]);

  // No band may carry a hero image, and the homepage must not grow one: the
  // statement band is type on paper and nothing else.
  await expect(page.locator('section[aria-labelledby="statement-heading"] img')).toHaveCount(0);

  await expect(page.locator(".index-row")).toHaveCount(6);
  await expect(page.locator(".selected-item")).toHaveCount(3);
  await expect(page.locator(".discipline-block")).toHaveCount(3);
  await expect(page.locator("#contact")).toHaveCount(1);

  await walkPage(page);

  // Regression: next/image does not apply basePath when images are unoptimized,
  // which silently broke every image on the project site.
  expect(await brokenImages(page), "images failing to load").toBe(0);

  const { scrollWidth, clientWidth } = await scrollMetrics(page);
  expect(scrollWidth, `horizontal overflow: ${scrollWidth} > ${clientWidth}`).toBeLessThanOrEqual(
    clientWidth + 1,
  );

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

/**
 * §8's deliberate departure, asserted so it stays deliberate.
 *
 * Catalogue marks, archive codes and years are Latin digits in the mono face —
 * they bypass `toFa()` through the named `figure()` in `src/lib/digits.ts`.
 * Everything else on the site is Persian digits. Someone "fixing" the
 * inconsistency by routing marks through `toFa()` would be undoing a decision,
 * not a bug, so the decision is pinned here.
 */
test("catalogue marks are Latin digits in the mono face, isolated from the RTL run", async ({
  page,
}) => {
  await page.goto(`${BASE}/`);

  const first = page.locator(".index-row__num").first();
  await expect(first).toHaveText("01");

  const style = await first.evaluate((el) => {
    const cs = getComputedStyle(el);
    return {
      direction: cs.direction,
      unicodeBidi: cs.unicodeBidi,
      family: cs.fontFamily,
      variant: cs.fontVariantNumeric,
    };
  });

  // An LTR number inside an RTL line needs its own isolate, or the leading
  // zero migrates to the wrong end of the run next to punctuation.
  expect(style.direction, "figures run LTR").toBe("ltr");
  expect(style.unicodeBidi, "figures are bidi-isolated").toContain("isolate");
  expect(style.family.toLowerCase(), "figures are set in the mono face").toContain("jetbrains");
  expect(style.variant, "figures are tabular").toContain("tabular-nums");

  // And the rest of the page is still Persian-numbered.
  const count = await page.locator(".index-list").locator("li").count();
  expect(count).toBe(6);
});

/**
 * §8's glyph check, done with numbers rather than with eyes.
 *
 * Vazirmatn carries the entire page. If the arabic subset fails to load, or a
 * future edit narrows `subsets`, the page does not error and does not look
 * obviously broken in a thumbnail — it quietly renders Persian in whatever the
 * system supplies. The control family below does not exist, so it resolves to
 * the generic fallback; a glyph whose advance matches the control exactly is a
 * glyph Vazirmatn did not draw.
 */
test("the Persian glyph set renders from Vazirmatn, not a fallback", async ({ page }) => {
  await page.goto(`${BASE}/`);

  const result = await page.evaluate(async () => {
    await document.fonts.ready;

    const sample = "گچپژ ورق ۱۲۳۴";

    const ctx = document.createElement("canvas").getContext("2d")!;
    const measure = (family: string, text: string) => {
      ctx.font = `400 64px ${family}`;
      return ctx.measureText(text).width;
    };

    /**
     * Both stacks end at the browser's default font rather than at a generic
     * family, and that is what makes the comparison mean something: a glyph
     * Vazirmatn does not contain falls through to exactly the same default the
     * control resolves to, so an identical advance is a missing glyph. Ending
     * either stack in `sans-serif` would compare two different fallbacks and
     * pass on tofu.
     */
    const target = '"Vazirmatn"';
    const control = '"VaraghDefinitelyNoSuchFace"';

    return {
      bodyFamily: getComputedStyle(document.body).fontFamily,
      scoped: getComputedStyle(document.documentElement)
        .getPropertyValue("--font-vazir")
        .trim(),
      loadedFamilies: [...document.fonts]
        .filter((f) => f.status === "loaded")
        .map((f) => f.family),
      whole: { target: measure(target, sample), control: measure(control, sample) },
      perGlyph: [...sample.replace(/\s+/g, "")].map((ch) => ({
        ch,
        codePoint: ch.codePointAt(0)!.toString(16).toUpperCase(),
        target: measure(target, ch),
        control: measure(control, ch),
      })),
    };
  });

  // `--font-vazir` and the resolved body stack are both next/font's doing;
  // quoting differs between them, so normalise before comparing.
  const strip = (v: string) => v.replace(/['"]/g, "");
  expect(result.scoped, "next/font exposed a family on --font-vazir").not.toBe("");
  expect(strip(result.bodyFamily), "body resolves through --font-vazir").toContain(
    strip(result.scoped),
  );

  // Two faces, because two subsets are in use. If `subsets` is ever narrowed
  // to `["arabic"]` this drops to one — and the space character, the em dash
  // and the rest of general punctuation live in the latin file, so every
  // Persian heading on the site would lose its word gaps.
  const vazirFaces = result.loadedFamilies.filter((f) => /^vazirmatn$/i.test(f));
  expect(
    vazirFaces.length,
    `both Vazirmatn subsets are loaded — loaded: ${result.loadedFamilies.join(", ")}`,
  ).toBeGreaterThanOrEqual(2);

  expect(
    result.whole.target,
    `the sample is drawn by Vazirmatn, not the default font (${result.whole.target} vs ${result.whole.control})`,
  ).not.toBeCloseTo(result.whole.control, 1);

  for (const g of result.perGlyph) {
    expect(g.target, `U+${g.codePoint} «${g.ch}» has zero advance`).toBeGreaterThan(0);
    expect(
      g.target,
      `U+${g.codePoint} «${g.ch}» is missing from Vazirmatn — it rendered at the default font's advance (${g.target} = ${g.control})`,
    ).not.toBeCloseTo(g.control, 1);
  }
});

test("a work route survives a hard load under the base path", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  // Hard load, not a client-side navigation: this is the case that 404'd on the
  // dynamic route's RSC payload, and the case a static host has to get right.
  const response = await page.goto(`${BASE}/products/kart-o-kaghaz/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("کارت و کاغذ");

  // Regression: a raw <a href="/"> skips basePath and leaves the site entirely.
  const homeLink = page.locator('nav[aria-label="مسیر صفحه"] a').first();
  await expect(homeLink).toHaveAttribute("href", `${BASE}/`);

  // The spec table is the page's factual content and every row must carry a
  // value — a `details` key renamed in the content file leaves a labelled row
  // with nothing after it, which reads as a missing fact rather than as a bug.
  const specValues = await page
    .locator(".spec-row dd")
    .evaluateAll((els) => els.map((el) => (el.textContent ?? "").trim()));
  expect(specValues.length, "spec rows").toBeGreaterThan(0);
  expect(specValues.filter((v) => v === ""), "spec rows with no value").toEqual([]);

  // The site's only conversion path (§42, narrowed to email and Instagram).
  // A `tel:` or a chat link here would be a claim about a channel that does
  // not exist, and the engine's WhatsApp link is exactly what was removed.
  const mail = page.locator('a[href^="mailto:"]').first();
  await expect(mail).toHaveAttribute("href", /^mailto:[^@\s]+@[^@\s]+$/);
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(0);
  await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);

  // Related works must lead somewhere else — a page linking to itself here is
  // the failure mode of every naive "related" implementation.
  const relatedLinks = await page
    .locator('section[aria-labelledby="related-heading"] a[href]')
    .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
  expect(relatedLinks.length).toBeGreaterThan(0);
  expect(relatedLinks.some((href) => href.includes("/products/kart-o-kaghaz"))).toBe(false);

  await walkPage(page);
  expect(await brokenImages(page), "images failing to load").toBe(0);

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("the register lists every work and its jump anchors resolve", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  const response = await page.goto(`${BASE}/products/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("فهرست کارها");

  // Regression: nav hrefs written as bare hashes pointed at homepage sections
  // and resolved to nothing once the header rendered on a second page.
  await expect(
    page.locator('header nav[aria-label="پیمایش اصلی"] a[aria-current="page"]'),
  ).toHaveText("فهرست کارها");

  const rows = page.locator(".index-row");
  const count = await rows.count();
  expect(count).toBe(6);

  // The break is only structure if its targets exist. A jump link pointing at
  // a removed discipline fails silently — the page just does not move.
  const anchors = await page
    .locator(".register-jump a")
    .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
  expect(anchors.length, "discipline jump links").toBe(3);
  for (const anchor of anchors) {
    await expect(page.locator(anchor), `jump anchor ${anchor}`).toHaveCount(1);
  }

  // Every work appears exactly once across the breaks — a grouping that drops
  // an item, or lists it under two disciplines, is invisible on the page.
  const hrefs = await rows.evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
  expect(new Set(hrefs).size, "each work listed once").toBe(count);

  // The printed count is derived, so it must never disagree with what is shown.
  const printed = await page.locator(".container p.t-mono").first().innerText();
  expect(fromFa(printed)).toBe(count);

  await walkPage(page);
  expect(await brokenImages(page), "images failing to load").toBe(0);

  const { scrollWidth, clientWidth } = await scrollMetrics(page);
  expect(scrollWidth, `horizontal overflow: ${scrollWidth} > ${clientWidth}`).toBeLessThanOrEqual(
    clientWidth + 1,
  );

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

/**
 * §12.9. The register is a four-column table on a 390px screen, and the
 * cheapest way to make it fit is to shrink the type — which is how a table
 * becomes unreadable while still "working". Nothing in a row may go below
 * 14px, at any viewport.
 */
test("the register stays legible — no cell below 14px", async ({ page }) => {
  for (const route of ["/", "/products/"]) {
    await page.goto(`${BASE}${route}`);

    const sizes = await page.evaluate(() =>
      [
        ...document.querySelectorAll(
          ".index-row__num, .index-row__title, .index-row__discipline, .index-row__role",
        ),
      ].map((el) => ({
        cls: el.className,
        px: parseFloat(getComputedStyle(el).fontSize),
      })),
    );

    expect(sizes.length, `${route} has register cells`).toBeGreaterThan(0);
    const small = sizes.filter((s) => s.px < 14);
    expect(small, `${route} cells below 14px: ${JSON.stringify(small)}`).toEqual([]);
  }
});

test("the archive composes every plate and opens the right one", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  const response = await page.goto(`${BASE}/gallery/`);
  expect(response?.status()).toBe(200);

  await expect(page.locator("h1")).toHaveText("آرشیو");
  await expect(
    page.locator('header nav[aria-label="پیمایش اصلی"] a[aria-current="page"]'),
  ).toHaveText("آرشیو");

  // Nothing else in this suite sees the header, footer and tile controls at
  // rest, and they are where most of `ui.ts` is consumed.
  expect(await namelessControls(page), "controls with no accessible name").toEqual([]);

  const tiles = page.locator(".archive-tile");
  await expect(tiles).toHaveCount(6);

  // §10. Every control that opens the lightbox is a real <button> with an
  // accessible name — and it must *look* interactive. The engine's tiles
  // compute `cursor: default`, a defect recorded in its handoff and never
  // fixed; this is the check that stops it being inherited.
  const cursors = await tiles.evaluateAll((els) =>
    els.map((el) => ({ tag: el.tagName.toLowerCase(), cursor: getComputedStyle(el).cursor })),
  );
  expect(
    cursors.filter((c) => c.tag !== "button"),
    "archive tiles must be real buttons",
  ).toEqual([]);
  expect(
    cursors.filter((c) => c.cursor !== "pointer"),
    `archive tiles must compute cursor: pointer — got ${JSON.stringify(cursors)}`,
  ).toEqual([]);

  // The plates are laid out in a grid, so each tile has a position within its
  // row *and* a position in the archive. The lightbox needs the second one —
  // passing the row-local index opens the wrong picture, which looks like a
  // working lightbox rather than like a bug.
  const third = tiles.nth(2);
  await third.scrollIntoViewIfNeeded();
  await third.click();

  const dialog = page.locator("dialog.lightbox");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty("open", true);
  await expect(dialog).toHaveAttribute("aria-label", /\S/);
  await expect(dialog.locator(".t-figure")).toHaveText("A03");

  // The lightbox's own controls exist only while it is open, so they are absent
  // from the exported HTML and can only be checked here.
  expect(await namelessControls(page), "lightbox controls with no name").toEqual([]);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveJSProperty("open", false);

  await walkPage(page);
  expect(await brokenImages(page), "images failing to load").toBe(0);

  const { scrollWidth, clientWidth } = await scrollMetrics(page);
  expect(scrollWidth, `horizontal overflow: ${scrollWidth} > ${clientWidth}`).toBeLessThanOrEqual(
    clientWidth + 1,
  );

  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

/** The same §10 guarantee on the other surface that opens a lightbox. */
test("a work page's plates are buttons that look interactive", async ({ page }) => {
  await page.goto(`${BASE}/products/ketab-baz/`);

  const plates = page.locator(".work-plate");
  await expect(plates).toHaveCount(3);

  const state = await plates.evaluateAll((els) =>
    els.map((el) => ({
      tag: el.tagName.toLowerCase(),
      cursor: getComputedStyle(el).cursor,
      name: (el.getAttribute("aria-label") ?? el.textContent ?? "").trim(),
    })),
  );

  expect(state.filter((s) => s.tag !== "button"), "plates must be real buttons").toEqual([]);
  expect(
    state.filter((s) => s.cursor !== "pointer"),
    `plates must compute cursor: pointer — got ${JSON.stringify(state)}`,
  ).toEqual([]);
  expect(state.filter((s) => s.name === ""), "plates must have an accessible name").toEqual([]);

  await plates.first().click();
  const dialog = page.locator("dialog.lightbox");
  await expect(dialog).toHaveJSProperty("open", true);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveJSProperty("open", false);
});

test("the about page owns the contact anchor and both inquiry paths", async ({ page }) => {
  const { consoleErrors, failed } = watch(page);

  const response = await page.goto(`${BASE}/about/`);
  expect(response?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText("استودیو");

  // Exactly one #contact. The footer renders on this page too, and two of them
  // is a silent duplicate-id defect that makes the nav anchor land on
  // whichever comes first.
  await expect(page.locator("#contact")).toHaveCount(1);

  // Both inquiry paths of §42, and neither may be a dead "#".
  const mail = page.locator('#contact a[href^="mailto:"]');
  await expect(mail).toHaveCount(1);
  await expect(mail).toHaveAttribute("href", /^mailto:[^@\s]+@[^@\s]+$/);

  const instagram = page.locator('#contact a[href*="instagram.com"]');
  await expect(instagram).toHaveCount(1);
  await expect(instagram).toHaveAttribute("rel", /noopener/);

  // No link anywhere on the page may be a bare "#": it looks like a link,
  // focuses like a link, and jumps the reader to the top of the page.
  const deadLinks = await page
    .locator('a[href="#"]')
    .evaluateAll((els) => els.map((el) => (el.textContent ?? "").trim()));
  expect(deadLinks, "links pointing at #").toEqual([]);

  expect(await brokenImages(page), "images failing to load").toBe(0);
  expect(failed, "failed requests").toEqual([]);
  expect(consoleErrors, "console errors").toEqual([]);
});

test("every route carries its own metadata, under the deployed base path", async ({ page }) => {
  const routes = ["/", "/products/", "/gallery/", "/about/", "/products/kart-o-kaghaz/", "/products/shishe-o-lule/"];

  const seen = new Map<string, string[]>();

  for (const route of routes) {
    await page.goto(`${BASE}${route}`);

    const meta = await page.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
      ogTitle: document.querySelector('meta[property="og:title"]')?.getAttribute("content"),
      ogUrl: document.querySelector('meta[property="og:url"]')?.getAttribute("content"),
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute("content"),
      robots: document.querySelector('meta[name="robots"]')?.getAttribute("content"),
    }));

    expect(meta.title, `${route} title`).toBeTruthy();
    expect(meta.description, `${route} description`).toBeTruthy();

    // og:title was set once in the root layout and inherited by every route, so
    // a shared link to any page previewed as the homepage.
    expect(meta.ogTitle, `${route} og:title matches the page title`).toBe(meta.title);

    // §13. The meta tag is the mechanism that actually keeps this out of an
    // index — a robots.txt under a project subpath is never fetched.
    expect(meta.robots, `${route} is noindex`).toContain("noindex");

    // The canonical has to carry the base path. `configure-pages` reports the
    // origin and the base path as two separate values, and a canonical built
    // from the origin alone points at someone else's site.
    for (const [name, value] of [
      ["canonical", meta.canonical],
      ["og:url", meta.ogUrl],
      ["og:image", meta.ogImage],
    ] as const) {
      expect(value, `${route} ${name} is absolute`).toMatch(/^https?:\/\//);
      if (BASE) expect(value, `${route} ${name} carries the base path`).toContain(`${BASE}/`);
    }

    expect(new URL(meta.canonical!).pathname, `${route} canonical points at itself`).toBe(
      `${BASE}${route}`,
    );

    for (const [field, value] of Object.entries(meta)) {
      if (field === "ogImage" || field === "robots") continue; // shared on purpose
      const list = seen.get(field) ?? [];
      expect(list, `${route} ${field} is unique across routes`).not.toContain(value);
      list.push(value as string);
      seen.set(field, list);
    }
  }
});

test("the sitemap and robots.txt are exported and absolute", async ({ page }) => {
  const sitemap = await page.request.get(`${BASE}/sitemap.xml`);
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();

  // Every exported route must be listed, and every entry absolute — a relative
  // <loc> is invalid in a sitemap and is dropped silently.
  for (const route of ROUTES) {
    expect(xml, `sitemap lists ${route}`).toContain(`${BASE}${route}</loc>`);
  }
  expect(xml.match(/<loc>/g)?.length, "sitemap entry count").toBe(ROUTES.length);
  expect(xml, "no relative loc").not.toMatch(/<loc>\//);
  expect(xml, "no 404 in the sitemap").not.toContain("/404");

  const robots = await page.request.get(`${BASE}/robots.txt`);
  expect(robots.status()).toBe(200);
  const text = await robots.text();
  expect(text, "robots points at the sitemap").toContain(`${BASE}/sitemap.xml`);
  expect(text, "robots disallows everything").toMatch(/Disallow:\s*\/\s*$/m);
});

test("structured data parses and claims nothing invented", async ({ page }) => {
  await page.goto(`${BASE}/products/kart-o-kaghaz/`);

  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((el) => el.textContent ?? ""));
  expect(blocks.length, "CreativeWork + Organization").toBe(2);

  const parsed = blocks.map((b) => JSON.parse(b) as Record<string, unknown>);

  // The type itself is the assertion. This studio sells nothing, and a
  // `Product` node on a portfolio page is a lie told to a search engine.
  const work = parsed.find((p) => p["@type"] === "CreativeWork");
  expect(work, "the work is a CreativeWork, not a Product").toBeTruthy();
  expect(parsed.some((p) => p["@type"] === "Product"), "nothing is a Product").toBe(false);

  const organization = parsed.find((p) => p["@type"] === "Organization")!;

  expect(work!.name).toBe("کارت و کاغذ");
  expect(String(work!.url)).toContain(`${BASE}/products/kart-o-kaghaz/`);

  // The point of the schema file: it must stay a mapping of data that exists.
  // These are what a generator would invent to earn a rich result, and this
  // site has no commerce, no reviews, no awards and no dates it can stand by.
  for (const field of ["offers", "aggregateRating", "review", "sku", "gtin", "award", "brand"]) {
    expect(work![field], `CreativeWork must not assert ${field}`).toBeUndefined();
  }
  // The social handles are `.example` placeholders; sameAs would claim the
  // studio owns accounts that do not resolve.
  expect(organization.sameAs, "Organization must not assert sameAs").toBeUndefined();
  expect(organization.foundingDate, "Organization must not assert a founding date").toBeUndefined();
  expect(organization.telephone, "Organization must not assert a phone number").toBeUndefined();
});

/**
 * Found in the engine's full-site pass, which is the only pass that ever left
 * the mobile menu by a route rather than by the close button.
 *
 * Controls in the panel carried `onClick={onClose}` individually, and the ones
 * that forgot navigated underneath a panel that stayed over the whole screen
 * with `body { overflow: hidden }` still set — stranding a phone visitor.
 *
 * Asserted for every control rather than for the ones that were broken: the
 * defect is one control forgetting, so the check has to be the whole set.
 */
test("every control that leaves the mobile menu closes it", async ({ page }, testInfo) => {
  test.skip(
    (testInfo.project.use.viewport?.width ?? 0) >= 768,
    "the mobile panel does not exist at desktop widths",
  );

  await page.goto(`${BASE}/`);

  const panel = page.locator(".menu-panel");
  const internal = page.locator(`.menu-panel a[href^="${BASE}/"]`);

  await page.locator(".menu-toggle").first().click();
  await expect(panel).toHaveAttribute("data-open", "true");
  const count = await internal.count();
  expect(count, "the panel's own links").toBeGreaterThan(3);

  for (let i = 0; i < count; i += 1) {
    await page.goto(`${BASE}/`);
    await page.locator(".menu-toggle").first().click();
    await expect(panel).toHaveAttribute("data-open", "true");

    const href = await internal.nth(i).getAttribute("href");
    await internal.nth(i).click();

    await expect(panel, `${href} left the panel open`).toHaveAttribute("data-open", "false");
    // The panel locks page scrolling while it is open; a panel that closes
    // without releasing that lock leaves a page nobody can scroll.
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow), {
        message: `${href} left the page scroll-locked`,
      })
      .not.toBe("hidden");
  }
});

test("an unknown path serves the styled 404", async ({ page }) => {
  const response = await page.goto(`${BASE}/definitely-not-a-page/`);

  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("این نشانی وجود ندارد");

  // It has to be the site's 404, not the host's: the header and footer are
  // what make it possible to leave, and the way back must carry the base path.
  await expect(page.locator("header .site-header, header")).toHaveCount(1);
  await expect(page.locator(`main a[href="${BASE}/"]`).first()).toBeVisible();
});

/**
 * A form with nowhere to post is worse than no form: on a static host the
 * browser falls back to a GET at the current URL, so the page reloads, the
 * scroll position is lost, and whatever the visitor typed — an email address,
 * here — is written into the URL and therefore into history and any outgoing
 * referrer. The engine shipped exactly that in its footer for four phases.
 * §42 permits a form only when it posts to a real third-party backend, so this
 * asserts the site has no form that resolves to neither.
 */
test("no route carries a form that submits nowhere", async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(`${BASE}${route}`);

    const dead = await page.evaluate(() =>
      [...document.querySelectorAll("form")]
        .filter((f) => {
          const action = f.getAttribute("action");
          return action === null || action === "" || action === "#";
        })
        .map((f) => f.className || "(no class)"),
    );

    expect(dead, `${route} has a form posting nowhere`).toEqual([]);
  }
});

/**
 * §12.8, as numbers rather than as a boolean.
 *
 * Walks every route at whatever viewport the project runs at and records both
 * measurements, so the report can quote them instead of asserting "no
 * overflow" and hoping. The annotation is attached whether or not the
 * assertion passes, which is the whole point — a pass with `scrollWidth`
 * creeping toward the limit is information.
 */
test("no route scrolls horizontally", async ({ page }, testInfo) => {
  const width = testInfo.project.use.viewport?.width ?? 0;
  const rows: string[] = [];

  // The last entry is the 404 probe. Its own document response is a 404 on
  // purpose — that is the assertion in the 404 test — so it is excluded from
  // the failed-request check while everything the page then loads is not.
  const probe = "/definitely-not-a-page/";

  for (const route of [...ROUTES, probe]) {
    const { consoleErrors, failed } = watch(page);
    await page.goto(`${BASE}${route}`);
    await walkPage(page);

    const { scrollWidth, clientWidth } = await scrollMetrics(page);
    rows.push(`${route} → scrollWidth ${scrollWidth} / clientWidth ${clientWidth}`);

    expect(
      scrollWidth,
      `${route} at ${width}px overflows: scrollWidth ${scrollWidth} > clientWidth ${clientWidth}`,
    ).toBeLessThanOrEqual(clientWidth + 1);

    // Chromium logs the probe's deliberate 404 twice — once as a response and
    // once as a generic console error. Both are filtered for that one route;
    // anything the 404 page then loads is still held to the same standard.
    const expected404 = (line: string) =>
      route === probe &&
      (line.endsWith(`${BASE}${probe}`) || /Failed to load resource.*404/.test(line));

    expect(failed.filter((f) => !expected404(f)), `${route} failed requests`).toEqual([]);
    expect(
      consoleErrors.filter((c) => !expected404(c)),
      `${route} console errors`,
    ).toEqual([]);
    page.removeAllListeners();
  }

  await testInfo.attach(`scroll-metrics-${width}px`, {
    body: rows.join("\n"),
    contentType: "text/plain",
  });
});
