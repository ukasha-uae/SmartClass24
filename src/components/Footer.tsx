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
    <footer className="hidden md:block border-t-2 border-violet-200/30 dark:border-violet-800/30 bg-gradient-to-br from-slate-50 via-violet-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-violet-950/50 dark:to-indigo-950/50 backdrop-blur-xl mt-auto relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-300/10 via-indigo-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-300/10 via-pink-300/10 to-rose-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          
          {/* Premium Brand & Newsletter - Takes 2 columns on large screens */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <div className="mb-6 p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border-2 border-violet-200/30 dark:border-violet-800/30 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl animate-pulse">🎓</div>
                <h3 className="text-2xl font-bold font-headline bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  SmartClass24
                </h3>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                Empowering {country?.name || 'African'} students with smart, interactive learning experiences. 
                Master {country?.academicStructure.juniorSecondary.name} & {country?.academicStructure.seniorSecondary.name} curriculum 
                with AI-powered tools.
              </p>
            </div>

            {/* Premium Newsletter Signup */}
            <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-xl border border-violet-200/50 dark:border-violet-800/50">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-2xl">📧</div>
                <h4 className="text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Stay Updated</h4>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 text-sm bg-white dark:bg-gray-800 border-2 border-violet-200 dark:border-violet-800 focus:border-violet-500 dark:focus:border-violet-400"
                  required
                  aria-label="Email address for newsletter"
                />
                <Button type="submit" size="sm" className="shrink-0 h-10 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Get updates on new lessons, features, and exam tips.
              </p>
            </div>

            {/* Premium Social Media Links */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-xl">🌐</div>
                <h4 className="text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Connect With Us</h4>
              </div>
              <div className="flex gap-3">
                {socialLinks.map(({ icon: Icon, href, label, ariaLabel }) => (
                  <Link
                    key={label}
                    href={href}
                    className="group relative h-10 w-10 rounded-xl bg-gradient-to-br from-white to-violet-50 dark:from-gray-800 dark:to-violet-950/50 border-2 border-violet-200/50 dark:border-violet-800/50 hover:border-violet-500 dark:hover:border-violet-400 hover:scale-110 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                    aria-label={ariaLabel}
                  >
                    <Icon className="h-4 w-4 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Premium Quick Links */}
          <div className="p-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl border border-violet-100/50 dark:border-violet-900/50">
            <h4 className="text-sm font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Quick Links</h4>
            <ul className="space-y-2.5">
              {footerSections.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Community */}
          <div className="p-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl border border-violet-100/50 dark:border-violet-900/50">
            <h4 className="text-sm font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Community</h4>
            <ul className="space-y-2.5">
              {footerSections.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Resources & Legal Combined on mobile */}
          <div className="col-span-2 md:col-span-1 p-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl border border-violet-100/50 dark:border-violet-900/50">
            <h4 className="text-sm font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Resources</h4>
            <ul className="space-y-2.5 mb-6">
              {footerSections.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="text-sm font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Company</h4>
            <ul className="space-y-2.5">
              {footerSections.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Premium Contact Info Bar */}
        <div className="border-t-2 border-violet-200/30 dark:border-violet-800/30 pt-6 mb-6">
          <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl border border-violet-200/30 dark:border-violet-800/30">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 group">
                <div className="p-2 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-lg">
                  <Mail className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <a href="mailto:support@smartclass24.com" className="text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium">
                  support@smartclass24.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-lg">
                  <Phone className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{country?.supportPhone || '+233 XX XXX XXXX'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-lg">
                  <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{country?.capital}, {country?.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Bottom Bar - Copyright & Country */}
        <div className="border-t-2 border-violet-200/30 dark:border-violet-800/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="p-3 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-xl border border-violet-200/50 dark:border-violet-800/50">
            <p className="text-slate-700 dark:text-slate-300">
              © {currentYear} SmartClass24. All rights reserved. 
              <span className="ml-2 font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Made with ❤️ for {country?.name || 'Africa'}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-xl border border-violet-200/50 dark:border-violet-800/50">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Currently serving: <span className="text-2xl">{country?.flag}</span> <span className="font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">{country?.name}</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
