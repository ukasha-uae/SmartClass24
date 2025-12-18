"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalization } from '@/lib/localization/localization-context';
import { useState } from 'react';

/**
 * Footer Component - Traditional website footer
 * Displays on desktop, hidden on mobile (where BottomNav is used)
 * Includes: Quick links, legal links, contact info, social media, newsletter
 */
export default function Footer() {
  const { country } = useLocalization();
  const [email, setEmail] = useState('');
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  const footerSections = {
    quickLinks: [
      { label: 'Browse Subjects', href: '/subjects/jhs' },
      { label: `${country?.academicStructure.seniorSecondary.name} Campus`, href: '/shs' },
      { label: 'Virtual Labs', href: '/virtual-labs' },
      { label: 'Past Questions', href: '/past-questions' },
      { label: 'Study Schedule', href: '/study-schedule' },
    ],
    community: [
      { label: 'Study Groups', href: '/study-groups' },
      { label: 'Q&A Community', href: '/community' },
      { label: 'Challenge Arena', href: '/challenge-arena' },
      { label: 'Achievements', href: '/achievements-feed' },
    ],
    resources: [
      { label: 'Teacher Portal', href: '/teacher/dashboard' },
      { label: 'Parent Portal', href: '/parent/dashboard' },
      { label: `${country?.examSystem.secondary} Prep`, href: '/wassce-questions' },
      { label: 'Programme Guide', href: '/shs-programmes' },
    ],
    legal: [
      { label: 'About Us', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Contact Us', href: '/contact' },
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          
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

          {/* Community */}
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
