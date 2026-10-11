import { createFileRoute } from '@tanstack/react-router';
import { PublicPage } from '@/components/site-footer';
import { PricingPanel } from '@/components/paywall';

export const Route = createFileRoute('/pricing')({
  head: () => ({
    meta: [
      { title: 'Pricing — 3-day free trial | GetCryptoDomains.com' },
      { name: 'description', content: 'Starter $29.99, Growth $49.99, Scale $99.99 per month. 3-day free trial with full access. Pay by card or USDC/USDT.' },
      { property: 'og:title', content: 'Pricing — GetCryptoDomains.com' },
      { property: 'og:description', content: '3-day free trial, full access. Plans for 1, 3 or 10 projects.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://getcryptodomains.com/pricing' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [{ rel: 'canonical', href: 'https://getcryptodomains.com/pricing' }],
  }),
  component: () => <PublicPage title="Simple pricing. Full access from day one." intro="Try everything free for 3 days, then keep the plan that fits how many projects you run."><PricingPanel /></PublicPage>,
});
