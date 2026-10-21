import type { LucideIcon } from "lucide-react";
import { klass } from "@/lib/klass";

/**
 * Tydligt markerad ruta för material som ska fyllas i före lansering
 * (kundcitat, logga, video …). Visas bara när sajt.visaPlatshallare är true –
 * komponenterna som använder den kontrollerar det.
 */
export function Platshallare({
  text,
  ikon: Ikon,
  className,
}: {
  text: string;
  ikon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={klass(
        "flex items-start gap-3 rounded-2xl border-[1.5px] border-dashed border-ink/20 bg-surface/50 p-4 text-[0.88rem] text-ink-soft",
        className,
      )}
    >
      {Ikon && <Ikon aria-hidden className="mt-0.5 size-4 shrink-0 text-ink-faint" />}
      <p>
        <span className="mr-1.5 rounded-full bg-ink/[0.07] px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-[0.06em] text-ink-soft">
          Platshållare
        </span>
        {text}
      </p>
    </div>
  );
}
