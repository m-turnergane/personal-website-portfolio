"use client";

import { useId, useState } from "react";
import { Figure, StateTag, type State } from "./figure";

interface Line {
  state: State;
  check: string;
  result: string;
}

const statusLabel: Record<State, string> = {
  pass: "PASS",
  fail: "FAIL",
  skip: "SKIPPED",
  neutral: "",
};

const runs: { id: string; label: string; lines: Line[] }[] = [
  {
    id: "sound",
    label: "Sound implementation",
    lines: [
      {
        state: "pass",
        check: "duplicate delivery",
        result: "one durable effect",
      },
      {
        state: "pass",
        check: "persistence failure",
        result: "non-2xx, retried",
      },
      {
        state: "pass",
        check: "bookkeeping fails after commit",
        result: "no second effect",
      },
      {
        state: "pass",
        check: "stale entitlement event",
        result: "reconciled to current state",
      },
      {
        state: "pass",
        check: "concurrent updates, one customer",
        result: "serialized",
      },
      {
        state: "pass",
        check: "entitlements beyond the summary",
        result: "full list paged",
      },
      {
        state: "skip",
        check: "stale worker fencing",
        result: "not exercised in this run",
      },
    ],
  },
  {
    id: "broken",
    label: "Broken reference",
    lines: [
      {
        state: "pass",
        check: "duplicate delivery",
        result: "same event.id skipped",
      },
      {
        state: "fail",
        check: "persistence failure",
        result: "returned 200, effect missing",
      },
      {
        state: "fail",
        check: "bookkeeping fails after commit",
        result: "granted twice on retry",
      },
      {
        state: "fail",
        check: "stale entitlement event",
        result: "older payload overwrote newer state",
      },
      {
        state: "fail",
        check: "concurrent updates, one customer",
        result: "one update lost",
      },
      {
        state: "fail",
        check: "entitlements beyond the summary",
        result: "stored the first 10 only",
      },
      {
        state: "skip",
        check: "stale worker fencing",
        result: "not exercised in this run",
      },
    ],
  },
];

function tally(lines: Line[]) {
  return {
    pass: lines.filter((l) => l.state === "pass").length,
    fail: lines.filter((l) => l.state === "fail").length,
    skip: lines.filter((l) => l.state === "skip").length,
  };
}

export function ConformanceRun() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const run = runs[active];
  const counts = tally(run.lines);

  return (
    <Figure
      label="Conformance run · illustrative"
      caption="Illustrative output, not a transcript of the real suite. The broken reference deduplicates on event.id, swallows errors and writes payloads as they arrive. It passes the one check most sample code is built around."
    >
      <div
        role="group"
        aria-label="Implementation under test"
        className="flex border-b border-white/[0.07]"
      >
        {runs.map((r, i) => {
          const selected = i === active;
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(i)}
              className={`relative flex-1 px-4 py-2.5 text-left text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40 sm:flex-none ${
                selected
                  ? "bg-white/[0.05] text-white"
                  : "text-zinc-500 hover:bg-white/[0.02] hover:text-zinc-300"
              }`}
            >
              {r.label}
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
        id={`${baseId}-output`}
        aria-live="polite"
        className="px-4 py-4 font-mono text-[13px] leading-relaxed"
      >
        <p className="mb-3 text-zinc-600">
          target:{" "}
          {run.id === "sound"
            ? "your implementation"
            : "deliberately broken reference"}
        </p>
        <ul className="space-y-1.5">
          {run.lines.map((line) => (
            <li
              key={line.check}
              className="grid grid-cols-[4.75rem_minmax(0,1fr)] items-baseline gap-x-3"
            >
              <StateTag state={line.state} className="w-full">
                {statusLabel[line.state]}
              </StateTag>
              <span className="min-w-0 break-words">
                <span className="text-zinc-200">{line.check}</span>
                <span className="block text-zinc-500 sm:inline">
                  <span className="hidden sm:inline"> · </span>
                  {line.result}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-white/[0.07] pt-3 text-zinc-400">
          <span className="whitespace-nowrap">{run.lines.length} checks</span> ·{" "}
          <span className="whitespace-nowrap text-state-pass">
            {counts.pass} passed
          </span>{" "}
          ·{" "}
          <span
            className={`whitespace-nowrap ${counts.fail ? "text-state-fail" : ""}`}
          >
            {counts.fail} failed
          </span>{" "}
          ·{" "}
          <span className="whitespace-nowrap text-state-skip">
            {counts.skip} unproven
          </span>
        </p>
      </div>

      <dl className="grid border-t border-white/[0.07] text-sm sm:grid-cols-3">
        {[
          {
            state: "pass" as const,
            term: "PASS",
            text: "The control was exercised under the failure and held.",
          },
          {
            state: "fail" as const,
            term: "FAIL",
            text: "The control was exercised and did not hold.",
          },
          {
            state: "skip" as const,
            term: "SKIPPED",
            text: "The control was never exercised. Unproven, never counted as a pass.",
          },
        ].map((item, i) => (
          <div
            key={item.term}
            className={`px-4 py-3 ${i > 0 ? "border-t border-white/[0.07] sm:border-l sm:border-t-0" : ""}`}
          >
            <dt className="mb-1">
              <StateTag state={item.state}>{item.term}</StateTag>
            </dt>
            <dd className="text-[13px] leading-relaxed text-zinc-400">
              {item.text}
            </dd>
          </div>
        ))}
      </dl>
    </Figure>
  );
}
