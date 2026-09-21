# ورق / VARAGH

A Persian RTL-first site for a fictional graphic-design studio — brutalist,
typographic, print-led. Static export, deployed to GitHub Pages.

Live: <https://barry-amirahmadi.github.io/varagh/>

It shares an engine with `parnian-cosmetics` — the Next.js static-export setup,
the content layer, the RTL rules, the accessibility guarantees, the build and
deploy pipeline — and shares none of its design. See the note at the top of
`docs/MASTER-HANDOFF.md` for what was re-decided.

## Routes

| Path | What it is |
|---|---|
| `/` | statement · register · three plates · disciplines · contact |
| `/products/` | the full register, broken by discipline |
| `/products/[slug]/` | one work: masthead, spec table, plates, two more rows |
| `/gallery/` | the archive — six process plates, `A01`–`A06` |
| `/about/` | the studio, one column, contact details at the foot |
| `/404` | — |

Route *paths* are deliberately identical to the engine's. Keeping every repo
structurally the same is worth more than a prettier URL, and a Persian-speaking
visitor never reads one.

## Running it

```
npm install
npm run dev            # localhost:3210 — do not verify anything here
```

**Verify against the export, never against `next dev`.** Every defect this
project family has shipped was invisible in dev and appeared only once the
export was served off disk by a host with no router.

```
export MSYS_NO_PATHCONV=1      # Git Bash mangles leading-slash arguments
npm run build:pages            # export under the deployed base path
npm run preview:pages          # serve out/ the way GitHub Pages does
```

| Script | |
|---|---|
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint; `jsx-a11y` findings are errors |
| `npm run build` | export at the site root |
| `npm run build:pages` | export at `/varagh` |
| `npm run preview:pages` | static server on `:4321` |
| `npm run test:smoke` | Playwright against `out/`, two viewports |
| `npm run media` | regenerate the placeholder plates |
| `npm run og` | regenerate the share card |

## Constraints that are not negotiable

- **Three runtime dependencies**: `next`, `react`, `react-dom`.
- `output: 'export'` — no API routes, Server Actions, Middleware or ISR.
- No commerce, no price, no cart, **no form**. The conversion path is a
  `mailto:` and Instagram.
- No claim about the studio: no client names, no awards, no press, no founding
  year, no headcount, no statistics.
- No parentheses in Persian text.
- Persian digits everywhere except catalogue marks — work numbers, archive
  codes and the year in a spec table, which are Latin in the mono face on
  purpose. `src/lib/digits.ts` has the full scope.

## Images

All 24 plates are 1:1 at 1024×1024; every crop on the site is CSS. The files
under `public/media/` are generated placeholders at the exact paths the real
photographs will use, so replacing them is a file swap and nothing else.
Budget: 300KB per file, 1.5MB per route.
