import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Twitter, Linkedin } from "lucide-react";
import { getPostBySlug, getAllSlugs, formatDate } from "@/lib/content";
import { MDXContent } from "@/app/components/mdx-content";

export async function generateStaticParams() {
  const slugs = getAllSlugs("writing");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug("writing", slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
  };
}

export default async function WritingPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug("writing", slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Link
        href="/writing"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-cyan-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Writing
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {frontmatter.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400 mb-6">
          <time>{formatDate(frontmatter.date)}</time>
          {frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {frontmatter.links && (frontmatter.links.x || frontmatter.links.linkedin) && (
          <div className="flex flex-wrap gap-3">
            {frontmatter.links.x && (
              <a
                href={frontmatter.links.x}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-lg transition-all"
              >
                <Twitter className="w-4 h-4" />
                Discuss on X
              </a>
            )}
            {frontmatter.links.linkedin && (
              <a
                href={frontmatter.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-lg transition-all"
              >
                <Linkedin className="w-4 h-4" />
                Share on LinkedIn
              </a>
            )}
          </div>
        )}
      </header>

      <article className="mb-12">
        <MDXContent content={content} />
      </article>

      <Link
        href="/writing"
        className="inline-flex items-center gap-2 text-neutral-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Writing
      </Link>
    </div>
  );
}
