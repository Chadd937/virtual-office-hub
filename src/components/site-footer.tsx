import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Building2 } from 'lucide-react';

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-grid">
      <div><Link to="/" className="footer-brand"><span className="brand-mark"><Building2 size={18}/></span>GetCryptoDomains.com</Link><p>An AI-assisted virtual office that turns your domain into a website, an app, and a Google Play release package — with you approving every step.</p></div>
      <nav aria-label="Product"><h4>Product</h4><Link to="/">Virtual office</Link><Link to="/pricing">Pricing</Link><Link to="/projects">Projects</Link><Link to="/integrations">Integrations</Link></nav>
      <nav aria-label="Resources"><h4>Resources</h4><Link to="/faq">Q&amp;A</Link><Link to="/blog">Blog</Link><a href="mailto:support@getcryptodomains.com">Contact support</a></nav>
      <nav aria-label="Legal"><h4>Legal</h4><Link to="/legal" hash="terms">Terms of Service</Link><Link to="/legal" hash="privacy">Privacy Policy</Link><Link to="/privacy-choices">Do Not Sell or Share My Personal Information</Link><Link to="/legal" hash="disclosures">Disclosures</Link></nav>
    </div>
    <div className="footer-disclosures">
      <p><strong>Not a financial service.</strong> GetCryptoDomains.com is not a broker, dealer, exchange, money transmitter, custodian or investment adviser. Nothing on this site is financial, legal or tax advice. Digital assets and blockchain domains are volatile and may lose all value.</p>
      <p><strong>AI disclosure.</strong> Managers, employees and Morgan the Store Manager are AI systems. Their work may contain errors and must be reviewed by you before use.</p>
      <p><strong>Your privacy.</strong> We do not sell or share your personal information, and we honor Global Privacy Control signals. Google Play approval is never guaranteed. Trademarks belong to their owners.</p>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} GetCryptoDomains.com. All rights reserved.</span><span>Made in the USA · Payments by Zen and on-chain USDC/USDT</span></div>
  </footer>;
}

export function PublicPage({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return <div className="public-page">
    <header className="public-top"><Link to="/" className="footer-brand"><span className="brand-mark"><Building2 size={18}/></span>GetCryptoDomains.com</Link><nav><Link to="/pricing">Pricing</Link><Link to="/faq">Q&amp;A</Link><Link to="/blog">Blog</Link><Link to="/" className="public-cta">Enter the office</Link></nav></header>
    <main className="public-main"><h1>{title}</h1>{intro && <p className="public-intro">{intro}</p>}{children}</main>
    <SiteFooter />
  </div>;
}
