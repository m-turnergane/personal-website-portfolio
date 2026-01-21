# Personal Website Portfolio

A personal portfolio and writing space built with Next.js, TypeScript, and Tailwind CSS. This site is a living document—a digital footprint meant to be refined over time, showcasing projects, automation experiments, trading research, and technical writing.

The goal was simple: create a space that feels like mine. Dark, minimal, and focused on readability. No distractions, no clutter—just the work and the words.

## Features

- **MDX-powered content** — Projects, automation case studies, and articles authored in MDX with custom components
- **Four content collections** — Deployed Projects, Automation & Agents, Trading Lab, and Writing
- **Dark minimalist design** — Near-black backgrounds, monochrome palette, subtle motion
- **Canvas-based starfield** — Orbiting particle animation that responds to viewport and respects `prefers-reduced-motion`
- **Responsive & accessible** — Works across devices, supports keyboard navigation, respects motion preferences
- **SEO fundamentals** — Dynamic metadata, sitemap, robots.txt, RSS feed, Open Graph images

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| Content | MDX with gray-matter frontmatter |
| Fonts | Geist (via `next/font`) |
| Analytics | Vercel Analytics & Speed Insights (optional) |
| Deployment | Vercel (recommended) |

## Local Development

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/m-turnergane/personal-website-portfolio.git
cd personal-website-portfolio

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The site will be available at `http://localhost:3000`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |

## Environment Variables

**No environment variables are required for basic functionality.** The site builds and runs without any API keys.

Optional variables (see `.env.example`):

| Variable | Purpose | Required |
|----------|---------|----------|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO/OG images | No (defaults to localhost) |

Analytics are automatically configured when deployed to Vercel—no manual setup needed.

## Project Structure

```
├── app/                    # Next.js App Router pages and components
│   ├── components/         # Shared React components
│   ├── hooks/              # Custom React hooks
│   ├── projects/           # Project collection pages
│   ├── automation/         # Automation collection pages
│   ├── trading-lab/        # Trading Lab collection pages
│   └── writing/            # Writing collection pages
├── content/                # MDX content files
│   ├── projects/           # Project case studies
│   ├── automation/         # Automation write-ups
│   ├── trading/            # Trading Lab experiments
│   └── writing/            # Blog posts and articles
├── lib/                    # Shared utilities
│   ├── content.ts          # MDX loading and parsing
│   └── site-config.ts      # Site-wide configuration
└── public/                 # Static assets (images, favicon)
```

## Content Authoring

Content lives in the `content/` directory as MDX files. Each file uses YAML frontmatter:

```mdx
---
title: "Project Title"
date: "2024-01-15"
summary: "Brief description for cards and SEO"
tags: ["tag1", "tag2"]
status: "published"
links:
  github: "https://github.com/..."
  live: "https://..."
---

# Content goes here

Regular MDX with custom components available.
```

### Content Status

- `published` — Visible on the site
- `coming-soon` — Shows in "In Development" sections

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com/new)
3. Deploy — no environment variables required

### Other Platforms

The site is a standard Next.js application and can be deployed anywhere that supports Node.js:

```bash
pnpm build
pnpm start
```

## Security

- **No secrets required** — The site runs without API keys
- **Environment files gitignored** — `.env*` files (except `.env.example`) are excluded
- **No hardcoded credentials** — All optional keys use environment variables
- **Public assets only** — No private data in the repository

## License

This is a personal portfolio. The code structure is available for reference, but the content (writing, images, project descriptions) is my own work.

---

Built by [Muhammad Gane](https://github.com/m-turnergane)
