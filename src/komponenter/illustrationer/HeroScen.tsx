"use client";

/**
 * Heronas scen: en påminnelse plingar in i kundens telefon – en gång, när
 * sidan öppnas. Ingen loop.
 *
 *   flyger  tre gnistspår i loggans färger flyger in från vänster och möts
 *           där notisen ska komma (knappt en sekund)
 *   framme  gnistan blixtrar till, en ring sprids, telefonen vibrerar och
 *           notisen fälls ned på låsskärmen med en liten studs
 *
 * Spåren ritas i en SVG till vänster om telefonen, mätt i telefonbredder
 * (1 enhet = 1 % av --telefon), så att de alltid slutar i notisen hur stor
 * telefonen än är. Inget mäts i DOM:en.
 *
 * Vid reducerad rörelse visas slutläget direkt, utan spår.
 *
 * Styr också startsidans intro (src/lib/intro.ts): telefonen centreras på
 * skärmen medan bara den syns, och när notisen har kommit släpps rubriken
 * och sedan menyn in.
 */
import { m, useInView, type Variants } from "motion/react";
import { Camera, Flashlight, MessageCircle } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { texter } from "@/innehall/texter";
import { satIntro } from "@/lib/intro";
import { Gnista, useOvergangsId } from "@/komponenter/ui/Gnista";
import { Exempeletikett } from "./Delar";
import { Telefon } from "./Telefon";
import { useReduceradRorelse } from "./useKoppling";

type Fas = "vila" | "flyger" | "framme";

/** Väntan innan gnistorna flyger och hur lång tid en flygning tar. */
const START_MS = 400;
const FLYG_S = 0.85;

/**
 * Introt: längre väntan innan gnistorna flyger (telefonen tonar in först),
 * och hur länge efter notisen rubriken respektive resten kommer.
 */
const INTRO_START_MS = 500;
const INTRO_TEXT_MS = 300;
const INTRO_KLAR_MS = 800;

/**
 * Spåren, i telefonbredder. Telefonen börjar vid x = 160 och notisens ikon
 * sitter vid (172, 64). Fördröjningen gör att de inte kommer exakt samtidigt.
 */
const SPAR = [
  { d: "M -14 14 C 50 -10, 118 16, 172 64", fordrojning: 0 },
  { d: "M -20 92 C 46 116, 122 98, 172 64", fordrojning: 0.1 },
  { d: "M 46 -26 C 98 10, 136 30, 172 64", fordrojning: 0.18 },
];
/** Från att gnistorna flyger tills notisen kommer (när det sista spåret är framme). */
const FLYG_MS = (FLYG_S + SPAR[SPAR.length - 1].fordrojning) * 1000;

/**
 * Ett spår som komet: en bit av linjen som rusar mot telefonen och försvinner
 * i den. Spåret tonas ut helt på slutet – en streckad linje med längd 0 och
 * runda ändar ritar annars en prick kvar i båda ändarna.
 */
const komet: Variants = {
  vila: { pathLength: 0, pathOffset: 0, opacity: 0 },
  flyg: (fordrojning: number) => ({
    pathLength: [0, 0.42, 0],
    pathOffset: [0, 0.3, 1],
    opacity: [0, 1, 1, 0],
    transition: {
      duration: FLYG_S,
      delay: fordrojning,
      ease: [0.55, 0, 0.85, 0.6],
      times: [0, 0.55, 1],
      opacity: { duration: FLYG_S, delay: fordrojning, times: [0, 0.12, 0.88, 1] },
    },
  }),
};

/** Gnistan som blixtrar till där spåren möts. */
const blixt: Variants = {
  vila: { scale: 0, rotate: 0, opacity: 0 },
  pling: {
    scale: [0, 1.35, 0],
    rotate: [0, 90, 160],
    opacity: [1, 1, 0],
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

/** Ringarna som sprids från träffpunkten. */
const ring: Variants = {
  vila: { scale: 0.2, opacity: 0 },
  pling: (fordrojning: number) => ({
    scale: [0.2, 3.4],
    opacity: [0.6, 0],
    transition: { duration: 1, delay: fordrojning, ease: "easeOut" },
  }),
};

/** Små gnistor som skjuts ut åt alla håll vid nedslaget (vinkel i grader). */
const SKUR = [0, 55, 115, 175, 235, 295];
const skur: Variants = {
  vila: { x: 0, y: 0, scale: 0, opacity: 0 },
  pling: (vinkel: number) => ({
    x: [0, Math.cos((vinkel * Math.PI) / 180) * 34],
    y: [0, Math.sin((vinkel * Math.PI) / 180) * 34],
    scale: [1, 0.3],
    opacity: [1, 0],
    transition: { duration: 0.65, ease: [0.2, 0.8, 0.4, 1] },
  }),
};

/** Etiketten "Exempelvy" tonas in med notisen, så att den inte står ensam först. */
const tona: Variants = {
  vila: { opacity: 0 },
  pling: { opacity: 1, transition: { duration: 0.4, delay: 0.25 } },
};

/** Telefonen vibrerar till när notisen kommer. */
const vibration: Variants = {
  vila: { rotate: 0 },
  pling: { rotate: [0, -2.4, 2.4, -1.6, 1.6, -0.6, 0], transition: { duration: 0.55, ease: "easeInOut" } },
};

/** Notisen fälls ned uppifrån med en liten studs. */
const notis: Variants = {
  vila: { opacity: 0, y: "-35%", scale: 0.9 },
  pling: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 520, damping: 22, delay: 0.06 } },
};

export function HeroScen() {
  const t = texter.exempel;
  const scen = useRef<HTMLDivElement>(null);
  const id = useOvergangsId("spar");
  const synlig = useInView(scen, { once: true, amount: 0.35 });
  const reducerad = useReduceradRorelse();
  const [fas, setFas] = useState<Fas>("vila");

  // Introt: innan något ritas flyttas telefonen till mitten av skärmen
  // (--intro-x/--intro-y, läses av CSS:en) och görs synlig. Har besökaren
  // redan scrollat ner (t.ex. efter omladdning) hoppas introt över.
  useLayoutEffect(() => {
    const el = scen.current;
    if (!el || document.documentElement.dataset.intro !== "vantar") return;
    if (window.scrollY > 40) {
      satIntro("klar");
      return;
    }
    const r = el.getBoundingClientRect();
    el.style.setProperty("--intro-x", `${document.documentElement.clientWidth / 2 - (r.left + r.width / 2)}px`);
    el.style.setProperty("--intro-y", `${window.innerHeight / 2 - (r.top + r.height / 2)}px`);
    satIntro("visualisering");
  }, []);

  // Scrollar eller trycker besökaren på en tangent under introt visas allt direkt.
  useEffect(() => {
    const steg = document.documentElement.dataset.intro;
    if (!steg || steg === "klar") return;
    const hoppa = () => satIntro("klar");
    const handelser = ["wheel", "touchmove", "keydown"] as const;
    for (const h of handelser) window.addEventListener(h, hoppa, { passive: true });
    return () => {
      for (const h of handelser) window.removeEventListener(h, hoppa);
    };
  }, []);

  // Spelas en gång: när telefonen först syns flyger gnistorna, sedan kommer
  // notisen. Under introt kommer därefter rubriken och sist resten.
  useEffect(() => {
    if (!synlig || reducerad) return;
    const medIntro = document.documentElement.dataset.intro === "visualisering";
    const start = medIntro ? INTRO_START_MS : START_MS;
    const framme = start + FLYG_MS;
    const timers = [
      window.setTimeout(() => setFas("flyger"), start),
      window.setTimeout(() => setFas("framme"), framme),
    ];
    if (medIntro) {
      timers.push(
        window.setTimeout(() => satIntro("text"), framme + INTRO_TEXT_MS),
        window.setTimeout(() => satIntro("klar"), framme + INTRO_TEXT_MS + INTRO_KLAR_MS),
      );
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [synlig, reducerad]);

  const visad: Fas = reducerad ? "framme" : fas;
  const pling = visad === "framme" ? "pling" : "vila";

  return (
    <div ref={scen} role="img" aria-label={t.heroBeskrivning} className="intro-telefon relative w-[var(--telefon)]">
      {/* Gnistspåren, till vänster om telefonen och in i den */}
      {!reducerad && (
        <svg
          aria-hidden
          viewBox="0 0 210 100"
          overflow="visible"
          className="pointer-events-none absolute top-0 right-1/2 z-20 h-[var(--telefon)] w-[calc(var(--telefon)*2.1)]"
        >
          <defs>
            <linearGradient id={`${id}-farg`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="172" y2="0">
              <stop offset="0" stopColor="#f19417" stopOpacity="0" />
              <stop offset="0.55" stopColor="#f19417" />
              <stop offset="1" stopColor="#d73014" />
            </linearGradient>
            <filter id={`${id}-glod`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.6" />
            </filter>
          </defs>
          {SPAR.map((s) => (
            <g key={s.d}>
              {/* Glöd under, skarp linje ovanpå */}
              <m.path
                d={s.d}
                fill="none"
                stroke={`url(#${id}-farg)`}
                strokeWidth={4}
                strokeLinecap="round"
                filter={`url(#${id}-glod)`}
                variants={komet}
                custom={s.fordrojning}
                initial="vila"
                animate={visad === "vila" ? "vila" : "flyg"}
              />
              <m.path
                d={s.d}
                fill="none"
                stroke={`url(#${id}-farg)`}
                strokeWidth={1.3}
                strokeLinecap="round"
                variants={komet}
                custom={s.fordrojning}
                initial="vila"
                animate={visad === "vila" ? "vila" : "flyg"}
              />
            </g>
          ))}
        </svg>
      )}

      {/* Telefonen, som vibrerar till när notisen kommer */}
      <m.div variants={vibration} initial="vila" animate={pling} style={{ transformOrigin: "50% 30%" }}>
        <Telefon mork>
          <div className="flex flex-1 flex-col items-center px-[4cqw]">
            <p className="mt-[3cqw] text-[length:max(0.55rem,4.6cqw)] font-medium text-white/80 first-letter:uppercase">
              {t.lasskarm.datum}
            </p>
            <p className="font-display text-[length:max(2.4rem,22cqw)] leading-none font-bold tracking-[-0.03em]">
              {t.lasskarm.klocka}
            </p>

            {/* Notisen. Platsen är reserverad även när den är dold, så att inget hoppar. */}
            <m.div
              variants={notis}
              initial="vila"
              animate={pling}
              className="mt-[9cqw] w-full rounded-[5cqw] bg-white/90 p-[3.2cqw] text-ink shadow-[0_8px_30px_-8px_rgb(0_0_0/0.5)] backdrop-blur-md"
            >
              <div className="flex items-center gap-[2.4cqw]">
                <span className="grid size-[7.5cqw] shrink-0 place-items-center rounded-[1.8cqw] bg-ink text-white">
                  <MessageCircle aria-hidden className="size-[4.4cqw]" strokeWidth={2.4} />
                </span>
                <span className="text-[length:max(0.5rem,3.6cqw)] font-medium tracking-[0.02em] text-ink-soft uppercase">
                  {t.lasskarm.app}
                </span>
                <span className="ml-auto text-[length:max(0.5rem,3.6cqw)] text-ink-soft">{t.lasskarm.nar}</span>
              </div>
              <p className="mt-[2cqw] text-[length:max(0.6rem,4.4cqw)] font-semibold">{t.avsandare}</p>
              <p className="text-[length:max(0.6rem,4.3cqw)] leading-[1.35]">
                {t.sms} <span className="text-accent-strong underline underline-offset-2">{t.bokningslank}</span>
              </p>
            </m.div>

            <m.div variants={tona} initial="vila" animate={pling} className="mt-[4cqw]">
              <Exempeletikett />
            </m.div>

            {/* Låsskärmens knappar och hemindikatorn, bara som bild */}
            <div aria-hidden className="mt-auto flex w-full items-center justify-between px-[4cqw] pb-[4cqw]">
              <span className="grid size-[11cqw] place-items-center rounded-full bg-white/15 backdrop-blur-md">
                <Flashlight className="size-[5cqw]" />
              </span>
              <span className="h-[1.2cqw] w-[34cqw] self-end rounded-full bg-white/70" />
              <span className="grid size-[11cqw] place-items-center rounded-full bg-white/15 backdrop-blur-md">
                <Camera className="size-[5cqw]" />
              </span>
            </div>
          </div>
        </Telefon>
      </m.div>

      {/* Där spåren möts: ringar, en gnistskur och en gnista som blixtrar till */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[calc(var(--telefon)*0.64)] left-[calc(var(--telefon)*0.12)] z-30"
      >
        {[0, 0.14].map((fordrojning) => (
          <m.span
            key={fordrojning}
            variants={ring}
            custom={fordrojning}
            initial="vila"
            animate={reducerad ? "vila" : pling}
            className="absolute -top-[calc(var(--telefon)*0.05)] -left-[calc(var(--telefon)*0.05)] size-[calc(var(--telefon)*0.1)] rounded-full border-2 border-[#ea7831]"
          />
        ))}
        {SKUR.map((vinkel) => (
          <m.span
            key={vinkel}
            variants={skur}
            custom={vinkel}
            initial="vila"
            animate={reducerad ? "vila" : pling}
            className="absolute -top-1 -left-1 size-2 rounded-full bg-[#f19417] shadow-[0_0_8px_#f19417]"
          />
        ))}
        <m.span
          variants={blixt}
          initial="vila"
          animate={reducerad ? "vila" : pling}
          className="absolute -top-[calc(var(--telefon)*0.06)] -left-[calc(var(--telefon)*0.06)] block size-[calc(var(--telefon)*0.12)]"
        >
          <Gnista className="size-full" />
        </m.span>
      </div>
    </div>
  );
}
