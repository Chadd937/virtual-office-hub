import { createFileRoute, Link } from '@tanstack/react-router';
import { LegalText } from '@/components/legal-text';

export const Route = createFileRoute('/legal')({
  head: () => ({ meta: [
    { title: 'Terms & Privacy — GetCryptoDomains.com' },
    { name: 'description', content: 'Terms of service, privacy policy and crypto risk disclosures for GetCryptoDomains.com.' },
    { property: 'og:title', content: 'Terms & Privacy — GetCryptoDomains.com' },
    { property: 'og:description', content: 'We do not sell your personal information. Read our terms and disclosures.' },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: () => <main className="legal-page"><Link to="/" className="text-primary text-sm">← Back to the office</Link><h1>Terms & Privacy</h1><LegalText /></main>,
});
