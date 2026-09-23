import type { ReactNode } from "react";

export const POSTERITY_CLICK_EVENT = "posterity_click";

export function PosterityFigure({
  label,
  caption,
  children,
  className = "",
}: {
  label?: string;
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`product-figure not-prose ${className}`}>
      <div className="pv-plate overflow-hidden rounded-lg border border-vellum/15">
        {label && (
          <div className="border-b border-vellum/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-vellum/70">
            {label}
          </div>
        )}
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 max-w-[68ch] text-sm leading-relaxed text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Kicker({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500 ${className}`}
    >
      {children}
    </p>
  );
}
