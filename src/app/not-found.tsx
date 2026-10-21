import { Behallare } from "@/komponenter/ui/Behallare";
import { KnappLank } from "@/komponenter/ui/Knapp";
import { Ordmarke } from "@/komponenter/ui/Ordmarke";

export default function HittadesInte() {
  return (
    <main id="innehall" className="grid min-h-svh place-items-center py-20">
      <Behallare bredd="smal" className="text-center">
        <div className="flex justify-center">
          <Ordmarke />
        </div>
        <h1 className="mt-10 text-h2 font-bold text-ink">Sidan finns inte</h1>
        <p className="mt-4 text-lead text-ink-soft">Länken kan vara gammal eller felstavad.</p>
        <KnappLank href="/" storlek="lg" className="mt-8">
          Till startsidan
        </KnappLank>
      </Behallare>
    </main>
  );
}
