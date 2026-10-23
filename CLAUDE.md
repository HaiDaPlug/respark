# Landningssidan – regler för arbetet

- Läs `docs/current_state.md` först och uppdatera den i slutet av varje session (på svenska). Läs också `docs/intern.md` om den finns.
- **Repot är publikt.** Interna uppgifter – beslut och vem som fattat dem, resultatsiffror som inte är verifierade, prisresonemang, kundkontakter, godkännanden som saknas, varumärkesfrågor – skrivs bara i `docs/intern.md` (lokal, står i `.gitignore`). Aldrig i koden, i commit-meddelanden eller i `docs/current_state.md`.
- Allt som ändras ofta ligger i `src/konfig/sajt.ts`, all text i `src/innehall/texter.ts`. Hårdkoda inte namn, priser eller texter i komponenterna.
- **Skriv ELI5:** så att en femåring förstår. Vardagsord, korta meningar, en sak i taget, konkreta exempel. Inga facktermer (utskick, import, kolumner, återbesök, uppföljning) och inget bildspråk. Skriv "sms" med gemener. Mer i skrivreglerna överst i `texter.ts`.
- **Påstå aldrig något som inte är bekräftat:** inga påhittade kunder, citat, siffror, integrationer eller garantier. Skriv "bokningar efter utskick", aldrig att SMS orsakade bokningar. Exempelvyer ska vara märkta "Exempelvy" och får inte visa resultatsiffror (antal SMS, bokningar, procent eller kurvor).
- Inga knappar eller formulär som låtsas fungera. Saknas länken visas en platshållare i stället för knappen (se priskortet).
- Animera bara transform och opacity, aldrig höjd eller bredd (scroll-ankring avbryter då mjuk scroll).
- Ingen tailwind-merge: skicka inte display- eller max-w-klasser som `className` till komponenter som redan sätter dem.
- Verifiera med `npm test`, `npm run lint` och `npm run build`, och titta på sidan i 390 och 1440 px.

Next.js-specifika regler för den här versionen: @AGENTS.md
