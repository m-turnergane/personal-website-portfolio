import { posterity } from "@/lib/posterity";
import { PosterityFigure } from "./figure";

function Connector({ label }: { label?: string }) {
  return (
    <div aria-hidden className="flex flex-col items-center py-1">
      <span className="h-5 w-px bg-vellum/50" />
      {label && (
        <span className="rounded-full border border-vellum/30 bg-[#0f0d0a] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-vellum">
          {label}
        </span>
      )}
      <span className="h-5 w-px bg-vellum/50" />
    </div>
  );
}

export function PosterityDeskDiagram() {
  const [eic, ...specialists] = posterity.agents;

  return (
    <PosterityFigure
      label="The desk · who talks to whom"
      caption={
        <>
          Specialists coordinate with each other and hand work along as files.
          Only the Editor-in-Chief carries the routine thread to me, so there is
          one place where decisions get asked for and made.
        </>
      }
    >
      <div className="px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-sm rounded-md border border-white/10 bg-white/[0.03] px-5 py-4 text-center">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">
            Owner · human
          </p>
          <p className="mt-1.5 text-lg font-semibold text-zinc-100">
            Muhammad Gane
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Sets the bar, makes the plates, clears the gates
          </p>
        </div>

        <Connector label="one owner thread" />

        <div className="mx-auto max-w-md rounded-md border border-vellum/40 bg-vellum/[0.06] px-5 py-4 text-center">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-vellum/80">
            {eic.role} · showrunner
          </p>
          <p className="pv-serif mt-1 text-[1.75rem] font-semibold leading-tight text-vellum">
            {eic.name}
          </p>
          <p className="mt-1 text-sm text-zinc-300">{eic.owns}</p>
        </div>

        <Connector />

        <div className="rounded-lg border border-dashed border-vellum/25 p-3 sm:p-4">
          <p className="mb-3 px-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">
            Posterity Desk · specialists
          </p>
          <div className="relative">
            <span
              aria-hidden
              className="absolute inset-x-6 top-1/2 hidden border-t border-dashed border-vellum/25 lg:block"
            />
            <ul className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {specialists.map((agent) => (
                <li
                  key={agent.name}
                  className="rounded-md border border-white/10 bg-[#0e0d0c] px-4 py-3.5"
                >
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">
                    {agent.role}
                  </p>
                  <p className="pv-serif mt-0.5 text-[1.375rem] font-semibold text-zinc-100">
                    {agent.name}
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-zinc-400">
                    {agent.owns}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 px-1 text-[13px] text-zinc-500">
            <span aria-hidden className="mr-2 inline-block w-5 border-t border-dashed border-vellum/40 align-middle" />
            Internal coordination. No specialist messages the owner directly.
          </p>
        </div>
      </div>
    </PosterityFigure>
  );
}
