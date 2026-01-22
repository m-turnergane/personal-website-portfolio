import { getPublishedPosts, formatDate } from "@/lib/content";
import { ArrowRight, Feather } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Writing",
  description:
    "Short stories, poetry, and personal reflections. Creative literature that feels more like play than work.",
};

export default function WritingPage() {
  const posts = getPublishedPosts("writing");

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Writing</h1>
        <blockquote className="border-l-2 border-white/20 pl-6">
          <p className="text-xl text-neutral-300 italic leading-relaxed">
            "A reader lives a thousand lives before he dies. The man who never
            reads lives only one."
          </p>
          <footer className="mt-3 text-neutral-500 text-sm">
            — George R.R. Martin
          </footer>
        </blockquote>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-white/[0.03] rounded-2xl border border-white/10">
          <div className="mb-6">
            <Feather className="w-12 h-12 text-white/20 mx-auto" />
          </div>
          <h2 className="text-xl font-medium text-white/80 mb-3">
            Still gathering the words
          </h2>
          <p className="text-neutral-400 max-w-md mx-auto leading-relaxed">
            I'm building up a body of work before making it public—short
            stories, reflections, maybe a few poems that survived the drafts.
            The kind of writing that takes time to get right.
          </p>
          <p className="text-neutral-500 text-sm mt-6 italic">
            Check back soon. The words are coming.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/writing/${post.slug}`}
              className="group block p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">
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
                          className="px-2 py-1 bg-white/[0.06] text-neutral-300 border border-white/10 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
