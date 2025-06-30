import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

export default function TermsAndConditions() {
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: June 21, 2025
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using the Home Krypto Token (HKT) platform and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                Home Krypto Token provides a blockchain-based platform for fractional real estate investment through digital tokens. Our service allows users to purchase HKT tokens representing shares in real estate properties, participate in rental income distribution, and benefit from potential property appreciation.
              </p>

              <h2>3. Investment Risks</h2>
              <p>
                <strong>IMPORTANT NOTICE:</strong> Cryptocurrency and real estate investments carry significant risks. You may lose some or all of your investment. Consider the following risks:
              </p>
              <ul>
                <li>Market volatility and price fluctuations</li>
                <li>Regulatory changes affecting cryptocurrency or real estate</li>
                <li>Liquidity risks - tokens may not be easily convertible to cash</li>
                <li>Property-specific risks including vacancy, damage, or devaluation</li>
                <li>Technology risks related to blockchain and smart contracts</li>
              </ul>

              <h2>4. Eligibility</h2>
              <p>
                You must be at least 18 years old and legally capable of entering into contracts in your jurisdiction. You represent that you have the legal authority to use our services and comply with these terms.
              </p>

              <h2>5. Token Ownership and Rights</h2>
              <p>
                HKT tokens represent fractional interests in real estate properties. Token holders may be entitled to:
              </p>
              <ul>
                <li>Proportional rental income distributions (subject to expenses and fees)</li>
                <li>Voting rights on certain property-related decisions</li>
                <li>Potential appreciation in token value based on property performance</li>
                <li>Usage rights for vacation rental properties (pilot program)</li>
              </ul>

              <h2>6. Fees and Expenses</h2>
              <p>
                Our platform charges various fees for services, including but not limited to:
              </p>
              <ul>
                <li>Platform transaction fees</li>
                <li>Property management fees</li>
                <li>Maintenance and operational expenses</li>
                <li>Legal and administrative costs</li>
              </ul>

              <h2>7. Prohibited Activities</h2>
              <p>
                You agree not to:
              </p>
              <ul>
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Attempt to manipulate token prices or market conditions</li>
                <li>Share or sell your account credentials</li>
                <li>Engage in money laundering or terrorist financing</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>

              <h2>8. KYC and AML Compliance</h2>
              <p>
                We are committed to compliance with Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations. You may be required to provide identification and other documentation to verify your identity.
              </p>

              <h2>9. Privacy and Data Protection</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
              </p>

              <h2>10. Intellectual Property</h2>
              <p>
                All content, trademarks, and intellectual property on our platform remain the property of Home Krypto Token or our licensors. You may not reproduce, distribute, or create derivative works without permission.
              </p>

              <h2>11. Disclaimers</h2>
              <p>
                <strong>NO INVESTMENT ADVICE:</strong> We do not provide investment, legal, or tax advice. All investment decisions are your sole responsibility.
              </p>
              <p>
                <strong>NO GUARANTEES:</strong> We make no guarantees about investment returns, token performance, or property values.
              </p>

              <h2>12. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Home Krypto Token shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses.
              </p>

              <h2>13. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.
              </p>

              <h2>14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notifications. Continued use of the service constitutes acceptance of modified terms.
              </p>

              <h2>15. Contact Information</h2>
              <p>
                For questions about these Terms and Conditions, please contact us at:
              </p>
              <p>
                Email: legal@homekrypto.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}