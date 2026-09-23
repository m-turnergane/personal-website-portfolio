import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import {
  getPostBySlug,
  getPublishedPosts,
  formatDate,
  readingTime,
} from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { withAttribution } from "@/lib/attribution";
import { MDXContent } from "@/app/components/mdx-content";
import { ProductCallout } from "@/app/components/products/product-callout";
import { TrackedLink } from "@/app/components/products/tracked-link";

export const dynamicParams = false;

export async function generateStaticParams() {
  return getPublishedPosts("products").map((post) => ({ slug: post.slug }));
}

function getProductPost(slug: string) {
  const post = getPostBySlug("products", slug);
  if (!post || post.frontmatter.status !== "published") return null;
  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getProductPost(slug);
  if (!post) return { title: "Product Not Found" };

  const { frontmatter } = post;
  const description = frontmatter.description ?? frontmatter.summary;
  const url = `/products/${slug}`;

  return {
    title: frontmatter.title,
    description,
    alternates: { canonical: url },
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    keywords: frontmatter.tags,
    openGraph: {
      type: "article",
      url,
      title: frontmatter.title,
      description,
      siteName: siteConfig.name,
      locale: "en_US",
      publishedTime: frontmatter.date,
      modifiedTime: frontmatter.updated ?? frontmatter.date,
      authors: [siteConfig.author.url],
      tags: frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description,
      creator: "@turner_obt",
    },
  };
}

function jsonLd(slug: string) {
  const post = getProductPost(slug)!;
  const { frontmatter } = post;
  const product = frontmatter.product;
  const url = `${siteConfig.url}/products/${slug}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: frontmatter.title,
    description: frontmatter.description ?? frontmatter.summary,
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated ?? frontmatter.date,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    keywords: frontmatter.tags.join(", "),
    ...(product && {
      about: {
        "@type": "SoftwareApplication",
        name: product.name,
        description: product.tagline,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Node.js 20, Node.js 22",
        softwareVersion: product.version.replace(/^v/, ""),
        url: product.url,
        author: { "@type": "Person", name: siteConfig.author.name },
        ...(product.pricing && {
          offers: {
            "@type": "Offer",
            price: product.pricing.price.replace(/[^0-9.]/g, ""),
            priceCurrency: "USD",
            url: product.url,
          },
        }),
      },
    }),
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteConfig.url}/products`,
      },
      { "@type": "ListItem", position: 3, name: frontmatter.title, item: url },
    ],
  };

  return JSON.stringify([article, breadcrumbs]).replace(/</g, "\\u003c");
}

export default async function ProductArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getProductPost(slug);
  if (!post) notFound();

  const { frontmatter, content } = post;
  const product = frontmatter.product;
  const productHref = product
    ? withAttribution(product.url, {
        campaign: product.campaign,
        content: product.attribution,
      })
    : undefined;

  const injected = product
    ? {
        ProductCallout: () => (
          <ProductCallout product={product} placement="article_callout" />
        ),
        ProductLink: ({ children }: { children: ReactNode }) => (
          <TrackedLink href={productHref!} placement="article_closing">
            {children}
          </TrackedLink>
        ),
      }
    : undefined;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(slug) }}
      />

      <Link
        href="/products"
        className="inline-flex items-center gap-2 rounded text-zinc-400 hover:text-white transition-colors mb-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <ArrowLeft aria-hidden className="w-4 h-4" />
        Back to Products
      </Link>

      <article>
        <header className="mb-12 max-w-[68ch] border-b border-white/[0.07] pb-10">
          {frontmatter.eyebrow && (
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
              {frontmatter.eyebrow}
            </p>
          )}
          <h1 className="title text-[1.75rem] leading-[1.15] sm:text-4xl sm:leading-[1.12] md:text-[2.75rem] font-bold text-zinc-50">
            {frontmatter.title}
          </h1>
          {frontmatter.subtitle && (
            <p className="mt-5 text-lg md:text-xl leading-relaxed text-zinc-300">
              {frontmatter.subtitle}
            </p>
          )}
          <p className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500">
            <span>{siteConfig.author.name}</span>
            <span aria-hidden>·</span>
            <time dateTime={frontmatter.date}>
              {formatDate(frontmatter.date)}
            </time>
            <span aria-hidden>·</span>
            <span>{readingTime(content)} min read</span>
          </p>
        </header>

        <MDXContent content={content} variant="product" components={injected} />

        <footer className="mt-16 flex flex-col gap-6 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-2" aria-label="Topics">
            {frontmatter.tags.map((tag) => (
              <li
                key={tag}
                className="px-3 py-1 bg-white/[0.03] text-zinc-400 border border-white/10 rounded-full text-xs"
              >
                {tag}
              </li>
            ))}
          </ul>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded text-zinc-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <ArrowLeft aria-hidden className="w-4 h-4" />
            Back to Products
          </Link>
        </footer>
      </article>
    </div>
  );
}
