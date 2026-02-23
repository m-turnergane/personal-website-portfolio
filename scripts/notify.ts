import fs from "fs";
import path from "path";
import matter from "gray-matter";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

const COLLECTION_DIRS: Record<string, string> = {
  writing: "content/writing",
  trading: "content/trading",
  automation: "content/automation",
  projects: "content/projects",
};

async function main() {
  const args = process.argv.slice(2);
  const flags: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith("--")) {
      const key = args[i].replace("--", "");
      flags[key] = args[i + 1] || "";
      i++;
    }
  }

  const collection = flags.collection;
  const slug = flags.slug;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://muhammadgane.com";
  const secret = process.env.NOTIFY_SECRET;

  if (!collection || !slug) {
    console.error(
      "\nUsage: npx tsx scripts/notify.ts --collection <name> --slug <slug>\n"
    );
    console.error("Collections: writing, trading, automation, projects\n");
    console.error("Example:");
    console.error(
      "  npx tsx scripts/notify.ts --collection trading --slug my-new-model\n"
    );
    process.exit(1);
  }

  if (!secret) {
    console.error(
      "Error: NOTIFY_SECRET not found. Set it in .env.local or as an environment variable.\n"
    );
    process.exit(1);
  }

  const contentDir = COLLECTION_DIRS[collection];
  if (!contentDir) {
    console.error(`Unknown collection: "${collection}"`);
    console.error(
      `Valid collections: ${Object.keys(COLLECTION_DIRS).join(", ")}\n`
    );
    process.exit(1);
  }

  const mdxPath = path.join(process.cwd(), contentDir, `${slug}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    console.error(`MDX file not found: ${mdxPath}\n`);
    process.exit(1);
  }

  const fileContents = fs.readFileSync(mdxPath, "utf8");
  const { data } = matter(fileContents);

  console.log(`\n  Notifying subscribers about:`);
  console.log(`  Collection:  ${collection}`);
  console.log(`  Title:       ${data.title}`);
  console.log(`  Slug:        ${slug}`);
  console.log(`  Summary:     ${data.summary || "(none)"}\n`);

  const res = await fetch(`${siteUrl}/api/notify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({
      collection,
      slug,
      title: data.title,
      summary: data.summary || "",
    }),
  });

  const result = await res.json();

  if (!res.ok) {
    console.error(`  Failed: ${result.error}\n`);
    process.exit(1);
  }

  console.log(`  Sent: ${result.sent} notification(s)`);
  if (result.failed > 0) {
    console.log(`  Failed: ${result.failed}`);
  }
  console.log("  Done.\n");
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
