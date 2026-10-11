export type Post = { slug: string; title: string; excerpt: string; date: string; body: string[] };
export const POSTS: Post[] = [
  { slug: 'turn-a-domain-into-a-business', title: 'How to turn a domain into a real business', date: '2026-10-08', excerpt: 'A parked domain earns nothing. Here is a simple path from name to website, app and revenue.', body: [
    'A great domain is a head start, not a business. The first step is deciding what the name promises: a store, a tool, a community or a service.',
    'Next, write a one-page plan: who the customer is, what they pay for, and how they find you. In your virtual office, Morgan and your managers can draft this plan for you to approve.',
    'Then launch a simple website, measure what visitors do, and only then invest in an app. Every deliverable your AI team produces is a draft you review before it goes anywhere.' ] },
  { slug: 'google-play-release-checklist', title: 'The Google Play release checklist for first-time founders', date: '2026-10-05', excerpt: 'Store listing, privacy policy, content rating and signing — what you need before you submit.', body: [
    'Google Play requires a developer account, a privacy policy link, a content rating questionnaire, store screenshots and a signed app bundle.',
    'Your office can prepare the listing text, privacy policy draft and release checklist. The final submission is always made from your own developer account, and approval is never guaranteed.',
    'Plan for review time, and test on real devices before you press publish.' ] },
  { slug: 'five-ways-to-make-money-from-a-domain', title: 'Five ways to make money from a domain', date: '2026-10-01', excerpt: 'Ads, affiliates, subscriptions, lead generation and resale — the trade-offs of each.', body: [
    'Ads are easy to start but need traffic. Affiliate links pay per sale and fit review or comparison sites.',
    'Subscriptions build steady income when you offer ongoing value. Lead generation works well for local or professional services.',
    'Resale can pay off for premium names, but value is never guaranteed. This is general information, not financial advice.' ] },
];
