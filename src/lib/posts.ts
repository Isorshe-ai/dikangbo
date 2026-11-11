import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from '../data/site';

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts are hidden in production builds. */
export async function getPosts(): Promise<Post[]> {
  const all = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** ~220 wpm; code blocks are skipped so snippets don't inflate the estimate. */
export function readingTime(body = ''): number {
  const text = body.replace(/```[\s\S]*?```/g, ' ').replace(/<[^>]+>/g, ' ').replace(/[#>*_`\[\]()!-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

/** Related = explicit `related` slugs first, then score by shared category/tags. */
export function getRelated(current: Post, all: Post[], limit = 3): Post[] {
  const others = all.filter((p) => p.id !== current.id);
  const forced = current.data.related.map((id) => others.find((p) => p.id === id)).filter(Boolean) as Post[];
  const scored = others
    .filter((p) => !forced.includes(p))
    .map((p) => ({
      p,
      score:
        (p.data.category === current.data.category ? 2 : 0) +
        p.data.tags.filter((t) => current.data.tags.includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .map((x) => x.p);
  return [...forced, ...scored].slice(0, limit);
}

export function allTags(posts: Post[]) {
  const m = new Map<string, number>();
  posts.forEach((p) => p.data.tags.forEach((t) => m.set(t, (m.get(t) ?? 0) + 1)));
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
export const tagSlug = slugify;
