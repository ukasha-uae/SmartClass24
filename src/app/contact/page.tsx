import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | SmartClass24',
  description: 'Get in touch with SmartClass24 support team',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 font-headline">Contact Us</h1>
        <p className="text-muted-foreground">
          We're here to help! Reach out to us through any of the channels below.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Support
            </CardTitle>
            <CardDescription>
              Get a response within 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href="mailto:support@smartclass24.com" className="text-primary hover:underline">
              support@smartclass24.com
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Phone Support
            </CardTitle>
            <CardDescription>
              Available Mon-Fri, 8am-6pm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono">+233 XX XXX XXXX</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Community Forum
            </CardTitle>
            <CardDescription>
              Ask questions and get answers from the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/community">
              <Button variant="outline" size="sm">Visit Forum</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Office Location
            </CardTitle>
            <CardDescription>
              Visit us at our office
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Accra, Ghana<br />
              (Exact address coming soon)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
