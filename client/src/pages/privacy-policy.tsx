import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white dark:bg-black py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Last updated: June 21, 2025
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Home Krypto Token ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
              </p>

              <h2>2. Information We Collect</h2>
              
              <h3>Personal Information</h3>
              <ul>
                <li>Name, email address, phone number</li>
                <li>Government-issued identification (for KYC compliance)</li>
                <li>Address and residency information</li>
                <li>Financial information for verification purposes</li>
                <li>Wallet addresses and transaction history</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <ul>
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Usage patterns and platform interactions</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Provide and maintain our services</li>
                <li>Process transactions and manage your account</li>
                <li>Comply with legal and regulatory requirements (KYC/AML)</li>
                <li>Communicate with you about your account and our services</li>
                <li>Improve our platform and user experience</li>
                <li>Detect and prevent fraud or security issues</li>
                <li>Send marketing communications (with your consent)</li>
              </ul>

              <h2>4. Information Sharing and Disclosure</h2>
              <p>We may share your information with:</p>
              
              <h3>Service Providers</h3>
              <ul>
                <li>Payment processors and financial institutions</li>
                <li>Identity verification services</li>
                <li>Cloud hosting and data storage providers</li>
                <li>Analytics and marketing platforms</li>
              </ul>

              <h3>Legal Requirements</h3>
              <ul>
                <li>Government agencies and regulators</li>
                <li>Law enforcement (when legally required)</li>
                <li>Courts and legal proceedings</li>
                <li>Tax authorities</li>
              </ul>

              <h2>5. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your information:
              </p>
              <ul>
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Multi-factor authentication</li>
                <li>Regular security audits and assessments</li>
                <li>Access controls and employee training</li>
                <li>Secure data centers with physical safeguards</li>
              </ul>

              <h2>6. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to:
              </p>
              <ul>
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Maintain records for regulatory purposes</li>
              </ul>

              <h2>7. Your Rights and Choices</h2>
              <p>
                Depending on your jurisdiction, you may have the right to:
              </p>
              <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your information (subject to legal requirements)</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>Withdraw consent for marketing communications</li>
              </ul>

              <h2>8. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to:
              </p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized content and recommendations</li>
                <li>Enhance security and prevent fraud</li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences.
              </p>

              <h2>9. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during international transfers.
              </p>

              <h2>10. Children's Privacy</h2>
              <p>
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18.
              </p>

              <h2>11. Third-Party Links</h2>
              <p>
                Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. Please review their privacy policies before providing any information.
              </p>

              <h2>12. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>

              <h2>13. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p>
                Email: privacy@homekrypto.com<br />
                Address: [Company Address]<br />
                Phone: [Phone Number]
              </p>

              <h2>14. Data Protection Officer</h2>
              <p>
                For EU residents, you can contact our Data Protection Officer at:
              </p>
              <p>
                Email: dpo@homekrypto.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}