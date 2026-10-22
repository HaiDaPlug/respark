/**
 * ALL TEXT PÅ SIDAN – på ett ställe.
 *
 * Komponenterna hämtar sina texter härifrån, så copy kan ändras utan att
 * röra layouten. Produktnamnet kommer från src/konfig/sajt.ts.
 *
 * Skrivregler för sidan:
 * - Sälj resultatet (kunder som kommer tillbaka), inte tekniken (SMS).
 * - Lova aldrig bokningar, avkastning eller integrationer som inte finns.
 * - Skriv "bokningar efter utskick", aldrig att ett SMS orsakade en bokning.
 */
import { sajt } from "@/konfig/sajt";

const p = sajt.produktnamn;
const kund = sajt.kundcase.kund;

/** Ankarlänkar till sektionerna. Används av menyn, knappar och sidfoten. */
export const ankare = {
  saFungerarDet: "sa-fungerar-det",
  pris: "pris",
  fragor: "vanliga-fragor",
  komIgang: "kom-igang",
} as const;

export const texter = {
  meta: {
    /** Undertext i delningsbilden. */
    undertitel: "Fler återbesök för behandlare och salonger",
    titel: `${p} – Få tillbaka kunder som inte bokat på länge`,
    beskrivning:
      "Fler återbesök för behandlare, kliniker och salonger. Tidigare kunder får en personlig påminnelse när det gått ett tag, och du ser vilka som kommer tillbaka. Fungerar med ditt nuvarande bokningssystem.",
  },

  meny: {
    lankar: [
      { etikett: "Så fungerar det", href: `/#${ankare.saFungerarDet}` },
      { etikett: "Pris", href: `/#${ankare.pris}` },
      { etikett: "Vanliga frågor", href: `/#${ankare.fragor}` },
    ],
    cta: "Kom igång",
    loggaIn: "Logga in",
    oppna: "Öppna menyn",
    stang: "Stäng menyn",
  },

  hero: {
    /** Rubriken delas upp så att ordet "tillbaka" kan få sin understrykning. */
    rubrik: { fore: "Få", markerad: "tillbaka", efter: "kunder som inte bokat på länge." },
    ingress: "Tidigare kunder får en personlig påminnelse när det gått ett tag – helt automatiskt. Du ser vilka som kommer tillbaka.",
    primar: "Kom igång",
    sekundar: "Se hur det fungerar",
    punkter: ["Behåll ditt bokningssystem", "Igång med kundlistan du har"],
    partner: (forbund: string) => `Särskilt erbjudande för medlemmar i ${forbund}`,
    partnerLank: "Se medlemspriset",
  },

  /** Exempeldata i illustrationerna. Påhittade personer – inga riktiga kunder. */
  exempel: {
    etikett: "Exempelvy",
    avsandare: "Din verksamhet",
    bokningslank: "boka.dinverksamhet.se",
    sms: "Hej Anna! Det var ett tag sedan vi sågs. Välkommen att boka en ny tid hos oss.",
    kunder: [
      { initialer: "AL", namn: "Anna Lindqvist", senast: "12 mars" },
      { initialer: "JB", namn: "Johan Berg", senast: "3 februari" },
      { initialer: "SK", namn: "Sara Karlsson", senast: "28 januari" },
      { initialer: "ME", namn: "Mikael Ek", senast: "19 december" },
    ],
    status: { inaktiv: "Inte bokat på ett tag", skickat: "SMS skickat", bokat: "Bokat igen" },
    nyBokning: { titel: "Ny bokning", text: "Anna Lindqvist · tis 10:30", efter: "2 dagar efter SMS" },
    heroBeskrivning:
      "Exempel: Anna har inte bokat på ett tag. Hon får ett SMS med en länk till bokningen och bokar en ny tid.",
  },

  problem: {
    rubrik: "Du har redan kunderna. Men alla kommer inte tillbaka av sig själva.",
    text: "Många vill komma tillbaka. Det som saknas är en påminnelse i rätt tid.",
    /**
     * Före/efter som två animerade scener (illustrationer/ForeEfter.tsx).
     * Korta etiketter – bilden ska bära budskapet, inte texten. "noder" är
     * etiketterna längs vägen i ordning, "slut" visas vid kunden.
     */
    fore: {
      etikett: "Före",
      titel: "För hand",
      noder: ["Kundlistan", "Leta i listan", "Skriv varje SMS", "Glöms bort"],
      slut: "Kom aldrig tillbaka",
      sammanfattning: "Tar tid – och blir sällan av.",
      beskrivning:
        "Före: från kundlistan måste du leta i listan och skriva varje SMS själv, och till slut glöms det bort. Kunden kom aldrig tillbaka.",
    },
    efter: {
      etikett: "Efter",
      titel: `Med ${p}`,
      noder: ["Kundlistan", "Automatisk påminnelse"],
      slut: "Kan boka direkt",
      sammanfattning: "Ställ in en gång. Resten sköts automatiskt.",
      beskrivning: `Efter: med ${p} går en påminnelse ut automatiskt till kunderna i listan, och kunden kan boka en ny tid direkt.`,
    },
  },

  saFungerarDet: {
    rubrik: "Tre steg till fler återbesök.",
    /** Samma ordning som vyerna i illustrationer/StegVyer.tsx (STEGVYER). */
    steg: [
      {
        titel: "Ladda upp kundlistan",
        text: "Ta ut den ur bokningssystemet du redan har. Inget att byta, inget att koppla ihop.",
      },
      {
        titel: "Välj när kunderna ska påminnas",
        text: "Till exempel efter tre månader utan bokning. Sedan går påminnelserna ut av sig själva.",
      },
      {
        titel: "Se vilka som kommer tillbaka",
        text: "Du ser vilka som har bokat efter varje utskick.",
      },
    ],
    /** Stegraden överst på mobil: "Steg 2 av 3". */
    stegAv: (nr: number, antal: number) => `Steg ${nr} av ${antal}`,
  },

  /** Visas bara när sajt.video.url är ifylld. */
  video: {
    rubrik: "Hellre se än läsa?",
    text: `En kort film om hur ${p} fungerar.`,
  },

  kundcase: {
    rubrik: "Byggt utifrån ett verkligt behov.",
    text: `Allt började hos ${kund}. Systemet vi byggde åt dem är grunden till ${p}.`,
    /** Fakta som redan finns i Khytes publicerade case. */
    ursprung: [
      { titel: "Behovet", text: "Fler tidigare patienter tillbaka – utan påminnelser för hand" },
      { titel: "Lösningen", text: "Ett system för kundlistan, påminnelserna och uppföljningen av bokningar" },
      { titel: "Nästa steg", text: `${p} – samma grund, för fler verksamheter` },
    ],
    /** En samlad platshållare som räknar upp det som saknas. */
    platshallare: {
      inledning: "Fylls i före lansering, med kundens godkännande:",
      citat: "citat",
      logotyp: "logga",
      skarmbild: "skärmbild från produkten",
      resultat: "verifierade resultat",
    },
    resultatEtikett: "Resultat",
  },

  pris: {
    rubrik: "Ett enkelt pris.",
    text: "Allt du behöver för fler återbesök – i ett paket.",
    /** Kort rad under planens namn. */
    beskrivning: "För behandlare, kliniker och salonger.",
    /** Visas i stället för beloppet när sajt.pris.visning är "dold". */
    dold: {
      rubrik: "Pris kommer snart",
      text: "Ett pris, inga tillval att jämföra.",
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
      period ? `${antal} SMS ingår per ${period}` : `${antal} SMS ingår`,
    pafyllning: (pris: string) => `Extra SMS: ${pris} per SMS-del`,
    smsNotis: "Ett SMS kan bestå av flera debiterbara delar beroende på längd och vilka tecken som används.",
    ingarRubrik: "Det här ingår",
    ingar: [
      "Automatiska påminnelser till tidigare kunder",
      "Egna utskick när du har lediga tider",
      "Se vilka som kommer tillbaka efter varje utskick",
      "Import av kundlistan från ditt bokningssystem",
      "SMS ingår – fyll på när du behöver",
    ],
    cta: "Kom igång",
  },

  fragor: {
    rubrik: "Bra att veta innan du börjar.",
    /** Visas under rubriken bara när sajt.kontaktEpost är ifylld. */
    kontakt: (epost: string) => `Hittar du inte svaret? Mejla oss på ${epost}.`,
    utkast: "Utkast",
    lista: [
      {
        fraga: "Måste jag byta bokningssystem?",
        svar: `Nej. Du tar emot bokningar precis som i dag. ${p} använder bara kundlistan du redan har.`,
      },
      {
        fraga: "Hur får jag in mina kunder?",
        svar: "Du tar ut kundlistan ur ditt bokningssystem och laddar upp filen. Från till exempel Bokadirekt går det bra, så länge filen innehåller namn, mobilnummer och senaste besök.",
      },
      {
        fraga: "Kan jag skicka egna utskick?",
        svar: "Ja. Utöver de automatiska påminnelserna kan du skicka egna utskick, till exempel när du har lediga tider.",
      },
      {
        fraga: "Hur vet jag vilka som kommer tillbaka?",
        svar: "Du ser vilka som har bokat efter ett utskick. Hur komplett bilden blir beror på hur aktuell bokningsdatan är.",
      },
      {
        fraga: "Vad händer när SMS:en tar slut?",
        svar: "SMS ingår, och du kan fylla på när du behöver. Exakta villkor publiceras när priset är fastställt.",
      },
      {
        fraga: "Passar det min verksamhet?",
        svar: "Det är gjort för verksamheter där kunderna kommer tillbaka med jämna mellanrum – behandlare, kliniker, salonger och spa.",
      },
      {
        fraga: "Hur hanteras personuppgifter?",
        svar: "Internt utkast: vi behöver ta fram ett tydligt upplägg för personuppgiftshantering, ansvarsfördelning och reglerna för marknadsförings-SMS. Svaret skrivs om och hänvisar till integritetspolicyn när den är klar.",
        /** Utkast visas bara när visaPlatshallare är true. */
        utkast: true,
      },
    ],
  },

  komIgang: {
    rubrik: "Dina kunder har redan hittat dig. Hjälp dem att hitta tillbaka.",
    text: "Börja med kundlistan du redan har.",
    cta: "Kom igång",
  },

  sidfot: {
    /** Slogan överst i sidfoten – svensk version av "Bring your customers back." */
    rubrik: "Få tillbaka dina kunder.",
    beskrivning: "Fler återbesök för tidsbokade verksamheter – med automatiska påminnelser till tidigare kunder.",
    rubrikProdukt: "Tjänsten",
    rubrikKontakt: "Kontakt",
    rubrikJuridik: "Villkor",
    integritet: "Integritetspolicy",
    villkor: "Användarvillkor",
  },
};
