# Astro Portfolio

A responsive personal portfolio and engineering blog built with Astro. Fork it to create your own portfolio: update the profile and content data, run it locally, then deploy the static site to Netlify or another static host.

## Features

- Portfolio pages for projects, skills, experience, education, and community work
- Markdown-powered blog with categories, tags, RSS, sitemap, and social preview images
- Responsive layout with dark mode
- Contact form configured for Netlify Forms
- Print-ready resume generated from the site content; visitors can save it as a PDF from their browser's print dialog
- GitHub Actions workflow for type-checking, building, and validating the site

## Requirements

- Node.js 22 or later
- npm

## Run locally

```sh
npm ci
npm run dev
```

Astro prints the local development URL in the terminal, usually `http://localhost:4321`.

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run check` | Type-check Astro files |
| `npm run build` | Type-check and create the production site in `dist/` |
| `npm run preview` | Preview the production build locally |
| `node scripts/validate-build.mjs` | Validate generated RSS, sitemap, canonical URLs, and social metadata |

## Make it yours

1. Update name, biography, location, contact details, social links, and canonical site URL in `src/data/site.ts`.
2. Edit experience, skills, education, training, and volunteering in `src/data/resume.ts`. The experience page and generated resume use this shared data.
3. Update projects in `src/data/projects.ts` and certifications in `src/data/certifications.ts`.
4. Replace `public/favicon.svg` and the diagrams in `public/images/blog/` with your own assets.
5. Add or edit Markdown posts in `src/content/blog/`. Set `draft: true` in frontmatter to hide a post from production builds.
6. Review the contact form and social links before publishing. The contact form uses Netlify Forms when deployed on Netlify.

The resume at `/resume/` is rendered from your site content; it does not depend on a separately uploaded PDF. Use **Generate Resume PDF** to open the print dialog, then select **Save as PDF**. You can also open `/resume/` and use its print button.

## Deploy

### Netlify

1. Fork this repository and push your changes to GitHub.
2. In Netlify, create a site by importing your fork.
3. Use `npm run build` as the build command and `dist` as the publish directory. Netlify reads these settings from `netlify.toml` at the repository root.
4. Set the production URL in `src/data/site.ts` to your deployed domain and configure a custom domain in Netlify if desired.
5. Enable Netlify Forms notifications if you want to receive contact-form submissions.

The included GitHub Actions workflow runs the build and output validation on pushes to `main` and pull requests. Configure your deployment provider separately if you use a host other than Netlify.

## License

This project is released under the [MIT License](./LICENSE). Remember to replace the original owner's personal details, writing, project descriptions, and images with your own before publishing a fork.
