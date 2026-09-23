import { packetSections } from "@/lib/posterity";
import { PosterityFigure } from "./figure";

const REDACTION_WIDTHS = [
  ["88%", "64%"],
  ["92%", "71%", "40%"],
  ["95%", "90%", "84%", "58%"],
  ["80%", "66%"],
  ["54%"],
  ["74%", "48%"],
  ["62%"],
  ["70%"],
];

const SEQUENCE_SYSTEMS = ["Evidence", "Reconstruction", "Map"];

function Redaction({ widths }: { widths: string[] }) {
  return (
    <span aria-hidden className="mt-2 flex flex-col gap-1.5">
      {widths.map((width, i) => (
        <span
          key={i}
          className="block h-[7px] rounded-[1px] bg-vellum/[0.09]"
          style={{ width }}
        />
      ))}
    </span>
  );
}

function SheetHeader({ file, meta }: { file: string; meta: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-vellum/15 pb-3">
      <p className="font-mono text-[12px] tracking-wide text-vellum">{file}</p>
      <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-zinc-500">
        {meta}
      </p>
    </div>
  );
}

export function InfoPacket() {
  return (
    <PosterityFigure
      label="The morning delivery · structure only"
      caption={
        <>
          The shape of what arrives every morning. Both files come in full,
          never as a summary. Episode contents are deliberately not reproduced
          here.
        </>
      }
    >
      <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="pv-sheet rounded-md border border-vellum/20 p-4 sm:p-5">
          <SheetHeader file="INFO-PACKET.md" meta="Spec" />
          <ol className="mt-1 divide-y divide-vellum/[0.08]">
            {packetSections.map((section, i) => (
              <li key={section.title} className="py-3">
                <div className="flex items-baseline gap-3">
                  <span className="w-5 shrink-0 font-mono text-[11px] text-vellum/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14px] font-medium text-zinc-100">
                    {section.title}
                  </span>
                  {section.note && (
                    <span className="ml-auto hidden text-right text-[12px] text-zinc-500 sm:inline">
                      {section.note}
                    </span>
                  )}
                </div>
                <div className="pl-8">
                  {section.note && (
                    <p className="mt-1 text-[12px] text-zinc-500 sm:hidden">
                      {section.note}
                    </p>
                  )}
                  {section.title === "Sequences" && (
                    <p className="mt-2 flex flex-wrap gap-1.5">
                      {SEQUENCE_SYSTEMS.map((system) => (
                        <span
                          key={system}
                          className="rounded-[3px] border border-vellum/25 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-vellum/80"
                        >
                          {system}
                        </span>
                      ))}
                    </p>
                  )}
                  <Redaction widths={REDACTION_WIDTHS[i] ?? ["60%"]} />
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-4">
          <div className="pv-sheet rounded-md border border-vellum/20 p-4 sm:p-5">
            <SheetHeader file="script-final.md" meta="Voiceover" />
            <div className="mt-3">
              <Redaction widths={["96%", "90%", "93%", "70%"]} />
              <Redaction widths={["94%", "88%", "52%"]} />
              <Redaction widths={["91%", "84%", "95%", "38%"]} />
            </div>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.02] p-4 text-[13px] leading-relaxed text-zinc-400">
            <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">
              Why a document
            </p>
            Every downstream step reads from it: my image generation, the
            assembly, the mute gate and the metadata. If something is wrong, it
            is wrong in one place I can point at.
          </div>
        </div>
      </div>
    </PosterityFigure>
  );
}
