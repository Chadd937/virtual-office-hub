import { createFileRoute } from '@tanstack/react-router';
import { PublicPage } from '@/components/site-footer';

const QA = [
  ['What is GetCryptoDomains.com?', 'A virtual office of AI managers and employees that plans and drafts the work to turn your domain into a website, a mobile app and a Google Play release package. You approve every task and review every deliverable.'],
  ['Are the AI agents real?', 'Yes. Each hired manager and employee is backed by a real AI model that writes plans and deliverables. Preview profiles shown before sign-in are clearly labeled as examples.'],
  ['How does the free trial work?', 'You get 3 days of full access with no holdbacks. A card is required to start the trial. Cancel before it ends and you will not be charged.'],
  ['How much does it cost?', 'Starter is $29.99/month for 1 open project, Growth is $49.99/month for 3, and Scale is $99.99/month for 10.'],
  ['Can I pay with crypto?', 'Yes. Send USDC or USDT on Solana, Ethereum, Base, Polygon, Arbitrum, BNB Chain or Tron, paste your transaction ID, and access switches on once the payment is confirmed on chain. Crypto payments cover 30 days and are non-refundable.'],
  ['Will you submit my app to Google Play?', 'We prepare the listing, privacy policy and release checklist. The final submission is made from your own Google Play developer account, and approval is never guaranteed.'],
  ['Do you hold my crypto or domains?', 'No. We never hold, transfer or manage your funds or domains, and we will never ask for seed phrases, private keys or wallet passwords.'],
  ['Do you sell my data?', 'No. We do not sell or share your personal information. See our Privacy Policy and the "Do Not Sell or Share" page.'],
  ['Is this financial advice?', 'No. Everything here is general information. Talk to a licensed professional before making financial, legal or tax decisions.'],
];

export const Route = createFileRoute('/faq')({
  head: () => ({
    meta: [
      { title: 'Q&A — GetCryptoDomains.com' },
      { name: 'description', content: 'Answers about the AI virtual office, free trial, pricing, crypto payments, Google Play and privacy.' },
      { property: 'og:title', content: 'Q&A — GetCryptoDomains.com' },
      { property: 'og:description', content: 'Everything you need to know before starting your 3-day free trial.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://getcryptodomains.com/faq' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [{ rel: 'canonical', href: 'https://getcryptodomains.com/faq' }],
    scripts: [{ type: 'application/ld+json', children: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: QA.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }) }],
  }),
  component: () => <PublicPage title="Questions & answers" intro="Straight answers about your AI office, pricing and privacy.">
    <div className="faq-list">{QA.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
  </PublicPage>,
});
