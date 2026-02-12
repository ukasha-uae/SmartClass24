'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GraduationCap, 
  Building2, 
  Users, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Globe,
  Shield,
  Zap,
  BarChart3,
  Palette,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default function PartnersPage() {
  const features = [
    {
      icon: Palette,
      title: 'White-Label Branding',
      description: 'Your logo, your colors, your domain. Complete customization to match your institution\'s identity.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Complete data isolation. Your students\' data stays private with enterprise-grade security.'
    },
    {
      icon: Globe,
      title: 'Multi-Country Support',
      description: 'Automatic localization for 5+ countries with curriculum alignment and exam-specific content.'
    },
    {
      icon: Zap,
      title: 'Interactive Virtual Labs',
      description: '20+ science experiments covering Biology, Chemistry, and Physics with hands-on learning.'
    },
    {
      icon: Trophy,
      title: 'Challenge Arena',
      description: 'Gamified learning with competitive battles, leaderboards, and engagement analytics.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track student progress, engagement metrics, and learning outcomes in real-time.'
    }
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$299',
      period: '/month',
      description: 'Perfect for small schools',
      features: [
        'Up to 200 students',
        'All campuses (Primary, JHS, SHS)',
        'Virtual Labs access',
        'Challenge Arena',
        'Basic analytics',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      price: '$799',
      period: '/month',
      description: 'Best for growing institutions',
      features: [
        'Up to 1,000 students',
        'Everything in Starter',
        'Custom branding',
        'Custom domain',
        'Advanced analytics',
        'Priority support',
        'Teacher dashboard',
        'Parent portal'
      ],
      cta: 'Most Popular',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large institutions',
      features: [
        'Unlimited students',
        'Everything in Professional',
        'Dedicated account manager',
        'Custom content integration',
        'API access',
        'SLA guarantee',
        '24/7 phone support',
        'On-premise deployment option'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const testimonial = {
    quote: "SmartClass24's white-label platform has transformed how we deliver personalized education. Our students are more engaged, and parents love the transparency.",
    author: "Wisdom Warehouse",
    role: "Alternative Education Center",
    location: "Dubai, UAE",
    logo: "/logos/wisdom-warehouse.png"
  };

  const stats = [
    { value: '750+', label: 'Active Students' },
    { value: '20+', label: 'Virtual Labs' },
    { value: '5,000+', label: 'Quiz Questions' },
    { value: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-gray-950 dark:via-purple-950/10 dark:to-gray-950">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <Building2 className="h-4 w-4" />
            For Schools & Institutions
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 dark:from-purple-400 dark:via-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
            Your Learning Platform,
            <br />
            Your Brand
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Launch a fully branded, white-label education platform in 30 minutes. Complete with interactive lessons, virtual labs, and gamified learning—all under your institution's name.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
              <Sparkles className="h-5 w-5" />
              Schedule a Demo
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="?tenant=demo">
                View Demo Site
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {stats.map((stat) => (
            <Card key={stat.label} className="text-center">
              <CardHeader className="pb-2">
                <CardTitle className="text-3xl md:text-4xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  {stat.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Production-ready platform with all the features your institution needs to deliver world-class education.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-2 border-purple-200 dark:border-purple-800">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                {testimonial.logo && (
                  <img 
                    src={testimonial.logo} 
                    alt={testimonial.author}
                    className="h-12 object-contain"
                  />
                )}
              </div>
              <blockquote className="text-xl md:text-2xl font-medium text-center mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-center">
                <p className="font-semibold text-purple-600 dark:text-purple-400">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role} • {testimonial.location}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your institution. All plans include setup support and training.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-2 border-purple-500 shadow-xl scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Launch in 3 Simple Steps
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From demo to deployment in under 48 hours. We handle the technical setup so you can focus on your students.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '1',
                title: 'Schedule Demo',
                description: 'Book a 30-minute call to see the platform in action and discuss your needs.'
              },
              {
                step: '2',
                title: 'Customize',
                description: 'We set up your branding, domain, and customize features to match your curriculum.'
              },
              {
                step: '3',
                title: 'Launch',
                description: 'Go live with full training and support. Onboard your first students immediately.'
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Launch Your Platform?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join Wisdom Warehouse and other leading institutions using our white-label platform. Schedule a demo today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Schedule Demo Call
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Links */}
      <section className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Questions? Email us at <a href="mailto:partners@smartclass24.app" className="text-purple-600 hover:underline">partners@smartclass24.app</a>
            </p>
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground">
                Pricing
              </Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
