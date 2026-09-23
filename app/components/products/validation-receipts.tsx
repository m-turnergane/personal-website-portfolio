import { Figure } from "./figure";

const receipts = [
  { value: "83", label: "automated tests in CI" },
  { value: "14", label: "PostgreSQL integration and concurrency tests" },
  { value: "20 · 22", label: "Node.js versions validated in CI" },
  {
    value: "Sandbox",
    label: "full Stripe lifecycle exercised against a real sandbox",
  },
];

export function ValidationReceipts() {
  return (
    <Figure label="Verification · release v0.2.0">
      <dl className="grid grid-cols-2 lg:grid-cols-4">
        {receipts.map((receipt, i) => (
          <div
            key={receipt.label}
            className={`flex flex-col-reverse justify-end px-4 py-4 ${i % 2 === 1 ? "border-l border-white/[0.07]" : ""} ${
              i >= 2 ? "border-t border-white/[0.07] lg:border-t-0" : ""
            } ${i === 2 ? "lg:border-l" : ""}`}
          >
            <dt className="mt-1 text-[13px] leading-snug text-zinc-500">
              {receipt.label}
            </dt>
            <dd className="font-mono text-xl text-zinc-100 sm:text-2xl">
              {receipt.value}
            </dd>
          </div>
        ))}
      </dl>
    </Figure>
  );
}
