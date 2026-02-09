/**
 * S24 Innovation Academy Program Detail Page
 * Shows program overview, courses, and enrollment options
 */
'use client';
import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Award, BookOpen, CheckCircle, Play } from 'lucide-react';
import { getUniversityProgram } from '@/lib/university-data';
import { useTenantLink } from '@/hooks/useTenantLink';

export default function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const program = getUniversityProgram(slug);
  const addTenantParam = useTenantLink();

  if (!program) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Under Construction Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 text-center text-sm font-medium">
        � AI-Powered Learning Platform - New features launching regularly
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href={addTenantParam('/university')}
            className="inline-flex items-center text-green-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Academy Home
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full">
              {program.difficulty.toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full">
              {program.discipline.toUpperCase()}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{program.title}</h1>
          <p className="text-xl text-green-100 mb-6 max-w-3xl">{program.description}</p>
          <div className="flex flex-wrap items-center gap-6 text-green-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{program.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>{program.courses.length} Courses</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Certificate upon completion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Program Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Outcomes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Skills You'll Master</h2>
              <ul className="space-y-3">
                {program.learningOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Who This Is For</h2>
              <ul className="space-y-2">
                {program.prerequisites.map((prereq, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">•</span>
                    <span className="text-gray-700">{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Courses */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Learning Path</h2>
              <div className="space-y-4">
                {program.courses.map((course, idx) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-gray-600 text-sm">{course.description}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">{course.duration}</span>
                    </div>
                    <div className="ml-11 mt-3">
                      <div className="text-sm text-gray-600 mb-2">
                        {course.modules.length} modules • {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                      </div>
                      <Link
                        href={`/university/programs/${program.slug}/courses/${course.slug}`}
                        className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold text-sm"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start Learning
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificate */}
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Award className="w-8 h-8 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">Your Achievement</h2>
              </div>
              <p className="text-gray-700 mb-2">
                Complete this program and earn your certificate to showcase your new skills:
              </p>
              <div className="bg-white rounded-lg p-4 border-2 border-yellow-300">
                <div className="font-bold text-lg text-gray-900">{program.certificate.title}</div>
                <div className="text-sm text-gray-600">Issued by {program.certificate.issuer}</div>
                {program.certificate.verifiable && (
                  <div className="text-xs text-green-600 mt-1 flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verifiable certificate
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-xl p-6 sticky top-4">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">FREE</div>
                <div className="text-gray-600">Full access to all courses</div>
              </div>
              
              <Link
                href={`/university/programs/${slug}/courses/${program.courses[0].slug}`}
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-4 rounded-lg font-bold text-lg transition-colors mb-4"
              >
                Start Learning Now
              </Link>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Lifetime access to course materials</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Hands-on projects with code editor</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Learn at your own pace</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>No prerequisites required</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Program Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {program.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
