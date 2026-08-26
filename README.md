# Tom & Jerry Classic Archive

经典猫和老鼠全集站点：Hanna-Barbera 时期 114 集院线动画短片（1940–1958），含中文剧集信息、奥斯卡筛选、在线播放与观影导读。

## 功能

- **全部剧集**：搜索、奥斯卡获奖 / 提名筛选、奶酪海报卡片
- **在线观看**：自建 R2 直链（配好后）→ Archive.org 嵌入 → Dailymotion
- **批量下载**：有 R2 时走直链，否则尝试 Archive.org
- **观影导读**：创作者、奥斯卡、音乐、角色宇宙、四个创作阶段
- **评论**：浏览器本地存储，不需要登录

## 片源（打开即看）

正片不进 Git。浏览器播 H.264 MP4，文件放在 Cloudflare R2（免费 10GB、流出不计费）。

1. 本地准备原片，放到 `originals/`，文件名带集数即可（`ep001.mp4` / `001.mkv` / `Tom and Jerry - 001 - ….mp4`）
2. 安装 [ffmpeg](https://ffmpeg.org/)，在项目根目录执行：

```bash
node scripts/encode-videos.mjs ./originals ./encoded
```

3. Cloudflare 建 R2 桶 `tom-jerry-films`，打开公开访问，把 `encoded/ep001.mp4` … `ep114.mp4` 传上去（控制台拖拽，或 `node scripts/upload-r2.mjs ./encoded`）
4. 把公开地址填进 [`src/data/video-cdn.json`](src/data/video-cdn.json) 的 `baseUrl`，不要末尾斜杠，例如：

```json
{ "baseUrl": "https://pub-xxxxxxxx.r2.dev", "filePattern": "ep{id}.mp4" }
```

5. 播放器会优先用 `https://pub-….r2.dev/ep001.mp4` 原生 `<video>` 播放。没配 `baseUrl` 时，默认走 Archive.org 嵌入页。

站点用 Cloudflare Pages（接这个 GitHub 仓库）即可；**视频不要放进仓库**。

未配置 R2 时的备用源：Internet Archive 条目 [tom-and-jerry-classic-hanna-barbera-1940](https://archive.org/details/tom-and-jerry-classic-hanna-barbera-1940)，以及 Dailymotion 公开嵌入。

## 本地运行

```bash
npm install
npm run dev
```

```bash
npm run build
npm run typecheck
```

## 技术栈

React 19 · TanStack Start / Router · Tailwind CSS v4 · Vite
