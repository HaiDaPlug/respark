/**
 * ALL TEXT PÅ SIDAN – på ett ställe.
 *
 * Komponenterna hämtar sina texter härifrån, så copy kan ändras utan att
 * röra layouten. Produktnamnet kommer från src/konfig/sajt.ts.
 *
 * Skrivregler för sidan:
 * - ELI5 (2026-10-23): skriv så att en femåring förstår. Vardagsord, korta
 *   meningar, en sak i taget och konkreta exempel. Inga facktermer
 *   (utskick, import, kolumner, återbesök, uppföljning) och inget bildspråk
 *   (faller mellan stolarna, egen röst). Hellre "sms" än "påminnelse" när
 *   det är tydligare.
 * - Sälj resultatet (kunder som kommer tillbaka), inte tekniken.
 * - Lova aldrig bokningar, avkastning eller integrationer som inte finns.
 * - Skriv "bokningar efter sms:et", aldrig att ett sms orsakade en bokning.
 * - "sms" med gemener, som Språkrådet rekommenderar.
 */
import { sajt } from "@/konfig/sajt";

const p = sajt.produktnamn;

/** Ankarlänkar till sektionerna. Används av menyn, knappar och sidfoten. */
export const ankare = {
  /** Sektionen efter heron, där berättelsen fortsätter. */
  varfor: "varfor",
  saFungerarDet: "sa-fungerar-det",
  pris: "pris",
  /** Sektionen "Vi som står bakom", med telefon och mejl. */
  kontakt: "kontakt",
  fragor: "vanliga-fragor",
  komIgang: "kom-igang",
} as const;

export const texter = {
  meta: {
    /** Undertext i delningsbilden. */
    undertitel: "Fler återbesök för behandlare och salonger",
    titel: `${p} – Få tillbaka kunder som inte bokat på länge`,
    beskrivning:
      "Automatiska sms-påminnelser för behandlare, kliniker och salonger. Kunder som inte bokat på länge får en personlig påminnelse, och du ser vilka som bokar efter utskicket. Fungerar med ditt nuvarande bokningssystem.",
  },

  meny: {
    lankar: [
      { etikett: "Så fungerar det", href: `/#${ankare.saFungerarDet}` },
      { etikett: "Pris", href: `/#${ankare.pris}` },
      { etikett: "Vanliga frågor", href: `/#${ankare.fragor}` },
      { etikett: "Kontakt", href: `/#${ankare.kontakt}` },
    ],
    cta: "Kom igång",
    loggaIn: "Logga in",
    oppna: "Öppna menyn",
    stang: "Stäng menyn",
  },

  /**
   * Heron är början på en berättelse: bara rubriken, ingen beskrivning. Den
   * fortsätter i nästa sektion (problem.rubrik), som besökaren ska vilja
   * scrolla till. Rubriken delas upp så att "inte glömt" kan få sin
   * understrykning.
   */
  hero: {
    rubrik: { fore: "Dina kunder har", markerad: "inte glömt", efter: "dig." },
    /**
     * En rad under rubriken som säger vad tjänsten är, så att besökaren
     * förstår det inom de första sekunderna. Berättelsen lever kvar i rubriken.
     */
    kategori: "Respark skickar ett sms till kunder som inte har varit hos dig på ett tag.",
    lasVidare: "Läs vidare",
    partner: (forbund: string) => `Särskilt erbjudande för medlemmar i ${forbund}`,
    partnerLank: "Se medlemspriset",
  },

  /** Exempeldata i illustrationerna. Påhittade personer – inga riktiga kunder. */
  exempel: {
    etikett: "Exempelvy",
    avsandare: "Din verksamhet",
    bokningslank: "boka.dinverksamhet.se",
    sms: "Hej Anna! Det var ett tag sedan vi sågs. Välkommen att boka en ny tid hos oss.",
    status: { inaktiv: "Inte bokat på ett tag", skickat: "Sms skickat", bokat: "Bokat igen" },
    /** Låsskärmen i heron. */
    lasskarm: { klocka: "9:41", datum: "tisdag 10 juni", app: "Meddelanden", nar: "nu" },
    heroBeskrivning:
      "Exempel: en påminnelse från verksamheten plingar in på Annas telefon: Hej Anna! Det var ett tag sedan vi sågs. Välkommen att boka en ny tid hos oss.",
  },

  /**
   * Efter heron: varför kunder inte kommer tillbaka, som en tidslinje
   * (sektioner/Problem.tsx). Bygger på kundcaset från Osteopaticentrum.
   * "ikon" väljer symbol i komponenten, "bokning" hur "Boka ny tid" ser ut.
   */
  problem: {
    /** Fortsättningen på heronas rubrik ("Dina kunder har inte glömt dig."). */
    /** Ingen ingress: tidslinjen berättar det (ingressen togs bort 2026-10-23, mindre text). */
    rubrik: "De vill komma tillbaka. Men de glömmer att boka.",
    tidslinje: [
      { vecka: "Vecka 1", handelser: [{ ikon: "nojd", text: "Nöjd efter besöket" }], bokning: "tanker" },
      { vecka: "Vecka 3", handelser: [{ ikon: "jobb", text: "Full fart på jobbet" }], bokning: "skjutsUpp" },
      {
        vecka: "Vecka 6",
        handelser: [
          { ikon: "jobb", text: "Full fart på jobbet" },
          { ikon: "familj", text: "Hämtning, läxor, träning" },
        ],
        bokning: "skjutsUpp",
      },
      {
        vecka: "Vecka 10",
        handelser: [
          { ikon: "jobb", text: "Full fart på jobbet" },
          { ikon: "familj", text: "Hämtning, läxor, träning" },
          { ikon: "vardag", text: "Vardagen rullar på" },
        ],
        bokning: "bortglomd",
      },
    ] as const,
    bokaNyTid: "Boka ny tid",
    skjutsUpp: "Skjuts upp",
    bortglomd: "Bortglömd",
    beskrivning:
      "Tidslinje: vecka 1 är kunden nöjd och tänker boka en ny tid. Vecka 3 och 6 skjuts det upp när jobbet och familjen tar tid. Vecka 10 är det bortglömt.",
  },

  /**
   * PROBLEMPITCH, INTE PRODUKTPITCH (2026-10-23): sidan målar upp besökarens
   * problem så att de känner igen sig, berättar att vi har sett samma sak hos
   * Mattias och att det är därför Respark finns – och först sedan, konkret,
   * vad Respark gör. Produkten pratar inte om sig själv.
   */

  /** Problemet från ägarens håll: dagarna är fulla, så sms:en blir inte av (sektioner/Vardag.tsx). */
  vardag: {
    rubrik: "Och du hinner inte påminna dem.",
    text: "Dagarna är fulla av kunder. Sms:en till dem som inte har bokat blir sällan av.",
    dag: "Din tisdag",
    rader: [
      { tid: "08.00", text: "Kunder hela förmiddagen" },
      { tid: "12.00", text: "Lunch i farten" },
      { tid: "13.00", text: "Kunder hela eftermiddagen" },
      { tid: "17.30", text: "Städa, beställa, svara på mejl" },
      { tid: "19.00", text: "Skriva till gamla kunder", blevInteAv: true },
    ],
    blevInteAv: "Blev inte av",
    igen: "Och samma sak nästa dag.",
    beskrivning:
      "Exempel på en arbetsdag: kunder hela förmiddagen och eftermiddagen, lunch i farten, städning och mejl. Sist på dagen: skriva till gamla kunder. Det blev inte av.",
  },

  /** Varför Respark finns: Mattias historia, med hans riktiga sms (sektioner/Berattelse.tsx). */
  berattelse: {
    rubrik: "Vi har sett det här förut.",
    stycken: [
      `Mattias är osteopat i Borås. Hans patienter mådde bättre och tänkte boka igen. Men vardagen kom emellan, och alla bokade inte igen.`,
      "Så vi byggde ett sätt att påminna dem. Ett sms några dagar efter besöket, med Mattias egna ord och en länk för att boka.",
      `Det blev början på ${p}.`,
    ],
    /** Under kundens riktiga SMS. */
    fotnot: (kund: string) => `Riktigt meddelande från ${kund}, fiktivt patientnamn.`,
    beskrivning: (avsandare: string, nar: string) => `Sms från ${avsandare}, ${nar}:`,
  },

  saFungerarDet: {
    rubrik: "Så fungerar det.",
    /**
     * Skillnaden mot bokningssystemet, i en rad under rubriken. Stod förut i en
     * egen sektion ("Det här gör Respark åt dig"), som togs bort 2026-10-23
     * eftersom den upprepade tidslinjen, berättelsen och stegen.
     */
    text: "Ditt bokningssystem påminner om tider som redan är bokade. Respark påminner dem som inte har bokat.",
    /** Samma ordning som vyerna i illustrationer/StegVyer.tsx (STEGVYER). */
    steg: [
      {
        titel: "Lägg in dina kunder",
        text: "En lista från bokningssystemet du redan har. Inget att byta.",
      },
      {
        titel: "Välj när sms:en ska gå ut",
        text: "Några dagar efter besöket, eller när det har gått länge. Sedan sköts resten av sig självt.",
      },
      {
        titel: "Se vilka som kommer tillbaka",
        text: "Du ser vilka som bokade efter sms:et.",
      },
    ],
    /** Platshållare under rubriken tills det är bestämt vilken hjälp nya kunder får. */
    uppstartSaknas: "Här står löftet om hjälp att komma igång, t.ex. \"Vi lägger in kundlistan åt dig\", när det är bestämt (sajt.uppstartshjalp).",
    /** Stegraden överst på mobil: "Steg 2 av 3". */
    stegAv: (nr: number, antal: number) => `Steg ${nr} av ${antal}`,
  },

  /** Visas bara när sajt.video.url är ifylld. */
  video: {
    rubrik: "Hellre se än läsa?",
    text: `En kort film om hur ${p} fungerar.`,
  },

  kundcase: {
    /** Rubriken i två delar; den andra får accentfärg. Från kundens eget case. */
    rubrik: { fore: "Så gick det för", efter: "Osteopaticentrum." },
    /** Under rutorna (en per bokning). */
    rutorFotnot: "Varje ruta är en bokning.",
    /** En samlad platshållare som räknar upp det som saknas. */
    platshallare: {
      inledning: "Fylls i före lansering, med kundens godkännande:",
      citat: "citat",
      logotyp: "logga",
      resultat: "verifierade resultat",
    },
  },

  pris: {
    /** Rubriken räcker – ingressen och raden under planens namn togs bort 2026-10-23 (mindre text). */
    rubrik: "Ett enkelt pris.",
    /** Visas i stället för beloppet när sajt.pris.visning är "dold". */
    dold: {
      rubrik: "Pris kommer snart",
    },
    /** Platshållare i priskortet när det inte finns någon registrerings- eller betallänk. */
    saknarLank: "Knappen visas här när registreringslänken finns (sajt.lankar.komIgang).",
    preliminart: "Preliminärt pris",
    medlemspris: (forbund: string) => `Medlemspris för ${forbund}`,
    medlemserbjudande: (forbund: string) => `Särskilt erbjudande för medlemmar i ${forbund}`,
    rabatt: (procent: number) => `${procent} % medlemsrabatt`,
    ordinarie: "Ordinarie",
    per: (period: string) => `per ${period}`,
    smsIngar: (antal: number, period: string | null) =>
      period ? `${antal} sms ingår per ${period}` : `${antal} sms ingår`,
    pafyllning: (pris: string) => `Fler sms: ${pris} styck`,
    smsNotis: "Ett långt sms kan räknas som flera.",
    ingarRubrik: "Det här ingår",
    ingar: [
      "Sms några dagar efter besöket",
      "Sms när det har gått länge sedan sist",
      "Egna sms när du har lediga tider",
      "Se vilka som bokar efter sms:et",
      "Sms ingår – köp fler när du vill",
    ],
    cta: "Kom igång",
    /** Knappen när en provperiod finns. */
    ctaProvperiod: (dagar: number) => `Testa gratis i ${dagar} dagar`,
    /** Det som sänker tröskeln, under priset (och i avslutningen). */
    trygghet: {
      bindning: "Ingen bindningstid – avsluta när du vill",
      provperiod: (dagar: number) => `Gratis i ${dagar} dagar`,
      provperiodSaknas: "Provperioden visas här när den är bestämd (sajt.pris.provperiodDagar).",
    },
    /**
     * "Räkna själv": besökarens eget pris per besök mot månadspriset. Ren
     * räkning – inget löfte om hur många som bokar. Visas bara när beloppen syns.
     */
    rakna: {
      rubrik: "Räkna själv",
      fraga: "Vad kostar ett besök hos dig?",
      enhet: "kr",
      resultat: (antal: number) =>
        antal === 1
          ? "Om en kund i månaden kommer tillbaka har Respark betalat sig."
          : `Om ${antal} kunder i månaden kommer tillbaka har Respark betalat sig.`,
      fotnot: "Ett räkneexempel med ditt eget pris, inget löfte om antal bokningar.",
      platshallare: "Här kan besökaren räkna på priset mot sitt eget pris per besök, när priset visas.",
    },
  },

  /**
   * Frågorna, ordnade efter vad en ny kund undrar mest. Svar som bygger på
   * något som inte är bestämt eller granskat är utkast (utkast: true) och
   * visas bara när platshållare är på.
   */
  fragor: {
    rubrik: "Vanliga frågor.",
    /** Under rubriken, när det finns ett telefonnummer eller en mejladress. */
    kontakt: (telefon: string | null, epost: string | null) =>
      telefon && epost
        ? `Hittar du inte svaret? Ring ${telefon} eller mejla ${epost}.`
        : telefon
          ? `Hittar du inte svaret? Ring oss på ${telefon}.`
          : epost
            ? `Hittar du inte svaret? Mejla oss på ${epost}.`
            : null,
    utkast: "Utkast",
    lista: [
      {
        fraga: "Måste jag byta bokningssystem?",
        svar: `Nej. Du bokar precis som i dag. ${p} använder bara listan över dina kunder.`,
      },
      {
        fraga: "Blir inte kunderna störda?",
        svar: "Du bestämmer när sms:en går ut och hur ofta. De är skrivna med dina ord och kundens namn, som om du hade skrivit dem själv.",
      },
      {
        fraga: "Hur får jag in mina kunder?",
        svar: [
          sajt.uppstartshjalp,
          "Du tar ut en lista över dina kunder från bokningssystemet, till exempel Bokadirekt, och lägger in den. Listan behöver namn, mobilnummer och när kunden var hos dig senast.",
        ]
          .filter(Boolean)
          .join(" "),
      },
      sajt.uppstartshjalp
        ? {
            fraga: "Behöver jag kunna något tekniskt?",
            svar: `Nej. ${sajt.uppstartshjalp} Sedan går sms:en ut av sig själva.`,
          }
        : {
            fraga: "Behöver jag kunna något tekniskt?",
            svar: "Internt utkast: svaret skrivs när det är bestämt vilken hjälp nya kunder får att komma igång (sajt.uppstartshjalp).",
            utkast: true,
          },
      ...(sajt.pris.ingenBindningstid
        ? [{ fraga: "Kan jag avsluta när jag vill?", svar: "Ja. Det finns ingen bindningstid." }]
        : []),
      {
        fraga: "Vad händer om sms:en tar slut?",
        svar: "Sms ingår, och du kan köpa fler när du vill. Hur många som ingår står här när priset är klart.",
      },
      {
        fraga: "Vad händer om en kund svarar på sms:et?",
        svar: "Internt utkast: behöver bekräftas i produkten – vart svaren tar vägen och om du får dem i mobilen.",
        utkast: true,
      },
      {
        fraga: "Får jag skicka sms till mina kunder?",
        svar: "Internt utkast: för befintliga kunder gäller ofta kundrelationsundantaget i marknadsföringslagen (19 §), om kunden har informerats och enkelt kan tacka nej i varje sms. Svaret ska granskas juridiskt och kopplas till integritetspolicyn innan det publiceras.",
        utkast: true,
      },
      {
        fraga: "Passar det mig?",
        svar: "Det passar dig vars kunder brukar komma tillbaka, som behandlare, kliniker, salonger och spa.",
      },
      {
        fraga: "Hur hanteras personuppgifter?",
        svar: "Internt utkast: vi behöver ta fram ett tydligt upplägg för personuppgiftshantering, ansvarsfördelning och reglerna för marknadsförings-SMS. Svaret skrivs om och hänvisar till integritetspolicyn när den är klar.",
        /** Utkast visas bara när visaPlatshallare är true. */
        utkast: true,
      },
    ] as { fraga: string; svar: string; utkast?: boolean }[],
  },

  /** Sektionen "Vi som står bakom" (sektioner/Team.tsx). */
  team: {
    rubrik: `Vi som står bakom ${p}.`,
    text: "Vill du hellre prata än läsa? Ring eller mejla oss, så svarar vi själva.",
    ring: (nummer: string) => `Ring ${nummer}`,
    mejla: "Mejla",
    /** Platshållare per person: vad som saknas i sajt.team. */
    saknas: (falt: string[]) => `Fylls i: ${falt.join(", ")}.`,
    falt: { roll: "roll", bild: "bild", telefon: "telefon" },
  },

  komIgang: {
    rubrik: "Dina kunder har redan hittat dig. Hjälp dem att hitta tillbaka.",
    text: "Börja med kundlistan du redan har.",
    cta: "Kom igång",
  },

  /** Knappraden längst ner på mobilen (sektioner/MobilKnappar.tsx). */
  mobilKnappar: { komIgang: "Kom igång", ring: "Ring oss" },

  sidfot: {
    /** Slogan överst i sidfoten – svensk version av "Bring your customers back." */
    rubrik: "Få tillbaka dina kunder.",
    rubrikProdukt: "Tjänsten",
    rubrikKontakt: "Kontakt",
    rubrikJuridik: "Villkor",
    integritet: "Integritetspolicy",
    villkor: "Användarvillkor",
    orgnr: (nummer: string) => `Org.nr ${nummer}`,
  },
};
