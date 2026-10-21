/** Slår ihop klassnamn och hoppar över tomma värden: klass("a", villkor && "b"). */
export function klass(...delar: Array<string | false | null | undefined>) {
  return delar.filter(Boolean).join(" ");
}
