import { sajt } from "@/konfig/sajt";
import { klass } from "@/lib/klass";
import { Logga } from "./Logga";

/**
 * Loggan i normal storlek: i menyn, på de juridiska sidorna och 404-sidan.
 * Skärmläsare får produktnamnet. Den stora loggan längst ner ligger i Sidfot.
 */
export function Ordmarke({ className }: { className?: string }) {
  return <Logga titel={sajt.produktnamn} className={klass("h-[1.875rem] w-auto sm:h-8 lg:h-9", className)} />;
}
