import { createFileRoute } from '@tanstack/react-router';
import { PublicPage } from '@/components/site-footer';

export const Route = createFileRoute('/privacy-choices')({
  head: () => ({
    meta: [
      { title: 'Do Not Sell or Share My Personal Information — GetCryptoDomains.com' },
      { name: 'description', content: 'GetCryptoDomains.com does not sell or share personal information. Learn about your privacy rights and how to make a request.' },
      { property: 'og:title', content: 'Your Privacy Choices — GetCryptoDomains.com' },
      { property: 'og:description', content: 'We do not sell or share your personal information.' },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: 'https://getcryptodomains.com/privacy-choices' },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [{ rel: 'canonical', href: 'https://getcryptodomains.com/privacy-choices' }],
  }),
  component: () => <PublicPage title="Do Not Sell or Share My Personal Information" intro="Your privacy choices under California (CCPA/CPRA) and other U.S. state privacy laws.">
    <div className="legal-text">
      <p><strong>We do not sell your personal information, and we do not share it for cross-context behavioral advertising.</strong> This has been true for the past 12 months. Because we do not sell or share, there is nothing you need to opt out of — but you may still submit a request and we will confirm it in writing.</p>
      <p><strong>Global Privacy Control.</strong> We treat a browser Global Privacy Control (GPC) signal as a valid opt-out request.</p>
      <p><strong>Your rights.</strong> You may request to know, access, correct or delete the personal information we hold about you, and to limit use of sensitive information. We will not discriminate against you for exercising these rights.</p>
      <p><strong>How to make a request.</strong> Email <a className="text-primary" href="mailto:support@getcryptodomains.com?subject=Privacy%20request">support@getcryptodomains.com</a> with the subject "Privacy request" from the email you use to sign in. We respond within 45 days. An authorized agent may submit a request on your behalf with written permission.</p>
    </div>
  </PublicPage>,
});
