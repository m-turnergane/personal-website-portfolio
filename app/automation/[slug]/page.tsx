import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Github, ExternalLink, FileText, Linkedin } from "lucide-react";
import {
  getPostBySlug,
  getAllSlugs,
  formatDate,
  readingTime,
  type Post,
} from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { MDXContent } from "@/app/components/mdx-content";
import { posterityComponents } from "@/app/components/posterity";

export async function generateStaticParams() {
  const slugs = getAllSlugs("automation");
  return slugs.map((slug) => ({ slug }));
}

const themeComponents = {
  posterity: posterityComponents,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug("automation", slug);

  if (!post) {
    return {
      title: "Automation Not Found",
    };
  }

  const { frontmatter } = post;
  const title = frontmatter.seoTitle ?? frontmatter.title;
  const description = frontmatter.description ?? frontmatter.summary;
  const url = `/automation/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    keywords: frontmatter.tags,
    openGraph: {
      type: "article",
      url,
      title,
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
      title,
      description,
      creator: "@turner_obt",
    },
  };
}

function jsonLd(slug: string, post: Post) {
  const { frontmatter } = post;
  const url = `${siteConfig.url}/automation/${slug}`;

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
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Automation & Agents",
        item: `${siteConfig.url}/automation`,
      },
      { "@type": "ListItem", position: 3, name: frontmatter.title, item: url },
    ],
  };

  return JSON.stringify([article, breadcrumbs]).replace(/</g, "\\u003c");
}

function LongformArticle({ post }: { post: Post }) {
  const { frontmatter, content } = post;
  const components = frontmatter.theme
    ? themeComponents[frontmatter.theme]
    : undefined;

  return (
    <div
      className={`max-w-4xl mx-auto py-12 ${frontmatter.theme ? `theme-${frontmatter.theme}` : ""}`}
    >
      <Link
        href="/automation"
        className="inline-flex items-center gap-2 rounded text-zinc-400 hover:text-white transition-colors mb-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      >
        <ArrowLeft aria-hidden className="w-4 h-4" />
        Back to Automation
      </Link>

      <article>
        <header className="article-header mb-12 max-w-[68ch] border-b border-white/[0.07] pb-10">
          {frontmatter.eyebrow && (
            <p className="article-eyebrow mb-5 font-mono text-[11px] uppercase tracking-[0.14em] text-zinc-500">
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

        <MDXContent content={content} variant="product" components={components} />

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
            href="/automation"
            className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded text-zinc-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <ArrowLeft aria-hidden className="w-4 h-4" />
            Back to Automation
          </Link>
        </footer>
      </article>
    </div>
  );
}

export default async function AutomationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug("automation", slug);

  if (!post) {
    notFound();
  }

  const structuredData = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(slug, post) }}
    />
  );

  if (post.frontmatter.layout === "longform") {
    return (
      <>
        {structuredData}
        <LongformArticle post={post} />
      </>
    );
  }

  const { frontmatter, content } = post;

  return (
    <div className="max-w-4xl mx-auto py-12">
      {structuredData}
      <Link
        href="/automation"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Automation
      </Link>

      <header className="mb-12">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold flex-1 min-w-0 break-words">
            {frontmatter.title}
          </h1>

          {/* Social Link Icons */}
          {frontmatter.links && (
            <div className="flex shrink-0 items-center gap-3">
              {frontmatter.links.github && (
                <a
                  href={frontmatter.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-bg-primary rounded-md p-2"
                  aria-label="View source code on GitHub"
                >
                  <Github className="w-6 h-6" />
                </a>
              )}
              {frontmatter.links.linkedin && (
                <a
                  href={frontmatter.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-bg-primary rounded-md p-2"
                  aria-label="Read LinkedIn article"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {frontmatter.links.kaggle && (
                <a
                  href={frontmatter.links.kaggle}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-bg-primary rounded-md p-2"
                  aria-label="View dataset on Kaggle"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.358" />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>

        {frontmatter.summary && (
          <p className="text-lg text-zinc-400 mb-6 leading-relaxed">
            {frontmatter.summary}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
          <time>{formatDate(frontmatter.date)}</time>
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white/[0.03] text-zinc-400 border border-white/10 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <article className="mb-12">
        <MDXContent content={content} />
      </article>

      <Link
        href="/automation"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Automation
      </Link>
    </div>
  );
}
