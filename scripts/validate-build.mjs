// Fails CI if the production build is missing the things this site promises.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const required = ['index.html', 'blog/index.html', 'rss.xml', 'sitemap-index.xml', 'robots.txt', '404.html', 'projects/index.html'];
const errors = [];
for (const f of required) if (!existsSync(join(dist, f))) errors.push(`missing ${f}`);

const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);
const pages = walk(dist).filter((f) => f.endsWith('index.html'));
for (const p of pages) {
  const html = readFileSync(p, 'utf8');
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${p}: no <title>`);
  if (!/rel="canonical"/.test(html)) errors.push(`${p}: no canonical`);
  if (!/property="og:image"/.test(html)) errors.push(`${p}: no og:image`);
  if (!/name="description"/.test(html)) errors.push(`${p}: no meta description`);
}
const posts = pages.filter((p) => p.includes(`${join('dist', 'blog')}/`) && !p.endsWith(join('blog', 'index.html')) && !/blog\/(category|tag)\//.test(p.replace(/\\/g, '/')));
if (posts.length === 0) errors.push('no article pages generated');
const todo = pages.filter((p) => readFileSync(p, 'utf8').includes('REPLACE-ME'));
if (todo.length) console.warn(`WARNING: placeholder social links (REPLACE-ME) found in ${todo.length} pages. Edit src/data/site.ts.`);
if (errors.length) { console.error('Build validation failed:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log(`Build OK: ${pages.length} pages, ${posts.length} articles.`);
