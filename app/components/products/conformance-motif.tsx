const lines = [
  { tag: "PASS", tone: "text-state-pass/80", text: "duplicate delivery" },
  { tag: "PASS", tone: "text-state-pass/80", text: "persistence failure" },
  { tag: "PASS", tone: "text-state-pass/80", text: "stale entitlement" },
  { tag: "SKIP", tone: "text-state-skip/80", text: "unproven ≠ passed" },
  { tag: "FAIL", tone: "text-state-fail/80", text: "broken reference" },
];

/** Decorative, text-only echo of a conformance run. */
export function ConformanceMotif({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`select-none font-mono text-[11px] leading-[1.9] ${className}`}
    >
      {lines.map((line, i) => (
        <div key={i} className="flex gap-3 whitespace-nowrap">
          <span className={`w-9 ${line.tone}`}>{line.tag}</span>
          <span className="text-zinc-600">{line.text}</span>
        </div>
      ))}
    </div>
  );
}
