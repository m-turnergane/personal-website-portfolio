"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { track } from "@vercel/analytics";
import type { EpisodeLink } from "@/lib/posterity";
import { TrackedLink } from "@/app/components/products/tracked-link";
import { POSTERITY_CLICK_EVENT } from "./figure";

export interface ShelfEpisode {
  slug: string;
  day: number;
  date: string;
  dateLabel: string;
  dateShort: string;
  title: string;
  lane: string;
  mythBust: boolean;
  links: EpisodeLink[];
  media: {
    thumb: { src: string; srcSet: string };
    poster: string;
    embed: string;
  } | null;
}

const number = (day: number) => `No. ${String(day).padStart(2, "0")}`;

function LaneChip({ episode }: { episode: ShelfEpisode }) {
  return (
    <span
      className={`inline-flex rounded-[3px] border px-1.5 py-0.5 font-mono text-[10px] uppercase leading-tight tracking-wider ${
        episode.mythBust
          ? "border-white/15 text-zinc-400"
          : "border-vellum/30 bg-vellum/[0.05] text-vellum/90"
      }`}
    >
      {episode.lane}
    </span>
  );
}

function PlatformLinks({
  episode,
  channelHref,
  placement,
  size = "sm",
}: {
  episode: ShelfEpisode;
  channelHref: string;
  placement: string;
  size?: "sm" | "md";
}) {
  const text = size === "md" ? "text-sm" : "text-[12.5px]";

  if (episode.links.length === 0) {
    return (
      <TrackedLink
        href={channelHref}
        event={POSTERITY_CLICK_EVENT}
        placement={`${placement}_channel`}
        aria-label={`Find “${episode.title}” on the Posterity YouTube channel (opens in a new tab)`}
        className={`pv-link rounded text-zinc-300 ${text}`}
      >
        Find it on the{" "}
        <span className="whitespace-nowrap">
          channel
          <ArrowUpRight aria-hidden className="ml-0.5 inline h-3.5 w-3.5 align-[-2px]" />
        </span>
      </TrackedLink>
    );
  }

  return (
    <ul
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${text}`}
      aria-label={`Watch “${episode.title}”`}
    >
      {episode.links.map((link) => (
        <li key={link.platform}>
          <TrackedLink
            href={link.href}
            event={POSTERITY_CLICK_EVENT}
            placement={`${placement}_${link.platform}`}
            aria-label={`Watch “${episode.title}” on ${link.label} (opens in a new tab)`}
            className={`pv-link rounded ${
              link.platform === "youtube" ? "text-zinc-100" : "text-zinc-400"
            }`}
          >
            {link.label}
          </TrackedLink>
        </li>
      ))}
    </ul>
  );
}

function Poster({ episode }: { episode: ShelfEpisode }) {
  const media = episode.media!;
  const [src, setSrc] = useState(media.poster);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      onError={() => setSrc(media.thumb.src)}
      alt=""
      width={1280}
      height={720}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  );
}

export function EpisodeShelfClient({
  episodes,
  initialSlug,
  channelHref,
}: {
  episodes: ShelfEpisode[];
  initialSlug: string | null;
  channelHref: string;
}) {
  const [activeSlug, setActiveSlug] = useState(initialSlug);
  const [playing, setPlaying] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageTitleRef = useRef<HTMLHeadingElement>(null);

  const active = episodes.find((e) => e.slug === activeSlug && e.media);

  function play(slug: string, placement: string) {
    setActiveSlug(slug);
    setPlaying(true);
    track("posterity_play", { slug, placement });

    if (placement === "stage") return;
    const stage = stageRef.current;
    if (!stage) return;
    const { top, bottom } = stage.getBoundingClientRect();
    const hidden = top < 0 || bottom > window.innerHeight;
    if (hidden) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      stage.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    }
    stageTitleRef.current?.focus({ preventScroll: true });
  }

  return (
    <figure className="product-figure not-prose">
      <div className="pv-plate overflow-hidden rounded-lg border border-vellum/15">
        <div className="border-b border-vellum/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-vellum/70">
          The archive · {episodes.length} episodes so far
        </div>

        {active && (
          <div
            ref={stageRef}
            className="grid gap-6 border-b border-vellum/10 p-4 sm:p-6 md:grid-cols-[15rem_minmax(0,1fr)] md:items-center md:gap-8"
          >
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[15rem] overflow-hidden rounded-md border border-vellum/20 bg-[#15120d] md:mx-0">
              {playing ? (
                <iframe
                  key={active.slug}
                  src={active.media!.embed}
                  title={`${active.title} · Posterity on YouTube`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => play(active.slug, "stage")}
                  className="group absolute inset-0 h-full w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-vellum"
                  aria-label={`Play “${active.title}”`}
                >
                  <Poster key={active.slug} episode={active} />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-4 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-vellum/50 bg-black/60 px-4 py-2 text-sm font-medium text-vellum backdrop-blur-sm transition-colors group-hover:bg-black/80"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Play
                  </span>
                </button>
              )}
            </div>

            <div className="min-w-0">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-vellum/70">
                {activeSlug === initialSlug && !playing ? "Start here" : "Now showing"}{" "}
                · {number(active.day)} · {active.dateLabel}
              </p>
              <h3
                ref={stageTitleRef}
                tabIndex={-1}
                className="pv-serif mt-2 text-[1.75rem] font-semibold leading-[1.15] text-zinc-50 focus:outline-none sm:text-[2rem]"
              >
                {active.title}
              </h3>
              <div className="mt-3">
                <LaneChip episode={active} />
              </div>
              <div className="mt-5">
                <PlatformLinks
                  episode={active}
                  channelHref={channelHref}
                  placement="stage"
                  size="md"
                />
              </div>
              <p className="mt-5 max-w-[42ch] text-[13px] leading-relaxed text-zinc-500">
                Plays here. Nothing loads from YouTube until you press play, and
                only one player exists at a time.
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 pt-4 sm:px-6">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-zinc-500">
            In publishing order
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-2.5 w-2.5 rounded-[2px] border border-white/25" />
              Myth-bust
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="h-2.5 w-2.5 rounded-[2px] border border-vellum/50 bg-vellum/20" />
              Story-led
            </span>
          </p>
        </div>

        <ol className="grid grid-cols-2 gap-x-3 gap-y-6 p-4 sm:gap-x-4 sm:p-6 md:grid-cols-3 lg:grid-cols-4">
          {episodes.map((episode) => {
            const isActive = episode.slug === active?.slug;
            return (
              <li key={episode.slug} className="flex min-w-0 flex-col">
                {episode.media ? (
                  <button
                    type="button"
                    onClick={() => play(episode.slug, "grid")}
                    aria-label={`Play “${episode.title}” in the player above`}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative aspect-[9/16] w-full overflow-hidden rounded-md border bg-[#15120d] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-vellum ${
                      isActive ? "border-vellum/70" : "border-white/10 hover:border-vellum/40"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={episode.media.thumb.src}
                      srcSet={episode.media.thumb.srcSet}
                      sizes="(min-width: 1024px) 200px, (min-width: 768px) 30vw, 45vw"
                      alt=""
                      width={480}
                      height={360}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    />
                    <span
                      aria-hidden
                      className={`absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider ${
                        isActive
                          ? "bg-vellum text-[#14110c]"
                          : "bg-black/60 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                      }`}
                    >
                      {isActive ? "In player" : (
                        <>
                          <Play className="h-2.5 w-2.5 fill-current" /> Play
                        </>
                      )}
                    </span>
                  </button>
                ) : (
                  <div className="pv-sheet relative flex aspect-[9/16] w-full flex-col justify-between overflow-hidden rounded-md border border-dashed border-vellum/30 p-3">
                    <span className="self-start rounded-full border border-vellum/40 px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-wider text-vellum">
                      Recently published
                    </span>
                    <span className="pv-serif text-[2.5rem] font-semibold leading-none text-vellum/25">
                      {String(episode.day).padStart(2, "0")}
                    </span>
                    <span className="text-[11.5px] leading-snug text-zinc-500">
                      Links land here once confirmed.
                    </span>
                  </div>
                )}

                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                  {number(episode.day)} · <time dateTime={episode.date}>{episode.dateShort}</time>
                </p>
                <p className="mt-1 text-[14px] font-medium leading-snug text-zinc-100">
                  {episode.title}
                </p>
                <div className="mt-2">
                  <LaneChip episode={episode} />
                </div>
                <div className="mt-2.5">
                  <PlatformLinks
                    episode={episode}
                    channelHref={channelHref}
                    placement="grid"
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </figure>
  );
}
