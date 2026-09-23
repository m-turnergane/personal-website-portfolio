import type { ReactNode } from "react";

export function Invariant({ children }: { children: ReactNode }) {
  return (
    <aside className="invariant my-6 max-w-[68ch] border-l-2 border-state-pass/40 py-1 pl-4">
      <p className="!my-0 mb-1 font-mono text-[11px] uppercase tracking-[0.14em] !text-state-pass/80">
        Invariant
      </p>
      <div className="text-zinc-100 [&>p]:!my-0 [&>p]:!text-zinc-100">
        {children}
      </div>
    </aside>
  );
}
