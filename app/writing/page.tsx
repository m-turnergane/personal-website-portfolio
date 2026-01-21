import Link from "next/link";
import { getPublishedPosts, formatDate } from "@/lib/content";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Writing",
  description: "Technical articles, tutorials, and thoughts on software development. Sharing knowledge and experiences.",
};

export default function WritingPage() {
  const posts = getPublishedPosts("writing");

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Writing
        </h1>
        <p className="text-xl text-neutral-400">
          Technical articles, tutorials, and thoughts on software development. Sharing knowledge and experiences.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
          <p className="text-neutral-400 text-lg mb-2">No articles yet</p>
          <p className="text-neutral-500 text-sm">Check back soon for updates!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group block p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                    {post.frontmatter.title}
                  </h2>
                  <p className="text-neutral-400 mb-3">
                    {post.frontmatter.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <time className="text-neutral-500">
                      {formatDate(post.frontmatter.date)}
                    </time>
                    <div className="flex gap-2">
                      {post.frontmatter.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
