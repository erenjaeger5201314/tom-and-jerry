import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Hash,
  List,
  MonitorPlay,
  Play,
  User,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EpisodeComments } from "@/components/comments/episode-comments";
import { EpisodePicker } from "@/components/player/episode-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getEpisode,
  TOTAL_EPISODES,
  videoSources,
  type VideoSource,
} from "@/lib/episodes";

export const Route = createFileRoute("/watch/$id")({
  component: WatchPage,
});

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Hash;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-muted-foreground">{label}:</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

function WatchPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const num = Number(id) || 1;
  const episode = useMemo(() => getEpisode(num), [num]);
  const sources = useMemo(() => videoSources(num), [num]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sourceIndex, setSourceIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const failoverTimer = useRef<number | null>(null);

  useEffect(() => {
    setSourceIndex(0);
    setFailed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [num]);

  useEffect(() => {
    if (failoverTimer.current) window.clearTimeout(failoverTimer.current);
    setFailed(false);
    const current = sources[sourceIndex];
    if (!current) return;
    if (current.isNativeVideo || current.isProxyStream) {
      failoverTimer.current = window.setTimeout(() => {
        if (sourceIndex < sources.length - 1) setSourceIndex((i) => i + 1);
        else setFailed(true);
      }, 10000);
    }
    return () => {
      if (failoverTimer.current) window.clearTimeout(failoverTimer.current);
    };
  }, [sourceIndex, sources, num]);

  const clearFailover = useCallback(() => {
    if (failoverTimer.current) window.clearTimeout(failoverTimer.current);
  }, []);

  const nextSource = useCallback(() => {
    if (sourceIndex < sources.length - 1) {
      setSourceIndex((i) => i + 1);
      setFailed(false);
    }
  }, [sourceIndex, sources.length]);

  const onError = useCallback(() => {
    setFailed(true);
    if (sourceIndex < sources.length - 1) nextSource();
  }, [sourceIndex, sources.length, nextSource]);

  if (!episode) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        <div className="text-center">
          <p className="text-lg mb-4">未找到该剧集</p>
          <Button asChild>
            <Link to="/">返回首页</Link>
          </Button>
        </div>
      </div>
    );
  }

  const hasPrev = num > 1;
  const hasNext = num < TOTAL_EPISODES;
  const current: VideoSource | undefined = sources[sourceIndex];
  const paragraphs = episode.behindTheScenes.split("\n\n");

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-14 z-40 bg-card border-b border-border shadow-sm">
        <div className="w-full max-w-5xl mx-auto">
          <div className="relative aspect-video bg-black">
            {current ? (
              <>
                {current.isNativeVideo ? (
                  <video
                    key={`${num}-${sourceIndex}`}
                    src={current.embedUrl}
                    poster={episode.thumbnail}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full bg-black"
                    onError={onError}
                    onLoadedMetadata={clearFailover}
                    onProgress={clearFailover}
                  />
                ) : (
                  <iframe
                    key={`${num}-${sourceIndex}`}
                    src={current.embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    title={`${episode.titleCn} - ${episode.title}`}
                    referrerPolicy="no-referrer"
                    onError={onError}
                  />
                )}
                {failed ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center p-6">
                      <AlertCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-white/70 text-sm mb-3">视频加载失败</p>
                      {sourceIndex < sources.length - 1 ? (
                        <Button size="sm" onClick={nextSource}>
                          切换到备用源
                        </Button>
                      ) : (
                        <p className="text-white/50 text-xs">暂无更多备用源</p>
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src={episode.thumbnail}
                  alt={episode.titleCn}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative text-center p-6">
                  <Play className="w-12 h-12 mx-auto mb-3 text-white/50" />
                  <p className="text-white/70 text-sm">暂无可用视频源</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Badge
              variant="secondary"
              className="shrink-0 bg-accent-warm/15 text-accent-warm border-accent-warm/20"
            >
              EP {episode.id}
            </Badge>
            <div className="min-w-0">
              <h1 className="font-semibold text-sm md:text-base text-foreground truncate">
                {episode.titleCn}
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                {episode.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {sources.length > 1 ? (
              <div className="hidden sm:flex items-center gap-1 mr-1">
                {sources.map((source, index) => (
                  <button
                    key={source.platform}
                    type="button"
                    onClick={() => {
                      setSourceIndex(index);
                      setFailed(false);
                    }}
                    className={`text-xs px-2 py-1 rounded-md transition-colors flex items-center gap-1 ${
                      index === sourceIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <MonitorPlay className="w-3 h-3" />
                    {source.label}
                  </button>
                ))}
              </div>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrev}
              onClick={() =>
                void navigate({
                  to: "/watch/$id",
                  params: { id: String(num - 1) },
                })
              }
              className="h-8 px-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">上一集</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen((v) => !v)}
              className="h-8 px-2"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">选集</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNext}
              onClick={() =>
                void navigate({
                  to: "/watch/$id",
                  params: { id: String(num + 1) },
                })
              }
              className="h-8 px-2"
            >
              <span className="hidden sm:inline mr-1">下一集</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        {sources.length > 1 ? (
          <div className="sm:hidden max-w-5xl mx-auto px-4 pb-2 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            <MonitorPlay className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground shrink-0">视频源:</span>
            {sources.map((source, index) => (
              <button
                key={source.platform}
                type="button"
                onClick={() => {
                  setSourceIndex(index);
                  setFailed(false);
                }}
                className={`text-xs px-2 py-1 rounded-md transition-colors shrink-0 ${
                  index === sourceIndex
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {source.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <EpisodePicker
        open={pickerOpen}
        activeId={num}
        onClose={() => setPickerOpen(false)}
        onSelect={(next) =>
          void navigate({ to: "/watch/$id", params: { id: String(next) } })
        }
      />

      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="md:col-span-2 space-y-4">
            <div>
              <Badge className="mb-3 bg-accent-warm/15 text-accent-warm border-accent-warm/20">
                第{episode.id}集 / 共{TOTAL_EPISODES}集
              </Badge>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-2">
                {episode.titleCn}
              </h2>
              <p className="text-muted-foreground text-lg">
                {episode.title} ({episode.year})
              </p>
            </div>
            <p className="text-foreground/80 leading-relaxed text-base">
              {episode.description}
            </p>
          </div>
          <div className="space-y-3 p-4 rounded-xl bg-card border border-border">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              剧集信息
            </h3>
            <div className="space-y-2.5">
              <MetaRow icon={Hash} label="集数" value={`第${episode.id}集`} />
              <MetaRow
                icon={Calendar}
                label="上映日期"
                value={episode.releaseDate || String(episode.year)}
              />
              <MetaRow icon={Clock} label="时长" value={episode.duration} />
              <MetaRow icon={User} label="导演" value={episode.director} />
              <MetaRow icon={BookOpen} label="季" value={`第${episode.season}季`} />
              <MetaRow
                icon={MonitorPlay}
                label="视频源"
                value={`${sources.length}个可用`}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
              第{episode.id}集 幕后故事
            </h2>
          </div>
          <div className="max-w-none">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-foreground/80 leading-relaxed mb-5 text-base"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        <EpisodeComments episodeId={episode.id} />

        <div className="border-t border-border mt-12 pt-6 flex items-center justify-between">
          {hasPrev ? (
            <Button variant="outline" asChild>
              <Link
                to="/watch/$id"
                params={{ id: String(num - 1) }}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>
                  <span className="text-muted-foreground text-xs block">上一集</span>
                  <span className="text-sm">第{num - 1}集</span>
                </span>
              </Link>
            </Button>
          ) : (
            <div />
          )}
          <Button variant="secondary" size="sm" asChild>
            <Link to="/">回到首页</Link>
          </Button>
          {hasNext ? (
            <Button variant="outline" asChild>
              <Link
                to="/watch/$id"
                params={{ id: String(num + 1) }}
                className="flex items-center gap-2"
              >
                <span className="text-right">
                  <span className="text-muted-foreground text-xs block">下一集</span>
                  <span className="text-sm">第{num + 1}集</span>
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
