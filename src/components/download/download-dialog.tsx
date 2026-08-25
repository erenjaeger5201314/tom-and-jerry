import {
  CheckCircle2,
  Download,
  Loader2,
  MinusCircle,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export type DownloadItem = {
  id: number;
  filename: string;
  title: string;
  loaded: number;
  total: number;
  status: "pending" | "downloading" | "done" | "error" | "cancelled";
  error?: string;
};

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(n < 10 ? 1 : 0)} ${units[i]}`;
}

export function DownloadDialog({
  open,
  items,
  onCancelItem,
  onClose,
}: {
  open: boolean;
  items: DownloadItem[];
  onCancelItem: (id: number) => void;
  onClose: () => void;
}) {
  const done = items.filter((i) => i.status === "done").length;
  const failed = items.filter(
    (i) => i.status === "error" || i.status === "cancelled",
  ).length;

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Download className="w-5 h-5 text-tom-blue" />
            视频下载
            <span className="ml-2 text-sm font-semibold text-muted-foreground">
              {done}/{items.length} 完成
              {failed > 0 ? (
                <span className="text-destructive ml-2">{failed} 失败</span>
              ) : null}
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-1 -mr-1 space-y-2.5 mt-2">
          {items.map((item) => {
            const pct = item.total > 0 ? (item.loaded / item.total) * 100 : 0;
            return (
              <div
                key={item.id}
                className="bg-muted/40 border border-border rounded-xl p-3"
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5">
                    {item.status === "done" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : null}
                    {item.status === "error" ? (
                      <XCircle className="w-5 h-5 text-destructive" />
                    ) : null}
                    {item.status === "cancelled" ? (
                      <MinusCircle className="w-5 h-5 text-muted-foreground" />
                    ) : null}
                    {item.status === "downloading" ? (
                      <Loader2 className="w-5 h-5 text-tom-blue animate-spin" />
                    ) : null}
                    {item.status === "pending" ? (
                      <Loader2 className="w-5 h-5 text-muted-foreground/50" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-sm text-foreground truncate">
                        {item.title}
                      </p>
                      {item.status === "downloading" ||
                      item.status === "pending" ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs rounded-full shrink-0"
                          onClick={() => onCancelItem(item.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      ) : null}
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-medium mt-0.5">
                      {item.filename}
                    </p>
                    {item.status === "downloading" ? (
                      <div className="mt-2">
                        <Progress value={pct} className="h-1.5" />
                        <div className="flex justify-between mt-1 text-[11px] text-muted-foreground font-semibold">
                          <span>
                            {formatBytes(item.loaded)}
                            {item.total > 0 ? ` / ${formatBytes(item.total)}` : ""}
                          </span>
                          <span>
                            {item.total > 0 ? `${pct.toFixed(1)}%` : "下载中..."}
                          </span>
                        </div>
                      </div>
                    ) : null}
                    {item.status === "done" ? (
                      <p className="text-xs text-emerald-600 font-semibold mt-1">
                        已保存 · {formatBytes(item.loaded)}
                      </p>
                    ) : null}
                    {item.status === "error" ? (
                      <p className="text-xs text-destructive font-semibold mt-1">
                        {item.error || "下载失败"}
                      </p>
                    ) : null}
                    {item.status === "cancelled" ? (
                      <p className="text-xs text-muted-foreground font-semibold mt-1">
                        已取消
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export async function fetchDownloadBlob(
  url: string,
  onProgress: (loaded: number, total: number) => void,
  signal?: AbortSignal,
) {
  let lastError: unknown = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const retryUrl =
        attempt === 0
          ? url
          : `${url}${url.includes("?") ? "&" : "?"}_retry=${attempt}_${Date.now()}`;
      const res = await fetch(retryUrl, {
        signal,
        mode: "cors",
        cache: attempt === 0 ? "default" : "reload",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const length = res.headers.get("content-length");
      const total = length ? parseInt(length, 10) : 0;
      if (!res.body) {
        const blob = await res.blob();
        onProgress(blob.size, blob.size);
        return blob;
      }
      const reader = res.body.getReader();
      const chunks: Uint8Array[] = [];
      let loaded = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          loaded += value.length;
          onProgress(loaded, total);
        }
      }
      const bytes = new Uint8Array(loaded);
      let offset = 0;
      for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
      }
      return new Blob([bytes], { type: "video/mp4" });
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError" || signal?.aborted) {
        throw err;
      }
      lastError = err;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw lastError ?? new Error("download failed");
}

export function saveBlob(blob: Blob, filename: string) {
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}
