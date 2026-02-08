'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageSquare, Clock } from 'lucide-react';
import { useTenant } from '@/hooks/useTenant';
import { getDefaultTenant } from '@/tenancy/registry';
import { useState, useEffect } from 'react';

export default function ContactPage() {
  const { tenantId, branding } = useTenant();
  const [mounted, setMounted] = useState(false);
  const defaultTenant = getDefaultTenant();
  const safeTenantId = mounted ? tenantId : defaultTenant.id;
  const safeBranding = mounted ? branding : defaultTenant.branding;
  const isWisdomWarehouse = safeTenantId === 'wisdomwarehouse';
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 font-headline">Contact Us</h1>
        <p className="text-muted-foreground">
          {isWisdomWarehouse 
            ? 'We\'re here to support you and your child\'s learning journey. Reach out through any channel below.'
            : 'We\'re here to help! Reach out to us through any of the channels below.'
          }
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
              {isWisdomWarehouse ? 'Get personalized assistance' : 'Get a response within 24 hours'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a href={`mailto:${safeBranding.supportEmail}`} className="text-primary hover:underline">
              {safeBranding.supportEmail}
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
              {isWisdomWarehouse ? 'Call us during operating hours' : 'Available Mon-Fri, 8am-6pm'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono">
              {isWisdomWarehouse ? '+971 54 306 8648' : '+970589549030'}
            </p>
          </CardContent>
        </Card>

        {isWisdomWarehouse && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Operating Hours
              </CardTitle>
              <CardDescription>
                Visit us during these times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p>Monday – Thursday: 10:30 – 18:00</p>
                <p>Friday: 10:30 – 16:30</p>
                <p>Saturday: 9:30 – 14:00</p>
                <p>Sunday: 10:00 – 15:00</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isWisdomWarehouse && (
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
        )}

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
              {isWisdomWarehouse ? (
                <>
                  Alserkal Avenue, Warehouse 49A<br />
                  Al Quoz 1<br />
                  Dubai, UAE
                </>
              ) : (
                <>
                  Accra, Ghana<br />
                  (Exact address coming soon)
                </>
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
