import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink, FileText, Linkedin } from "lucide-react";
import { getPostBySlug, getAllSlugs, formatDate } from "@/lib/content";
import { MDXContent } from "@/app/components/mdx-content";

export async function generateStaticParams() {
  const slugs = getAllSlugs("automation");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug("automation", slug);

  if (!post) {
    return {
      title: "Automation Not Found",
    };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
  };
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

  const { frontmatter, content } = post;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Link
        href="/automation"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Automation
      </Link>

      <header className="mb-12">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold flex-1">
            {frontmatter.title}
          </h1>

          {/* Social Link Icons */}
          {frontmatter.links && (
            <div className="flex items-center gap-3">
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
