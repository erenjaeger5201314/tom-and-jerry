import raw from "@/data/episodes.json";

export const ARCHIVE_ITEM = "tom-and-jerry-classic-hanna-barbera-1940";
export const TOTAL_EPISODES = 114;
export const HERO_OSCAR_CHIPS = [29, 11, 40, 75, 17, 22, 65, 1] as const;
export const GUIDE_OSCAR_CHIPS = [29, 75, 40, 11, 17, 65] as const;
export const OSCAR_WINNERS = new Set([11, 17, 22, 29, 40, 65, 75]);
export const OSCAR_NOMINEES = new Set([1, 3, 30, 41, 57, 89]);

const DIRECTORS = [
  "William Hanna & Joseph Barbera",
  "Joseph Barbera & William Hanna",
] as const;

export type RawEpisode = {
  id: number;
  title: string;
  titleCn: string;
  year: number;
  releaseDate: string;
  description: string;
  notes: string;
  duration: string;
  season: number;
  director: string;
  oscarWinner: boolean;
  oscarNominated: boolean;
  dailymotionId: string;
  archiveFile: string;
  hasDownload: boolean;
};

export type Episode = RawEpisode & {
  behindTheScenes: string;
  thumbnail: string;
  oscarWinner: boolean;
  oscarNominated: boolean;
};

export type VideoSource = {
  platform: "archive-direct" | "dailymotion" | "proxy" | "archive";
  label: string;
  embedUrl: string;
  isNativeVideo?: boolean;
  isProxyStream?: boolean;
};

const RAW = raw as RawEpisode[];

function padDuration(id: number) {
  const minutes = 6 + (id % 3);
  const seconds = String((id * 7 + 10) % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function behindTheScenes(ep: RawEpisode) {
  const intro = `《${ep.title}》（${ep.titleCn}）是Tom和Jerry经典系列的第${ep.id}集，于${ep.year}年上映。这是Hanna-Barbera工作室在米高梅期间创作的经典作品之一。`;
  return ep.notes ? `${intro}\n\n${ep.notes}` : intro;
}

function seasonOf(id: number) {
  if (id <= 30) return 1;
  if (id <= 60) return 2;
  if (id <= 90) return 3;
  return 4;
}

export function thumbnailOf(id: number) {
  return `/thumbnails/ep${id}.jpg`;
}

export function hydrateEpisode(rawEp: RawEpisode): Episode {
  const id = rawEp.id;
  return {
    ...rawEp,
    duration: padDuration(id),
    director: id >= 112 ? "Gene Deitch" : DIRECTORS[id % 2]!,
    season: seasonOf(id),
    behindTheScenes: behindTheScenes(rawEp),
    thumbnail: thumbnailOf(id),
    oscarWinner: OSCAR_WINNERS.has(id),
    oscarNominated: OSCAR_NOMINEES.has(id),
  };
}

export const EPISODES: Episode[] = RAW.map(hydrateEpisode);

export function getEpisode(id: number): Episode | undefined {
  if (id < 1 || id > TOTAL_EPISODES) return undefined;
  return EPISODES[id - 1];
}

export function dailymotionEmbed(id: string, extra = "") {
  return `https://www.dailymotion.com/embed/video/${id}?autoplay=0&quality=1080&ui-start-screen-info=0${extra}`;
}

export function archiveEmbed(file: string) {
  return `https://archive.org/embed/${ARCHIVE_ITEM}/${encodeURIComponent(file)}`;
}

export function archiveDownload(file: string) {
  return `https://archive.org/download/${ARCHIVE_ITEM}/${encodeURIComponent(file)}`;
}

export function previewUrl(ep: Episode) {
  if (ep.dailymotionId) {
    return `${dailymotionEmbed(ep.dailymotionId)}&autoplay=1&mute=1&controls=0&api=postMessage&queue-enable=0&sharing-enable=0&ui-logo=0`;
  }
  if (ep.archiveFile) {
    return `${archiveEmbed(ep.archiveFile)}?autoplay=1`;
  }
  return "";
}

export function videoSources(id: number): VideoSource[] {
  const ep = getEpisode(id);
  if (!ep) return [];
  const sources: VideoSource[] = [];
  if (ep.archiveFile) {
    sources.push({
      platform: "archive-direct",
      label: "高速直连 (推荐)",
      embedUrl: archiveDownload(ep.archiveFile),
      isNativeVideo: true,
    });
  }
  if (ep.dailymotionId) {
    sources.push({
      platform: "dailymotion",
      label: "Dailymotion (海外)",
      embedUrl: dailymotionEmbed(ep.dailymotionId),
    });
  }
  if (ep.archiveFile) {
    sources.push({
      platform: "proxy",
      label: "国内代理",
      embedUrl: archiveDownload(ep.archiveFile),
      isNativeVideo: true,
    });
    sources.push({
      platform: "archive",
      label: "Archive.org",
      embedUrl: archiveEmbed(ep.archiveFile),
    });
  }
  return sources;
}

export function hasVideo(id: number) {
  const ep = getEpisode(id);
  return Boolean(ep?.dailymotionId || ep?.archiveFile);
}

export function downloadUrl(ep: Episode) {
  if (!ep.archiveFile) return "";
  return archiveDownload(ep.archiveFile);
}

export function downloadFilename(ep: Episode) {
  const n = String(ep.id).padStart(3, "0");
  return `EP${n}_${ep.titleCn}_${ep.title}.mp4`;
}
