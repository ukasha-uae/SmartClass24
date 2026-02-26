'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">Last updated: December 6, 2025</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Our Commitment to Privacy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-4">
            <p>
              At SmartClass24, we are committed to protecting the privacy and security of our students, parents, 
              and educators. This Privacy Policy explains how we collect, use, and safeguard your information.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Student Information</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Name and class/year</li>
                <li>School name and region</li>
                <li>Email address (optional)</li>
                <li>Profile picture (optional)</li>
                <li>Learning progress and quiz results</li>
                <li>Challenge arena statistics and rankings</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Parent/Guardian Information</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Name and contact information</li>
                <li>Linking code for student account access</li>
                <li>Communication preferences</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Usage Data</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Device information and browser type</li>
                <li>IP address and location (region level only)</li>
                <li>Pages visited and features used</li>
                <li>Time spent on platform</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>We use the collected information to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Provide personalized learning experiences</li>
              <li>Track progress and generate performance reports</li>
              <li>Enable challenge arena and social features</li>
              <li>Send notifications about achievements and challenges</li>
              <li>Improve our platform and develop new features</li>
              <li>Communicate important updates to students and parents</li>
              <li>Ensure platform security and prevent misuse</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Data Storage and Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Encrypted data transmission (HTTPS)</li>
              <li>Secure Firebase authentication and database</li>
              <li>Local storage for non-sensitive data only</li>
              <li>Regular security audits and updates</li>
              <li>Limited staff access to personal information</li>
            </ul>
            <p className="text-muted-foreground">
              Your data is stored on secure servers in compliance with international data protection standards.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Parental Rights and Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Parents and guardians have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Access their child's account and learning data</li>
              <li>Review and update student information</li>
              <li>Control privacy settings and notifications</li>
              <li>Request deletion of student data</li>
              <li>Opt-out of certain features (e.g., social features, challenge arena)</li>
              <li>Receive regular progress reports</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Student Privacy Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>We are committed to protecting student privacy:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>No advertising or marketing to students</li>
              <li>No selling or sharing of student data with third parties</li>
              <li>Age-appropriate content and interactions</li>
              <li>Moderated social features to ensure safety</li>
              <li>Option to use platform anonymously (Independent Learner mode)</li>
              <li>Clear privacy controls in student settings</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Under Ghana's Data Protection Act and international standards, you have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account and data</li>
              <li>Export your data (Settings → Data Export)</li>
              <li>Withdraw consent for data processing</li>
              <li>File a complaint with data protection authorities</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="mb-3">
              If you have questions or concerns about our Privacy Policy, please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: <a href="mailto:ukashasolution@gmail.com" className="text-primary hover:underline">ukashasolution@gmail.com</a></p>
              <p>Phone: +233 30 000 0000</p>
              <p>Address: Accra Digital Centre, Accra, Ghana</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>This policy is subject to updates. We will notify users of any significant changes.</p>
        </div>
      </div>
    </div>
  );
}
