'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsOfServicePage() {
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
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">Last updated: December 6, 2025</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <p>
              By accessing and using SmartClass24 ("the Platform"), you agree to be bound by these Terms of Service. 
              If you are a student under 18, your parent or guardian must review and accept these terms on your behalf.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div>
              <h3 className="font-semibold mb-2">Account Creation</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Students must provide accurate information during registration</li>
                <li>One account per student</li>
                <li>Parents can link multiple student accounts</li>
                <li>You are responsible for maintaining account security</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Account Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                <li>Keep login credentials confidential</li>
                <li>Do not share your account with others</li>
                <li>Update your information when necessary</li>
                <li>Use your real name and school information</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <p className="font-semibold">You agree to use SmartClass24 only for lawful educational purposes. Prohibited activities include:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Harassment, bullying, or threatening other users</li>
              <li>Sharing inappropriate or offensive content</li>
              <li>Cheating or helping others cheat on quizzes</li>
              <li>Impersonating other students or teachers</li>
              <li>Attempting to hack or disrupt the platform</li>
              <li>Sharing answers to challenge arena questions publicly</li>
              <li>Creating fake accounts or manipulating rankings</li>
              <li>Commercial use without permission</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Challenge Arena Rules</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Play fair - no external assistance during live battles</li>
              <li>Respect your opponents - no trash talk or harassment</li>
              <li>Accept results gracefully - disputes will be reviewed by admins</li>
              <li>Rating manipulation or boosting is prohibited</li>
              <li>School vs school battles must be coordinated by teachers</li>
              <li>Tournament prizes are non-transferable</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Content Ownership</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div>
              <h3 className="font-semibold mb-2">Platform Content</h3>
              <p className="text-muted-foreground">
                All lessons, quizzes, questions, and educational materials are owned by SmartClass24 or licensed from 
                third parties. You may not copy, distribute, or reproduce this content without permission.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 mt-3">User Content</h3>
              <p className="text-muted-foreground">
                Content you create (study group posts, questions, achievements) remains yours, but you grant SmartClass24 
                a license to display and use this content within the platform. You retain the right to delete your content.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Parental Oversight</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>Parents can monitor student activity through the Parent Portal</li>
              <li>Parents can restrict social features or challenge participation</li>
              <li>Parents will be notified of policy violations</li>
              <li>Parents can request account deletion at any time</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Service Modifications</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <p className="text-muted-foreground">
              SmartClass24 reserves the right to modify, suspend, or discontinue any part of the service with or without 
              notice. We will not be liable for any modification or discontinuation of services.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate accounts that violate these terms. Students may delete 
              their accounts at any time through Settings. Upon termination, your access to the platform will cease, 
              but we may retain certain data as required by law or for legitimate business purposes.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <p className="text-muted-foreground">
              SmartClass24 is provided "as is" without warranties of any kind. While we strive for accuracy, we do not 
              guarantee that content is error-free or that it will guarantee academic success. Your use of the platform 
              is at your own risk.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <p className="text-muted-foreground">
              SmartClass24 and its operators shall not be liable for any indirect, incidental, or consequential damages 
              arising from your use of the platform, including but not limited to data loss, exam performance, or 
              device issues.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <p className="text-muted-foreground">
              These Terms of Service are governed by the laws of the jurisdiction where the service is provided. 
              Any disputes will be resolved according to applicable local laws.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="mb-3">For questions about these terms:</p>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: <a href="mailto:legal@smartclass24.edu.gh" className="text-primary hover:underline">legal@smartclass24.edu.gh</a></p>
              <p>Phone: +233 30 000 0000</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>By continuing to use SmartClass24, you acknowledge that you have read and agree to these Terms of Service.</p>
        </div>
      </div>
    </div>
  );
}
