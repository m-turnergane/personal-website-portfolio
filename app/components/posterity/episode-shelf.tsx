import {
  FEATURED_SLUG,
  embedUrl,
  isMythBust,
  posterity,
  posterThumbnail,
  thumbnailSources,
} from "@/lib/posterity";
import { EpisodeShelfClient, type ShelfEpisode } from "./episode-shelf-client";

function dateLabel(iso: string, withYear: boolean) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(withYear && { year: "numeric" }),
    timeZone: "UTC",
  });
}

export function EpisodeShelf() {
  const episodes: ShelfEpisode[] = posterity.episodes.map((episode) => {
    const id = episode.youtubeShortsId;
    return {
      slug: episode.slug,
      day: episode.day,
      date: episode.date,
      dateLabel: dateLabel(episode.date, true),
      dateShort: dateLabel(episode.date, false),
      title: episode.title,
      lane: episode.lane,
      mythBust: isMythBust(episode),
      links: episode.links,
      media: id
        ? {
            thumb: thumbnailSources(id),
            poster: posterThumbnail(id),
            embed: embedUrl(id),
          }
        : null,
    };
  });

  const featured =
    episodes.find((e) => e.slug === FEATURED_SLUG && e.media) ??
    [...episodes].reverse().find((e) => e.media) ??
    null;

  return (
    <EpisodeShelfClient
      episodes={episodes}
      initialSlug={featured?.slug ?? null}
      channelHref={posterity.cta.primary.href}
    />
  );
}
