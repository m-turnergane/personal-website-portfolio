import { siteConfig } from "@/lib/site-config";

const ATTRIBUTION_SOURCE = new URL(siteConfig.author.url).hostname;

/**
 * Append referral attribution parameters to an outbound product URL.
 */
export function withAttribution(
  url: string,
  { campaign, content }: { campaign: string; content: string },
): string {
  const target = new URL(url);
  target.searchParams.set("utm_source", ATTRIBUTION_SOURCE);
  target.searchParams.set("utm_medium", "referral");
  target.searchParams.set("utm_campaign", campaign);
  target.searchParams.set("utm_content", content);
  return target.toString();
}
