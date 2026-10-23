import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { MouseEventHandler, ReactNode } from "react";
import { klass } from "@/lib/klass";

type Variant = "primar" | "sekundar" | "ljus";
type Storlek = "md" | "lg";

/**
 * Klasserna för sidans knappar. Används av länkar (KnappLank) och kan även
 * ges till riktiga <button>-element.
 *
 * primar   – nästan svart, för huvudhandlingen ("Kom igång"). Var beige-brun
 *            till 2026-10-23, men smälte då in i sidans beige.
 * sekundar – ljus med kant, för "Se hur det fungerar"
 * ljus     – för mörka ytor
 */
export function knappKlasser(variant: Variant = "primar", storlek: Storlek = "md", extra?: string) {
  return klass(
    "group inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold",
    "transition-[background-color,box-shadow,transform,color] duration-200 ease-out active:scale-[0.98]",
    storlek === "lg" ? "h-[3.25rem] px-7 text-[1rem]" : "h-11 px-5 text-[0.94rem]",
    variant === "primar" && "bg-knapp text-bg shadow-knapp hover:-translate-y-px hover:bg-knapp-hover",
    variant === "sekundar" && "bg-surface/70 text-ink ring-1 ring-line-strong hover:bg-surface hover:ring-ink/25",
    variant === "ljus" && "bg-bg text-ink hover:-translate-y-px hover:bg-surface",
    extra,
  );
}

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  storlek?: Storlek;
  /** Visar en pil som glider åt höger vid hovring. */
  pil?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

/**
 * En länk som ser ut som en knapp. Ankarlänkar (/#…) och externa länkar blir
 * vanliga <a> så att de fungerar även utan JavaScript; interna sidor går via
 * Next.js <Link>.
 */
export function KnappLank({ href, children, variant, storlek, pil, className, onClick }: Props) {
  const klasser = knappKlasser(variant, storlek, className);
  const innehall = (
    <>
      {children}
      {pil && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
          strokeWidth={2.25}
        />
      )}
    </>
  );

  const vanligLank = href.includes("#") || /^(https?:|mailto:)/.test(href);
  if (vanligLank) {
    return (
      <a href={href} className={klasser} onClick={onClick}>
        {innehall}
      </a>
    );
  }
  return (
    <Link href={href} className={klasser} onClick={onClick}>
      {innehall}
    </Link>
  );
}
