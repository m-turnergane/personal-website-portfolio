import { siteConfig } from "@/lib/site-config";
import { getAllPosts } from "@/lib/content";

export async function GET() {
  const baseUrl = siteConfig.url;

  // Gather posts from all content collections
  const projects = getAllPosts("projects");
  const automation = getAllPosts("automation");
  const writing = getAllPosts("writing");
  const trading = getAllPosts("trading");

  // Combine all posts with their collection type
  const allPosts = [
    ...projects.map((p) => ({ ...p, collection: "projects" })),
    ...automation.map((p) => ({ ...p, collection: "automation" })),
    ...writing.map((p) => ({ ...p, collection: "writing" })),
    ...trading.map((p) => ({ ...p, collection: "trading-lab" })),
  ];

  // Sort by date (newest first) and filter to published only
  const sortedPosts = allPosts
    .filter((post) => post.frontmatter.status === "published")
    .sort((a, b) => {
      const dateA = new Date(a.frontmatter.date);
      const dateB = new Date(b.frontmatter.date);
      return dateB.getTime() - dateA.getTime();
    });

  const itemsXml = sortedPosts
    .map(
      (post) =>
        `<item>
          <title>${escapeXml(post.frontmatter.title)}</title>
          <link>${baseUrl}/${post.collection}/${post.slug}</link>
          <description>${escapeXml(post.frontmatter.summary || "")}</description>
          <pubDate>${new Date(post.frontmatter.date).toUTCString()}</pubDate>
        </item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>${escapeXml(siteConfig.name)}</title>
        <link>${baseUrl}</link>
        <description>${escapeXml(siteConfig.description)}</description>
        ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}

// Helper to escape XML special characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
