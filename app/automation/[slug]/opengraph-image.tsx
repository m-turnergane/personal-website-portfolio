import { ImageResponse } from "next/og";
import { getAllSlugs, getPostBySlug } from "@/lib/content";

export const alt = "Muhammad Gane · Automation & Agents";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllSlugs("automation").map((slug) => ({ slug }));
}

const VELLUM = "#d8c6a0";
const SEPIA = "#9c7a4b";

const desk = ["Archivist", "Scriptor", "Atelier", "Pulse"];

// Satori has no built-in serif. Once any font is registered, every face used on
// the card must be registered too, or glyphs fall through to the wrong one.
// On failure the card renders with Satori's default face.
async function loadGoogleFont(
  family: string,
  weight: number,
  text?: string,
): Promise<ArrayBuffer | null> {
  try {
    const params = `family=${family.replace(/ /g, "+")}:wght@${weight}${
      text ? `&text=${encodeURIComponent(text)}` : ""
    }`;
    const css = await fetch(`https://fonts.googleapis.com/css2?${params}`).then(
      (res) => res.text(),
    );
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!src) return null;
    return await fetch(src[1]).then((res) => res.arrayBuffer());
  } catch {
    return null;
  }
}

function PosterityCard({ title }: { title: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "64px 80px",
        background:
          "radial-gradient(ellipse at 20% 0%, #1d1811 0%, #100d0a 55%, #0a0908 100%)",
        color: "#f3ead8",
        fontFamily: "Inter",
        border: `1px solid ${SEPIA}33`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "Inter",
          fontSize: 20,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#8a7b63",
        }}
      >
        <div style={{ display: "flex" }}>Automation & Agents · Case study</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontFamily: "Cormorant",
            fontSize: 104,
            letterSpacing: 20,
            color: VELLUM,
            lineHeight: 1,
          }}
        >
          POSTERITY
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 44,
            lineHeight: 1.2,
            maxWidth: 980,
            color: "#f3ead8",
            fontFamily: "Inter",
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: `1px solid ${SEPIA}55`,
          paddingTop: 26,
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: "#d4cbb8" }}>
          muhammadgane.com
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              display: "flex",
              fontSize: 16,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#0f0c09",
              background: VELLUM,
              padding: "6px 12px",
              borderRadius: 3,
            }}
          >
            Vellum · EIC
          </div>
          {desk.map((name) => (
            <div
              key={name}
              style={{
                display: "flex",
                fontSize: 16,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: VELLUM,
                border: `1px solid ${SEPIA}88`,
                padding: "6px 12px",
                borderRadius: 3,
              }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DefaultCard({ title }: { title: string }) {
  return (
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
        Automation & Agents
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 56,
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
          borderTop: "1px solid rgba(255,255,255,0.12)",
          paddingTop: 28,
          fontSize: 26,
          color: "#d4d4d8",
        }}
      >
        muhammadgane.com
      </div>
    </div>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug("automation", slug);
  const title = post?.frontmatter.title ?? "Automation & Agents";

  if (post?.frontmatter.theme === "posterity") {
    const [serif, regular, bold] = await Promise.all([
      loadGoogleFont("Cormorant Garamond", 500, "POSTERITY"),
      loadGoogleFont("Inter", 400),
      loadGoogleFont("Inter", 700),
    ]);
    const fonts =
      serif && regular && bold
        ? [
            { name: "Inter", data: regular, style: "normal" as const, weight: 400 as const },
            { name: "Inter", data: bold, style: "normal" as const, weight: 700 as const },
            { name: "Cormorant", data: serif, style: "normal" as const, weight: 500 as const },
          ]
        : undefined;
    return new ImageResponse(<PosterityCard title={title} />, { ...size, fonts });
  }

  return new ImageResponse(<DefaultCard title={title} />, size);
}
