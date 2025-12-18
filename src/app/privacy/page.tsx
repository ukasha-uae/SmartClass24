import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | SmartClass24',
  description: 'SmartClass24 Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 font-headline">Privacy Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-6">
          Last updated: December 18, 2025
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, including:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Name and email address</li>
          <li>Profile information</li>
          <li>Learning progress and performance data</li>
          <li>Device and usage information</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Provide and improve our educational services</li>
          <li>Personalize your learning experience</li>
          <li>Track academic progress</li>
          <li>Communicate important updates</li>
          <li>Ensure platform security</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Protection</h2>
        <p>
          We implement appropriate security measures to protect your personal information 
          from unauthorized access, alteration, or disclosure.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>Access your personal data</li>
          <li>Request data correction or deletion</li>
          <li>Opt-out of marketing communications</li>
          <li>Export your learning data</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
        <p>
          For privacy-related questions, contact us at: privacy@smartclass24.com
        </p>
      </div>
    </div>
  );
}
