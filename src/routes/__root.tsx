import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AuthProvider } from "@/lib/auth/provider";
import appCss from "../styles.css?url";

const APP_NAME = "Tom & Jerry Classic Archive";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "重温114集经典旧版猫和老鼠，每一集都附有精心收录的幕后故事。1940–1958 Hanna-Barbera 院线短片全集。",
      },
      { name: "theme-color", content: "#1F7AD6" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preload", as: "image", href: "/tom.jpg" },
    ],
  }),
  component: RootShell,
});

function RootShell() {
  return (
    <html lang="zh-CN" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <PreviewHostBridge />
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
              <Outlet />
            </main>
          </div>
          <Toaster richColors position="top-center" />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}
