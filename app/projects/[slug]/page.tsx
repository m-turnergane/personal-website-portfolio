import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Linkedin,
  Twitter,
} from "lucide-react";
import { getPostBySlug, getAllSlugs, formatDate } from "@/lib/content";
import { MDXContent } from "@/app/components/mdx-content";

export async function generateStaticParams() {
  const slugs = getAllSlugs("projects");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug("projects", slug);

  if (!post) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug("projects", slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  return (
    <div className="max-w-4xl mx-auto py-12">
      {/* Back Link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      {/* Header */}
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
              {frontmatter.links.live && (
                <a
                  href={frontmatter.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-bg-primary rounded-md p-2"
                  aria-label="View live demo"
                >
                  <ExternalLink className="w-6 h-6" />
                </a>
              )}
              {frontmatter.links.x && (
                <a
                  href={frontmatter.links.x}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-bg-primary rounded-md p-2"
                  aria-label="View X thread"
                >
                  <Twitter className="w-6 h-6" />
                </a>
              )}
              {frontmatter.links.linkedin && (
                <a
                  href={frontmatter.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-bg-primary rounded-md p-2"
                  aria-label="View LinkedIn article"
                >
                  <Linkedin className="w-6 h-6" />
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

      {/* Content */}
      <article className="mb-12">
        <MDXContent content={content} />
      </article>

      {/* Back Link (Bottom) */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>
    </div>
  );
}
