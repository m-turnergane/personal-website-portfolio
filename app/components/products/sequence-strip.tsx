import { Figure, StateTag } from "./figure";

function Features({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <span className="font-mono text-[13px] text-zinc-500">[ ]</span>;
  }
  return (
    <span className="font-mono text-[13px] text-zinc-200 break-words">
      [{items.join(", ")}]
    </span>
  );
}

function StaleEvent() {
  const rows = [
    {
      order: "1",
      event: "evt_2 · summary after cancellation",
      writes: [] as string[],
      note: "Created second, delivered first",
    },
    {
      order: "2",
      event: "evt_1 · summary before cancellation",
      writes: ["premium-support"],
      note: "An earlier delivery, retried",
    },
  ];

  return (
    <Figure
      label="Delivery order ≠ creation order"
      caption="Writing each payload as it arrives leaves a canceled customer with access. Treating both events as a prompt to read current active entitlements stores an empty set both times."
    >
      <ol className="divide-y divide-white/[0.05]">
        {rows.map((row) => (
          <li
            key={row.order}
            className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 px-4 py-3 sm:grid-cols-[1.5rem_minmax(0,1.3fr)_minmax(0,1fr)] sm:items-center"
          >
            <span className="font-mono text-[11px] text-zinc-600">
              {row.order}
            </span>
            <div>
              <div className="font-mono text-[13px] text-zinc-200 break-words">
                {row.event}
              </div>
              <div className="text-xs text-zinc-500">{row.note}</div>
            </div>
            <div className="col-start-2 sm:col-start-3">
              <span className="mr-2 text-xs text-zinc-500">writes</span>
              <Features items={row.writes} />
            </div>
          </li>
        ))}
      </ol>
      <div className="grid gap-3 border-t border-white/[0.07] px-4 py-3 text-sm sm:grid-cols-2">
        <div className="flex flex-wrap items-center gap-2">
          <StateTag state="fail">stored</StateTag>
          <Features items={["premium-support"]} />
          <span className="text-xs text-zinc-500">payload as authority</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StateTag state="pass">stored</StateTag>
          <Features items={[]} />
          <span className="text-xs text-zinc-500">
            reconciled to current state
          </span>
        </div>
      </div>
    </Figure>
  );
}

function ConcurrentUpdates() {
  const steps = [
    { a: "reads current set: [basic]", b: "" },
    { a: "", b: "reads current set: [basic]" },
    { a: "writes [basic, reports]", b: "" },
    { a: "", b: "writes [basic, api]" },
  ];

  return (
    <Figure
      label="Two workers, one customer"
      caption="Each worker is correct on its own. Interleaved between read and write, the second commit silently erases the first. Serializing work per customer, or rejecting a write whose read is stale, removes the window."
    >
      <div className="grid grid-cols-2 border-b border-white/[0.07] font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        <div className="px-4 py-2">Worker A · adds reports</div>
        <div className="border-l border-white/[0.07] px-4 py-2">
          Worker B · adds api
        </div>
      </div>
      <ol>
        {steps.map((step, i) => (
          <li
            key={i}
            className="grid grid-cols-2 border-b border-white/[0.04] text-[13px]"
          >
            <div className="px-4 py-2.5 font-mono text-zinc-300 break-words">
              {step.a && (
                <>
                  <span className="mr-2 text-zinc-600">t{i + 1}</span>
                  {step.a}
                </>
              )}
            </div>
            <div className="border-l border-white/[0.07] px-4 py-2.5 font-mono text-zinc-300 break-words">
              {step.b && (
                <>
                  <span className="mr-2 text-zinc-600">t{i + 1}</span>
                  {step.b}
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap items-center gap-2 px-4 py-3 text-sm">
        <StateTag state="fail">stored</StateTag>
        <Features items={["basic", "api"]} />
        <span className="text-xs text-zinc-500">
          reports is gone, and nothing failed
        </span>
      </div>
    </Figure>
  );
}

export function SequenceStrip({
  variant,
}: {
  variant: "stale-event" | "concurrent-updates";
}) {
  return variant === "stale-event" ? <StaleEvent /> : <ConcurrentUpdates />;
}
