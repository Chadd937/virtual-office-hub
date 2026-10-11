import { createFileRoute, Link } from '@tanstack/react-router';
import { PublicPage } from '@/components/site-footer';
import { POSTS } from '@/lib/blog-posts';

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: [
      { title: 'Blog — GetCryptoDomains.com' },
      { name: 'description', content: 'Guides on turning domains into websites, apps and Google Play launches, plus ways to earn from a domain.' },
      { property: 'og:title', content: 'Blog — GetCryptoDomains.com' },
      { property: 'og:description', content: 'Practical guides for domain owners and first-time founders.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://getcryptodomains.com/blog' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [{ rel: 'canonical', href: 'https://getcryptodomains.com/blog' }],
  }),
  component: () => <PublicPage title="The GetCryptoDomains blog" intro="Practical guides for domain owners and first-time founders.">
    <div className="blog-grid">{POSTS.map(p => <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="blog-card"><small>{new Date(p.date).toLocaleDateString('en-US', { dateStyle: 'long' })}</small><h2>{p.title}</h2><p>{p.excerpt}</p><span className="text-primary">Read article →</span></Link>)}</div>
  </PublicPage>,
});
