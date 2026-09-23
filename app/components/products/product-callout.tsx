import { ArrowRight } from "lucide-react";
import type { ProductMeta } from "@/lib/content";
import { withAttribution } from "@/lib/attribution";
import { TrackedLink } from "./tracked-link";

export function ProductCallout({
  product,
  placement,
}: {
  product: ProductMeta;
  placement: string;
}) {
  const href = withAttribution(product.url, {
    campaign: product.campaign,
    content: product.attribution,
  });

  return (
    <aside
      aria-labelledby="product-callout-title"
      className="product-figure not-prose relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.025]"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-state-pass/50 via-white/10 to-transparent"
      />
      <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div>
          <p className="my-0 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
            The product · {product.version}
          </p>
          <h2
            id="product-callout-title"
            className="mb-3 mt-3 text-2xl font-bold leading-tight text-white"
          >
            {product.name}
          </h2>
          <p className="my-0 text-[15px] leading-relaxed text-zinc-300">
            The failure model in this essay, packaged as a TypeScript runtime,
            PostgreSQL primitives and a conformance suite you run against your
            own integration.
          </p>
          <ul className="my-5 flex flex-wrap gap-2 pl-0" aria-label="Stack">
            {product.stack.map((item) => (
              <li
                key={item}
                className="my-0 list-none rounded border border-white/10 px-2 py-0.5 pl-2 font-mono text-[11px] text-zinc-400"
              >
                {item}
              </li>
            ))}
          </ul>
          <TrackedLink
            href={href}
            placement={placement}
            className="group flex w-full items-center justify-between gap-3 rounded-md sm:inline-flex sm:w-auto sm:justify-start border border-white/20 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:border-white/40 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
          >
            Explore {product.name}
            <ArrowRight
              aria-hidden
              className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </TrackedLink>
        </div>

        {product.pricing && (
          <div className="border-t border-white/[0.07] pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <p className="my-0 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              {product.pricing.edition}
            </p>
            <p className="mb-4 mt-2 text-zinc-100">
              <span className="font-mono text-2xl">
                {product.pricing.price}
              </span>
            </p>
            <ul className="my-0 space-y-1.5 pl-0">
              {product.pricing.terms.map((term) => (
                <li
                  key={term}
                  className="my-0 flex gap-2 pl-0 text-sm leading-snug text-zinc-400"
                >
                  <span aria-hidden className="text-zinc-600">
                    ·
                  </span>
                  {term}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
