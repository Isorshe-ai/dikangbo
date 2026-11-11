# dikangbo — portfolio and engineering blog

Astro static site for David Ikangbo. Deployed to Netlify (free plan). No paid services.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies (Node 22) |
| `npm run dev` | Dev server at http://localhost:4321 (drafts are visible) |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `node scripts/validate-build.mjs` | Check the build has RSS, sitemap, canonicals and OG tags |

## Before the first deploy

1. Edit the social URLs in `src/data/site.ts` (LinkedIn, GitHub, X). Placeholders are marked `REPLACE-ME`.
2. Put your resume at `public/documents/David_Ikangbo_Resume.pdf`. The old repo never contained the file, so the download button was broken.
3. Add real credentials to `src/data/certifications.ts`. The section stays hidden in production until you do.
4. Add real metrics to the project outcomes in `src/data/projects.ts` where you have them.

## Writing an article

Create `src/content/blog/<slug>.md`. The file name becomes the URL (`/blog/<slug>/`).

```md
---
title: "Your title (max 90 chars)"
description: "50–200 characters; used for SEO, social cards and RSS."
pubDate: 2026-12-01
updatedDate: 2026-12-10      # optional
category: DevOps              # DevOps | Platform Engineering | SRE | Cloud | Security
tags: [Terraform, AWS]
draft: false                  # true hides it from production builds
related: [other-article-slug] # optional; otherwise picked by category/tag overlap
---
```

- New categories: add them to `CATEGORIES` in `src/data/site.ts`.
- Diagrams: put SVG/PNG files in `public/images/blog/` and embed with `<figure><img …><figcaption>…</figcaption></figure>`.
- A 1200×630 social card is generated for every article at `/og/blog/<slug>.png`.
- Reading time, table of contents, share buttons, related articles, RSS and JSON-LD are automatic.

## Deployment (GitHub → Netlify)

1. Push this repo to GitHub.
2. Netlify → Add new site → Import from Git → choose the repo. Build settings come from `netlify.toml` (`npm run build`, publish `dist`).
3. Pushes to `main` deploy to production; pull requests get deploy previews.
4. Contact form: Netlify detects it at build time. Enable email notifications under Site configuration → Forms.
5. `.github/workflows/ci.yml` builds and validates every push and PR. The old S3 deploy workflow was removed.
