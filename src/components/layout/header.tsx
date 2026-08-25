import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Clapperboard, Menu, Play, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const isGuide = pathname === "/guide";
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-card/95 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 group min-w-0">
          <img
            src="/tom.png"
            alt="Tom"
            className="w-10 h-10 rounded-xl object-cover shadow-sm transition-transform group-hover:scale-105 group-hover:rotate-3"
          />
          <div className="min-w-0">
            <span className="font-display text-lg text-foreground leading-none block">
              Tom & Jerry
            </span>
            <span className="hidden sm:block text-[10px] text-muted-foreground font-semibold tracking-wider uppercase">
              Classic Archive
            </span>
          </div>
          <img
            src="/jerry.png"
            alt="Jerry"
            className="hidden sm:block w-10 h-10 rounded-xl object-cover shadow-sm ml-1 transition-transform group-hover:scale-105 group-hover:-rotate-3"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Button
            variant={isHome ? "default" : "ghost"}
            size="sm"
            className={
              isHome
                ? "bg-tom-blue text-white font-bold rounded-full shadow-sm"
                : "rounded-full font-semibold text-foreground"
            }
            asChild
          >
            <Link to="/">
              <Clapperboard className="w-3.5 h-3.5 mr-1.5" />
              全部剧集
            </Link>
          </Button>
          <Button
            variant={isGuide ? "default" : "ghost"}
            size="sm"
            className={
              isGuide
                ? "bg-tom-blue text-white font-bold rounded-full shadow-sm"
                : "rounded-full font-semibold text-foreground"
            }
            asChild
          >
            <Link to="/guide">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              导读
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={
              !isHome && !isGuide
                ? "bg-accent-warm text-white font-bold rounded-full shadow-sm"
                : "rounded-full font-semibold text-foreground"
            }
            asChild
          >
            <Link to="/watch/$id" params={{ id: "1" }}>
              <Play className="w-3.5 h-3.5 mr-1.5" />
              开始观看
            </Link>
          </Button>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "关闭菜单" : "打开菜单"}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {open ? (
        <div className="md:hidden border-t border-border bg-card p-4 animate-fade-in shadow-lg">
          <nav className="flex flex-col gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="justify-start rounded-xl"
            >
              <Link to="/" onClick={() => setOpen(false)}>
                <Clapperboard className="w-4 h-4 mr-2" />
                全部剧集
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="justify-start rounded-xl"
            >
              <Link to="/guide" onClick={() => setOpen(false)}>
                <BookOpen className="w-4 h-4 mr-2" />
                导读
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="justify-start rounded-xl"
            >
              <Link
                to="/watch/$id"
                params={{ id: "1" }}
                onClick={() => setOpen(false)}
              >
                <Play className="w-4 h-4 mr-2" />
                开始观看
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
