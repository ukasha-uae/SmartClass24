"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalization } from '@/lib/localization/localization-context';
import { useState, useEffect } from 'react';
import { FEATURE_FLAGS } from '@/lib/featureFlags';
import { useV1FeatureAccess } from '@/components/V1RouteGuard';

/**
 * Footer Component - Traditional website footer
 * Displays on desktop, hidden on mobile (where BottomNav is used)
 * Includes: Quick links, legal links, contact info, social media, newsletter
 */
export default function Footer() {
  const { country } = useLocalization();
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();
  
  // V1: Check feature access - only after client-side hydration
  const { hasAccess: hasLessonsAccess } = useV1FeatureAccess('lessons');
  const { hasAccess: hasVirtualLabsAccess } = useV1FeatureAccess('virtualLabs');
  const showCommunity = FEATURE_FLAGS.V1_LAUNCH.showCommunity;
  const showStudyGroups = FEATURE_FLAGS.V1_LAUNCH.showStudyGroups;
  const showTeacher = FEATURE_FLAGS.V1_LAUNCH.showTeacher;
  const showParent = FEATURE_FLAGS.V1_LAUNCH.showParent;

  // Ensure we only render client-side values after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  // V1: Build footer sections conditionally
  // Use mounted state to prevent hydration mismatch - only use client-side values after mount
  const footerSections = {
    quickLinks: [
      { label: 'Challenge Arena', href: '/challenge-arena/ghana', show: true },
      // Only include conditional links after client-side hydration
      ...(mounted && hasLessonsAccess ? [
        { label: `${country?.academicStructure.seniorSecondary.name} Campus`, href: '/subjects/shs', show: true },
        { label: 'Programme Guide', href: '/shs-programmes', show: true },
      ] : []),
      ...(mounted && hasVirtualLabsAccess ? [
        { label: 'Virtual Labs', href: '/virtual-labs', show: true },
      ] : []),
      { label: 'Past Questions', href: '/past-questions', show: true },
      { label: 'Study Schedule', href: '/study-schedule', show: true },
    ].filter(item => item.show),
    community: showCommunity ? [
      ...(showStudyGroups ? [{ label: 'Study Groups', href: '/study-groups', show: true }] : []),
      { label: 'Q&A Community', href: '/community', show: true },
      { label: 'Challenge Arena', href: '/challenge-arena/ghana', show: true },
      { label: 'Achievements', href: '/achievements-feed', show: true },
    ].filter(item => item.show) : [],
    resources: [
      ...(showTeacher ? [{ label: 'Teacher Portal', href: '/teacher/dashboard', show: true }] : []),
      ...(showParent ? [{ label: 'Parent Portal', href: '/parent/dashboard', show: true }] : []),
      ...(mounted && hasLessonsAccess ? [
        { label: `${country?.examSystem.secondary} Prep`, href: '/wassce-questions', show: true },
      ] : []),
    ].filter(item => item.show),
    legal: [
      { label: 'About Us', href: '/about', show: true },
      { label: 'Privacy Policy', href: '/privacy', show: true },
      { label: 'Terms of Service', href: '/terms', show: true },
      { label: 'Contact Us', href: '/contact', show: true },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', ariaLabel: 'Visit our Facebook page' },
    { icon: Twitter, href: '#', label: 'Twitter', ariaLabel: 'Visit our Twitter profile' },
    { icon: Instagram, href: '#', label: 'Instagram', ariaLabel: 'Visit our Instagram page' },
    { icon: Youtube, href: '#', label: 'YouTube', ariaLabel: 'Visit our YouTube channel' },
  ];

  return (
    <footer className="hidden md:block border-t bg-muted/30 mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Main Footer Content */}
        <div className={`grid grid-cols-2 md:grid-cols-${showCommunity && footerSections.community.length > 0 ? '4' : '3'} lg:grid-cols-${showCommunity && footerSections.community.length > 0 ? '5' : '4'} gap-8 mb-8`}>
          
          {/* Brand & Newsletter - Takes 2 columns on large screens */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <div className="mb-4">
              <h3 className="text-lg font-bold font-headline bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                SmartClass24
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Empowering {country?.name || 'African'} students with smart, interactive learning experiences. 
                Master {country?.academicStructure.juniorSecondary.name} & {country?.academicStructure.seniorSecondary.name} curriculum 
                with AI-powered tools.
              </p>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Stay Updated</h4>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-sm"
                  required
                  aria-label="Email address for newsletter"
                />
                <Button type="submit" size="sm" className="shrink-0">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Get updates on new lessons, features, and exam tips.
              </p>
            </div>

            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Connect With Us</h4>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label, ariaLabel }) => (
                  <Link
                    key={label}
                    href={href}
                    className="h-9 w-9 rounded-lg bg-background border hover:bg-accent hover:border-primary transition-colors flex items-center justify-center"
                    aria-label={ariaLabel}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerSections.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community - Only show if enabled */}
          {showCommunity && footerSections.community.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-4">Community</h4>
              <ul className="space-y-2.5">
                {footerSections.community.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resources & Legal Combined on mobile */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2.5 mb-6">
              {footerSections.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerSections.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="border-t pt-6 mb-6">
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:support@smartclass24.com" className="hover:text-primary transition-colors">
                support@smartclass24.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{country?.supportPhone || '+233 XX XXX XXXX'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{country?.capital}, {country?.name}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Copyright & Country */}
        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div>
            <p>
              © {currentYear} SmartClass24. All rights reserved. 
              <span className="ml-2">Made with ❤️ for {country?.name || 'Africa'}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span>Currently serving: {country?.flag} {country?.name}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
