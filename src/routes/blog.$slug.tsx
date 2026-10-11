import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { PublicPage } from '@/components/site-footer';
import { POSTS } from '@/lib/blog-posts';

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => { const post = POSTS.find(p => p.slug === params.slug); if (!post) throw notFound(); return post; },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: 'Article not found — GetCryptoDomains.com' }, { name: 'robots', content: 'noindex' }] };
    const url = `https://getcryptodomains.com/blog/${params.slug}`;
    return {
      meta: [
        { title: `${loaderData.title} — GetCryptoDomains.com` },
        { name: 'description', content: loaderData.excerpt },
        { property: 'og:title', content: loaderData.title },
        { property: 'og:description', content: loaderData.excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: url },
        { name: 'twitter:card', content: 'summary' },
      ],
      links: [{ rel: 'canonical', href: url }],
      scripts: [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: loaderData.title, datePublished: loaderData.date, author: { '@type': 'Organization', name: 'GetCryptoDomains.com' } }) }],
    };
  },
  notFoundComponent: PostMissing,
  component: PostPage,
});

function PostMissing() { return <PublicPage title="Article not found"><Link to="/blog" className="text-primary">← Back to the blog</Link></PublicPage>; }
function PostPage() {
  const post = Route.useLoaderData();
  return <PublicPage title={post.title} intro={new Date(post.date).toLocaleDateString('en-US', { dateStyle: 'long' })}>
    <article className="blog-article">{post.body.map((p, i) => <p key={i}>{p}</p>)}<p className="text-xs text-muted-foreground">General information only — not financial, legal or tax advice.</p><Link to="/blog" className="text-primary">← All articles</Link></article>
  </PublicPage>;
}
