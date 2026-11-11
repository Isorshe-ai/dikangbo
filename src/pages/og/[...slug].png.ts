import type { APIRoute, GetStaticPaths } from 'astro';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { getPosts } from '../../lib/posts';
import { SITE } from '../../data/site';

const require = createRequire(import.meta.url);
const font = (w: string) => readFileSync(require.resolve(`@fontsource/inter/files/inter-latin-${w}-normal.woff`));
const regular = font('400');
const bold = font('700');

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  return [
    { params: { slug: 'default' }, props: { title: SITE.name, sub: SITE.tagline, meta: 'dikangbo.netlify.app' } },
    ...posts.map((p) => ({
      params: { slug: `blog/${p.id}` },
      props: { title: p.data.title, sub: p.data.category, meta: `${SITE.name} · dikangbo.netlify.app` },
    })),
  ];
};

const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export const GET: APIRoute = async ({ props }) => {
  const { title, sub, meta } = props as { title: string; sub: string; meta: string };
  const size = title.length > 60 ? 54 : 66;
  const tree = h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', background: '#121212', color: '#fff', padding: 72, fontFamily: 'Inter', borderLeft: '16px solid #00ffe0' }, [
    h('div', { display: 'flex', fontSize: 34, color: '#00ffe0', fontWeight: 700 }, `>_ ${sub}`),
    h('div', { display: 'flex', width: '100%', fontSize: size, fontWeight: 700, lineHeight: 1.15 }, title),
    h('div', { display: 'flex', fontSize: 28, color: '#b5b5b5' }, meta),
  ]);
  const svg = await satori(tree as any, {
    width: 1200, height: 630,
    fonts: [
      { name: 'Inter', data: regular, weight: 400, style: 'normal' },
      { name: 'Inter', data: bold, weight: 700, style: 'normal' },
    ],
  });
  const png = new Resvg(svg).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
