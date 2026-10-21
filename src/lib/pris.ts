/** Medlemspris efter rabatt, avrundat till hela kronor. 1 000 kr och 20 % ger 800 kr. */
export function medlemspris(ordinarie: number, rabattProcent: number) {
  return Math.round(ordinarie * (1 - rabattProcent / 100));
}

const heltal = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 });
const decimaler = new Intl.NumberFormat("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * Belopp i svensk form med hårt mellanslag före "kr", så att talet och
 * enheten aldrig hamnar på olika rader: 1500 → "1 500 kr", 0.5 → "0,50 kr".
 */
export function kronor(belopp: number) {
  const format = Number.isInteger(belopp) ? heltal : decimaler;
  return `${format.format(belopp)} kr`;
}
