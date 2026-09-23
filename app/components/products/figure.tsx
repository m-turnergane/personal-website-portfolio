import type { ReactNode } from "react";

export type State = "pass" | "fail" | "skip" | "neutral";

const STATE_CLASSES: Record<State, string> = {
  pass: "text-state-pass border-state-pass/30 bg-state-pass/[0.06]",
  fail: "text-state-fail border-state-fail/30 bg-state-fail/[0.06]",
  skip: "text-state-skip border-state-skip/30 bg-state-skip/[0.06]",
  neutral: "text-zinc-400 border-white/10 bg-white/[0.02]",
};

export function StateTag({
  state,
  children,
  className = "",
}: {
  state: State;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-[3px] border px-1.5 py-0.5 font-mono text-[11px] uppercase leading-none tracking-wider ${STATE_CLASSES[state]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Figure({
  label,
  caption,
  children,
}: {
  label?: string;
  caption?: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className="product-figure not-prose">
      <div className="rounded-lg border border-white/10 bg-[#0d0d0f]/80">
        {label && (
          <div className="border-b border-white/[0.07] px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
            {label}
          </div>
        )}
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 max-w-[68ch] text-sm leading-relaxed text-zinc-500 [&_code]:text-zinc-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
