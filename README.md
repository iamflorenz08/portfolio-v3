# Portfolio

pnpm workspace monorepo.

```
apps/
  web/                  Next.js 16 (App Router) + Tailwind CSS v4
  api/                  (planned) backend
packages/
  shared/               Shared TypeScript types (web ⇄ api contract)
  typescript-config/    Shared tsconfig presets
```

## Getting started

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm lint && pnpm typecheck
```

## Editing content

All content lives in `apps/web/src/content/site.ts`, typed by `@portfolio/shared`.
SEO metadata, JSON-LD, OG images, sitemap and manifest are all derived from it.

Set `NEXT_PUBLIC_SITE_URL` (see `apps/web/.env.example`) to your production URL so
canonical links, the sitemap and OG image URLs are correct.

## SEO

- Metadata API: title template, description, keywords, canonical, Open Graph, Twitter
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest` (generated from `src/app`)
- Dynamic OG / Twitter images (`opengraph-image.tsx`, `twitter-image.tsx`)
- JSON-LD structured data: `WebSite`, `ProfilePage`, `Person`
- Fully static prerendering, semantic HTML, single `<h1>`, skip link, accessible nav

## Adding the backend

Create `apps/api` with its own `package.json` (e.g. `@portfolio/api`) and depend on
`"@portfolio/shared": "workspace:*"` to reuse the types. It is picked up automatically
by `pnpm-workspace.yaml`.
