# Respark – landningssida: nuläge

Senast uppdaterad: 2026-10-24

One-page-landningssida för Respark: tidigare kunder får automatiska
påminnelser, och verksamheten ser vilka som kommer tillbaka. Den här
kodbasen är bara landningssidan. Själva produkten ligger i ett annat repo.

**Stack:** Next.js 16.4 (App Router, Cache Components), TypeScript strict,
Tailwind v4, Motion 14, Lucide. Ingen databas och inget API – sidan är helt
statisk.

**Status:** Verifierad lokalt men **inte publicerad**. Sidan visar
platshållare och indexeras inte förrän punkterna i
[Före publicering](#före-publicering) är klara.

**Nya sidan (gjord 2026-10-22–23 på grenen `hero-editorial`) ligger i `main` sedan 2026-10-24:** en ny hero över
hela skärmen, en berättelse som börjar med besökarens problem och en
editorial stil på resten av sidan. Se
[Editorial omgörning](#editorial-omgörning-gren-hero-editorial).

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
| Heronas scen (`HeroScen.tsx`), kundens SMS i telefonen (`KundSms.tsx`) och produktillustrationerna (exempelvyer) | `src/komponenter/illustrationer/` |
| Knappar, behållare, rubriker, platshållare | `src/komponenter/ui/` |
| **Loggan** (gnista + svart ord): `Logga` (gnista + ord), `Gnista` (bara märket), `Ordmarke` (menystorlek). Konturerna ligger i `gnistaData.ts` och `loggaOrdData.ts` (genererade från `public/logos/respark-logga-svart.png`). SVG-text till delningsbild och hemskärmsikon: `loggaSvg.ts` | `src/komponenter/ui/` |
| Loggans originalfiler (PNG): `respark-logga-svart.png` (gnista + svart ord, den som används), `respark-logga-vit.png` (gnista + vitt ord), `respark-ord-svart.png` och `respark-ord-vit.png` (bara ordet), `respark-gnista.png` (bara märket) | `public/logos/` |
| Favicon (gnistan) och hemskärmsikon. `favicon.ico` (16/32/48 px, renderad från `icon.svg`) behövs för Safari och äldre webbläsare | `src/app/icon.svg`, `src/app/favicon.ico`, `src/app/apple-icon.tsx` |
| Logik med tester: förbund och pris. Vart "Kom igång" leder: `lankar.ts`. Startsidans intro: `intro.ts` | `src/lib/` |
| Kundcasets bilder (Osteopaticentrums logga, Mattias Hietalas porträtt) | `public/kundcase/` |
| Utkast till integritetspolicy och villkor | `src/app/integritetspolicy/`, `src/app/villkor/` |
| Delningsbild, robots, sitemap | `src/app/opengraph-image.tsx`, `robots.ts`, `sitemap.ts` |

## Sidans uppbyggnad

Varje sektion har ett eget jobb och förklarar inte flödet igen: vad du får →
känner du igen problemet → hur det fungerar → finns det på riktigt → vad det
kostar → frågor → kom igång. Budskapet är återbesök, inte SMS. Sektionerna
börjar direkt med sin rubrik, utan överrubriker (borttagna 2026-10-21).

0. **Intro** (bara startsidan, `src/lib/intro.ts`): först syns bara telefonen mitt på skärmen medan påminnelsen plingar in. Sedan glider telefonen till sin plats och rubriken kommer in ord för ord (uppåt, från oskärpa), och sist tonas menyn och "Läs vidare" in. Hela introt tar knappt 4 sekunder. Det hoppas över vid länk till en sektion (`/#pris`), när besökaren kommer från en annan sida på sajten, vid reducerad rörelse och om sidan redan är nedscrollad. Scroll eller tangenttryck under introt visar allt direkt. Det spelas vid vanligt besök och vid omladdning.
1. **Meny**: fast, genomskinlig överst. Under 1024 px blir länkarna en meny bakom en knapp (Escape stänger, sidan bakom scrollar inte).
2. **Hero**: över hela skärmen. Början på en berättelse: rubriken "Dina kunder har *inte glömt* dig." stor nere till vänster (`text-hero`), en rad som säger vad tjänsten är ("Automatiska sms-påminnelser för behandlare, kliniker och salonger.", `texter.hero.kategori`) och "Läs vidare ↓". Inga knappar ("Kom igång" finns i menyn och i mobilens knapprad). Bakgrunden (`yta-hero`) är ljus beige upptill och tonar över i sidans bakgrund nedtill, så att det inte blir någon skarv. Till höger (ovanför rubriken på mobil) en telefon med mörk låsskärm (`HeroScen.tsx`). **En gång** när sidan öppnas flyger tre gnistspår i loggans färger in i telefonen, gnistan blixtrar till med en liten skur och en ring, telefonen vibrerar och SMS-notisen ("Din verksamhet – Hej Anna! …") fälls ned med en studs. Ingen loop. Vid reducerad rörelse visas notisen direkt, utan spår.
3. **Problem** (`Problem.tsx`, ankare `#varfor`): berättelsens fortsättning, "De vill komma tillbaka. Sedan kommer vardagen emellan." Sedan en tidslinje över fyra veckor (vecka 1, 3, 6 och 10): kunden är nöjd och tänker boka, veckorna fylls med jobb, familj och vardag, "Boka ny tid" stryks över ("Skjuts upp") och är till slut "Bortglömd". Korten kommer in ett i taget när de scrollas fram. Fyra kolumner från 1024 px, två från 640 px, annars staplade. Bygger på kundcaset. Ersatte före/efter-scenerna (`ForeEfter.tsx`, i git-historiken) 2026-10-22.
3b. **Vad Respark gör** (`Losning.tsx`): "De behöver bara en påminnelse i rätt tid." (andra halvan av heronas berättelse) med beskrivningen: personliga SMS automatiskt, några dagar efter besöket eller när det gått en tid, vid de tidpunkter du väljer. Till vänster kundens riktiga SMS i en telefon (`KundSms.tsx`, från `sajt.kundcase.sms`, "Riktigt meddelande från Osteopaticentrum, fiktivt patientnamn"), till höger tre poänger med tunna linjer: Rätt tidpunkt, Din egen röst, Ingen faller mellan stolarna. Sist jämförelsen i en blick: "Ditt bokningssystem – påminner inför bokade tider" + "Respark – påminner dem som inte har bokat", och "Du behåller allt du har. Respark tar hand om resten." (`texter.losning.jamforelse`).
4. **Så fungerar det**: tre steg som styrs av scrollen, numrerade "01–03" och åtskilda av tunna linjer (inga rutor). Desktop (`StegScroll.tsx`): innehållet fastnar under menyn, steget byts medan man scrollar, linjen ovanför det aktiva steget fylls från vänster och produktvyn tonar över. Klick eller Enter på ett steg scrollar dit. Mobil och surfplatta (`StegTidslinje.tsx`): stegen staplade, med en stegrad som fastnar under menyn och fylls i takt med scrollen.
5. **Video**: syns bara när `video.url` är satt. Ingen platshållare.
6. **Kundcase**: "Mer än en fylld kalender. *Det handlar om förtroende.*" med Osteopaticentrums logga och en mening till höger. Resultaten som stora siffror (22 bokningar inom 30 dagar efter att patienten fått ett SMS, med en ruta per bokning som dyker upp när de scrollas fram, och 297 patienter som fick en uppföljning, mätt t.o.m. 21 oktober 2026) och Mattias Hietalas citat med bild. Citatet är kortat 2026-10-24: första meningen ("Som terapeut är det viktigt …") är borttagen, resten står ordagrant. Allt kommer från `sajt.kundcase`. Det som saknas räknas upp i en enda platshållare (just nu inget). Raden med knappen sist i sektionen ("Vill du ha det här hos dig?" + Kom igång + "Prata med oss") är borttagen 2026-10-24, så sektionen slutar med citatet.
7. **Pris**: ett rent, tvåspaltigt priskort i SaaS-stil (plan, pris och knapp till vänster, det som ingår till höger). Priset: 695 kr per månad exkl. moms, 100 sms ingår och upp till 25 oanvända sparas till nästa månad. Under priset: provperioden (när `pris.provperiodDagar` är satt, annars en platshållare) och "Ingen bindningstid – avsluta när du vill" (`pris.ingenBindningstid`). Knappen heter "Testa gratis i N dagar" när det finns en provperiod.
7b. **Vi som står bakom** (`Team.tsx`, ankare `#kontakt`): kort för Erik och Hai med bild (annars initial), roll, telefon (ring-länk) och mejl från `sajt.team`. Det som saknas räknas upp i en platshållare per person. Sektionen och alla länkar dit ("Kontakt" i menyn och sidfoten) döljs om ingen har kontaktuppgifter och platshållare är av (`visaKontakt()` i `src/lib/lankar.ts`).
8. **Vanliga frågor**: rubriken överst och frågorna i stor typ över hela bredden (dragspel). Utkastsvar visas bara när platshållare är på. Raden "Mejla oss på …" visas bara när `kontaktEpost` är ifylld. Ordnade efter vad en ny kund undrar mest. Nya 2026-10-23: "Blir inte kunderna störda?", "Kan jag avsluta när jag vill?" och tre utkast som väntar på beslut eller granskning: "Behöver jag kunna något tekniskt?" (uppstartshjälpen), "Vad händer om en kund svarar på sms:et?" (produkten) och "Är det tillåtet att skicka påminnelser?" (juridisk granskning). Under rubriken står telefon och/eller mejl när de finns.
9. **Kom igång**: mörkt band över hela bredden med lika stor rubrik som heron, en tunn linje och sedan ingressen och en enda knapp, utan formulär. Under texten trygghetsraderna (provperiod, ingen bindningstid) och "Ring oss" när det finns ett nummer.
10. **Sidfot**: sandfärgad yta med slogan, länkkolumner och en rad med ©. Allra längst ner ligger loggan i full bredd, upp till 100rem, som en signatur. Den stora loggan är dekor (aria-hidden), eftersom namnet står i raden ovanför. Kontaktkolumnen visar telefon och mejl när de finns, och raden med © bolagets namn och organisationsnummer (`sajt.foretag`).
11. **Knappraden på mobil** (`MobilKnappar.tsx`, under 1024 px): "Kom igång" och "Ring oss" (när det finns ett nummer) längst ner. Syns när heron är förbi och försvinner när avslutningen kommer fram. Dold rad är `inert`.

## Designsystem

- **Färger** (i `sajt.farger`, blir CSS-variabler på `<html>`): bakgrund `#FAF8F5`, yta `#FFFFFF`, sand `#F2EDE7`, text `#292522`, sekundär text `#5E5650` (mörkare sedan 2026-10-23, 6,8:1 mot bakgrunden), accent (kamel) `#A98463`, mörk accent (kaffebrun) `#86603F` för text och knappar i accentfärg. Linjer, ljus accent och skuggor räknas fram ur dessa med `color-mix`, så det räcker att ändra konfigurationen. **Kontrollera kontrasten om en färg byts.** Uppmätt: vit text på knapp 5,6:1, accenttext på bakgrund 5,3:1 och på `accent-soft` 4,6:1. Den ljusa accentytan (`accent-soft`) är 18 % accent, annars försvinner den mot sand.
- **Orange finns bara i loggan.** Gränssnittets accent är beige-brun.
- **Rytm och djup (2026-10-23):** sektionerna växlar botten i stället för att alla är ljusa: hero (ljus beige) → tidslinjen på **sandband** (`bg-sand`, vita kort) → ljust → kundcaset på ett **djupt skogsgrönt band** (`bg-framgang-djup`, vit text, vita rutor med grön bock, `Bokningsrutor ljus`, loggan på en vit bricka, ljust grönt sken och korn) → ljust → priset på **sandband** → ljust → avslutningen mörk (`bg-ink`) → sidfoten sand. Det gröna bandet är sidans tyngdpunkt (beviset) och den enda stora gröna ytan.
- **Tre färgroller sedan 2026-10-23:** knapparna är nästan svarta (`bg-knapp`, textfärgen; var beige-bruna och smälte in). Beige-brunt är märkesfärgen i rubrikerna ("inte glömt", "Det handlar om förtroende.") och i små detaljer (ikoner, stegnummer, linjer). **Djup skogsgrön `#2F6B4F` (`sajt.farger.framgang`, `text-framgang`, `bg-framgang`, `bg-framgang-soft`, `text-framgang-ljus`) är den enda markeringsfärgen och betyder alltid "det blev bra"**: statusen "Bokat igen", bockarna för det som ingår och trygghetsraderna, siffran 22 och rutorna i kundcaset, "Klar" och de hittade kolumnerna i produktvyerna och "Nöjd efter besöket" i tidslinjen. Aldrig på knappar, och som stor yta bara i kundcasets band (den mörka varianten `framgang-djup`). Kontrast 5,9:1 mot bakgrunden.
- **Typsnitt:** Manrope för rubriker och Inter för brödtext, via `next/font`.
- **Skala:** `text-hero` (heron och avslutningen, max 6,25rem, begränsad även av skärmhöjden med `10.5svh`), `text-display` (max 3,5rem), `text-h2` (max 3,4rem sedan 2026-10-22, förut 2,5rem), `text-h3` och `text-lead` skalar flytande mellan mobil och desktop. De flesta sektioner har `py-16 sm:py-24`. **Målet är att varje sektion syns uppifrån och ned på en laptopskärm (1280×720).**
- **Editorial stil (gren `hero-editorial`):** stora rubriker, gärna med kort ingress nere till höger (`Sektionsrubrik delad`), tunna linjer (`border-line-strong`) och siffror ("01") i stället för rutor och brickor. Ingen text i två spalter bredvid varandra.
- **Djup utan nya färger:** beige ytor som mörknar svagt nedåt (`yta-beige`), ett fint korn (`korn`), beige kort mot off-white bakgrund och djupare skuggor (`shadow-djup`). Accenten används i små, solida doser: primärknappar, stegnumren och ordet "tillbaka" i heron. **Blanda inte accenten med vitt i stora ytor** – med en varmare accent blir det rosa. Mörkt används bara i avslutningen "Kom igång".
- **Former:** mjuka hörn (kort 24–32 px), knappar som piller och varma skuggor (`shadow-kort`, `shadow-lyft`, `shadow-telefon`).
- **Knappar:** beige-brun primärknapp ("Kom igång", hover `accent-djup`) och ljus sekundärknapp med kant ("Se hur det fungerar"). Inga andra knapptyper.

## Editorial omgörning (gren `hero-editorial`)

Gjord 2026-10-22 som ett test att jämföra mot `main`.

- **Heron** är ny (se Sidans uppbyggnad punkt 2). `HeroIllustration.tsx` och SMS-tråden i `Telefon.tsx` är borttagna. `Telefon` har fått läget `mork` (låsskärm). Taglinen är delad i två: heronas rubrik (`texter.hero.rubrik`) och nästa sektions rubrik (`texter.problem.rubrik`). Beskrivningen, som förut stod i heron, är nu `texter.problem.text`. Sektionen efter heron har ankaret `#varfor`.
- **Första versionen av grenen** (samma dag) hade en loopande hero med kundkort och SMS-tråd på mörkare beige yta. Den ersattes av den här. Koden finns i historiken om den behövs.
- **Ändrade sektioner:** Problem (delad rubrik), Så fungerar det (siffror och linjer, samma bakgrund som sidan i stället för vit), Kundcase (utan beige ruta), Vanliga frågor (rubrik överst), Kom igång (band över hela bredden). Pris, Video och Sidfot är oförändrade.
- **Placeringen i heron** styrs av CSS-variabeln `--telefon` (telefonens bredd) på `<section>` i `Hero.tsx`. Under lg räknas den ur skärmhöjden minus rubriken (`(100svh − 19rem) / 2,2`, högst 16rem på mobil och 18rem på surfplatta), så att hela telefonen ryms ovanför rubriken. På desktop är den `min(20rem, 38svh)`, telefonen står vertikalt centrerad i linje med innehållets högerkant (`right-8`, eftersom absolut placering räknas från behållarens padding-kant) och rubriken håller sig till vänster om den (`max-w: 100% − --telefon − 2rem`).
- **Telefonens text** har bara en minsta storlek (`max(…rem, …cqw)`), inget tak, så att den skalar med den stora telefonen.
- **Gnistspåren** ritas i en SVG till vänster om telefonen, mätt i telefonbredder (1 enhet = 1 % av `--telefon`, telefonen börjar vid x = 160, notisens ikon sitter vid (172, 64)). Därför slutar de alltid i notisen, hur stor telefonen än är, och inget mäts i DOM:en. Varje spår är en komet (`pathLength` + `pathOffset`) som **tonas ut helt på slutet**: ett streck med längd 0 och runda ändar ritar annars en prick kvar i båda ändarna.
- **Introt (kortare sedan 2026-10-23):** rubriken kommer efter knappt 2 sekunder och menyn efter knappt 3 (tiderna `INTRO_*` och `FLYG_S` i `HeroScen.tsx`).
- **Introt** styrs av `data-intro` på `<html>` (`vantar` → `visualisering` → `text` → `klar`). Ett litet inline-skript i `<head>` (`INTRO_SKRIPT` i `src/lib/intro.ts`, renderat i `layout.tsx`) sätter `vantar` innan något ritas, så att menyn och rubriken aldrig blinkar till. `next/script` med `beforeInteractive` duger inte: i App Router körs inline-skript först när Nexts JavaScript har laddats. `<html>` har därför `suppressHydrationWarning`. `HeroScen` mäter telefonen, sätter `--intro-x/--intro-y` (avståndet till skärmens mitt) och driver tillstånden i takt med animationen. CSS:en (avsnittet INTRO i `globals.css`) döljer och visar med klasserna `intro-telefon`, `intro-ord` (`--i` = ordets nummer) och `intro-sist`. Tillståndet går aldrig bakåt (`satIntro`). Som skydd sätter skriptet `klar` efter 6 sekunder. Utan attributet syns allt direkt.
- **Understrykningen** under "inte glömt" avslöjas med `clip-path` i stället för streckmönster. `pathLength` + `stroke-dasharray` stämmer inte när SVG:n är utsträckt med `non-scaling-stroke`, och då syntes en bit av linjen innan den ritats.
- **Orange i heron:** gnistspåren och låsskärmens sken använder loggans färger, eftersom det är gnistan som flyger. Gränssnittets accent är fortfarande beige-brun.
- **Kortare väg till erbjudandet (2026-10-26, efter extern granskning):** tre inledande delar sa nästan samma sak. "Och du hinner inte påminna dem" (`Vardag.tsx`) är borttagen; ägarens sida och luckan står i raden under tidslinjens rubrik ("Och du hinner inte påminna alla. Bokningssystemet påminner bara om tider som redan är bokade."). "Så fungerar det" kommer nu direkt efter berättelsen, med fördelen under rubriken ("Lätt att komma igång. Sedan blir uppföljningen gjord, utan att du behöver komma ihåg den."), och kundcaset (beviset) ligger precis före priset. Ordningen: Hero → Problem → Berättelse → Så fungerar det → Kundcase → Pris → Team → Frågor → Kom igång.
- **Problempitch, inte produktpitch (2026-10-23):** sidan målar först upp besökarens problem och berättar sedan varför Respark finns. Ordningen: Hero → Problem (kundens tidslinje, "De vill komma tillbaka. Men de glömmer att boka.") → **Vardag** (`Vardag.tsx`, "Och du hinner inte påminna dem.": en arbetsdag där "Skriva till gamla kunder" stryks och blir "Blev inte av") → **Berättelse** (`Berattelse.tsx`, "Vi har sett det här förut.": Mattias historia i tre korta stycken och hans riktiga sms; sedan 2026-10-24 står telefonen till vänster och texten till höger från 1024 px, på mobil kommer texten först) → Kundcase ("Så gick det för Osteopaticentrum.", resultat, citat) → **Så fungerar det** (stegen, med raden "Ditt bokningssystem påminner om tider som redan är bokade. Respark påminner dem som inte har bokat." under rubriken; steg 2 nämner både "några dagar efter besöket" och "när det har gått länge") → Pris → Team → Frågor → Kom igång. `Losning.tsx` är borttagen (sms:et ligger i Berättelse och jämförelsen med bokningssystemet är raden under "Så fungerar det"). Sektionen "Det här gör Respark åt dig" (`VadViGor.tsx`) byggdes och togs bort samma dag: den upprepade tidslinjen (samma form), berättelsen och stegen. Texterna ligger i `texter.vardag` och `texter.berattelse`.
- **ELI5 (2026-10-23):** all text skrivs så att en femåring förstår (regeln står i `CLAUDE.md` och överst i `texter.ts`). Omskrivet: kategoriraden i heron ("Respark skickar ett sms till kunder som inte har varit hos dig på ett tag."), tidslinjens rubrik ("De vill komma tillbaka. Men de glömmer att boka."), poängerna ("När du vill", "Med dina ord", "Ingen glöms bort"), stegen ("Så fungerar det.", "Lägg in dina kunder", "Välj när sms:en ska gå ut"), kundcasets rubrik ("Så gick det för Osteopaticentrum."), det som ingår och frågorna ("Vanliga frågor.", "Passar det mig?", "Får jag skicka sms till mina kunder?"). "sms" skrivs med gemener. Produktvyerna (`StegVyer.tsx`) har kvar produktens egna ord tills Hai stämt av dem.
- **Räknaren "Räkna själv"** i priskortet togs bort 2026-10-24.
- **Mindre text (2026-10-23):** borttagna ingresser i Problem (tidslinjen visar det), Vad Respark gör (tidpunkterna står i första poängen) och Pris, raden under planens namn och "Ett pris, inga tillval att jämföra", jämförelsens fotnot, sidfotens beskrivning och frågorna "Kan jag skicka egna utskick?" och "Hur vet jag vilka som kommer tillbaka?" (priset och stegen svarar). Stegtexterna, kundcasets mening och listan över vad som ingår (fem rader) är kortade, och kundcasets mätperiod står en gång.
- **Efter heron (2026-10-22, utifrån kundcaset från Osteopaticentrum):** tidslinjen (Problem), den nya sektionen Vad Respark gör (Losning) och ett ifyllt kundcase. Steg 2 i Så fungerar det nämner nu både uppföljning några dagar efter besöket och påminnelse efter tre månader. Exempelkunderna (`texter.exempel.kunder`) är borttagna med före/efter-scenerna.
- **Verifierat:** se Verifierat nedan.

## Så styr du sidan

Allt nedan görs i `src/konfig/sajt.ts`.

- **Produktnamn:** `produktnamn`. Slår igenom i texter, metadata och delningsbild. Loggan är en bild och byts separat (se Var saker finns).
- **Pris:** `pris.visning`:
  - `"dold"` (nu): inga belopp, bara "Pris kommer snart".
  - `"preliminar"`: beloppen visas med etiketten "Preliminärt pris", för intern granskning.
  - `"bekraftad"`: slutgiltigt. Knappen går till `lankar.betalning` om den är satt, annars till registreringen.
  - Belopp, period, moms, antal SMS och påfyllningspris ligger bredvid. Belopp och antal SMS är 0 tills de är beslutade. Påfyllningen visas bara när den inte är `null`.
- **Förbund:** lägg till i `partners` och dela länken `domän/?partner=slug`. Sidan visar då "Särskilt erbjudande för medlemmar i …" i heron och medlemspriset (ordinarie pris minus `rabattProcent`) i priskortet. Sätt `aktiv: true` först när samarbetet är bekräftat. Ingen rabattkod fungerar automatiskt, eftersom det inte finns något rabattsystem än. Lägg därför förbundets rabatt i en egen betallänk (`betalningslank`).
- **Kontakt och team:** `team` (namn, roll, bild, telefon, mejl per person), `kontaktTelefon` (numret för "Ring oss"; annars det första i teamet), `kontaktEpost` och `foretag` (namn och org.nr i sidfoten). Bilder läggs i `public/team/`.
- **Priset:** `pris.ordinarie` (695), `period`, `momstext` ("exkl. moms"), `inkluderadeSms` (100) och `sparadeSms` (25: så många oanvända sms följer högst med till nästa period; 0 = raden visas inte). Antalet och sparandet syns i priskortet och i frågan om vad som händer när sms:en tar slut.
- **Löften som sänker tröskeln:** `pris.ingenBindningstid` (true), `pris.provperiodDagar` (null tills bestämd) och `uppstartshjalp` (null tills bestämd; texten står då under rubriken i Så fungerar det och i frågorna).
- **Kom igång:** `lankar.komIgang` är registreringslänken i produkten (i dag `null`). Utan länk leder menyn, heron och avslutningen till prisdelen, och priskortet visar en platshållare i stället för en knapp.
- **Betalning (Stripe):** enklast är en Stripe Payment Link i `lankar.betalning` (och per förbund i `betalningslank`, gärna med rabattkod). Ingen backend behövs. Den används bara när priset är `"bekraftad"`.
- **Kundcase:** `kundcase.citat` (med `bild`), `logotyp` (med bredd och höjd), `skarmbild`, `resultat` (`rutor: true` ger en ruta per enhet) och `sms` (kundens riktiga SMS i "Vad Respark gör"; `null` visar sidans eget exempel). Fyll bara i godkänt och verifierat material, och ändra aldrig orden i ett citat.
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

**Verifierat 2026-10-22 (gren `hero-editorial`):** `npm test` (8 gröna), `npm run lint`, `tsc` och `npm run build` utan fel. axe-core: 0 fel i desktop, mobil och desktop med reducerad rörelse. Heron fotad i 1440×900, 1280×720, 1024×768, 820×1180, 390×844 och 360×740 utan sidledsscroll eller konsolfel. Animationen är fotad i sju lägen på desktop och mobil, och övergången hero → nästa sektion i båda. Introt är fotat i åtta lägen (desktop och mobil) utan konsolfel. När det spelas och när det hoppas över (vanligt besök, omladdning, `/#pris` i ny flik, scroll under introt, navigering från `/villkor`, reducerad rörelse) är provat i Playwright. Inline-skriptet ligger i `<head>` i produktionsbygget. 2026-10-23, efter konverteringsförbättringarna: `npm test` (11 gröna, nya tester för `telefonHref`), lint och bygget gröna, axe 0 fel (desktop, mobil, reducerad rörelse), ingen sidledsscroll i 360–1440 px. Mobilens knapprad är dold i heron, synlig mitt på sidan och dold vid avslutningen. Efter tidslinjen, Vad Respark gör och kundcaset (samma dag): `npm test`, lint och bygget gröna, axe 0 fel, ingen sidledsscroll och inga konsolfel i 360, 390, 820, 1024, 1280 och 1440 px. Hela sidan fotad i 1440 och 390 px. Hela sidan är fotad i 1440 och 390 px.

**Verifierat 2026-10-24 (ny logga):** `npm test` (11 gröna), `npm run lint` (0 fel) och `npm run build` utan fel. Menyn, sidfoten, delningsbilden, hemskärmsikonen och favicon visar den nya loggan. Uppmätt i 390×844 och 1440×900 (Chrome, riktig skärmstorlek): ingen sidledsscroll, menyloggan 157×30 px och 189×36 px, sidfotens logga ryms inom sidomarginalerna. Obs: Chrome utan fönster (`--headless --window-size=390,…`) på Windows lägger ut sidan bredare än 390 px. Använd riktig skärmemulering för mobilbilder.

**Verifierat 2026-10-24 (Berättelse speglad, kortare citat, knappraden i kundcaset borttagen):** `npm test` (11 gröna), `npm run lint` (0 fel) och bygget utan fel. Fotat i 1440×900 och 390×844 (Playwright): telefonen till vänster och texten till höger på desktop, texten först på mobil, kundcaset slutar med citatet. Ingen sidledsscroll och inga konsolfel.

**Inte testat:** riktig iPhone/Android, Safari och Firefox (särskilt sticky och scrollstyrningen) och publicering på Vercel.

## Före publicering

- [ ] Slutligt produktnamn och varumärkeskontroll
- [x] Riktig logotyp (gnista + svart ord, spårad från `public/logos/respark-logga-svart.png` 2026-10-24). Byt gärna till formgivarens original-SVG om den finns.
- [ ] Domän i `doman`
- [x] Pris (2026-10-24): 695 kr per månad exkl. moms, `pris.visning: "bekraftad"`
- [x] Sms som ingår: 100 per månad, och upp till 25 oanvända följer med till nästa månad (`pris.sparadeSms`)
- [ ] Pris för fler sms (`pris.pafyllningPerSms`, verifiera operatörens kostnad och hur sms-delar räknas)
- [ ] Stripe: Payment Link i `lankar.betalning`
- [ ] Riktig kontaktadress i `kontaktEpost`
- [ ] Teamet: roll, porträtt (`public/team/`) och telefon för Erik och Hai i `team`
- [ ] Bolagets namn och organisationsnummer i `foretag`
- [ ] Provperiod beslutad → `pris.provperiodDagar`
- [ ] Uppstartshjälp beslutad → `uppstartshjalp` (t.ex. "Vi lägger in kundlistan åt dig.")
- [ ] Svaren på utkastfrågorna: vad som händer när en kund svarar på sms:et, och den juridiskt granskade texten om att det är tillåtet
- [x] Kundcaset ifyllt 2026-10-22: citat, bild, logga, resultat och SMS
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
- **Före/efter-scenerna** (`ForeEfter.tsx`) är borttagna sedan 2026-10-22 och ersatta av tidslinjen. De finns i git-historiken.
- **SMS-tecken:** ett tankstreck (–), typografiska citattecken eller emoji gör hela SMS:et till UCS-2 (70 tecken per del i stället för 160) och kan nästan fördubbla kostnaden. Bra att veta för produktens SMS-editor.
- **Loggan är spårad från en PNG**, sedan 2026-10-24 från `public/logos/respark-logga-svart.png` (gnista + svart ord). Den ersatte den första loggan, som hade ett tjockare brunt ord och en större gnista. Spårningen: potrace på en 4× förstorad bild med bildens genomskinlighet som täckning, lätt utjämnad (blur 2,5 px, `optTolerance` 0,4) så att kanterna inte blir vågiga när loggan är stor i sidfoten. Avvikelsen mot originalet är under 2 %. Ordet är rent svart (`#000000`), uppmätt i originalet. Bladens färgövergångar är uppmätta i originalet. Favicon (`icon.svg`, `favicon.ico`) är omgjorda från den nya gnistan. Konturerna ligger i `gnistaData.ts` (märket) och `loggaOrdData.ts` (ordet). De är uppdelade så att klientkomponenter som bara visar gnistan inte drar med sig ordets ~10 kB. Kommer en ny logga är det enklast att få den som SVG och ersätta konturerna. **Färgövergångarna behöver unika id:n** (`useOvergangsId`), eftersom loggan finns flera gånger på sidan.
- **Menyn får loggan som prop** (`<Navigering logga={<Ordmarke />} />`). Menyn är en klientkomponent, och så hamnar inte loggans konturer i dess JavaScript.
- **Cache Components** är på (Next 16-standard). Aktuell tid får inte läsas vid förrendering, så årtalet i sidfoten hämtas med `"use cache"`.

## Idéer till nästa steg

- Kort förklaringsvideo (ca 25 s): lista → påminnelse → kunden bokar → vilka som kom tillbaka. Lägg länken i `video.url`, så visas sektionen.
- Egna partnersidor (`/medlem/förbund`) om förbunden vill ha en egen länk att dela.
- Riktiga skärmbilder från produkten bredvid exempelvyerna när produktens gränssnitt är klart.
- Enkel analys (t.ex. Vercel Analytics) för att mäta klick på "Kom igång" per förbund.
