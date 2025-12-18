import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | SmartClass24',
  description: 'SmartClass24 Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 font-headline">Terms of Service</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Last updated: December 18, 2025
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using SmartClass24, you agree to be bound by these Terms of Service 
          and all applicable laws and regulations.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. User Accounts</h2>
        <p>You are responsible for:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Maintaining the confidentiality of your account</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of unauthorized use</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Violate any laws or regulations</li>
          <li>Share your account with others</li>
          <li>Attempt to access restricted areas</li>
          <li>Interfere with platform operation</li>
          <li>Use content without permission</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
        <p>
          All content on SmartClass24, including lessons, quizzes, and materials, is protected 
          by copyright and other intellectual property rights.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
        <p>
          SmartClass24 provides educational content "as is" and makes no warranties about 
          accuracy or completeness. We are not liable for any damages arising from use of the platform.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Continued use of the platform 
          constitutes acceptance of modified terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact</h2>
        <p>
          For questions about these terms, contact: legal@smartclass24.com
        </p>
      </div>
    </div>
  );
}
