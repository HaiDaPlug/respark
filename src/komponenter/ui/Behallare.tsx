import type { ReactNode } from "react";
import { klass } from "@/lib/klass";

const BREDDER = {
  /** Sidans vanliga bredd. */
  normal: "max-w-[75rem]",
  /** Löptext, t.ex. juridiska sidor. */
  text: "max-w-[46rem]",
  /** Korta, centrerade budskap. */
  smal: "max-w-[34rem]",
};

/**
 * Centrerar innehållet med sidans maxbredd och sidomarginaler (20 px på
 * mobil). Bredden väljs med `bredd` – skicka inte max-w i className, två
 * max-w-klasser krockar.
 */
export function Behallare({
  children,
  className,
  bredd = "normal",
}: {
  children: ReactNode;
  className?: string;
  bredd?: keyof typeof BREDDER;
}) {
  return <div className={klass("mx-auto w-full px-5 sm:px-8", BREDDER[bredd], className)}>{children}</div>;
}
