import { statement } from "@/content/sections";

/**
 * Band 1 — the statement. The whole first screen, and no image on it.
 *
 * This is the opposite of the hero the engine opens with: no photograph, no
 * inset, no eyebrow, no lead paragraph, no pair of buttons, no scroll hint.
 * Six words at 13vw, a rule, and one line of metadata. If anything else ever
 * lands in this band, the band has stopped being the design.
 *
 * The statement is the page's `<h1>`. That is not a stylistic choice — it is
 * the only sentence on the screen and the only honest candidate for the
 * document's heading.
 */
export function StatementBand() {
  return (
    <section
      className="ground-light screen flex flex-col justify-between"
      aria-labelledby="statement-heading"
    >
      <div className="container pt-[var(--section-y-tight)]">
        <h1 id="statement-heading" className="t-statement">
          {statement.text}
        </h1>
      </div>

      <div className="container pb-6">
        <hr className="rule-heavy" />
        {/* One line, in the mono face. The Persian words inside it fall
            through to Vazirmatn by way of the `--font-mono` stack — see the
            note on that token. The last entry is an em dash standing where a
            founding year would be. */}
        <p className="t-mono mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {statement.meta.map((part, i) => (
            <span key={i}>{part}</span>
          ))}
        </p>
      </div>
    </section>
  );
}
