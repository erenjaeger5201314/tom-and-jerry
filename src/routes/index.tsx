import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  CheckSquare,
  Clock,
  Download,
  Filter,
  Play,
  Search,
  Trophy,
  X,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { EpisodeCard } from "@/components/episodes/episode-card";
import {
  DownloadDialog,
  fetchDownloadBlob,
  saveBlob,
  type DownloadItem,
} from "@/components/download/download-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  downloadFilename,
  downloadUrl,
  EPISODES,
  HERO_OSCAR_CHIPS,
  OSCAR_NOMINEES,
  OSCAR_WINNERS,
  thumbnailOf,
  type Episode,
} from "@/lib/episodes";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    links: [{ rel: "preload", as: "image", href: "/jerry.jpg" }],
  }),
});

type FilterKey = "all" | "winner" | "nominated";

function Home() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [downloadMode, setDownloadMode] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [items, setItems] = useState<DownloadItem[]>([]);
  const abortMap = useRef(new Map<number, AbortController>());

  const filtered = useMemo(() => {
    let list = EPISODES;
    if (filter === "winner") list = list.filter((ep) => OSCAR_WINNERS.has(ep.id));
    if (filter === "nominated")
      list = list.filter((ep) => OSCAR_NOMINEES.has(ep.id));
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (ep) =>
          ep.titleCn.toLowerCase().includes(q) ||
          ep.title.toLowerCase().includes(q) ||
          ep.description.toLowerCase().includes(q) ||
          String(ep.id).includes(q),
      );
    }
    return list;
  }, [filter, query]);

  const toggleSelect = useCallback((id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectCurrent = useCallback(() => {
    setSelected(new Set(filtered.map((ep) => ep.id)));
  }, [filtered]);

  const clearSelected = useCallback(() => setSelected(new Set()), []);
  const exitDownload = useCallback(() => {
    setDownloadMode(false);
    setSelected(new Set());
  }, []);

  const patchItem = useCallback(
    (id: number, patch: Partial<DownloadItem>) => {
      setItems((list) =>
        list.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      );
    },
    [],
  );

  const startDownload = useCallback(async () => {
    if (selected.size === 0) return;
    const targets = EPISODES.filter((ep) => selected.has(ep.id));
    const queue: DownloadItem[] = targets.map((ep) => ({
      id: ep.id,
      filename: downloadFilename(ep),
      title: `第${ep.id}集 · ${ep.titleCn}`,
      loaded: 0,
      total: 0,
      status: "pending",
    }));
    setItems(queue);
    setDialogOpen(true);
    for (const ep of targets) {
      const url = downloadUrl(ep);
      if (!url) {
        patchItem(ep.id, { status: "error", error: "无可用下载源" });
        continue;
      }
      const controller = new AbortController();
      abortMap.current.set(ep.id, controller);
      patchItem(ep.id, { status: "downloading" });
      try {
        const blob = await fetchDownloadBlob(
          url,
          (loaded, total) => patchItem(ep.id, { loaded, total }),
          controller.signal,
        );
        saveBlob(blob, downloadFilename(ep));
        patchItem(ep.id, { status: "done", loaded: blob.size, total: blob.size });
      } catch (err) {
        const name = (err as { name?: string }).name;
        if (name === "AbortError") {
          patchItem(ep.id, { status: "cancelled" });
        } else {
          window.open(url, "_blank", "noopener,noreferrer");
          patchItem(ep.id, {
            status: "error",
            error: "浏览器直链已打开，请在新标签页保存",
          });
        }
      } finally {
        abortMap.current.delete(ep.id);
      }
    }
  }, [selected, patchItem]);

  const cancelItem = useCallback((id: number) => {
    abortMap.current.get(id)?.abort();
  }, []);

  const closeDialog = useCallback(() => {
    abortMap.current.forEach((c) => c.abort());
    abortMap.current.clear();
    setDialogOpen(false);
    setItems([]);
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-linear-to-br from-tom-blue to-accent-warm py-10 md:py-14">
        <div className="absolute inset-0 pattern-dots-hero" />
        <div className="absolute top-6 left-[8%] w-28 h-28 rounded-full bg-cheese-yellow/20 blur-2xl animate-bounce-soft" />
        <div
          className="absolute bottom-6 right-[12%] w-36 h-36 rounded-full bg-white/10 blur-3xl animate-bounce-soft"
          style={{ animationDelay: "1s" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center mb-5">
            <img
              src="/jerry.jpg"
              alt="Tom and Jerry"
              width={1280}
              height={720}
              fetchPriority="high"
              decoding="sync"
              className="w-full max-w-xl h-auto rounded-2xl shadow-2xl border-4 border-white/20"
            />
          </div>
          <div className="text-center max-w-xl mx-auto">
            <p className="text-white/85 text-base md:text-lg mb-4 leading-relaxed font-semibold">
              重温114集经典旧版猫和老鼠，每一集都附有精心收录的幕后故事
            </p>
            <div className="flex items-center gap-2.5 mb-5 justify-center flex-wrap">
              {[
                { icon: Trophy, text: "114集" },
                { icon: Award, text: "7座奥斯卡" },
                { icon: Clock, text: "1940-1958" },
              ].map((stat) => (
                <div
                  key={stat.text}
                  className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-white text-sm font-bold"
                >
                  <stat.icon className="w-3.5 h-3.5 text-cheese-yellow" />
                  <span>{stat.text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-cheese-yellow hover:bg-cheese-yellow/90 text-foreground font-extrabold px-8 rounded-full text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                asChild
              >
                <Link to="/watch/$id" params={{ id: "1" }}>
                  <Play className="w-4 h-4 mr-2" fill="currentColor" />
                  从第1集开始
                </Link>
              </Button>
              <Button
                size="lg"
                className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 rounded-full text-base border-2 border-white/25 backdrop-blur-sm"
                asChild
              >
                <Link to="/guide">
                  <BookOpen className="w-4 h-4 mr-2" />
                  观影导读
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex gap-2 justify-center mt-7 overflow-x-auto scrollbar-hide pb-1">
            {HERO_OSCAR_CHIPS.map((id) => (
              <Link
                key={id}
                to="/watch/$id"
                params={{ id: String(id) }}
                className="relative rounded-xl overflow-hidden shrink-0 w-20 h-14 md:w-24 md:h-16 group border-2 border-white/20 hover:border-cheese-yellow transition-all shadow-md"
              >
                <img
                  src={thumbnailOf(id)}
                  alt={`EP ${id}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute bottom-0.5 left-1 text-[9px] font-extrabold text-white drop-shadow">
                  EP {id}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索剧集名称、编号..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-card rounded-full border-2 focus:border-tom-blue shadow-sm"
            />
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={`rounded-full font-bold ${filter === "all" ? "bg-tom-blue text-white" : ""}`}
            >
              全部
            </Button>
            <Button
              variant={filter === "winner" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("winner")}
              className={`rounded-full font-bold ${filter === "winner" ? "bg-cheese-yellow text-foreground" : ""}`}
            >
              <Award className="w-3.5 h-3.5 mr-1" />
              奥斯卡获奖
              <span className="ml-1 text-xs opacity-70">(7)</span>
            </Button>
            <Button
              variant={filter === "nominated" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("nominated")}
              className={`rounded-full font-bold ${filter === "nominated" ? "bg-accent-warm text-white" : ""}`}
            >
              <Trophy className="w-3.5 h-3.5 mr-1" />
              奥斯卡提名
              <span className="ml-1 text-xs opacity-70">(6)</span>
            </Button>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <Button
              variant={downloadMode ? "default" : "outline"}
              size="sm"
              onClick={() => (downloadMode ? exitDownload() : setDownloadMode(true))}
              className={`rounded-full font-bold ${downloadMode ? "bg-tom-blue text-white" : ""}`}
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              {downloadMode ? "退出下载" : "下载"}
            </Button>
          </div>
        </div>

        {downloadMode ? (
          <div className="flex items-center gap-3 mb-6 bg-tom-blue/5 border-2 border-tom-blue/20 rounded-2xl px-4 py-3 animate-fade-up">
            <CheckSquare className="w-4 h-4 text-tom-blue shrink-0" />
            <span className="text-sm font-bold text-foreground">
              已选择 <span className="text-tom-blue">{selected.size}</span> 集
            </span>
            <div className="flex gap-2 ml-auto flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={selectCurrent}
                className="rounded-full font-bold text-xs"
              >
                全选当前 ({filtered.length})
              </Button>
              {selected.size > 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelected}
                  className="rounded-full font-bold text-xs"
                >
                  <X className="w-3 h-3 mr-1" />
                  清除
                </Button>
              ) : null}
              <Button
                size="sm"
                onClick={() => void startDownload()}
                disabled={selected.size === 0}
                className="rounded-full font-bold text-xs bg-tom-blue hover:bg-tom-blue/90 text-white"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                下载选中 ({selected.size})
              </Button>
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground font-semibold">
          <span>共 {filtered.length} 集</span>
          {filter !== "all" ? (
            <>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              <span>
                {filter === "winner" ? "奥斯卡获奖影片" : "奥斯卡提名影片"}
              </span>
            </>
          ) : null}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((ep: Episode, index) => (
            <div
              key={ep.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              <EpisodeCard
                episode={ep}
                selectable={downloadMode}
                selected={selected.has(ep.id)}
                onToggleSelect={toggleSelect}
              />
            </div>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-bold">没有找到匹配的剧集</p>
            <p className="text-sm mt-2">请尝试其他搜索词</p>
          </div>
        ) : null}
      </section>

      <DownloadDialog
        open={dialogOpen}
        items={items}
        onCancelItem={cancelItem}
        onClose={closeDialog}
      />
    </div>
  );
}
