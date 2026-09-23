import { ArrowUpRight } from "lucide-react";
import { posterity } from "@/lib/posterity";
import { TrackedLink } from "@/app/components/products/tracked-link";
import { POSTERITY_CLICK_EVENT } from "./figure";

export function PosterityWatch() {
  const { brand, cta } = posterity;

  return (
    <aside
      aria-labelledby="posterity-watch-title"
      className="product-figure not-prose pv-plate relative overflow-hidden rounded-lg border border-vellum/20 px-6 py-8 text-center sm:px-10 sm:py-10"
    >
      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-vellum/60">
        See what the desk ships
      </p>
      <h2
        id="posterity-watch-title"
        className="pv-serif mt-4 text-[2rem] font-medium uppercase leading-none tracking-[0.14em] text-vellum sm:text-[2.75rem] sm:tracking-[0.18em]"
      >
        {brand.name}
      </h2>
      <p className="pv-serif mx-auto mt-4 max-w-[34ch] text-lg italic leading-snug text-zinc-300 sm:text-xl">
        {brand.tagline}
      </p>
      <p className="mt-3 text-sm text-zinc-500">
        New Shorts most mornings on {brand.handles.youtube}.
      </p>

      <div className="mt-7 flex flex-col items-center gap-4">
        <TrackedLink
          href={cta.primary.href}
          event={POSTERITY_CLICK_EVENT}
          placement="closing_youtube"
          className="pv-button group inline-flex items-center gap-3 rounded-md px-5 py-3 text-[15px] font-medium"
        >
          {cta.primary.label}
          <ArrowUpRight
            aria-hidden
            className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </TrackedLink>
        <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-zinc-500">
          <span>Also on</span>
          {cta.secondary.map((link) => (
            <TrackedLink
              key={link.label}
              href={link.href}
              event={POSTERITY_CLICK_EVENT}
              placement={`closing_${link.label.toLowerCase()}`}
              className="pv-link rounded text-zinc-300"
            >
              {link.label}
            </TrackedLink>
          ))}
        </p>
      </div>
    </aside>
  );
}
