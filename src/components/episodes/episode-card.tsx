import { useNavigate } from "@tanstack/react-router";
import { Check, Clock, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Episode } from "@/lib/episodes";
import { previewUrl } from "@/lib/episodes";
import { cn } from "@/lib/utils";

export function EpisodeCard({
  episode,
  selectable,
  selected,
  onToggleSelect,
}: {
  episode: Episode;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: number) => void;
}) {
  const navigate = useNavigate();
  const [previewing, setPreviewing] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const preview = previewUrl(episode);

  const clearHover = useCallback(() => {
    setPreviewing(false);
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
  }, []);

  const onEnter = useCallback(() => {
    if (selectable) return;
    if (window.matchMedia("(hover: hover)").matches === false) return;
    hoverTimer.current = window.setTimeout(() => setPreviewing(true), 600);
  }, [selectable]);

  useEffect(() => () => clearHover(), [clearHover]);

  const onClick = () => {
    if (selectable && onToggleSelect) onToggleSelect(episode.id);
    else void navigate({ to: "/watch/$id", params: { id: String(episode.id) } });
  };

  return (
    <div
      className={cn(
        "group block rounded-2xl overflow-hidden bg-card border-2 shadow-[0_2px_12px_hsl(28_40%_50%_/_0.08),0_1px_3px_hsl(28_40%_50%_/_0.06)] transition-all duration-300 cursor-pointer",
        selected
          ? "border-tom-blue ring-2 ring-tom-blue/30 -translate-y-1"
          : "border-border hover:-translate-y-1.5 hover:shadow-[0_12px_28px_hsl(28_40%_50%_/_0.15),0_4px_10px_hsl(28_40%_50%_/_0.08)] hover:border-tom-blue/30",
      )}
      onMouseEnter={onEnter}
      onMouseLeave={clearHover}
      onClick={onClick}
    >
      <div className="relative aspect-video bg-secondary overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-linear-to-br from-tom-blue/20 to-accent-warm/20">
          <span className="text-3xl font-display text-tom-blue/40">
            EP {episode.id}
          </span>
          <span className="text-xs text-muted-foreground mt-1 font-bold">
            {episode.titleCn}
          </span>
        </div>
        {!imgFailed ? (
          <img
            src={episode.thumbnail}
            alt={episode.titleCn}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-transform duration-500",
              previewing ? "opacity-0" : "group-hover:scale-110",
            )}
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
        ) : null}
        {previewing && preview ? (
          <iframe
            ref={iframeRef}
            src={preview}
            className="absolute inset-0 w-full h-full z-10"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={`Preview: ${episode.titleCn}`}
          />
        ) : null}
        <div className="absolute top-2 left-2 z-20">
          <span className="inline-flex items-center gap-1 bg-accent-warm text-white font-extrabold text-[11px] rounded-full px-2.5 py-0.5 shadow-sm">
            EP {episode.id}
          </span>
        </div>
        {selectable ? (
          <div className="absolute top-2 right-2 z-20">
            <div
              className={cn(
                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                selected
                  ? "bg-tom-blue border-tom-blue text-white scale-110"
                  : "bg-white/80 border-border hover:border-tom-blue",
              )}
            >
              {selected ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : null}
            </div>
          </div>
        ) : null}
        {!previewing && !selectable ? (
          <>
            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-tom-blue/95 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
              </div>
            </div>
          </>
        ) : null}
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-bold text-sm text-card-foreground line-clamp-1 group-hover:text-tom-blue transition-colors">
          {episode.titleCn}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1 font-medium">
          {episode.title}
        </p>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
          <span className="bg-secondary rounded-full px-2 py-0.5">
            {episode.releaseDate || episode.year}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {episode.duration}
          </span>
        </div>
      </div>
    </div>
  );
}
