import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/content";
import { withAttribution } from "@/lib/attribution";
import { TrackedLink } from "@/app/components/products/tracked-link";
import { ConformanceMotif } from "@/app/components/products/conformance-motif";

const description =
  "Software I've shipped and sell, with the engineering write-up behind each one.";

export const metadata: Metadata = {
  title: "Products",
  description,
  alternates: { canonical: "/products" },
  openGraph: {
    title: "Products | Muhammad Gane",
    description,
    url: "/products",
    type: "website",
    siteName: "Muhammad Gane",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
};

export default function ProductsPage() {
  const products = getPublishedPosts("products").filter(
    (post) => post.frontmatter.product,
  );

  return (
    <div className="max-w-4xl mx-auto py-12">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-100">
          Products
        </h1>
        <p className="text-xl text-zinc-400 max-w-2xl">
          Software I&apos;ve shipped and sell. Each one started as a problem I
          kept running into, and each comes with the write-up of how I reasoned
          about it.
        </p>
      </header>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.03] rounded-xl border border-white/10">
          <p className="text-zinc-400 text-lg">Nothing here yet.</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {products.map(({ slug, frontmatter }) => {
            const product = frontmatter.product!;
            return (
              <li
                key={slug}
                className="group relative rounded-xl border border-white/10 bg-white/[0.03] transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.05]"
              >
                <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                      {product.license} · {product.version}
                    </p>
                    <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-zinc-100">
                      <Link
                        href={`/products/${slug}`}
                        className="rounded-xl after:absolute after:inset-0 after:rounded-xl focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-white/40"
                      >
                        {product.name}
                      </Link>
                    </h2>
                    <p className="mt-2 text-lg text-zinc-300">
                      {product.tagline}
                    </p>
                    <p className="mt-5 text-sm text-zinc-500">The write-up</p>
                    <p className="mt-1 text-zinc-300">{frontmatter.title}</p>
                  </div>
                  <ConformanceMotif className="hidden md:block pt-8 opacity-80 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="flex flex-col gap-4 border-t border-white/[0.07] px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                  <ul className="flex flex-wrap gap-2" aria-label="Stack">
                    {product.stack.map((item) => (
                      <li
                        key={item}
                        className="rounded border border-white/10 px-2 py-0.5 font-mono text-[11px] text-zinc-400"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap text-zinc-300 group-hover:text-white transition-colors">
                      Read the write-up
                      <ArrowRight
                        aria-hidden
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                    <TrackedLink
                      href={withAttribution(product.url, {
                        campaign: product.campaign,
                        content: "products-listing",
                      })}
                      placement="products_listing"
                      className="relative z-10 inline-flex items-center gap-1 whitespace-nowrap rounded text-zinc-500 underline-offset-4 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      Product site
                      <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
                    </TrackedLink>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
