"use client";

/**
 * Kundlistan som somnar och vaknar, och kalendern som fylls (jämförelsesidan,
 * 2026-11-16). Ersatte scenen med två telefoner: den visade kundens skärm
 * med tre sms, vilket kunde se ut som tjat. Den här visar ägarens sida – det
 * man köper Respark för.
 *
 * Scenen fastnar under menyn, och scrollen är tiden:
 *   1  Kunderna glömmer att boka   kunderna i listan bleknar en i taget och
 *                                   får "Inte bokat på ett tag"
 *   2  Respark skickar sms          en kund i taget får "Sms skickat", och
 *                                   de som bokar lyser upp: "Bokat igen"
 *                                   med en gnista. Alla bokar inte (bokar:
 *                                   false i texterna) – bilden ska inte se
 *                                   ut som ett löfte.
 *   3  Lediga tider fylls           samma stund landar kundens namn i en
 *                                   ledig ruta i veckan, med en gnista
 *
 * Kalendern står i 3D, lutad som ett papper på bordet, och följer musen
 * några grader (useLutning). Listan står nästan rakt, lite vriden mot
 * kalendern. Bara transform och opacity animeras.
 *
 * EXEMPELVY: påhittade kunder, inga siffror (inga "+5 bokningar"). Hela
 * scenen beskrivs med aria-label; innehållet är dolt för skärmläsare.
 * Vid reducerad rörelse visas slutläget direkt.
 */
import { m, useInView, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Check } from "lucide-react";
import { useRef, useState, type CSSProperties } from "react";
import { texter } from "@/innehall/texter";
import { klass } from "@/lib/klass";
import { Avatar, Exempeletikett, Fonster, Statuschip } from "@/komponenter/illustrationer/Delar";
import { useReduceradRorelse } from "@/komponenter/illustrationer/useKoppling";
import { useLutning } from "@/komponenter/illustrationer/useLutning";
import { Behallare } from "@/komponenter/ui/Behallare";
import { Gnista } from "@/komponenter/ui/Gnista";
import { Sektionsrubrik } from "@/komponenter/ui/Sektionsrubrik";

/** Samma som klassen top-24 på det fasta innehållet (6rem). */
const STICKY_TOPP_PX = 96;
/** Hur långt man scrollar genom scenen, i procent av skärmhöjden. */
const SCROLL_VH = 200;

/**
 * Tiden, som andel av scrollen (0–1):
 * kund i bleknar vid SOMNAR_START + i · SOMNAR_STEG,
 * får sitt sms vid VAKNAR_START + i · VAKNAR_STEG och bokar BOKAR_EFTER senare.
 * Efter den sista bokningen står scenen kvar till slutet.
 */
const SOMNAR_START = 0.04;
const SOMNAR_STEG = 0.05;
const VAKNAR_START = 0.38;
const VAKNAR_STEG = 0.1;
const BOKAR_EFTER = 0.045;

/** Rutor i veckan som redan är bokade (dag, tid), så att kalendern inte ser tom ut. */
const BOKADE: Array<[number, number]> = [
  [0, 0],
  [0, 3],
  [1, 0],
  [1, 2],
  [2, 1],
  [3, 1],
  [3, 3],
  [4, 0],
];

/** Kalenderns vilovinkel: som ett papper på bordet, vridet lite mot listan. */
const KALENDER_X = 16;
const KALENDER_Y = -9;
/** Listans vilovinkel: nästan rak, vriden lite mot kalendern. */
const LISTA_Y = 9;
const LUTNING_MAX = 4;

const mjuk = [0.22, 1, 0.36, 1] as const;

type Kundlage = "nojd" | "inaktiv" | "skickat" | "bokat";

/** Var kund i befinner sig vid tiden t. En kund som inte bokar stannar på "Sms skickat". */
function kundlage(t: number, i: number, bokar: boolean): Kundlage {
  const vaknar = VAKNAR_START + i * VAKNAR_STEG;
  if (bokar && t >= vaknar + BOKAR_EFTER) return "bokat";
  if (t >= vaknar) return "skickat";
  if (t >= SOMNAR_START + i * SOMNAR_STEG) return "inaktiv";
  return "nojd";
}

/** Vilken av de tre faserna som pågår vid tiden t (för raden ovanför scenen). */
function fas(t: number, antal: number): number {
  if (t >= VAKNAR_START + (antal - 1) * VAKNAR_STEG + BOKAR_EFTER) return 2;
  if (t >= VAKNAR_START) return 1;
  return 0;
}

export function KunderOchKalender() {
  const t = texter.jamforelse.scen;
  const spar = useRef<HTMLDivElement>(null);
  const reducerad = useReduceradRorelse();
  const [tid, setTid] = useState(0);

  // 0 när scenen fastnar under menyn, 1 när den släpper.
  const { scrollYProgress } = useScroll({ target: spar, offset: [`start ${STICKY_TOPP_PX}px`, "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setTid(v));
  const nu = reducerad ? 1 : tid;
  const lagen = t.kunder.map((k, i) => kundlage(nu, i, k.bokar));
  const aktivFas = fas(nu, t.kunder.length);
  /** Linjen under fasraden fylls i takt med scrollen (scaleX, ingen bredd ändras). */
  const fyllnad = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id={t.ankare} aria-labelledby="scen-rubrik" className="scroll-mt-16 yta-beige">
      <Behallare>
        <div ref={spar} className="relative" style={{ height: `calc(100vh - ${STICKY_TOPP_PX}px + ${SCROLL_VH}vh)` }}>
          {/* Menyn är 4rem hög på mobil och 4,5rem från lg; från lg centreras innehållet i höjd */}
          <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-start pt-6 pb-24 lg:top-24 lg:h-[calc(100vh-6rem)] lg:justify-center lg:py-6">
            {/* Ingressen bara från sm – på mobil behövs höjden till listan och kalendern */}
            <Sektionsrubrik id="scen-rubrik" rubrik={t.rubrik} centrerad />
            <p className="mx-auto mt-4 hidden max-w-[44rem] text-center text-lead text-ink-soft sm:block">{t.text}</p>

            {/* Berättelsens tre delar, med en linje som fylls i takt med scrollen */}
            <div className="mx-auto mt-4 w-full max-w-[40rem] sm:mt-8">
              <ol className="grid grid-cols-3 gap-2 text-center text-[0.72rem] font-semibold sm:text-[0.9rem]">
                {t.faser.map((f, i) => (
                  <li
                    key={f}
                    aria-current={i === aktivFas ? "step" : undefined}
                    className={klass("transition-colors duration-300", i === aktivFas ? "text-ink" : "text-ink-faint")}
                  >
                    <span className="sm:hidden">{t.faserKorta[i]}</span>
                    <span className="hidden sm:inline">{f}</span>
                  </li>
                ))}
              </ol>
              <div className="relative mt-2.5 h-1 rounded-full bg-ink/10">
                <m.span aria-hidden className="absolute inset-0 origin-left rounded-full bg-detalj" style={{ scaleX: reducerad ? 1 : fyllnad }} />
              </div>
              <p className="mt-2.5 text-center text-[0.8rem] text-ink-soft sm:text-[0.85rem]">{t.exempelText}</p>
            </div>

            {/* Listan och kalendern */}
            <div
              role="img"
              aria-label={t.beskrivning}
              className="mx-auto mt-4 grid w-full max-w-[64rem] items-center gap-3 sm:mt-8 sm:gap-5 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-10"
            >
              <Kundlista lagen={lagen} />
              <Kalender lagen={lagen} />
            </div>
          </div>
        </div>
      </Behallare>
    </section>
  );
}

/** Kundlistan: ett appfönster med kunderna, som bleknar och lyser upp. */
function Kundlista({ lagen }: { lagen: Kundlage[] }) {
  const t = texter.jamforelse.scen;
  const scen = useRef<HTMLDivElement>(null);
  const { rotateX, rotateY } = useLutning(scen, { narmast: "section", max: LUTNING_MAX / 2, basX: 2, basY: LISTA_Y });

  return (
    <div ref={scen} className="mx-auto w-full max-w-[24rem] lg:max-w-none" style={{ perspective: "1600px" }}>
      <m.div className="transform-3d" style={{ rotateX, rotateY }}>
        <Fonster titel={t.lista.titel} hoger={<Exempeletikett />} innerKlass="p-1.5 sm:p-3">
          <ul className="flex flex-col gap-0.5 sm:gap-1">
            {t.kunder.map((k, i) => {
              const lage = lagen[i];
              const blek = lage === "inaktiv";
              return (
                <m.li
                  key={k.initialer}
                  initial={false}
                  animate={{ opacity: blek ? 0.45 : 1, x: lage === "skickat" || lage === "bokat" ? 2 : 0 }}
                  transition={{ duration: 0.6, ease: mjuk }}
                  className={klass(
                    "relative flex items-center gap-2.5 rounded-xl px-2.5 py-1 transition-colors duration-500 sm:gap-3 sm:px-3 sm:py-2",
                    lage === "bokat" ? "bg-framgang-soft" : lage === "skickat" ? "bg-accent-wash" : "bg-transparent",
                  )}
                >
                  <Avatar initialer={k.initialer} framhavd={lage === "skickat" || lage === "bokat"} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.9rem] font-semibold text-ink">{k.namn}</span>
                    {/* "Senast här i …" bara från sm, så att raderna är låga på mobil */}
                    <span className="hidden text-[0.74rem] text-ink-soft sm:block">{t.lista.senast(k.senast)}</span>
                  </span>
                  {lage !== "nojd" && <Statuschip status={lage} className="shrink-0" />}
                  {/* Gnistan som tänds när kunden bokar igen */}
                  <m.span
                    aria-hidden
                    className="pointer-events-none absolute -top-1.5 -left-1.5 size-5"
                    initial={false}
                    animate={lage === "bokat" ? { scale: [0, 1.4, 1], rotate: [-40, 10, 0], opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ duration: 0.55, ease: mjuk }}
                  >
                    <Gnista className="size-full drop-shadow-[0_3px_6px_rgb(215_48_20/0.35)]" />
                  </m.span>
                </m.li>
              );
            })}
          </ul>
        </Fonster>
      </m.div>
    </div>
  );
}

/** Veckokalendern i 3D: bokade rutor i grått, lediga streckade, och kunderna som landar i dem. */
function Kalender({ lagen }: { lagen: Kundlage[] }) {
  const t = texter.jamforelse.scen;
  const scen = useRef<HTMLDivElement>(null);
  const reducerad = useReduceradRorelse();
  const iBild = useInView(scen);
  const svava = iBild && !reducerad;
  const { rotateX, rotateY } = useLutning(scen, { narmast: "section", max: LUTNING_MAX, basX: KALENDER_X, basY: KALENDER_Y });

  /** Kund per ruta (dag, tid), för de som har bokat eller är på väg. */
  const kunder = new Map<string, number>();
  t.kunder.forEach((k, i) => kunder.set(`${k.dag}-${k.tid}`, i));
  const bokade = new Set(BOKADE.map(([d, h]) => `${d}-${h}`));

  return (
    <div ref={scen} className="w-full" style={{ perspective: "1400px" }}>
      <m.div className="transform-3d" style={{ rotateX, rotateY }}>
        <m.div
          initial={false}
          animate={svava ? { y: [0, -5, 0] } : { y: 0 }}
          transition={svava ? { duration: 7, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
        >
          <Fonster titel={t.kalender.titel} hoger={<Exempeletikett />} className="shadow-djup" innerKlass="p-2.5 sm:p-4">
            <div
              className="grid gap-1 sm:gap-1.5"
              style={{ gridTemplateColumns: `2rem repeat(${t.kalender.dagar.length}, minmax(0, 1fr))` } as CSSProperties}
            >
              <span />
              {t.kalender.dagar.map((d) => (
                <span key={d} className="pb-0.5 text-center text-[0.7rem] font-semibold text-ink-soft sm:text-[0.78rem]">
                  {d}
                </span>
              ))}
              {t.kalender.tider.map((tidrad, h) => (
                <Rad key={tidrad} tid={tidrad} h={h} kunder={kunder} bokade={bokade} lagen={lagen} />
              ))}
            </div>
          </Fonster>
        </m.div>
      </m.div>
    </div>
  );
}

function Rad({
  tid,
  h,
  kunder,
  bokade,
  lagen,
}: {
  tid: string;
  h: number;
  kunder: Map<string, number>;
  bokade: Set<string>;
  lagen: Kundlage[];
}) {
  const t = texter.jamforelse.scen;
  return (
    <>
      <span className="self-center text-[0.68rem] font-medium text-ink-faint tabular-nums sm:text-[0.76rem]">{tid}</span>
      {t.kalender.dagar.map((_, d) => {
        const nyckel = `${d}-${h}`;
        const kund = kunder.get(nyckel);
        const bokadAvKund = kund !== undefined && lagen[kund] === "bokat";
        if (bokade.has(nyckel)) {
          return (
            <span key={nyckel} className="flex h-7 items-center justify-center rounded-lg bg-sand text-[0.68rem] font-medium text-ink-soft sm:h-11 sm:text-[0.76rem]">
              {t.kalender.bokad}
            </span>
          );
        }
        return (
          <span key={nyckel} className="relative h-7 sm:h-11">
            {/* Den lediga rutan ligger kvar under – när kunden landar ovanpå ändras ingen storlek */}
            <span className="absolute inset-0 flex items-center justify-center rounded-lg border border-dashed border-line-strong text-[0.66rem] text-ink-faint sm:text-[0.74rem]">
              {t.kalender.ledig}
            </span>
            {kund !== undefined && (
              <m.span
                initial={false}
                animate={bokadAvKund ? { opacity: 1, y: 0, z: 0, scale: 1 } : { opacity: 0, y: -18, z: 70, scale: 1.12 }}
                transition={bokadAvKund ? { type: "spring", stiffness: 380, damping: 24 } : { duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center gap-1 rounded-lg bg-framgang text-[0.68rem] font-semibold text-white shadow-kort sm:text-[0.76rem]"
              >
                <Check aria-hidden className="size-3 shrink-0 text-white/85" strokeWidth={3} />
                <span className="truncate">{t.kunder[kund].kort}</span>
                {/* Gnistan när tiden fastnar */}
                <m.span
                  aria-hidden
                  className="pointer-events-none absolute -top-2 -right-2 size-5"
                  initial={false}
                  animate={bokadAvKund ? { scale: [0, 1.5, 1], rotate: [-30, 20, 0], opacity: [1, 1, 1] } : { scale: 0, opacity: 0 }}
                  transition={{ duration: 0.6, delay: bokadAvKund ? 0.1 : 0, ease: mjuk }}
                >
                  <Gnista className="size-full drop-shadow-[0_3px_6px_rgb(215_48_20/0.4)]" />
                </m.span>
              </m.span>
            )}
          </span>
        );
      })}
    </>
  );
}
