import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EpLink({
  ep,
  children,
  className,
}: {
  ep: number;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to="/watch/$id"
      params={{ id: String(ep) }}
      className={cn(
        "inline-flex items-center text-tom-blue hover:text-accent-warm font-bold underline decoration-tom-blue/30 decoration-2 underline-offset-2 hover:decoration-accent-warm/60 transition-colors",
        className,
      )}
    >
      {children ?? `第${ep}集`}
    </Link>
  );
}
