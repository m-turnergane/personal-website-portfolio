import { ImageResponse } from "next/og";
import { getPostBySlug, getPublishedPosts } from "@/lib/content";

export const alt = "Muhammad Gane · Products";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getPublishedPosts("products").map((post) => ({ slug: post.slug }));
}

const states = [
  { tag: "PASS", color: "#86efac" },
  { tag: "PASS", color: "#86efac" },
  { tag: "SKIPPED", color: "#fcd34d" },
  { tag: "FAIL", color: "#fca5a5" },
];

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug("products", slug);
  const title = post?.frontmatter.title ?? "Products";
  const productName = post?.frontmatter.product?.name;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background:
          "linear-gradient(180deg, #0a0c14 0%, #0a0a0a 70%, #080808 100%)",
        color: "#fafafa",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 22,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#71717a",
        }}
      >
        {productName ? `Products · ${productName}` : "Products"}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 60,
          fontWeight: 700,
          lineHeight: 1.12,
          letterSpacing: -1.5,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#d4d4d8" }}>
          muhammadgane.com
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {states.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                fontSize: 18,
                letterSpacing: 2,
                color: s.color,
                border: `1px solid ${s.color}55`,
                padding: "6px 12px",
                borderRadius: 4,
              }}
            >
              {s.tag}
            </div>
          ))}
        </div>
      </div>
    </div>,
    size,
  );
}
