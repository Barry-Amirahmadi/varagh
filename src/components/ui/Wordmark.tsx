import Link from "next/link";
import { site } from "@/content/site";
import { ui } from "@/content/ui";
import { cn } from "@/lib/cn";

/**
 * The studio lockup: the Persian name at weight 900, with the Latin
 * transliteration as a tracked mono micro-label beside it. Tracking is applied
 * to the Latin only — the Persian never carries letter-spacing, because it
 * would sever the cursive joins.
 *
 * No rule between the two halves, unlike the engine's. A hairline there makes
 * the lockup read as a badge; the two are simply set next to each other and
 * the weight difference does the separating.
 */
export function Wordmark({
  size = "sm",
  className,
  onClick,
}: {
  size?: "sm" | "lg";
  className?: string;
  /** Present so the copy inside the mobile panel can close it on the way out. */
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex min-h-11 items-baseline gap-2", className)}
      onClick={onClick}
      aria-label={`${site.brand.name} — ${ui.nav.home}`}
    >
      <span
        className="t-display"
        style={{
          fontSize: size === "lg" ? "clamp(2.5rem, 7vw, 4rem)" : "1.75rem",
          lineHeight: 1,
        }}
      >
        {site.brand.name}
      </span>
      <span className="t-mono hidden sm:inline">{site.brand.latin}</span>
    </Link>
  );
}
