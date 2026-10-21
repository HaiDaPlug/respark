/**
 * CENTRAL KONFIGURATION – allt som ofta ändras finns här.
 *
 * Produktnamn, färger, priser, länkar, förbund och kundcase styrs från den
 * här filen. Texterna ligger i src/innehall/texter.ts och läser namnet
 * härifrån, så ett namnbyte slår igenom överallt (logga, rubriker, metadata,
 * OG-bild).
 *
 * Grundregel: inget här får påstå något som inte är bekräftat. Obekräftade
 * värden står som null eller med visning "dold" tills de är beslutade.
 */

/** Hur priset visas på sidan. */
export type Prisvisning =
  /** Inga belopp syns – bara texten om ett enkelt upplägg. Standard tills priset är beslutat. */
  | "dold"
  /** Beloppen syns med etiketten "Preliminärt pris". För intern granskning. */
  | "preliminar"
  /** Beloppen syns som slutgiltiga. Först när pris, period och villkor är beslutade. */
  | "bekraftad";

/** Ett förbund eller en organisation som får ett eget erbjudande via ?partner=slug. */
export type Partner = {
  /** Det som står i länken: exempel.se/?partner=slug. Små bokstäver, inga mellanslag. */
  slug: string;
  /** Namnet som visas för besökaren, t.ex. "Svenska Exempelförbundet". */
  namn: string;
  /** Medlemsrabatt i procent. null = ingen rabatt visas, bara att erbjudandet finns. */
  rabattProcent: number | null;
  /**
   * Sätt true FÖRST när samarbetet är bekräftat. Ett förbund som inte är
   * aktivt visas aldrig – sidan beter sig då som en vanlig besökare.
   */
  aktiv: boolean;
  /** Fungerar bara under utveckling (npm run dev), aldrig på den publicerade sidan. */
  endastUtveckling?: boolean;
  /** Egen betallänk för medlemmar (t.ex. Stripe Payment Link med rabattkod). */
  betalningslank?: string | null;
};

/** Ett resultat i kundcaset. Lägg bara in siffror som är verifierade och godkända av kunden. */
export type Kundresultat = {
  varde: string;
  etikett: string;
  /** Vilken period siffran gäller, t.ex. "mars–maj 2026". */
  period: string;
};

export const sajt = {
  /** Produktens namn. Byt här – det slår igenom på hela sidan. */
  produktnamn: "Respark",

  /** Sajtens adress utan avslutande snedstreck. Används i metadata, sitemap och OG-bild. */
  doman: "https://example.com",

  /** Får sökmotorer indexera sidan? Sätt true först vid lansering. */
  indexera: false,

  /**
   * Visar tydligt markerade platshållare för material som saknas (kundcitat,
   * logga, video, utkast i FAQ). Sätt false före lansering – då döljs allt
   * som inte är ifyllt.
   */
  visaPlatshallare: true,

  /** Kontaktadress som visas i sidfoten. null = visas inte. Fyll bara i en riktig adress. */
  kontaktEpost: null as string | null,

  /**
   * Färgerna läses in som CSS-variabler i layout.tsx. Ljusa tonerna är
   * bakgrunder, `text`/`textSekundar` är brödtext och `accentMork` används när
   * accentfärgen bär text eller knappar. accentMork är vald så att den klarar
   * WCAG AA (4,5:1) både mot vitt och mot den ljusa accentytan – kontrollera
   * kontrasten om den byts.
   *
   * Accenten är beige-brun (kamel + kaffebrun) sedan 2026-10-20. Terrakotta
   * (#C86A4A / #AB4E2C) upplevdes som för orange.
   */
  farger: {
    bakgrund: "#FAF8F5",
    yta: "#FFFFFF",
    sand: "#F2EDE7",
    text: "#292522",
    textSekundar: "#6B625C",
    accent: "#A98463",
    accentMork: "#86603F",
  },

  lankar: {
    /**
     * Registreringen i produkten – dit alla "Kom igång"-knappar leder.
     * null tills registreringen finns: då leder knapparna till prisdelen och
     * priskortet visar en platshållare i stället för en knapp. (Det finns
     * ingen intresseanmälan längre – den togs bort 2026-10-20.)
     */
    komIgang: null as string | null,
    /** Inloggning i produkten. null = ingen "Logga in"-länk visas. */
    loggaIn: null as string | null,
    /**
     * Betalsida, t.ex. en Stripe Payment Link. Används bara när priset är
     * "bekraftad" – annars går priskortets knapp till komIgang.
     */
    betalning: null as string | null,
  },

  pris: {
    visning: "dold" as Prisvisning,
    /** Ordinarie pris i kronor. 0 = inte beslutat (syns bara när visning inte är "dold"). */
    ordinarie: 0,
    /** Betalningsperiod. Ej beslutad. */
    period: "månad",
    /** Visas efter priset. Ej beslutad. */
    momstext: "exkl. moms",
    /** Antal SMS som ingår. 0 = inte beslutat. */
    inkluderadeSms: 0,
    /** true = "N SMS ingår per månad", false = "N SMS ingår". */
    smsPerPeriod: true,
    /** Pris per extra SMS-del i kronor. null = visas inte. Kostnaden är inte verifierad. */
    pafyllningPerSms: null as number | null,
  },

  /**
   * Förbund med eget erbjudande. Besökare som kommer via
   * exempel.se/?partner=slug ser förbundets namn och medlemspriset.
   * Visa aldrig ett förbund innan samarbetet är bekräftat.
   */
  partners: [
    {
      slug: "demo",
      namn: "Exempelförbundet",
      rabattProcent: 20,
      aktiv: true,
      endastUtveckling: true,
    },
  ] as Partner[],

  kundcase: {
    kund: "Osteopaticentrum",
    /** Godkänt citat: { text, namn, roll }. null tills kunden har godkänt texten. */
    citat: null as { text: string; namn: string; roll: string } | null,
    /** Logotyp i public/, t.ex. { src: "/kundcase/logga.svg", alt: "Osteopaticentrum" }. Bara med tillåtelse. */
    logotyp: null as { src: string; alt: string } | null,
    /** Riktig skärmbild från produkten i public/. */
    skarmbild: null as { src: string; alt: string } | null,
    /** Verifierade resultat. Tom lista = inga siffror visas. */
    resultat: [] as Kundresultat[],
  },

  video: {
    /** YouTube-, Vimeo- eller mp4-länk till förklaringsvideon. null = sektionen visas inte. */
    url: null as string | null,
  },
};
