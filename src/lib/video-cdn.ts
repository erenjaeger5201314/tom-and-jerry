import cfg from "@/data/video-cdn.json";

function pad3(id: number) {
  return String(id).padStart(3, "0");
}

/** Public R2 (or any CDN) origin, no trailing slash. */
export function r2Base(): string {
  const fromEnv = String(import.meta.env.VITE_R2_BASE_URL ?? "").trim();
  const fromFile = String(cfg.baseUrl ?? "").trim();
  return (fromEnv || fromFile).replace(/\/+$/, "");
}

export function r2Enabled(): boolean {
  return r2Base().length > 0;
}

export function r2File(id: number): string {
  const pattern = cfg.filePattern || "ep{id}.mp4";
  return pattern.replace("{id}", pad3(id));
}

export function r2Url(id: number): string {
  if (!r2Enabled()) return "";
  return `${r2Base()}/${r2File(id)}`;
}
