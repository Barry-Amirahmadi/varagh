const FA = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/**
 * Renders a number in Persian digits. Latin digits inside an otherwise Persian
 * interface read as a translation artefact, so any number the reader sees goes
 * through here — a count, a position, a status code.
 */
export function toFa(value: number | string): string {
  return String(value).replace(/\d/g, (d) => FA[Number(d)]);
}

/* ============================================================================
   THE ONE EXCEPTION, AND IT IS DELIBERATE.

   Work numbers (`01`–`06`), archive codes (`A01`–`A06`) and the year in a
   work's spec table are rendered in **Latin digits, in the mono face**, by
   NOT passing through `toFa()`.

   This is art direction, not an oversight. Those three are catalogue marks —
   the figure a printer stamps on a plate, the code written on the back of a
   contact sheet — rather than quantities a reader adds up. Set in Latin in a
   monospaced face they read as a register; set as `۰۱` in the body face the
   same mark reads as the number one, and the register stops being one.

   The scope is exactly those three uses and nothing else. Counts, positions,
   the lightbox counter, the 404 status and the copyright year all still go
   through `toFa()`.

   If a review flags "Latin digits in a Persian interface" — this is the
   answer. The CSS side of the same decision is `.t-figure` in
   `src/app/globals.css`, which carries the matching comment; do not "fix"
   one of them without the other.
   ========================================================================= */

/**
 * A catalogue mark, passed through untouched.
 *
 * Exists so that the bypass is a named, greppable call rather than the absence
 * of one: `figure(work.figure)` at a call site says "this is deliberately not
 * localised", where a bare string says nothing at all and looks like something
 * somebody forgot.
 */
export function figure(mark: string): string {
  return mark;
}
