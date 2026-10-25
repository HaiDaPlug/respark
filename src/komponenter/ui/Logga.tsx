import { klass } from "@/lib/klass";
import { GnistaBlad, useOvergangsId } from "./Gnista";
import { LOGGA_VIEWBOX, ORD, ORD_FARG } from "./loggaOrdData";

/**
 * Respark-loggan: gnistan och ordet "respark" som vektor. Skalar skarpt från
 * menyn till den stora loggan i sidfoten.
 */
export function Logga({
  className,
  titel,
  ordFarg = ORD_FARG,
}: {
  className?: string;
  /** Tillgängligt namn. Utan titel är loggan dekor (aria-hidden), t.ex. när namnet redan står i närheten. */
  titel?: string;
  /** Ordets färg. Standard är originalets svarta. */
  ordFarg?: string;
}) {
  const prefix = useOvergangsId("logga");
  return (
    <svg
      viewBox={LOGGA_VIEWBOX}
      className={klass("shrink-0", className)}
      role={titel ? "img" : undefined}
      aria-label={titel}
      aria-hidden={titel ? undefined : true}
    >
      <GnistaBlad prefix={prefix} />
      <path d={ORD} fill={ordFarg} fillRule="evenodd" />
    </svg>
  );
}
