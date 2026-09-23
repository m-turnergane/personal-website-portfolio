import { pipeline, type Actor, type PipelineStep } from "@/lib/posterity";
import { PosterityFigure } from "./figure";

const ACTOR_LABEL: Record<Actor, string> = {
  agent: "Agent",
  human: "Human",
  platform: "Platform",
};

const ACTOR_CLASSES: Record<Actor, string> = {
  agent: "border-white/15 text-zinc-400",
  human: "border-vellum bg-vellum text-[#14110c]",
  platform: "border-sepia/50 text-sepia",
};

function ActorTag({ actor }: { actor: Actor }) {
  return (
    <span
      className={`inline-flex items-center rounded-[3px] border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-none tracking-wider ${ACTOR_CLASSES[actor]}`}
    >
      {ACTOR_LABEL[actor]}
    </span>
  );
}

function StepCard({ step }: { step: PipelineStep }) {
  return (
    <div
      className={`rounded-md border px-3.5 py-3 ${
        step.gate
          ? "border-vellum/45 bg-vellum/[0.06]"
          : "border-white/10 bg-[#0e0d0c]"
      }`}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        <ActorTag actor={step.actor} />
        {step.gate && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-vellum">
            Gate
          </span>
        )}
      </div>
      <p className="mt-2 text-[14px] font-semibold leading-snug text-zinc-100">
        {step.title}
      </p>
      <p className="mt-1 text-[12.5px] leading-snug text-zinc-400">
        {step.detail}
      </p>
      <p className="mt-2 font-mono text-[10.5px] leading-snug text-zinc-500">
        {step.owner}
      </p>
    </div>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-vellum/10 px-4 py-3 text-[12px] text-zinc-500 sm:px-6">
      {(Object.keys(ACTOR_LABEL) as Actor[]).map((actor) => (
        <span key={actor} className="inline-flex items-center gap-2">
          <ActorTag actor={actor} />
          {actor === "agent" && "does the work"}
          {actor === "human" && "me"}
          {actor === "platform" && "publishing surface"}
        </span>
      ))}
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="h-3 w-3 rounded-[3px] border border-vellum/45 bg-vellum/[0.12]" />
        quality gate
      </span>
    </div>
  );
}

export function PosterityPipeline() {
  return (
    <PosterityFigure
      label="How a Short gets made"
      caption={
        <>
          Three gates sit between an idea and a public upload: my plates, the
          Editor-in-Chief&apos;s mute check, and my final look. The last step
          feeds the first.
        </>
      }
    >
      <Legend />

      {/* Desktop: phases left to right, then the loop back. */}
      <div className="hidden px-6 pb-6 pt-5 lg:block">
        <ol className="grid grid-cols-5 gap-3">
          {pipeline.map((phase, p) => (
            <li key={phase.phase} className="relative flex flex-col">
              <p className="mb-3 flex items-baseline gap-2 border-b border-vellum/15 pb-2">
                <span className="pv-serif text-lg font-semibold text-vellum">
                  {["I", "II", "III", "IV", "V"][p]}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
                  {phase.phase}
                </span>
                {p < pipeline.length - 1 && (
                  <span aria-hidden className="ml-auto text-[13px] text-vellum/50">
                    →
                  </span>
                )}
              </p>
              <ol className="flex flex-1 flex-col gap-2.5">
                {phase.steps.map((step) => (
                  <li key={step.title}>
                    <StepCard step={step} />
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
        <div aria-hidden className="relative mx-[10%] mt-4 h-6 rounded-b-lg border-x border-b border-dashed border-vellum/35">
          <span className="absolute -top-1.5 left-0 -translate-x-1/2 text-[10px] leading-none text-vellum/70">
            ▲
          </span>
          <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 bg-[#0f0d0a] px-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-vellum/80">
            Next story
          </span>
        </div>
      </div>

      {/* Mobile and tablet: a single timeline. */}
      <ol className="px-4 pb-5 pt-5 sm:px-6 lg:hidden">
        {pipeline.map((phase, p) => (
          <li key={phase.phase} className="relative pb-5 pl-8 last:pb-0">
            <span
              aria-hidden
              className="absolute left-[9px] top-2 h-full w-px bg-vellum/20"
            />
            <span
              aria-hidden
              className="absolute left-0 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-vellum/40 bg-[#0f0d0a] font-mono text-[9px] text-vellum"
            >
              {p + 1}
            </span>
            <p className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-400">
              {phase.phase}
            </p>
            <ol className="grid gap-2.5 sm:grid-cols-2">
              {phase.steps.map((step) => (
                <li key={step.title}>
                  <StepCard step={step} />
                </li>
              ))}
            </ol>
          </li>
        ))}
        <li className="relative pl-8 pt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-vellum/80">
          <span aria-hidden className="absolute left-[3px] top-[14px] text-sm leading-none">
            ↺
          </span>
          Back to discovery with the next story
        </li>
      </ol>
    </PosterityFigure>
  );
}
