import Link from "next/link";
import { getPublishedPosts, getAllPosts, formatDate } from "@/lib/content";
import { ArrowRight, FlaskConical } from "lucide-react";

export const metadata = {
  title: "Trading Lab",
  description:
    "Quantitative trading experiments and market analysis tools. Exploring algorithmic strategies and data-driven insights.",
};

export default function TradingLabPage() {
  const publishedPosts = getPublishedPosts("trading");
  const allPosts = getAllPosts("trading");
  const inDevelopmentPosts = allPosts.filter(
    (post) => post.frontmatter.status !== "published"
  );

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-zinc-100">
          Trading Lab
        </h1>
        <p className="text-xl text-zinc-400">
          Quantitative trading experiments and market analysis tools. Exploring
          algorithmic strategies and data-driven insights.
        </p>
      </div>

      {/* Published Projects */}
      {publishedPosts.length > 0 && (
        <div className="space-y-6 mb-12">
          {publishedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/trading-lab/${post.slug}`}
              className="group block p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-zinc-100 group-hover:text-white transition-colors">
                    {post.frontmatter.title}
                  </h2>
                  <p className="text-zinc-400 mb-3">
                    {post.frontmatter.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <time className="text-zinc-500">
                      {formatDate(post.frontmatter.date)}
                    </time>
                    <div className="flex gap-2">
                      {post.frontmatter.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-white/[0.03] text-zinc-400 border border-white/10 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* In Development Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4 text-zinc-300">
          In Development
        </h3>
        {inDevelopmentPosts.length === 0 ? (
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-xl">
            <p className="text-zinc-500 text-center">
              No projects currently in development
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {inDevelopmentPosts.map((post) => (
              <div
                key={post.slug}
                className="p-6 bg-white/[0.03] border border-white/10 rounded-xl opacity-70"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-zinc-200">
                        {post.frontmatter.title}
                      </h3>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded text-xs">
                        {post.frontmatter.status}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm">
                      {post.frontmatter.summary}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
