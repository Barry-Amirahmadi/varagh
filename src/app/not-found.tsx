import Link from "next/link";
import { notFound } from "@/content/sections";

/**
 * The 404.
 *
 * One hard-ruled block on the paper — the only place `.plane-raised` appears
 * on this site, and the clearest demonstration of what that class now means:
 * the same colour as the page with a 2px rule around it, and no shadow.
 *
 * The status code is in Persian digits, unlike the catalogue marks elsewhere.
 * It is a number being read to a reader, not a figure stamped on a plate —
 * the scope of that exception is written out in `src/lib/digits.ts`.
 */
export default function NotFound() {
  return (
    <section className="ground-light">
      <div className="container py-[var(--section-y)]">
        <div className="plane-raised max-w-[var(--measure)] p-[var(--space-6)]">
          <p className="t-display leading-none">{notFound.figure}</p>
          <hr className="rule-heavy my-6" />
          <h1 className="t-h2">{notFound.heading}</h1>
          <p className="t-body mt-4">{notFound.lead}</p>
          <p className="mt-8">
            <Link href={notFound.action.href} className="t-h3 link-hard">
              {notFound.action.label}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
