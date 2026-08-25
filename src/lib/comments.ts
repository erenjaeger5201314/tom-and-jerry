const NICK_KEY = "tj-comment-nickname";
const STORE_KEY = "tj-comments-v1";

export type EpisodeComment = {
  id: string;
  episode_id: number;
  nickname: string;
  content: string;
  created_at: string;
};

function readStore(): Record<string, EpisodeComment[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, EpisodeComment[]>) : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, EpisodeComment[]>) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

export function loadNickname() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NICK_KEY) ?? "";
}

export function saveNickname(name: string) {
  localStorage.setItem(NICK_KEY, name);
}

export function loadComments(episodeId: number): EpisodeComment[] {
  const list = readStore()[String(episodeId)] ?? [];
  return [...list].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function addComment(
  episodeId: number,
  nickname: string,
  content: string,
): EpisodeComment {
  const comment: EpisodeComment = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    episode_id: episodeId,
    nickname,
    content,
    created_at: new Date().toISOString(),
  };
  const store = readStore();
  const key = String(episodeId);
  store[key] = [comment, ...(store[key] ?? [])];
  writeStore(store);
  saveNickname(nickname);
  return comment;
}

export function formatRelativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const delta = (Date.now() - then) / 1000;
  if (delta < 60) return "刚刚";
  if (delta < 3600) return `${Math.floor(delta / 60)} 分钟前`;
  if (delta < 86400) return `${Math.floor(delta / 3600)} 小时前`;
  if (delta < 86400 * 7) return `${Math.floor(delta / 86400)} 天前`;
  return new Date(iso).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

const AVATAR_TONES = [
  "bg-tom-blue text-white",
  "bg-accent-warm text-white",
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-muted text-foreground",
] as const;

export function nicknameTone(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length]!;
}
