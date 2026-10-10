export const LEGAL_VERSION = '2026-10-10';

export function LegalText() {
  return <div className="legal-text">
    <h3>Terms of Service</h3>
    <p>GetCryptoDomains.com ("we", "us") provides an AI-assisted virtual office that helps you plan and draft work for domains, websites and apps. By using the service you confirm you are at least 18 years old and able to enter a binding agreement.</p>
    <ul>
      <li><strong>Not a financial service.</strong> We are not a broker, dealer, exchange, money transmitter, custodian, bank, or investment adviser. We do not hold, transfer, swap or manage cryptocurrency or digital assets for you.</li>
      <li><strong>No financial, legal or tax advice.</strong> Content from our AI managers and employees is informational and may be incomplete or wrong. Consult a licensed professional before making financial, legal or tax decisions.</li>
      <li><strong>Crypto and domain risk.</strong> Digital assets and blockchain-based domains are volatile and may lose all value. Blockchain transactions are generally irreversible. Domain value is never guaranteed.</li>
      <li><strong>AI-generated work.</strong> Every deliverable is a draft that you review and approve. You are responsible for checking accuracy, trademarks and legal compliance before using or publishing it.</li>
      <li><strong>Trademarks.</strong> Do not use the service to target, squat on, or infringe another party's trademark or brand.</li>
      <li><strong>Sanctions and lawful use.</strong> You may not use the service if you are located in, or a resident of, a country or region subject to U.S. sanctions, or listed on a U.S. government restricted-party list. No illegal, fraudulent or deceptive use.</li>
      <li><strong>App store submissions.</strong> We help prepare app listings and release packages. Approval by Google Play or any other store is never guaranteed, and the final submission is made from your own developer account.</li>
      <li><strong>Taxes.</strong> You are responsible for reporting and paying any taxes on income or gains you earn.</li>
      <li><strong>No guarantee of results.</strong> The service is provided "as is", without warranties. To the extent allowed by law, our liability is limited to the amount you paid us in the prior 12 months.</li>
    </ul>
    <h3>Privacy Policy</h3>
    <ul>
      <li><strong>We do not sell or rent your personal information.</strong> We do not share it for cross-context advertising.</li>
      <li><strong>What we store:</strong> only what is needed to run your office — your sign-in email, and the projects, tasks, agents and deliverables you create. Your website questionnaire answers stay in your browser until you sign in and save them to your office.</li>
      <li><strong>We never ask for</strong> seed phrases, private keys, wallet passwords or payment card numbers in chat. Never share them with anyone.</li>
      <li><strong>AI processing:</strong> text you send to agents is processed by our AI provider only to produce your reply or deliverable.</li>
      <li><strong>Access:</strong> your office data is private to your account. Delete requests can be sent to support@getcryptodomains.com.</li>
      <li><strong>Your rights:</strong> depending on your state (for example California), you may request access, correction or deletion of your data. We will not discriminate against you for exercising these rights.</li>
      <li><strong>Children:</strong> the service is not directed to anyone under 18.</li>
    </ul>
    <p className="legal-version">Version {LEGAL_VERSION}. This is a general template and should be reviewed by a qualified attorney.</p>
  </div>;
}
