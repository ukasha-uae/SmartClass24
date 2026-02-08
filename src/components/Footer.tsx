"use client";

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocalization } from '@/lib/localization/localization-context';
import { useTenant } from '@/hooks/useTenant';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useFullscreen } from '@/contexts/FullscreenContext';
import { useState, useEffect, useMemo } from 'react';

/**
 * Footer Component - Traditional website footer
 * Displays on desktop, hidden on mobile (where BottomNav is used)
 * Includes: Quick links, legal links, contact info, social media, newsletter
 */
export default function Footer() {
  const { country } = useLocalization();
  const { branding, market, hasLocalization, tenantId } = useTenant();
  const { isFullscreen } = useFullscreen();
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const currentYear = new Date().getFullYear();
  const addTenantParam = useTenantLink();
  
  // Use localized values directly from context (client-side only)
  // Fix hydration by deferring client-only values to mounted state
  const phoneNumber = mounted && hasLocalization && country?.supportPhone ? country.supportPhone : '+970589549030';
  const location = mounted && hasLocalization && country?.capital && country?.name ? `${country.capital}, ${country.name}` : branding.name;
  
  // Ensure client-side mounting for hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Hide footer during fullscreen (gameplay/lessons)
  if (isFullscreen) {
    return null;
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  // Get tenant-specific footer customization (only after mount to avoid hydration mismatch)
  const footerConfig = mounted ? branding.footer : undefined;
  const brandEmoji = (mounted && footerConfig?.emoji) || '🎓';
  const brandTagline = mounted && footerConfig?.tagline ? footerConfig.tagline : (
    market === 'us' 
      ? 'Empowering students with smart, interactive learning experiences. Master every subject with AI-powered tools and personalized education.'
      : mounted && hasLocalization && country
        ? `Empowering ${country.name} students with smart, interactive learning experiences. Master ${country.academicStructure.juniorSecondary.name} & ${country.academicStructure.seniorSecondary.name} curriculum with AI-powered tools.`
        : 'Empowering students worldwide with smart, interactive learning experiences and AI-powered tools.'
  );
  const showSocialMedia = mounted ? (footerConfig?.showSocialMedia !== false) : true; // Default to true

  const footerSections = useMemo(() => {
    const features = [
      { label: 'Challenge Arena', href: addTenantParam('/challenge-arena') },
      { label: 'Virtual Labs', href: addTenantParam('/virtual-labs') },
      { label: 'Pricing', href: addTenantParam('/pricing') },
    ];

    return {
      // V1: Only Challenge Arena and Virtual Labs
      features: tenantId === 'wisdomwarehouse'
        ? features.filter(item => item.label !== 'Pricing')
        : features,
      legal: [
        { label: 'About Us', href: addTenantParam('/about') },
        { label: 'Privacy Policy', href: addTenantParam('/privacy') },
        { label: 'Terms of Service', href: addTenantParam('/terms') },
        { label: 'Contact Us', href: addTenantParam('/contact') },
      ],
    };
  }, [addTenantParam, tenantId]);

  // Build social links from tenant config or use defaults (only after mount)
  const socialLinks = mounted ? [
    { 
      icon: Facebook, 
      href: footerConfig?.socialLinks?.facebook || '#', 
      label: 'Facebook', 
      ariaLabel: 'Visit our Facebook page',
      enabled: !footerConfig?.socialLinks || footerConfig?.socialLinks?.facebook !== undefined
    },
    { 
      icon: Twitter, 
      href: footerConfig?.socialLinks?.twitter || '#', 
      label: 'Twitter', 
      ariaLabel: 'Visit our Twitter profile',
      enabled: !footerConfig?.socialLinks || footerConfig?.socialLinks?.twitter !== undefined
    },
    { 
      icon: Instagram, 
      href: footerConfig?.socialLinks?.instagram || '#', 
      label: 'Instagram', 
      ariaLabel: 'Visit our Instagram page',
      enabled: !footerConfig?.socialLinks || footerConfig?.socialLinks?.instagram !== undefined
    },
    { 
      icon: Youtube, 
      href: footerConfig?.socialLinks?.youtube || '#', 
      label: 'YouTube', 
      ariaLabel: 'Visit our YouTube channel',
      enabled: !footerConfig?.socialLinks || footerConfig?.socialLinks?.youtube !== undefined
    },
    { 
      icon: Linkedin, 
      href: footerConfig?.socialLinks?.linkedin || '#', 
      label: 'LinkedIn', 
      ariaLabel: 'Visit our LinkedIn page',
      enabled: !footerConfig?.socialLinks || footerConfig?.socialLinks?.linkedin !== undefined
    },
  ].filter(link => link.enabled) : [
    { icon: Facebook, href: '#', label: 'Facebook', ariaLabel: 'Visit our Facebook page' },
    { icon: Twitter, href: '#', label: 'Twitter', ariaLabel: 'Visit our Twitter profile' },
    { icon: Instagram, href: '#', label: 'Instagram', ariaLabel: 'Visit our Instagram page' },
    { icon: Youtube, href: '#', label: 'YouTube', ariaLabel: 'Visit our YouTube channel' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', ariaLabel: 'Visit our LinkedIn page' },
  ];

  return (
    <footer className="hidden md:block border-t-2 border-violet-200/30 dark:border-violet-800/30 bg-gradient-to-br from-slate-50 via-violet-50/50 to-indigo-50/50 dark:from-slate-900 dark:via-violet-950/50 dark:to-indigo-950/50 backdrop-blur-xl mt-auto relative overflow-hidden" suppressHydrationWarning>
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-300/10 via-indigo-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-300/10 via-pink-300/10 to-rose-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Premium Brand & Newsletter - Takes 2 columns on large screens */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <div className="mb-6 p-6 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border-2 border-violet-200/30 dark:border-violet-800/30 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                {/* Premium Logo with Enhanced Design */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 rounded-full blur-xl opacity-40 animate-pulse"></div>
                  <div className="relative p-2 bg-gradient-to-br from-violet-500/20 via-indigo-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-violet-300/30 dark:border-violet-700/30">
                    <div className="text-3xl">{brandEmoji}</div>
                  </div>
                </div>
                <div className="relative">
                  {/* Text glow */}
                  <h3 className="absolute inset-0 text-2xl font-black font-headline bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent blur-sm opacity-50">
                    {branding.name}
                  </h3>
                  {/* Main text */}
                  <h3 className="relative text-2xl font-black font-headline bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                    {branding.name}
                  </h3>
                </div>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                {brandTagline}
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
              {showSocialMedia && socialLinks.length > 0 && (
                <>
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
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="h-4 w-4 text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* V1 Features */}
          <div className="p-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl border border-violet-100/50 dark:border-violet-900/50">
            <h4 className="text-sm font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Features</h4>
            <ul className="space-y-2.5">
              {footerSections.features.map((link) => (
                <li key={link.href}>
                  <Link
                    href={addTenantParam(link.href)}
                    className="text-sm text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="p-4 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm rounded-xl border border-violet-100/50 dark:border-violet-900/50">
            <h4 className="text-sm font-bold mb-4 bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Company</h4>
            <ul className="space-y-2.5">
              {footerSections.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={addTenantParam(link.href)}
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
              {mounted && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-lg">
                      <Phone className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {phoneNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 rounded-lg">
                      <MapPin className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {location}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Premium Bottom Bar - Copyright & Country */}
        <div className="border-t-2 border-violet-200/30 dark:border-violet-800/30 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="p-3 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-xl border border-violet-200/50 dark:border-violet-800/50">
            <p className="text-slate-700 dark:text-slate-300">
              © {currentYear} {branding.name}. All rights reserved.
              {mounted && market === 'ghana' && hasLocalization && (
                <span className="ml-2 font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">Made with ❤️ for {country?.name || 'Ghana'}</span>
              )}
            </p>
          </div>
          {mounted && hasLocalization && country && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-xl border border-violet-200/50 dark:border-violet-800/50">
            <span className="text-slate-700 dark:text-slate-300 font-medium">Currently serving: <span className="text-2xl">{country.flag}</span> <span className="font-bold bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 bg-clip-text text-transparent">{country.name}</span></span>
          </div>
          )}
        </div>
      </div>
    </footer>
  );
}
