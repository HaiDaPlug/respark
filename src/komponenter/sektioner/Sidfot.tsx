import Link from "next/link";
import { texter } from "@/innehall/texter";
import { sajt } from "@/konfig/sajt";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Logga } from "@/komponenter/ui/Logga";

/** Årtalet räknas när sidan byggs och cachas – det får inte läsas vid varje förrendering. */
async function aktuelltAr() {
  "use cache";
  return new Date().getFullYear();
}

/**
 * Sidfoten: en lugn beige yta med kolumner överst och loggan i full bredd
 * längst ner, som en signatur. Den stora
 * loggan är dekor (aria-hidden) – namnet står redan i raden ovanför.
 */
export async function Sidfot() {
  const t = texter.sidfot;
  const ar = await aktuelltAr();
  const rubrikKlass = "text-[0.82rem] font-semibold text-ink";
  const lankKlass = "inline-block py-1 text-ink-soft transition-colors hover:text-ink";

  return (
    <footer className="bg-sand">
      <Behallare className="grid grid-cols-2 gap-x-6 gap-y-10 pt-14 pb-10 lg:grid-cols-[1.6fr_1fr_1fr] lg:pt-20 lg:pb-12">
        <div className="col-span-2 max-w-sm lg:col-span-1">
          <p className="font-display text-h3 font-bold text-ink">{t.rubrik}</p>
          <p className="mt-3 text-[0.95rem] text-ink-soft">{t.beskrivning}</p>
        </div>

        <nav aria-label={t.rubrikProdukt}>
          <p className={rubrikKlass}>{t.rubrikProdukt}</p>
          <ul className="mt-3 space-y-1 text-[0.92rem]">
            {texter.meny.lankar.map((lank) => (
              <li key={lank.href}>
                <a href={lank.href} className={lankKlass}>
                  {lank.etikett}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          <nav aria-label={t.rubrikJuridik}>
            <p className={rubrikKlass}>{t.rubrikJuridik}</p>
            <ul className="mt-3 space-y-1 text-[0.92rem]">
              <li>
                <Link href="/integritetspolicy" className={lankKlass}>
                  {t.integritet}
                </Link>
              </li>
              <li>
                <Link href="/villkor" className={lankKlass}>
                  {t.villkor}
                </Link>
              </li>
            </ul>
          </nav>

          {sajt.kontaktEpost && (
            <div>
              <p className={rubrikKlass}>{t.rubrikKontakt}</p>
              <a href={`mailto:${sajt.kontaktEpost}`} className={`${lankKlass} mt-3 text-[0.92rem]`}>
                {sajt.kontaktEpost}
              </a>
            </div>
          )}
        </div>
      </Behallare>

      <Behallare className="border-t border-ink/10 py-5 text-[0.84rem] text-ink-soft">
        <p>
          © {ar} {sajt.produktnamn}
        </p>
      </Behallare>

      {/*
        Loggan i full bredd längst ner. Bredare än sidans innehåll, men med samma
        sidomarginaler. Ingen intoning: den ligger så långt ner att en
        scrollutlöst animation ibland inte hinner starta.
      */}
      <div className="mx-auto w-full max-w-[100rem] px-5 pt-4 pb-8 sm:px-8 sm:pb-12">
        <Logga className="h-auto w-full" />
      </div>
    </footer>
  );
}
