import { createFileRoute } from '@tanstack/react-router';
import { POSTS } from '@/lib/blog-posts';

const BASE = 'https://getcryptodomains.com';
const PATHS = ['/', '/pricing', '/faq', '/blog', '/legal', '/privacy-choices', ...POSTS.map(p => `/blog/${p.slug}`)];

export const Route = createFileRoute('/sitemap.xml')({
  server: { handlers: { GET: () => new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${PATHS.map(p => `<url><loc>${BASE}${p}</loc></url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml' } }) } },
});
