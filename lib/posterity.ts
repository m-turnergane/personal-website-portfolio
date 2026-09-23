import raw from "@/content/data/posterity.json";

/* ========== Episode catalogue (content/data/posterity.json) ========== */

export type EpisodeStatus = "live" | "yt-only" | "draft";
export type Platform = "youtube" | "tiktok" | "instagram";

export interface EpisodeLink {
  platform: Platform;
  label: string;
  href: string;
}

export interface Episode {
  day: number;
  date: string;
  slug: string;
  title: string;
  lane: string;
  status: EpisodeStatus;
  youtubeShortsId: string | null;
  /** Only platforms with a real URL in the source data, YouTube first. */
  links: EpisodeLink[];
}

export interface Agent {
  name: string;
  role: string;
  owns: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  instagram: "Instagram",
};

const PLATFORM_ORDER: Platform[] = ["youtube", "tiktok", "instagram"];
const STATUSES: EpisodeStatus[] = ["live", "yt-only", "draft"];

function fail(message: string): never {
  throw new Error(`[posterity.json] ${message}`);
}

// The supplied channel CTA carries the attribution parameters for every
// outbound Posterity link, so the campaign is defined in one place.
const ATTRIBUTION = new URL(raw.cta.primary.href).searchParams;

export function withPosterityAttribution(url: string): string {
  const target = new URL(url);
  ATTRIBUTION.forEach((value, key) => target.searchParams.set(key, value));
  return target.toString();
}

function parseEpisode(entry: (typeof raw.episodes)[number]): Episode {
  const where = `episode day ${entry.day ?? "?"}`;
  if (!Number.isInteger(entry.day)) fail(`${where}: missing day`);
  if (!entry.slug || !entry.title || !entry.lane) {
    fail(`${where}: slug, title and lane are required`);
  }
  if (Number.isNaN(Date.parse(entry.date))) fail(`${where}: invalid date`);
  if (!STATUSES.includes(entry.status as EpisodeStatus)) {
    fail(`${where}: unknown status "${entry.status}"`);
  }
  if (entry.youtubeShortsId && !/^[\w-]{11}$/.test(entry.youtubeShortsId)) {
    fail(`${where}: malformed youtubeShortsId`);
  }

  const sourceLinks = entry.links as Partial<Record<Platform, string | null>>;
  const links = PLATFORM_ORDER.flatMap((platform) => {
    const href = sourceLinks[platform];
    if (!href) return [];
    try {
      new URL(href);
    } catch {
      fail(`${where}: invalid ${platform} URL`);
    }
    return [
      {
        platform,
        label: PLATFORM_LABELS[platform],
        href: withPosterityAttribution(href),
      },
    ];
  });

  return {
    day: entry.day,
    date: entry.date,
    slug: entry.slug,
    title: entry.title,
    lane: entry.lane,
    status: entry.status as EpisodeStatus,
    youtubeShortsId: entry.youtubeShortsId ?? null,
    links,
  };
}

export const posterity = {
  brand: {
    name: raw.brand.name,
    tagline: raw.brand.tagline,
    about: raw.brand.about,
    format: raw.brand.format,
    cadence: raw.brand.cadence,
    handles: raw.brand.handles,
  },
  cta: {
    primary: raw.cta.primary as CtaLink,
    secondary: raw.cta.secondary as CtaLink[],
  },
  agents: raw.agents as Agent[],
  episodes: raw.episodes
    .filter((entry) => entry.status !== "draft")
    .map(parseEpisode)
    .sort((a, b) => a.day - b.day),
  updated: raw.updated,
};

export const FEATURED_SLUG = "thonis-heracleion";

export function isMythBust(episode: Episode): boolean {
  return /myth/i.test(episode.lane);
}

/* ========== YouTube media ========== */

/** 4:3 frames with the vertical Short centred; crop to 9:16 with object-cover. */
export function thumbnailSources(id: string) {
  const base = `https://i.ytimg.com/vi/${id}`;
  return {
    src: `${base}/hqdefault.jpg`,
    srcSet: `${base}/hqdefault.jpg 480w, ${base}/sddefault.jpg 640w`,
  };
}

/** The custom thumbnail at 1280×720 (~405px-wide vertical frame). One per page. */
export function posterThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hq720.jpg`;
}

export function embedUrl(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
}

/* ========== Desk structure (article diagrams) ========== */

export type Actor = "agent" | "human" | "platform";

export interface PipelineStep {
  title: string;
  detail: string;
  owner: string;
  actor: Actor;
  gate?: boolean;
}

export interface PipelinePhase {
  phase: string;
  steps: PipelineStep[];
}

export const pipeline: PipelinePhase[] = [
  {
    phase: "Prepare",
    steps: [
      {
        title: "Discover & score",
        detail: "Shortlist stories that can teach something in the first two seconds",
        owner: "Archivist · Vellum greenlights",
        actor: "agent",
      },
      {
        title: "INFO PACKET + VO",
        detail: "Research depth, full voiceover and a brief for every sequence",
        owner: "Scriptor + Archivist",
        actor: "agent",
      },
    ],
  },
  {
    phase: "Make",
    steps: [
      {
        title: "Plates",
        detail: "I generate and select the stills, plus a unique outro",
        owner: "Owner",
        actor: "human",
        gate: true,
      },
      {
        title: "Assemble",
        detail: "VO, spoken captions, music and outro into a rough cut",
        owner: "Atelier",
        actor: "agent",
      },
    ],
  },
  {
    phase: "Gate",
    steps: [
      {
        title: "Mute gate",
        detail: "Does the cut teach with the sound off? Failures stay internal",
        owner: "Vellum",
        actor: "agent",
        gate: true,
      },
      {
        title: "Final look",
        detail: "Nothing goes public until I've watched it",
        owner: "Owner",
        actor: "human",
        gate: true,
      },
    ],
  },
  {
    phase: "Publish",
    steps: [
      {
        title: "YouTube first",
        detail: "Short goes live on the channel with a custom thumbnail",
        owner: "Owner · Atelier",
        actor: "platform",
      },
      {
        title: "TikTok + Instagram",
        detail: "Only after YouTube is public; Instagram forced to 9:16",
        owner: "Atelier",
        actor: "platform",
      },
    ],
  },
  {
    phase: "Learn",
    steps: [
      {
        title: "Ledger → next story",
        detail: "Metrics and the experiment log feed the next pick",
        owner: "Pulse → Vellum",
        actor: "agent",
      },
    ],
  },
];

export const packetSections: { title: string; note?: string }[] = [
  { title: "Why this story now" },
  { title: "Narrator arc" },
  { title: "Full voiceover", note: "~65–90 seconds" },
  { title: "Sequences", note: "5–7, each with a generation brief" },
  { title: "Bans" },
  { title: "Thumbnail concepts" },
  { title: "Metadata" },
  { title: "Music direction" },
];

export const chronicleLayers = [
  {
    name: "Evidence",
    body: "Real archaeology, coins, maps and period sources, where the rights allow it.",
  },
  {
    name: "Reconstruction",
    body: "Painterly, tactile generated stills for the shots the historical record can't supply.",
  },
  {
    name: "Editorial graphics",
    body: "Maps, labels and timelines that add information instead of repeating the narration.",
  },
];

export const standingRules: { rule: string; why: string }[] = [
  {
    rule: "Mute test",
    why: "The cut has to teach something with the sound off.",
  },
  {
    rule: "Full spoken captions",
    why: "Captions carry every word of the VO, not just place names.",
  },
  {
    rule: "Unique outro",
    why: "Every episode gets its own closing plate. No shared brand card.",
  },
  {
    rule: "AI disclosure",
    why: "Platform labels and descriptions disclose generated imagery where required.",
  },
  {
    rule: "True 9:16 on Instagram",
    why: "Force the crop before sharing; the default is square.",
  },
  {
    rule: "Skip, don't ship weak",
    why: "A missed day costs less than a weak episode.",
  },
  {
    rule: "Pin a question",
    why: "Every publish gets an open discussion question pinned.",
  },
];
