import { Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EPISODES, hasVideo, type Episode } from "@/lib/episodes";
import { cn } from "@/lib/utils";

function PickerItem({
  episode,
  isActive,
  onClick,
}: {
  episode: Episode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left p-2.5 rounded-lg transition-colors flex items-center gap-3",
        isActive
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-muted border border-transparent",
      )}
    >
      <span
        className={cn(
          "shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold",
          isActive
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {episode.id}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm truncate",
            isActive ? "text-primary font-semibold" : "text-foreground",
          )}
        >
          {episode.titleCn}
        </p>
        <p className="text-xs text-muted-foreground truncate">{episode.title}</p>
      </div>
      {hasVideo(episode.id) ? (
        <Play className="w-3 h-3 text-primary shrink-0" />
      ) : null}
    </button>
  );
}

export function EpisodePicker({
  open,
  activeId,
  onClose,
  onSelect,
}: {
  open: boolean;
  activeId: number;
  onClose: () => void;
  onSelect: (id: number) => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-80 max-w-[85vw] bg-card border-l border-border h-full animate-fade-in flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">选择剧集</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="h-[calc(100%-57px)] overflow-y-auto">
          <div className="p-2">
            {EPISODES.map((ep) => (
              <PickerItem
                key={ep.id}
                episode={ep}
                isActive={ep.id === activeId}
                onClick={() => {
                  onSelect(ep.id);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
