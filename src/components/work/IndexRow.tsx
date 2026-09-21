import Link from "next/link";
import type { Product } from "@/types/content";
import { figure } from "@/lib/digits";
import { workAnchor } from "@/content/categories";

/**
 * One row of the register.
 *
 * The whole row is the link. Not a title that links with three inert columns
 * beside it: a reader scanning a printed index runs a finger along the line,
 * and a 60px-tall target that only responds on its first 200px is the wrong
 * shape for that.
 *
 * `figure` bypasses `toFa()` deliberately — Latin digits, mono face. The
 * reasoning is written out once, in `src/lib/digits.ts`; the call is routed
 * through that named function rather than left as a bare string so the bypass
 * is greppable and does not read as something somebody forgot.
 *
 * LAYOUT: the placement is `grid-template-areas`, defined in components.css.
 * Do not convert it to column numbers — the note there explains which bug
 * that reintroduces.
 */
export function IndexRow({ work }: { work: Product }) {
  return (
    <li id={workAnchor(work.slug)}>
      <Link href={`/products/${work.slug}/`} className="index-row">
        <span className="index-row__num t-figure">{figure(work.figure)}</span>
        <span className="index-row__title">{work.name}</span>
        {/* Below 768 this wrapper is a flex row holding both values on one
            line; at 768 it becomes `display: contents` and the two children
            take their own named columns. One markup, two registers, and
            neither can put a value in the wrong column. */}
        <span className="index-row__meta">
          <span className="index-row__discipline">{work.category}</span>
          <span className="index-row__role">{work.role}</span>
        </span>
      </Link>
    </li>
  );
}
