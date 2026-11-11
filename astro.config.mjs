import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Change this if you add a custom domain.
const SITE = 'https://dikangbo.netlify.app';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.includes('/contact-success/') })],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: false,
    },
  },
});
