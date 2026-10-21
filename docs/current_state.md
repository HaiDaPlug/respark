# Respark – landningssida: nuläge

Senast uppdaterad: 2026-10-21

One-page-landningssida för Respark: tidigare kunder får automatiska
påminnelser, och verksamheten ser vilka som kommer tillbaka. Den här
kodbasen är bara landningssidan. Själva produkten ligger i ett annat repo.

**Stack:** Next.js 16.4 (App Router, Cache Components), TypeScript strict,
Tailwind v4, Motion 14, Lucide. Ingen databas och inget API – sidan är helt
statisk.

**Status:** Verifierad lokalt men **inte publicerad**. Sidan visar
platshållare och indexeras inte förrän punkterna i
[Före publicering](#före-publicering) är klara.

> **Repot är publikt.** Interna anteckningar (beslut, siffror som inte är
> verifierade, prisresonemang, kundkontakter, godkännanden och
> varumärkesfrågor) skrivs bara i `docs/intern.md`. Den filen finns lokalt
> och står i `.gitignore`.

## Kom igång

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # enhetstester (Vitest)
npm run lint
npm run build && npm run start   # produktionsläge
```

Förbundslänken kan testas lokalt med `http://localhost:3000/?partner=demo`.
Demoförbundet fungerar bara med `npm run dev`, aldrig på den publicerade sidan.

## Var saker finns

| Vad | Fil |
| --- | --- |
| **Allt som ändras ofta:** namn, färger, pris, länkar, förbund, kundcase, video, flaggor | `src/konfig/sajt.ts` |
| All text på sidan | `src/innehall/texter.ts` |
| Designsystemet (färgtoken, typografi, skuggor, animationer) | `src/app/globals.css` |
| Sektionerna, i sidordning | `src/komponenter/sektioner/` (ordningen styrs i `src/app/page.tsx`) |
| Produktillustrationerna (exempelvyer) och före/efter-scenerna (`ForeEfter.tsx`) | `src/komponenter/illustrationer/` |
| Knappar, behållare, rubriker, platshållare | `src/komponenter/ui/` |
| **Loggan**: `Logga` (gnista + ord), `Gnista` (bara märket), `Ordmarke` (menystorlek). Konturerna ligger i `gnistaData.ts` och `loggaOrdData.ts` (genererade). SVG-text till delningsbild och hemskärmsikon: `loggaSvg.ts` | `src/komponenter/ui/` |
| Favicon (gnistan) och hemskärmsikon | `src/app/icon.svg`, `src/app/apple-icon.tsx` |
| Logik med tester: förbund och pris. Vart "Kom igång" leder: `lankar.ts` | `src/lib/` |
| Utkast till integritetspolicy och villkor | `src/app/integritetspolicy/`, `src/app/villkor/` |
| Delningsbild, robots, sitemap | `src/app/opengraph-image.tsx`, `robots.ts`, `sitemap.ts` |

## Sidans uppbyggnad

Varje sektion har ett eget jobb och förklarar inte flödet igen: vad du får →
känner du igen problemet → hur det fungerar → finns det på riktigt → vad det
kostar → frågor → kom igång. Budskapet är återbesök, inte SMS.

1. **Meny**: fast, genomskinlig överst. Under 1024 px blir länkarna en meny bakom en knapp (Escape stänger, sidan bakom scrollar inte).
2. **Hero**: rubrik "Få tillbaka kunder som inte bokat på länge." och en loopande illustration: Anna markeras i kundlistan, ett SMS går till hennes telefon, "Ny bokning" dyker upp och statusen blir "Bokat igen". Den pausar när den inte syns och står i slutläget vid reducerad rörelse.
3. **Problem**: före/efter som två animerade scener (`ForeEfter.tsx`) med en pil emellan (nedåt på mobil). Korten ligger bredvid varandra från 1024 px, annars staplade. Scenerna loopar bara när de syns och står i ett stillbildsläge vid reducerad rörelse.
4. **Så fungerar det**: tre steg som styrs av scrollen. Desktop (`StegScroll.tsx`): innehållet fastnar under menyn, steget byts medan man scrollar, linjen mellan numren fylls och produktvyn tonar över. Klick eller Enter på ett steg scrollar dit. Mobil och surfplatta (`StegTidslinje.tsx`): stegen staplade, med en stegrad som fastnar under menyn och fylls i takt med scrollen.
5. **Video**: syns bara när `video.url` är satt. Ingen platshållare.
6. **Kundcase**: berättelsen om var systemet började, som en tidslinje (behovet → lösningen → nästa steg). Citat, logga, skärmbild och resultat visas först när de finns i konfigurationen. Det som saknas räknas upp i en enda platshållare.
7. **Pris**: ett rent, tvåspaltigt priskort i SaaS-stil (plan, pris och knapp till vänster, det som ingår till höger). Beloppen är dolda tills vidare ("Pris kommer snart").
8. **Vanliga frågor**: dragspel. Utkastsvar visas bara när platshållare är på. Raden "Mejla oss på …" visas bara när `kontaktEpost` är ifylld.
9. **Kom igång**: mörk avslutning med rubrik och en enda knapp, utan formulär.
10. **Sidfot**: sandfärgad yta med slogan, länkkolumner och en rad med ©. Allra längst ner ligger loggan i full bredd, upp till 100rem, som en signatur. Den stora loggan är dekor (aria-hidden), eftersom namnet står i raden ovanför.

## Designsystem

- **Färger** (i `sajt.farger`, blir CSS-variabler på `<html>`): bakgrund `#FAF8F5`, yta `#FFFFFF`, sand `#F2EDE7`, text `#292522`, sekundär text `#6B625C`, accent (kamel) `#A98463`, mörk accent (kaffebrun) `#86603F` för text och knappar i accentfärg. Linjer, ljus accent och skuggor räknas fram ur dessa med `color-mix`, så det räcker att ändra konfigurationen. **Kontrollera kontrasten om en färg byts.** Uppmätt: vit text på knapp 5,6:1, accenttext på bakgrund 5,3:1 och på `accent-soft` 4,6:1. Den ljusa accentytan (`accent-soft`) är 18 % accent, annars försvinner den mot sand.
- **Orange finns bara i loggan.** Gränssnittets accent är beige-brun.
- **Typsnitt:** Manrope för rubriker och Inter för brödtext, via `next/font`.
- **Skala:** `text-display` (max 3,5rem), `text-h2` (max 2,5rem), `text-h3` och `text-lead` skalar flytande mellan mobil och desktop. Sektionerna har `py-16 sm:py-20`. **Målet är att varje sektion syns uppifrån och ned på en laptopskärm (1280×720).**
- **Djup utan nya färger:** beige ytor som mörknar svagt nedåt (`yta-beige`), ett fint korn (`korn`), beige kort mot off-white bakgrund och djupare skuggor (`shadow-djup`). Accenten används i små, solida doser: primärknappar, stegnumren och ordet "tillbaka" i heron. **Blanda inte accenten med vitt i stora ytor** – med en varmare accent blir det rosa. Mörkt används bara i avslutningen "Kom igång".
- **Former:** mjuka hörn (kort 24–32 px), knappar som piller och varma skuggor (`shadow-kort`, `shadow-lyft`, `shadow-telefon`).
- **Knappar:** beige-brun primärknapp ("Kom igång", hover `accent-djup`) och ljus sekundärknapp med kant ("Se hur det fungerar"). Inga andra knapptyper.

## Så styr du sidan

Allt nedan görs i `src/konfig/sajt.ts`.

- **Produktnamn:** `produktnamn`. Slår igenom i texter, metadata och delningsbild. Loggan är en bild och byts separat (se Var saker finns).
- **Pris:** `pris.visning`:
  - `"dold"` (nu): inga belopp, bara "Pris kommer snart".
  - `"preliminar"`: beloppen visas med etiketten "Preliminärt pris", för intern granskning.
  - `"bekraftad"`: slutgiltigt. Knappen går till `lankar.betalning` om den är satt, annars till registreringen.
  - Belopp, period, moms, antal SMS och påfyllningspris ligger bredvid. Belopp och antal SMS är 0 tills de är beslutade. Påfyllningen visas bara när den inte är `null`.
- **Förbund:** lägg till i `partners` och dela länken `domän/?partner=slug`. Sidan visar då "Särskilt erbjudande för medlemmar i …" i heron och medlemspriset (ordinarie pris minus `rabattProcent`) i priskortet. Sätt `aktiv: true` först när samarbetet är bekräftat. Ingen rabattkod fungerar automatiskt, eftersom det inte finns något rabattsystem än. Lägg därför förbundets rabatt i en egen betallänk (`betalningslank`).
- **Kom igång:** `lankar.komIgang` är registreringslänken i produkten (i dag `null`). Utan länk leder menyn, heron och avslutningen till prisdelen, och priskortet visar en platshållare i stället för en knapp.
- **Betalning (Stripe):** enklast är en Stripe Payment Link i `lankar.betalning` (och per förbund i `betalningslank`, gärna med rabattkod). Ingen backend behövs. Den används bara när priset är `"bekraftad"`.
- **Kundcase:** `kundcase.citat`, `logotyp`, `skarmbild` och `resultat`. Fyll bara i godkänt och verifierat material.
- **Video:** `video.url` tar en YouTube-, Vimeo- eller mp4-länk.
- **Flaggor:** `visaPlatshallare` (sätt `false` före lansering) och `indexera` (sätt `true` vid lansering).

Det finns ingen intresseanmälan. "Kom igång" leder till registreringen, som på
vanliga SaaS-sidor, och sidan behöver inga miljövariabler.

## Verifierat

- `npm test` (förbund och medlemspris), `npm run lint`, `tsc` och `npm run build` utan fel. Allt förrenderas statiskt, även favicon, hemskärmsikon och delningsbild.
- axe-core: 0 fel i desktop och mobil.
- Klicktest i Chrome (Playwright): menylänkar, mobilmenyn (öppna, länk, Escape, scrollspärr), stegen (klick och Enter scrollar till rätt steg, `aria-current` följer med), frågorna, reducerad rörelse (scenerna står stilla i slutläget) och "Hoppa till innehållet" som första tabbstopp.
- Förbundslänken (`?partner=demo`, okänd slug) och prislägena `"dold"` och `"preliminar"` provade i dev.
- Skärmbilder i 390, 1280 och 1440 px utan sidledsscroll eller konsolfel. Sektionshöjderna är uppmätta i 1440×900, 1280×720 och 390×844.

**Inte testat:** riktig iPhone/Android, Safari och Firefox (särskilt sticky och scrollstyrningen) och publicering på Vercel.

## Före publicering

- [ ] Slutligt produktnamn och varumärkeskontroll
- [x] Riktig logotyp (spårad från PNG). Byt gärna till formgivarens original-SVG om den finns.
- [ ] Domän i `doman`
- [ ] Pris, betalningsperiod och moms beslutade → `pris.visning: "bekraftad"`
- [ ] Antal SMS som ingår och pris för påfyllning (verifiera operatörens kostnad och hur SMS-delar räknas)
- [ ] Stripe: Payment Link i `lankar.betalning`
- [ ] Riktig kontaktadress i `kontaktEpost`
- [ ] Kundens godkännande för kundcaset (namn och ev. citat, logga och skärmbild)
- [ ] Bara verifierade och godkända resultat i `kundcase.resultat`
- [ ] Integritetspolicy och villkor skrivna (och gärna juridiskt granskade), personuppgiftsbiträdesavtal för kundernas data, svaret i FAQ om personuppgifter omskrivet
- [ ] Avregistrering från SMS (t.ex. svara STOPP) finns i produkten. Lägg då till raden i exempel-SMS:en
- [ ] Illustrationerna stämmer med produkten (uppföljningssteg, bokningsuppföljning)
- [ ] **Registreringslänken i `lankar.komIgang`**. Utan den finns ingen knapp i priskortet, och "Kom igång" leder bara till priset.
- [ ] `visaPlatshallare: false` och `indexera: true`
- [ ] Testa på riktig iPhone och Android

## Medvetna val och kända begränsningar

- **Dev-servern kan fastna på gammal CSS** när globals.css ändras (Turbopack-cache). Nya klasser saknas då, och sidan ser halvt uppdaterad ut. Starta om `npm run dev`. Hjälper inte det, kör `rm -rf .next/dev` först. Produktionsbygget påverkas inte.
- **Ärlighet först:** inga påhittade kunder, citat eller resultat. Alla produktbilder är märkta "Exempelvy" med påhittade namn. Illustrationerna visar **inga resultatsiffror** (antal SMS, antal bokningar, procent eller stigande kurvor), eftersom sådana läses som en utlovad träffsäkerhet även i en exempelvy. Resultat visas som vilka som bokade efter ett utskick. Texten säger "bokningar efter utskick", aldrig att ett SMS orsakade en bokning. Ingen garanti om bokningar per SMS.
- **Förbund läses i webbläsaren:** sidan är statisk, så förbundets namn dyker upp direkt efter laddning (en kort blinkning). Det håller sidan snabb.
- **Tailwind-klasser krockar:** det finns ingen tailwind-merge. Skicka därför aldrig `hidden`/`flex` eller `max-w-*` som `className` till en komponent som redan sätter dem. Slå in i en `div`, eller använd `Behallare`s `bredd`.
- **Animera aldrig höjd eller bredd:** använd transform (`scaleX`/`scaleY`). Höjdanimationer flyttar layouten, och då avbryter webbläsaren besökarens mjuka scroll (scroll-ankring).
- **Serverkomponenter kan inte läsa listor eller konstanter från "use client"-filer.** Därför används `STEGVYER` bara i klientkomponenterna `StegScroll` och `StegTidslinje`.
- **Scrollstyrda steg (desktop):** `SCROLL_PER_STEG_VH` (38) i `StegScroll.tsx` styr hur långt man scrollar per steg. Lägre värde betyder snabbare byten. Spåret är skärmhöjden plus antal steg × 38vh, och innehållet fastnar vid `top-24`. Ändras det, ändra också `STICKY_TOPP_PX` (96). All text syns hela tiden och bara bakgrund och färg byts, så ingen höjd ändras medan man scrollar.
- **Före/efter-scenerna** drivs av en klocka per scen (0 → 1 i en loop) som bara går när scenen syns. Vägarna räknas fram matematiskt (Catmull–Rom), så punktens läge läses aldrig från DOM:en och fungerar vid serverrendering. Noder och etiketter är HTML placerad med procent, så scenen har fast bildformat (8:5). **Låt inte text stå halvgenomskinlig i längre stunder** (axe larmar om kontrasten). Därför tonas kunden i före-scenen över till en streckad kontur utan text i stället för att blekna.
- **SMS-tecken:** ett tankstreck (–), typografiska citattecken eller emoji gör hela SMS:et till UCS-2 (70 tecken per del i stället för 160) och kan nästan fördubbla kostnaden. Bra att veta för produktens SMS-editor.
- **Loggan är spårad från en PNG** (potrace på en 4× förstorad bild, med bildens genomskinlighet som täckning). Bladens färgövergångar är uppmätta i originalet. Konturerna ligger i `gnistaData.ts` (märket) och `loggaOrdData.ts` (ordet). De är uppdelade så att klientkomponenter som bara visar gnistan inte drar med sig ordets ~10 kB. Kommer en ny logga är det enklast att få den som SVG och ersätta konturerna. **Färgövergångarna behöver unika id:n** (`useOvergangsId`), eftersom loggan finns flera gånger på sidan.
- **Menyn får loggan som prop** (`<Navigering logga={<Ordmarke />} />`). Menyn är en klientkomponent, och så hamnar inte loggans konturer i dess JavaScript.
- **Cache Components** är på (Next 16-standard). Aktuell tid får inte läsas vid förrendering, så årtalet i sidfoten hämtas med `"use cache"`.

## Idéer till nästa steg

- Kort förklaringsvideo (ca 25 s): lista → påminnelse → kunden bokar → vilka som kom tillbaka. Lägg länken i `video.url`, så visas sektionen.
- Egna partnersidor (`/medlem/förbund`) om förbunden vill ha en egen länk att dela.
- Riktiga skärmbilder från produkten bredvid exempelvyerna när produktens gränssnitt är klart.
- Enkel analys (t.ex. Vercel Analytics) för att mäta klick på "Kom igång" per förbund.
