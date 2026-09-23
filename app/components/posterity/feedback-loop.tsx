import { PosterityFigure } from "./figure";

const loop = [
  { who: "Desk + owner", what: "Publish, then pin a discussion question" },
  { who: "Pulse", what: "Logs the experiment in the metrics ledger" },
  { who: "Pulse", what: "Scans comparable channels for what's moving" },
  { who: "Pulse", what: "Turns both into a growth hypothesis" },
  { who: "Vellum", what: "Weighs it against the brand lane and picks" },
];

export function FeedbackLoop() {
  return (
    <PosterityFigure
      label="The daily loop · conceptual"
      caption={
        <>
          The loop runs on a schedule each morning, ahead of the next INFO
          PACKET. The numbers change daily; the structure is what matters here,
          so none are shown.
        </>
      }
    >
      <div className="p-4 sm:p-6">
        <ol className="grid gap-2.5 lg:grid-cols-5 lg:gap-3">
          {loop.map((step, i) => (
            <li
              key={step.what}
              className="relative flex gap-3 rounded-md border border-white/10 bg-[#0e0d0c] px-3.5 py-3 lg:flex-col lg:gap-1.5"
            >
              <span className="font-mono text-[11px] text-vellum/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">
                  {step.who}
                </span>
                <span className="mt-0.5 block text-[13.5px] leading-snug text-zinc-200">
                  {step.what}
                </span>
              </span>
              {i < loop.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-[11px] top-3 z-10 hidden text-[13px] text-vellum/60 lg:block"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-3 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-vellum/80">
          <span aria-hidden>↺</span> The pick becomes tomorrow&apos;s packet
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-vellum/30 bg-vellum/[0.05] px-4 py-3.5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-vellum">
              Now · exploring
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-300">
              Early in the channel&apos;s life, Vellum tries new angles and
              watches what holds. One quiet day doesn&apos;t rewrite the thesis.
            </p>
          </div>
          <div className="rounded-md border border-dashed border-white/15 px-4 py-3.5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">
              Later · a formal series
            </p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-zinc-400">
              With weeks of accumulated data, the picks should settle into
              recurring series instead of one-off experiments.
            </p>
          </div>
        </div>
      </div>
    </PosterityFigure>
  );
}
