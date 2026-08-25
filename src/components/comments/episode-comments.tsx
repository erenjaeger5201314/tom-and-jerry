import { Loader2, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  addComment,
  formatRelativeTime,
  loadComments,
  loadNickname,
  nicknameTone,
  type EpisodeComment,
} from "@/lib/comments";

export function EpisodeComments({ episodeId }: { episodeId: number }) {
  const [comments, setComments] = useState<EpisodeComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setNickname(loadNickname());
  }, []);

  useEffect(() => {
    setLoading(true);
    setComments(loadComments(episodeId));
    setLoading(false);
  }, [episodeId]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nick = nickname.trim();
    const text = content.trim();
    if (!nick) {
      toast.error("请填写昵称");
      return;
    }
    if (!text) {
      toast.error("请输入评论内容");
      return;
    }
    if (nick.length > 40) {
      toast.error("昵称太长（最多 40 字）");
      return;
    }
    if (text.length > 1000) {
      toast.error("评论太长（最多 1000 字）");
      return;
    }
    setSubmitting(true);
    const created = addComment(episodeId, nick, text);
    setComments((list) => [created, ...list]);
    setContent("");
    setSubmitting(false);
    toast.success("评论已发布");
  };

  return (
    <div className="border-t border-border pt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
          评论{" "}
          <span className="text-muted-foreground font-normal text-base">
            ({comments.length})
          </span>
        </h2>
      </div>
      <form
        onSubmit={onSubmit}
        className="space-y-3 p-4 rounded-xl bg-card border border-border mb-8"
      >
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="你的昵称"
          maxLength={40}
          disabled={submitting}
          className="bg-background"
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="说点什么吧…"
          maxLength={1000}
          rows={3}
          disabled={submitting}
          className="bg-background resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {content.length} / 1000
          </span>
          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            发表评论
          </Button>
        </div>
      </form>
      {loading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          加载评论中…
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground text-sm">
          还没有评论，来抢沙发吧～
        </div>
      ) : (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="flex gap-3 p-4 rounded-xl bg-card border border-border"
            >
              <div
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${nicknameTone(comment.nickname)}`}
              >
                {comment.nickname.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-foreground truncate">
                    {comment.nickname}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-foreground/85 whitespace-pre-wrap break-words leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
