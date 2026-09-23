import { chronicleLayers, standingRules } from "@/lib/posterity";
import { PosterityFigure } from "./figure";

const NUMERALS = ["I", "II", "III"];

export function RecoveredChronicle() {
  return (
    <PosterityFigure label="The Recovered Chronicle · visual system and standing rules">
      <ol className="grid gap-px bg-vellum/10 md:grid-cols-3">
        {chronicleLayers.map((layer, i) => (
          <li key={layer.name} className="bg-[#0f0d0b] px-5 py-5 sm:px-6">
            <p className="pv-serif text-2xl font-semibold leading-none text-vellum/70">
              {NUMERALS[i]}
            </p>
            <p className="mt-3 text-[15px] font-semibold text-zinc-100">
              {layer.name}
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-400">
              {layer.body}
            </p>
          </li>
        ))}
      </ol>

      <div className="border-t border-vellum/15 px-5 py-5 sm:px-6">
        <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">
          Standing rules
        </p>
        <dl className="divide-y divide-white/[0.06]">
          {standingRules.map(({ rule, why }) => (
            <div
              key={rule}
              className="grid gap-1 py-2.5 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6"
            >
              <dt className="text-[14px] font-medium text-vellum">{rule}</dt>
              <dd className="text-[14px] leading-snug text-zinc-400">{why}</dd>
            </div>
          ))}
        </dl>
      </div>
    </PosterityFigure>
  );
}
