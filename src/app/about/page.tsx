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
} from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-12 w-12 text-violet-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">SmartC24</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Ghana's Premier Educational Platform for Primary, JHS & SHS Students
          </p>
          <div className="flex gap-2 justify-center mt-3">
            <Badge variant="secondary">Version 2.5.0</Badge>
            <Badge className="bg-green-600">Primary</Badge>
            <Badge className="bg-blue-600">JHS</Badge>
            <Badge className="bg-violet-600">SHS</Badge>
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="mb-6 border-violet-200 dark:border-violet-800">
          <CardHeader>
            <CardTitle className="text-violet-600">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Features Highlight */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>What We Offer</CardTitle>
          </CardHeader>
          <CardContent>
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
                <a href="mailto:support@smartc24.edu.gh" className="text-sm text-primary hover:underline">
                  support@smartc24.edu.gh
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Phone</p>
                <a href="tel:+233300000000" className="text-sm text-primary hover:underline">
                  +233 30 000 0000
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-muted-foreground">
                  Accra Digital Centre<br />
                  Accra, Ghana
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://twitter.com/smartc24" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://github.com/ukasha-uae/smartclass24" target="_blank" rel="noopener noreferrer">
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
            <CardTitle>Acknowledgments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
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
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2025 SmartC24 (formerly SmartJHS). All rights reserved.</p>
          <p className="mt-2">Empowering Ghana's students from Primary School through SHS with competitive learning and comprehensive curriculum.</p>
          <div className="flex gap-2 justify-center mt-3">
            <Badge variant="outline" className="text-xs">Primary (Class 1-6)</Badge>
            <Badge variant="outline" className="text-xs">JHS Support</Badge>
            <Badge variant="outline" className="text-xs">SHS Support</Badge>
            <Badge variant="outline" className="text-xs">School Battles</Badge>
            <Badge variant="outline" className="text-xs">NSMQ-Inspired</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
