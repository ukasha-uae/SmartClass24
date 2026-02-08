'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Shield,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Twitter,
  Heart,
  Brain,
  Sparkles,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useTenant } from '@/hooks/useTenant';
import { getDefaultTenant } from '@/tenancy/registry';
import { useState, useEffect } from 'react';

export default function PrivacyPolicyPage() {
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
      <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20">
        <div className="max-w-4xl mx-auto" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {isWisdomWarehouse ? (
              <Brain className="h-12 w-12 text-blue-600" />
            ) : (
              <GraduationCap className="h-12 w-12 text-violet-600" />
            )}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              {safeBranding.name}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {isWisdomWarehouse 
              ? 'Reimagining Education for Curious, Creative Minds'
              : 'Ghana\'s Premier Educational Platform for Primary, JHS & SHS Students'
            }
          </p>
          {!isWisdomWarehouse && (
            <div className="flex gap-2 justify-center mt-3">
              <Badge variant="secondary">Version 2.5.0</Badge>
              <Badge className="bg-green-600">Primary</Badge>
              <Badge className="bg-blue-600">JHS</Badge>
              <Badge className="bg-violet-600">SHS</Badge>
            </div>
          )}
        </div>

        {/* Mission Statement */}
        <Card className="mb-6 border-violet-200 dark:border-violet-800">
          <CardHeader>
            <CardTitle className="text-violet-600">
              {isWisdomWarehouse ? 'About Us' : 'Our Mission'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isWisdomWarehouse ? (
              <>
                <p>
                  At <strong>Wisdom Warehouse</strong>, we go beyond textbooks and tests. Our hands-on, 
                  individualized approach helps children build real-world skills, emotional resilience, and a 
                  strong sense of purpose. Through personalised mentorship, creative workshops, 
                  and community connection, we support each learner in uncovering their potential 
                  and stepping confidently into who they're meant to be.
                </p>
                <p>
                  Driven by parents and educators who did not believe in the one-size-fits-all education, 
                  Wisdom Warehouse was built to offer an inclusive, supportive, and truly transformative learning 
                  experience that helps all children thrive, not just conform.
                </p>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>🎯 Our Mission:</strong> Wisdom Warehouse empowers curious, creative, and developing young minds by 
                    offering an alternative, holistic educational experience rooted in real-world 
                    learning, emotional resilience, and individual potential. We nurture confidence, 
                    purpose, and community in children through personalised support, skill-building 
                    workshops, and hands-on academic guidance, believing that every child holds a unique 
                    form of genius.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800 mt-4">
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    <strong>🌟 Our Vision:</strong> At Wisdom Warehouse, we believe every child deserves an education that 
                    recognises them as a whole person, each with a unique way of learning, thinking, and 
                    growing. We envision a world where no two learners are treated the same, where 
                    curiosity is encouraged, and education adapts to the child, not the other way around. 
                    Our vision is to create spaces where every learner feels confident, capable, and inspired to thrive.
                  </p>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>SmartC24</strong> (formerly SmartJHS) is dedicated to transforming education in Ghana by providing every 
                  Primary School, Junior High School, and Senior High School student with access to quality learning resources, interactive lessons, 
                  competitive challenges, and collaborative tools that prepare them from foundational skills (Class 1-6) through BECE, WASSCE, and beyond.
                </p>
                <p>
                  We believe that every student deserves the opportunity to excel, regardless of their location or 
                  economic background. Through innovative technology, NSMQ-inspired school competitions, and deep understanding 
                  of the Ghanaian curriculum, we're making quality education accessible to all while celebrating Ghana's 
                  rich culture of academic excellence.
                </p>
                <div className="p-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg border border-violet-200 dark:border-violet-800 mt-4">
                  <p className="text-sm text-violet-900 dark:text-violet-100">
                    <strong>🎯 Our Vision:</strong> To become Ghana's premier online learning platform that empowers students 
                    from Primary School (Class 1) through Senior High School, fostering academic excellence through competition, collaboration, and comprehensive 
                    curriculum coverage at every educational stage.
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Features Highlight / Core Values */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isWisdomWarehouse ? 'Our Core Values' : 'What We Offer'}</CardTitle>
          </CardHeader>
          <CardContent>
            {isWisdomWarehouse ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Individuality
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Every child has a unique way of learning. We honor and nurture that individuality.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    Curiosity
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Questions are encouraged, exploration is celebrated, and wonder is the starting point.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Heart className="h-5 w-5 text-blue-600" />
                    Emotional Resilience
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Building confidence, self-awareness, and the ability to navigate challenges with grace.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    🌍 Real-World Relevance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Learning that connects to life, prepares for the future, and feels meaningful.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Inclusion
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    A safe space for all learners—neurodivergent, sensitive, creative, and unique.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    🤝 Community
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connection, collaboration, and belonging are at the heart of everything we do.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    🌱 Growth Over Perfection
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Progress, effort, and learning from mistakes matter more than grades or test scores.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    📚 Dual-Level Curriculum
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete JHS and SHS curriculum coverage aligned with Ghana Education Service standards and WAEC syllabus
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    🏆 NSMQ-Style School Battles
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Compete in school-vs-school battles inspired by Ghana's famous National Science & Maths Quiz
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    ⚔️ Challenge Arena
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Quick matches, boss battles, and ranked competitions with real-time AI opponents
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    🎓 Seamless JHS → SHS Transition
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Upgrade your account when you graduate to SHS while preserving all your JHS achievements
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    👥 Social Learning
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Campus-specific study groups, Q&A community, and parent-student linking for collaborative growth
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    📊 Advanced Analytics
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed progress tracking, achievement systems, and performance insights for students and parents
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    🏫 School Rankings & Verification
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    National school leaderboards, student verification, and school pride through competitive battles
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    📖 Past Questions Database
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive BECE and WASSCE past questions organized by subject and difficulty level
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Email</p>
                <a 
                  href={`mailto:${safeBranding.supportEmail}`}
                  className="text-sm text-primary hover:underline"
                >
                  {safeBranding.supportEmail}
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Phone</p>
                <a 
                  href={isWisdomWarehouse ? "tel:+971543068648" : "tel:+233300000000"}
                  className="text-sm text-primary hover:underline"
                >
                  {isWisdomWarehouse ? '+971 54 306 8648' : '+233 30 000 0000'}
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  {isWisdomWarehouse ? (
                    <>
                      Alserkal Avenue, Warehouse 49A<br />
                      Al Quoz 1, Dubai, UAE
                    </>
                  ) : (
                    <>
                      Accra Digital Centre<br />
                      Accra, Ghana
                    </>
                  )}
                </p>
              </div>
            </div>
            
            {isWisdomWarehouse && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Operating Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Monday – Thursday: 10:30 – 18:00<br />
                    Friday: 10:30 – 16:30<br />
                    Saturday: 9:30 – 14:00<br />
                    Sunday: 10:00 – 15:00
                  </p>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="flex flex-wrap gap-2">
              {isWisdomWarehouse ? (
                <Button variant="outline" size="sm" asChild>
                  <a href="https://www.instagram.com/wisdomwarehousedubai/" target="_blank" rel="noopener noreferrer">
                    <Globe className="h-4 w-4 mr-2" />
                    Instagram
                  </a>
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://twitter.com/smartc24" target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://github.com/ukasha-uae/SmartClass24" target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      Repository
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://smartc24.edu.gh" target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </a>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Legal Links */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Legal & Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/privacy-policy">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Privacy Policy
              </Button>
            </Link>
            <Link href="/terms-of-service">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Terms of Service
              </Button>
            </Link>
            <Link href="/code-of-conduct">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Student Code of Conduct
              </Button>
            </Link>
            <Link href="/accessibility">
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Accessibility Statement
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Acknowledgments */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{isWisdomWarehouse ? 'Who We Serve' : 'Acknowledgments'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {isWisdomWarehouse ? (
              <>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">Parents</h3>
                  <p>
                    We work with families who want more for their children than traditional schooling can offer. You might be:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Feeling your child is being overlooked, labelled, or left uninspired in a conventional classroom</li>
                    <li>Parenting a child who is sensitive, anxious, creative or learns differently</li>
                    <li>Looking for an education that is values-driven, human-centred, and relevant to real life</li>
                    <li>Searching for a safe, supportive space that builds confidence, emotional strength, and practical life skills</li>
                    <li>Exploring alternative models like homeschooling, unschooling, or hybrid learning</li>
                    <li>Feeling isolated or unsure where to turn for both academic and emotional support</li>
                  </ul>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">For Professionals & Partners</h3>
                  <p>We also collaborate with:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Educational psychologists and therapists who need trusted, specialist programs to recommend</li>
                    <li>Schools or learning support professionals looking for referral or partnership opportunities</li>
                    <li>Wellness and parenting communities that champion holistic child development</li>
                  </ul>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-50 to-amber-50 dark:from-blue-950/20 dark:to-amber-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Heart className="h-4 w-4 fill-current" />
                    <span className="font-medium">Beyond the System. Into Their Potential.</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>SmartC24</strong> is built in collaboration with educators, curriculum specialists, and students across Ghana 
                  to ensure our content meets the highest standards of educational excellence for both JHS and SHS levels.
                </p>
                <p>
                  Special thanks to the Ghana Education Service, WAEC, participating schools from Accra to Kumasi, 
                  and the NSMQ community for inspiring our competitive learning approach. We're grateful to all the 
                  students and teachers who have contributed feedback to make this platform better.
                </p>
                <div className="p-3 bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 rounded-lg border border-violet-200 dark:border-violet-800">
                  <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300">
                    <Heart className="h-4 w-4 fill-current" />
                    <span className="font-medium">Made with love for Ghana's future leaders - from JHS to SHS and beyond</span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {safeBranding.name}. All rights reserved.</p>
          <p className="mt-2">
            {isWisdomWarehouse 
              ? 'Empowering curious, creative, and developing young minds through alternative, holistic education.'
              : 'Empowering Ghana\'s students from Primary School through SHS with competitive learning and comprehensive curriculum.'
            }
          </p>
          {!isWisdomWarehouse && (
            <div className="flex gap-2 justify-center mt-3">
              <Badge variant="outline" className="text-xs">Primary (Class 1-6)</Badge>
              <Badge variant="outline" className="text-xs">JHS Support</Badge>
              <Badge variant="outline" className="text-xs">SHS Support</Badge>
              <Badge variant="outline" className="text-xs">School Battles</Badge>
              <Badge variant="outline" className="text-xs">NSMQ-Inspired</Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
