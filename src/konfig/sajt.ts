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

/**
 * Ett kundcase i sektionen Kundcase. Det första i listan visas stort, resten
 * som mindre kort under. Fyll bara i material som kunden har godkänt.
 */
export type Kundcase = {
  kund: string;
  /** Vad de gör och var, t.ex. "Osteopati i Borås". Står överst på kortet. */
  verksamhet: string;
  /** Hur vi hjälpte dem, i en kort mening var (ELI5): problemet de hade och det vi gjorde. Bara det som är sant. */
  problem: string;
  losning: string;
  /** Logotyp i public/. Bara med tillåtelse. */
  logotyp: { src: string; alt: string; bredd: number; hojd: number } | null;
  /** Godkänt citat. null tills kunden har godkänt texten. Ändra aldrig orden i ett citat. */
  citat: { text: string; namn: string; roll: string; bild?: { src: string; alt: string } } | null;
  /** Verifierade resultat. Tom lista = inga siffror visas. */
  resultat: Kundresultat[];
};

/**
 * En av oss som står bakom tjänsten, i sektionen "Vi som står bakom".
 * Fält som är null visas som platshållare (när visaPlatshallare är på).
 */
export type Teammedlem = {
  namn: string;
  /** T.ex. "Kundkontakt". null = inte ifyllt. */
  roll: string | null;
  /** Porträtt i public/, t.ex. { src: "/team/erik.jpg", alt: "Erik" }. */
  bild: { src: string; alt: string } | null;
  /** Telefonnummer som det skrivs, t.ex. "070-123 45 67". Blir en ring-länk. */
  telefon: string | null;
  epost: string | null;
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

  /** Kontaktadress som visas i sidfoten och vid frågorna. null = visas inte. Fyll bara i en riktig adress. */
  kontaktEpost: null as string | null,

  /**
   * Telefonnummer för "Ring oss" (mobilens knapprad, avslutningen och
   * frågorna). null = första numret i teamet används, och finns inget visas
   * ingen ring-knapp.
   */
  kontaktTelefon: null as string | null,

  /** Vi som står bakom tjänsten (sektionen Team). Namn, roll, bild och telefon fylls i när de finns. */
  team: [
    { namn: "Erik", roll: null, bild: null, telefon: null, epost: null },
    { namn: "Hai", roll: null, bild: null, telefon: null, epost: null },
  ] as Teammedlem[],

  /** Bolaget som säljer tjänsten, i sidfoten. null = visas inte. */
  foretag: {
    namn: null as string | null,
    orgnr: null as string | null,
  },

  /**
   * Löftet om hjälp att komma igång, t.ex. "Vi lägger in kundlistan åt dig."
   * null = inte bestämt: steg 1 och frågorna beskriver då att man laddar upp
   * listan själv, och en platshållare visar var löftet ska stå.
   */
  uppstartshjalp: null as string | null,

  /**
   * Färgerna läses in som CSS-variabler i layout.tsx. Ljusa tonerna är
   * bakgrunder, `text`/`textSekundar` är brödtext och `accentMork` används när
   * accentfärgen bär text eller knappar. accentMork är vald så att den klarar
   * WCAG AA (4,5:1) både mot vitt och mot den ljusa accentytan – kontrollera
   * kontrasten om den byts.
   *
   * Accenten är beige-brun (kamel + kaffebrun) sedan 2026-10-20. Terrakotta
   * (#C86A4A / #AB4E2C) upplevdes som för orange.
   *
   * textSekundar är mörkare sedan 2026-10-23 (#6B625C → #5E5650, 5,6:1 → 6,8:1
   * mot bakgrunden), eftersom målgruppen ofta är 50+ och läser mycket grå text.
   *
   * framgang (djup skogsgrön, 2026-10-23) är sidans enda markeringsfärg och
   * betyder alltid "det blev bra": bokat och bockar för det som ingår. Den
   * används aldrig på stora ytor eller knappar.
   * Kontrast 5,9:1 mot bakgrunden. Knapparna är nästan svarta (textfärgen).
   */
  farger: {
    bakgrund: "#FAF8F5",
    yta: "#FFFFFF",
    sand: "#F2EDE7",
    text: "#292522",
    textSekundar: "#5E5650",
    accent: "#A98463",
    accentMork: "#86603F",
    framgang: "#2F6B4F",
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

  /** Priset sedan 2026-10-24: 695 kr per månad exkl. moms, 100 sms, upp till 25 sparas till nästa månad. */
  pris: {
    visning: "bekraftad" as Prisvisning,
    /** Ordinarie pris i kronor. 0 = inte beslutat (syns bara när visning inte är "dold"). */
    ordinarie: 695,
    /** Betalningsperiod. */
    period: "månad",
    /** Visas efter priset. */
    momstext: "exkl. moms",
    /** Antal sms som ingår per period. 0 = inte beslutat. */
    inkluderadeSms: 100,
    /** Hur många oanvända sms som högst följer med till nästa period. 0 = inga. */
    sparadeSms: 25,
    /** true = "N SMS ingår per månad", false = "N SMS ingår". */
    smsPerPeriod: true,
    /** Pris per extra SMS-del i kronor. null = visas inte. Kostnaden är inte verifierad. */
    pafyllningPerSms: null as number | null,
    /** Ingen bindningstid – kunden kan avsluta när den vill. Bekräftat 2026-10-23. */
    ingenBindningstid: true,
    /** Gratis provperiod i dagar. null = inte bestämd (en platshållare visar var den ska stå). */
    provperiodDagar: null as number | null,
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

  /** Kundcasen, i den ordning de visas. Det första visas stort. Tom lista = sektionen visas inte. */
  kundcase: [
    {
      kund: "Osteopaticentrum",
      verksamhet: "Osteopati i Borås",
      problem: "Patienterna mådde bättre och tänkte boka igen. Men alla bokade inte en ny tid.",
      losning: "Ett sms med Mattias egna ord några dagar efter besöket, med en länk för att boka.",
      logotyp: { src: "/kundcase/osteopaticentrum-logga.png", alt: "Osteopaticentrum", bredd: 696, hojd: 283 },
      citat: {
        text: "Det handlar inte bara om att fylla kalendern, utan också om att skapa kontinuitet, bygga förtroende och hjälpa kunden att prioritera sitt välmående.",
        namn: "Mattias Hietala",
        roll: "Grundare, Osteopaticentrum",
        bild: { src: "/kundcase/mattias-hietala.png", alt: "Mattias Hietala" },
      },
      resultat: [
        {
          varde: "36",
          etikett: "bokningar inom 30 dagar efter att patienten fått ett SMS",
          period: "Mätt under 30 dagar.",
        },
        {
          varde: "358",
          etikett: "patienter fick en uppföljning under samma 30 dagar",
          period: "Mätt under 30 dagar.",
        },
      ],
    },
  ] as Kundcase[],

  video: {
    /** YouTube-, Vimeo- eller mp4-länk till förklaringsvideon. null = sektionen visas inte. */
    url: null as string | null,
  },
};
