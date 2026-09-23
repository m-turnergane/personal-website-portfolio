import { ArrowUpRight } from "lucide-react";
import { posterity } from "@/lib/posterity";
import { TrackedLink } from "@/app/components/products/tracked-link";
import { Kicker, POSTERITY_CLICK_EVENT } from "./figure";

const record = [
  { term: "Subject", value: "Dark history, vanished kingdoms, mythology, folklore" },
  { term: "Format", value: "Vertical 9:16 Shorts, cross-posted to TikTok and Reels" },
  { term: "Cadence", value: "Most mornings, when an episode clears the gate" },
  { term: "Operated by", value: "Five agents and one human" },
];

export function PosterityIdentity() {
  const { brand, cta } = posterity;

  return (
    <section
      aria-label="Project record: Posterity"
      className="product-figure not-prose pv-plate relative overflow-hidden rounded-lg border border-vellum/15"
    >
      <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10">
        <div>
          <Kicker className="text-vellum/60">Project record</Kicker>
          <p className="pv-serif mt-4 text-[2rem] font-medium uppercase leading-none tracking-[0.14em] text-vellum sm:text-5xl sm:tracking-[0.18em]">
            {brand.name}
          </p>
          <p className="pv-serif mt-4 text-xl italic leading-snug text-zinc-200 sm:text-[1.375rem]">
            {brand.tagline}
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
            Cinematic stories told in under ninety seconds, documented where the
            record is solid and labelled where it&apos;s legend.
          </p>
        </div>

        <dl className="grid content-start gap-4 border-t border-vellum/10 pt-6 text-sm md:border-l md:border-t-0 md:pl-8 md:pt-1">
          {record.map(({ term, value }) => (
            <div key={term}>
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">
                {term}
              </dt>
              <dd className="mt-1 leading-snug text-zinc-200">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex flex-col gap-4 border-t border-vellum/10 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <TrackedLink
          href={cta.primary.href}
          event={POSTERITY_CLICK_EVENT}
          placement="identity_youtube"
          className="pv-button group inline-flex items-center justify-between gap-3 rounded-md px-4 py-2.5 text-sm font-medium sm:justify-start"
        >
          {cta.primary.label}
          <ArrowUpRight
            aria-hidden
            className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </TrackedLink>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
          <span>Also on</span>
          {cta.secondary.map((link) => (
            <TrackedLink
              key={link.label}
              href={link.href}
              event={POSTERITY_CLICK_EVENT}
              placement={`identity_${link.label.toLowerCase()}`}
              className="pv-link rounded text-zinc-300"
            >
              {link.label}
            </TrackedLink>
          ))}
        </p>
      </div>
    </section>
  );
}
