# Harness Engineering Wiki

**An editorial, interactive guide to AI agent harnesses in 2026.**
> 模型负责推理,harness 负责其他一切。

![Next.js](https://img.shields.io/badge/Next.js-15-000?style=flat-square)
![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square)

A content-first site covering the 10 most important harness engineering tools — organized into **Frameworks**, **Memory & State**, and **Tools & Protocols** — with dedicated detail pages, a side-by-side code comparison tool, and a cross-cutting patterns layer.

---

## Quick start

```bash
# 1. install
npm install

# 2. dev server
npm run dev

# 3. open
# → http://localhost:3000
```

Requirements: **Node 18.17+** (Node 20 LTS recommended).

### Production build

```bash
npm run build
npm run start
```

---

## Structure

```
harness-wiki/
├── app/                           # Next.js App Router
│   ├── page.tsx                   # Home (L1 — card grid + hero)
│   ├── layout.tsx                 # Root layout, fonts, footer
│   ├── globals.css                # Design tokens + theme
│   ├── not-found.tsx              # 404
│   ├── frameworks/[slug]/page.tsx # L2 — dynamic framework detail pages
│   ├── compare/page.tsx           # Side-by-side code comparison
│   └── patterns/page.tsx          # L3 — cross-framework patterns
│
├── components/
│   ├── Nav.tsx                    # Sticky nav + theme toggle (client)
│   ├── FrameworkGrid.tsx          # Filterable grid (client)
│   ├── FrameworkCard.tsx          # Reserved — currently inlined
│   ├── BrandLogo.tsx              # 10 custom SVG brand marks
│   ├── CodeBlock.tsx              # Python/TS highlighter + copy
│   └── CompareView.tsx            # Task picker + side-by-side code (client)
│
├── data/
│   ├── frameworks.ts              # ★ all 10 tools — full content
│   └── compareTasks.ts            # ★ side-by-side code samples
│
├── lib/
│   └── cn.ts                      # className helper
│
├── tailwind.config.ts             # colors, fonts, animations
├── next.config.mjs
├── tsconfig.json
├── package.json
└── postcss.config.mjs
```

**Where the content lives:** 95% of what readers see comes from `data/frameworks.ts` and `data/compareTasks.ts`. Everything else is rendering glue.

---

## The 10 harnesses covered

| Tool | Org | Category |
|---|---|---|
| LangGraph | LangChain | Framework |
| AutoGen | Microsoft | Framework |
| Agents SDK | OpenAI | Framework |
| CrewAI | crewAIInc | Framework |
| Pydantic AI | Pydantic | Framework |
| ADK | Google | Framework |
| smolagents | Hugging Face | Framework |
| Letta | letta-ai | Memory |
| mem0 | mem0ai | Memory |
| MCP + Agent SDK | Anthropic | Protocol |

Each gets a detail page with: full description, preferences, focus, key APIs, use cases, anti-patterns, vs-other comparisons, hello world code, install command, links.

---

## Extend it

### Add a new framework

1. Append an entry to the `frameworks` array in `data/frameworks.ts` (the `Framework` type will guide you)
2. Add its SVG mark as a new `case` in `components/BrandLogo.tsx`
3. Add its brand color to `tailwind.config.ts` under `colors.brand` (optional — it's also stored inline on each framework)
4. Done. The home grid, detail route (`/frameworks/<id>`), filter, and sidebar recommendations all pick it up automatically.

### Add a new side-by-side comparison task

Append a `CompareTask` to `compareTasks` in `data/compareTasks.ts`. Each task holds 2–3 code samples labeled by framework id. The compare page picks them up automatically.

### Add a new pattern

For now patterns live inline in `app/patterns/page.tsx`. If the list grows past ~10 entries, extract them into `data/patterns.ts` following the same shape as `frameworks.ts`.

---

## Design system

- **Fonts** — `Fraunces` (display serif, variable, character-rich) + `Geist Sans` (body) + `Geist Mono` (code). Loaded via `next/font/google` — zero external requests at runtime.
- **Palette** — warm cream (`#FAF7F0`) in light mode, warm black (`#0E0D0B`) in dark mode, with per-framework brand accents. All tokens in `app/globals.css` as CSS variables.
- **Motion** — staggered fade-up on grid reveal, hover-lift on cards, animated link underlines. All CSS, no JS motion library.
- **Theme** — class-based dark mode (`documentElement.classList.add("dark")`). Persisted in `localStorage`. Respects `prefers-color-scheme` on first visit.

---

## Deploy

### Vercel (recommended — 2 minutes)

```bash
# 1. push to GitHub
git init
git add .
git commit -m "initial"
git branch -M main
git remote add origin https://github.com/<you>/harness-wiki.git
git push -u origin main

# 2. deploy
# → visit vercel.com/new
# → import your repo
# → click Deploy (no config needed — Vercel auto-detects Next.js)
```

You'll get a live URL like `harness-wiki.vercel.app` within 60 seconds. Custom domains are free on Vercel's Hobby plan.

### Cloudflare Pages

```bash
# Build command:  npm run build
# Build output:   .next
# Requires: @cloudflare/next-on-pages (one extra dep for edge runtime)
```

See the [Cloudflare Next.js guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/) for the edge adapter setup.

### Netlify

```bash
# Build command:  npm run build
# Publish dir:    .next
# Netlify's Next.js runtime handles the rest automatically.
```

### Docker / self-host

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Roadmap

**v0.2**
- Full patterns pages (currently inline on `/patterns`)
- Pyodide-powered in-browser playground for `smolagents` and `pydantic-ai` hello worlds
- Search (pagefind — local, no service)
- Auto-updated GitHub star counts via a weekly GH Action

**v0.3**
- Trace visualizer component (paste an agent run trace, render as timeline)
- Per-framework benchmark: same task, measured on token cost + wall-clock
- RSS / newsletter pipeline for weekly harness ecosystem changes

**v1.0**
- Hosted sandbox (E2B-backed) for real agent runs
- Community-contributed cookbooks
- EN / ZH dual content (currently ZH-leaning with EN scaffolding)

---

## License & attribution

Content is opinionated editorial — feel free to fork. Framework descriptions synthesize documentation, blog posts, and maintainer talks; individual framework licenses remain with their respective projects.

**Reference sources:**
- [OpenAI · Harness Engineering](https://openai.com/index/harness-engineering/)
- [Anthropic · Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- [ai-boost/awesome-harness-engineering](https://github.com/ai-boost/awesome-harness-engineering)

---

Built as a learning-in-public project. Contributions, corrections, and new pattern entries welcome — open a PR or issue.
