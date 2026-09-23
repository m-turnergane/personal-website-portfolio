"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Figure, StateTag, type State } from "./figure";

type StageState = "done" | "failed" | "pending" | "misleading";

const stages = [
  { name: "Verify", detail: "Signature and payload" },
  { name: "Check", detail: "Is event.id processed?" },
  { name: "Mutate", detail: "Grant access or credits" },
  { name: "Mark", detail: "Insert event.id" },
  { name: "ACK", detail: "Return 2xx" },
];

interface Scenario {
  tab: string;
  title: string;
  /** Index of the stage after which the process stops, if it crashes. */
  crashAfter?: number;
  stageStates: StageState[];
  durable: string;
  stripe: string;
  naive: { state: State; label: string; text: string };
  correct: { state: State; label: string; text: string };
}

const scenarios: Scenario[] = [
  {
    tab: "Before the write",
    title: "The worker dies after the dedupe check",
    crashAfter: 1,
    stageStates: ["done", "done", "pending", "pending", "pending"],
    durable: "Nothing.",
    stripe: "No 2xx arrived, so the event is redelivered.",
    naive: {
      state: "pass",
      label: "fine",
      text: "The retry is indistinguishable from a first attempt.",
    },
    correct: {
      state: "pass",
      label: "fine",
      text: "Same. Failing before anything is durable is the cheap case.",
    },
  },
  {
    tab: "After the write",
    title: "Access is granted, then the worker dies before marking the event",
    crashAfter: 2,
    stageStates: ["done", "done", "done", "pending", "pending"],
    durable: "The grant, with no record that it happened.",
    stripe: "No 2xx arrived, so the event is redelivered.",
    naive: {
      state: "fail",
      label: "twice",
      text: "The retry passes the check, because event.id was never inserted, and grants again.",
    },
    correct: {
      state: "pass",
      label: "holds",
      text: "The operation record commits in the same transaction as the grant. Either both exist or neither does.",
    },
  },
  {
    tab: "Before the ACK",
    title: "Everything commits, then the response is lost",
    crashAfter: 3,
    stageStates: ["done", "done", "done", "done", "pending"],
    durable: "The grant and the processed event.id.",
    stripe: "The request timed out, so the event is redelivered.",
    naive: {
      state: "pass",
      label: "fine",
      text: "The retry finds event.id and skips. This is the case event.id deduplication was designed for.",
    },
    correct: {
      state: "pass",
      label: "fine",
      text: "The operation is already recorded. The retry is a no-op that returns 2xx.",
    },
  },
  {
    tab: "Two paths at once",
    title: "The webhook and the success page fulfill cs_123 at the same moment",
    stageStates: ["done", "misleading", "done", "done", "done"],
    durable: "Two grants for one purchase.",
    stripe: "Nothing unusual. Every request returned 2xx.",
    naive: {
      state: "fail",
      label: "twice",
      text: "Both paths check before either writes, and the success page has no event.id to check at all.",
    },
    correct: {
      state: "pass",
      label: "holds",
      text: "The operation key fulfill:cs_123 is unique inside the transaction, so the second commit becomes a no-op.",
    },
  },
  {
    tab: "Error swallowed",
    title: "The write throws, the handler logs it and returns 200",
    stageStates: ["done", "done", "failed", "pending", "misleading"],
    durable: "Nothing, apart from a log line.",
    stripe:
      "It saw a 2xx. As far as Stripe knows the event was delivered, and it will not come back.",
    naive: {
      state: "fail",
      label: "silent",
      text: "The effect is lost and nothing retries it. You find out from the customer.",
    },
    correct: {
      state: "pass",
      label: "holds",
      text: "The handler returns non-2xx until the effect is durable, and Stripe keeps retrying.",
    },
  },
];

const stageStyles: Record<StageState, string> = {
  done: "border-white/25 bg-white/[0.06] text-zinc-100",
  failed: "border-state-fail/50 bg-state-fail/[0.08] text-state-fail",
  pending: "border-dashed border-white/10 text-zinc-600",
  misleading: "border-state-skip/50 bg-state-skip/[0.08] text-state-skip",
};

const stageStateLabel: Record<StageState, string> = {
  done: "completed",
  failed: "failed",
  pending: "not reached",
  misleading: "completed, but misleading",
};

export function CrashPointExplorer() {
  const [active, setActive] = useState(1);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();
  const scenario = scenarios[active];

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = scenarios.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = active === last ? 0 : active + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = active === 0 ? last : active - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <Figure
      label="Where the handler stops"
      caption="The naive handler is the common sample shape: check a processed-events table, apply the effect, insert the event ID, return 200. Pick a failure point to see what the retry does."
    >
      <div
        role="tablist"
        aria-label="Failure points"
        className="grid grid-cols-2 border-b border-white/[0.07] sm:grid-cols-3 lg:grid-cols-5"
      >
        {scenarios.map((s, i) => {
          const selected = i === active;
          return (
            <button
              key={s.tab}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${baseId}-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={onKeyDown}
              className={`relative px-3 py-2.5 text-left text-[13px] transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40 ${
                selected
                  ? "bg-white/[0.05] text-white"
                  : "text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-300"
              }`}
            >
              <span className="mr-1.5 font-mono text-[11px] text-zinc-600">
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.tab}
              {selected && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px bg-white/60"
                />
              )}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active}`}
        className="px-4 py-5 sm:px-5"
      >
        <p className="mb-5 text-[15px] font-medium text-zinc-100">
          {scenario.title}
        </p>

        <ol className="flex flex-col gap-2 md:flex-row md:items-stretch md:gap-0">
          {stages.map((stage, i) => {
            const state = scenario.stageStates[i];
            const crashHere = scenario.crashAfter === i;
            return (
              <li
                key={stage.name}
                className="flex flex-col md:flex-1 md:flex-row md:items-stretch"
              >
                <div
                  className={`flex items-baseline justify-between gap-3 rounded-md border px-3 py-2 transition-colors md:block md:min-h-[4.75rem] md:min-w-0 md:flex-1 ${stageStyles[state]}`}
                >
                  <span className="font-mono text-[13px]">
                    {stage.name}
                    <span className="sr-only">: {stageStateLabel[state]}</span>
                  </span>
                  <span
                    className={`text-right text-xs md:mt-0.5 md:block md:text-left ${
                      state === "pending" ? "text-zinc-600" : "text-zinc-400"
                    }`}
                  >
                    {stage.detail}
                  </span>
                </div>
                {i < stages.length - 1 && (
                  <div
                    aria-hidden={!crashHere}
                    className={`flex items-center justify-center ${
                      crashHere
                        ? "h-9 md:h-auto md:w-9"
                        : "h-4 md:h-auto md:w-5"
                    }`}
                  >
                    {crashHere ? (
                      <span className="flex items-center gap-2 md:flex-col md:gap-1">
                        <span
                          aria-hidden
                          className="flex h-5 w-5 items-center justify-center rounded-full border border-state-fail/60 bg-state-fail/10 text-[11px] leading-none text-state-fail"
                        >
                          ✕
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-state-fail/90 md:hidden">
                          process stops
                        </span>
                        <span className="sr-only">Process stops here</span>
                      </span>
                    ) : (
                      <span className="h-full w-px bg-white/10 md:h-px md:w-full" />
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <dl className="mt-6 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="mb-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Durable after the failure
            </dt>
            <dd className="text-zinc-300">{scenario.durable}</dd>
          </div>
          <div>
            <dt className="mb-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              What Stripe does next
            </dt>
            <dd className="text-zinc-300">{scenario.stripe}</dd>
          </div>
          <div className="border-t border-white/[0.07] pt-4">
            <dt className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Naive handler
              <StateTag state={scenario.naive.state}>
                {scenario.naive.label}
              </StateTag>
            </dt>
            <dd className="text-zinc-300">{scenario.naive.text}</dd>
          </div>
          <div className="border-t border-white/[0.07] pt-4">
            <dt className="mb-1.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Holds the invariant
              <StateTag state={scenario.correct.state}>
                {scenario.correct.label}
              </StateTag>
            </dt>
            <dd className="text-zinc-300">{scenario.correct.text}</dd>
          </div>
        </dl>
      </div>
    </Figure>
  );
}
