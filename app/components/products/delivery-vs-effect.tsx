import { Figure, StateTag, type State } from "./figure";

interface Arrival {
  source: string;
  detail: string;
  byEvent: { state: State; label: string };
  byOperation: { state: State; label: string };
}

const arrivals: Arrival[] = [
  {
    source: "evt_A · checkout.session.completed",
    detail: "First delivery for cs_123",
    byEvent: { state: "pass", label: "grant" },
    byOperation: { state: "pass", label: "grant" },
  },
  {
    source: "Success page loads",
    detail: "Redirect fulfills cs_123, no event involved",
    byEvent: { state: "fail", label: "grant" },
    byOperation: { state: "neutral", label: "no-op" },
  },
  {
    source: "evt_A · redelivered",
    detail: "Stripe retries after a timeout",
    byEvent: { state: "neutral", label: "skip" },
    byOperation: { state: "neutral", label: "no-op" },
  },
];

const rowGrid =
  "grid grid-cols-2 gap-x-3 gap-y-2 px-4 py-3 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center";

export function DeliveryVsEffect() {
  return (
    <Figure
      label="One purchase, three arrivals"
      caption={
        <>
          Deduplicating on <code>event.id</code> only recognizes the same
          delivery twice. Keying on the business operation recognizes the same
          purchase, whatever path it arrived by.
        </>
      }
    >
      <div
        role="table"
        aria-label="Grants produced for Checkout Session cs_123 under two deduplication strategies"
      >
        <div role="rowgroup">
          <div
            role="row"
            className={`${rowGrid} border-b border-white/[0.07] font-mono text-[11px] uppercase tracking-wider text-zinc-500`}
          >
            <span role="columnheader" className="hidden sm:block">
              Arrival
            </span>
            <span role="columnheader">
              Keyed on{" "}
              <span className="normal-case text-zinc-300">event.id</span>
            </span>
            <span role="columnheader">
              Keyed on{" "}
              <span className="normal-case text-zinc-300">fulfill:cs_123</span>
            </span>
          </div>
        </div>
        <div role="rowgroup">
          {arrivals.map((arrival) => (
            <div
              key={arrival.source}
              role="row"
              className={`${rowGrid} border-b border-white/[0.05]`}
            >
              <div role="rowheader" className="col-span-2 sm:col-span-1">
                <div className="font-mono text-[13px] text-zinc-200 break-words">
                  {arrival.source}
                </div>
                <div className="text-xs text-zinc-500">{arrival.detail}</div>
              </div>
              <div role="cell">
                <StateTag state={arrival.byEvent.state}>
                  {arrival.byEvent.label}
                </StateTag>
              </div>
              <div role="cell">
                <StateTag state={arrival.byOperation.state}>
                  {arrival.byOperation.label}
                </StateTag>
              </div>
            </div>
          ))}
          <div role="row" className={`${rowGrid} text-sm`}>
            <div
              role="rowheader"
              className="col-span-2 font-mono text-[11px] uppercase tracking-wider text-zinc-500 sm:col-span-1"
            >
              Durable result
            </div>
            <div role="cell" className="text-state-fail">
              2 grants
            </div>
            <div role="cell" className="text-state-pass">
              1 grant
            </div>
          </div>
        </div>
      </div>
    </Figure>
  );
}
