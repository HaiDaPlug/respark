import Link from "next/link";
import { ArrowLeft, TriangleAlert } from "lucide-react";
import { sajt } from "@/konfig/sajt";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Ordmarke } from "@/komponenter/ui/Ordmarke";
import { Sidfot } from "./Sidfot";

/**
 * Gemensam layout för integritetspolicyn och användarvillkoren.
 *
 * Båda är UTKAST: rubrikerna visar vad som ska stå, men texten ska skrivas
 * (gärna granskas juridiskt) innan sidan publiceras. Sidorna indexeras inte.
 */
export function Juridiksida({
  titel,
  ingress,
  avsnitt,
}: {
  titel: string;
  ingress: string;
  avsnitt: { rubrik: string; innehall: string }[];
}) {
  return (
    <>
      <header className="border-b border-line">
        <Behallare className="flex h-16 items-center justify-between">
          <Link href="/" className="rounded-lg">
            <Ordmarke />
            <span className="sr-only"> – till startsidan</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-ink-soft hover:text-ink">
            <ArrowLeft aria-hidden className="size-4" />
            Till startsidan
          </Link>
        </Behallare>
      </header>

      <main id="innehall">
        <Behallare bredd="text" className="py-16 sm:py-20">
          <div className="flex items-start gap-3 rounded-2xl border-[1.5px] border-dashed border-accent/50 bg-accent-wash p-4 text-[0.92rem] text-ink">
            <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-strong" />
            <p>
              <strong>Utkast.</strong> Den här sidan är inte färdig och ska skrivas klart – och gärna granskas
              juridiskt – innan {sajt.produktnamn} lanseras. Uppgifter inom hakparentes ska fyllas i.
            </p>
          </div>

          <h1 className="mt-10 text-h2 font-bold text-ink">{titel}</h1>
          <p className="mt-4 text-lead text-ink-soft">{ingress}</p>

          <div className="mt-12 space-y-10">
            {avsnitt.map((a) => (
              <section key={a.rubrik}>
                <h2 className="text-h3 font-bold text-ink">{a.rubrik}</h2>
                <p className="mt-3 text-ink-soft">{a.innehall}</p>
              </section>
            ))}
          </div>
        </Behallare>
      </main>
      <Sidfot />
    </>
  );
}
