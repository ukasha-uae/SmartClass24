/**
 * S24 Innovation Academy - Main Landing Page
 * Browse available programs and courses
 */

'use client';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code, Zap, Shield, Globe, TrendingUp } from 'lucide-react';
import { getAllActivePrograms } from '@/lib/university-data';
import { useTenantLink } from '@/hooks/useTenantLink';

export default function UniversityCampusPage() {
  const programs = getAllActivePrograms();
  const addTenantParam = useTenantLink();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Under Construction Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3">
        <div className="container mx-auto px-4 text-center">
          <p className="font-semibold flex items-center justify-center space-x-2">
            <span className="text-2xl">🚧</span>
            <span>S24 Innovation Academy is under active development - Explore our early features!</span>
            <span className="text-2xl">🚧</span>
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              S24 Innovation Academy
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Empowering beginners to become tech builders and founders using AI-driven learning and real-world projects
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#programs"
                className="px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center space-x-2"
              >
                <span>Browse Programs</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={addTenantParam('/university/demo')}
                className="px-8 py-4 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition-colors border-2 border-white/30"
              >
                Try Demo Lesson
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose S24 Innovation Academy?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Integrated Code Editor</h3>
              <p className="text-gray-600">
                Write, run, and preview your code directly in the platform. No external tools needed.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Project-Based Learning</h3>
              <p className="text-gray-600">
                Build real-world projects that showcase your skills and build your portfolio.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Instant Feedback</h3>
              <p className="text-gray-600">
                Get immediate feedback on your code with automated validation and suggestions.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Safe & Secure</h3>
              <p className="text-gray-600">
                Sandboxed code execution environment ensures safety while you learn and experiment.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Learn Anywhere</h3>
              <p className="text-gray-600">
                Access your courses and projects from any device with a web browser.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Industry-Relevant Skills</h3>
              <p className="text-gray-600">
                Learn technologies and tools used by professional developers in the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Available Programs
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {programs.map((program) => (
              <Link
                key={program.id}
                href={`/university/programs/${program.slug}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group"
              >
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-32 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-white" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      {program.difficulty.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">{program.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-green-600 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{program.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {program.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform">
                    <span>View Program</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">More Programs Coming Soon!</h3>
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                'React Development',
                'Python Programming',
                'Data Structures',
                'Full Stack Dev',
                'Mobile Apps',
                'Cloud Computing',
                'Machine Learning',
                'Cybersecurity'
              ].map((program) => (
                <div
                  key={program}
                  className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-500"
                >
                  <div className="font-semibold">{program}</div>
                  <div className="text-xs mt-1">Coming 2026</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Tech Journey?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join thousands of students learning to code with hands-on projects and expert guidance.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
