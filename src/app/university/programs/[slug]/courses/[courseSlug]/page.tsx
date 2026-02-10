/**
 * University Course Detail Page
 * Shows course overview and all modules/lessons
 */
'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, CheckCircle, Play } from 'lucide-react';
import { getUniversityProgram } from '@/lib/university-data';
import { useTenantLink } from '@/hooks/useTenantLink';

export default function CoursePage({ params }: { params: Promise<{ slug: string; courseSlug: string }> }) {
  const { slug, courseSlug } = use(params);
  
  // Call all hooks before any conditional logic/returns
  const addTenantParam = useTenantLink();
  
  // Get data and check validity (but don't return yet)
  const program = getUniversityProgram(slug);
  const course = program?.courses.find(c => c.slug === courseSlug);

  // Now that all hooks are called, it's safe to throw notFound()
  if (!program || !course) {
    notFound();
  }

  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalProjects = course.modules.reduce((acc, m) => acc + m.projects.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Under Construction Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 text-center text-sm font-medium">
        🚧 Under Construction - Features being actively developed
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href={addTenantParam(`/university/programs/${slug}`)}
            className="inline-flex items-center text-green-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Program
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl text-green-100 mb-6 max-w-3xl">{course.description}</p>
          <div className="flex flex-wrap items-center gap-6 text-green-100">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>{totalLessons} Lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{totalProjects} Projects</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Instructor */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Instructor</h2>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {course.instructor.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-lg">{course.instructor.name}</div>
                <div className="text-gray-600">{course.instructor.title}</div>
                {course.instructor.bio && (
                  <div className="text-gray-600 text-sm mt-1">{course.instructor.bio}</div>
                )}
              </div>
            </div>
          </div>

          {/* Course Modules */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Course Content</h2>
            <div className="space-y-6">
              {course.modules.map((module, moduleIdx) => (
                <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Module Header */}
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                            {moduleIdx + 1}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm ml-11">{module.description}</p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                        {module.estimatedTime}
                      </span>
                    </div>
                  </div>

                  {/* Module Lessons */}
                  <div className="divide-y divide-gray-200">
                    {module.lessons.map((lesson, lessonIdx) => (
                      <Link
                        key={lesson.id}
                        href={addTenantParam(`/university/programs/${slug}/courses/${courseSlug}/lessons/${lesson.slug}`)}
                        className="block p-4 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-green-500 flex items-center justify-center text-xs font-semibold text-gray-500 group-hover:text-green-600">
                              {lessonIdx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 group-hover:text-green-600">
                                {lesson.title}
                              </div>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                  {lesson.type}
                                </span>
                                <span className="text-xs text-gray-500">{lesson.estimatedTime}</span>
                              </div>
                            </div>
                          </div>
                          <Play className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                        </div>
                      </Link>
                    ))}

                    {/* Module Projects */}
                    {module.projects.length > 0 && (
                      <div className="bg-yellow-50 border-t-2 border-yellow-300">
                        {module.projects.map((project, projectIdx) => (
                          <div
                            key={project.id}
                            className="p-4 flex items-start space-x-3"
                          >
                            <div className="w-6 h-6 bg-yellow-500 text-white rounded flex items-center justify-center text-xs font-bold">
                              P
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{project.title}</div>
                              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                              <div className="flex items-center space-x-3 mt-2">
                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold">
                                  Project Assignment
                                </span>
                                <span className="text-xs text-gray-500">{project.points} points</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start Learning CTA */}
          <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-green-100 mb-6">Begin with the first lesson and build your skills step by step.</p>
            <Link
              href={addTenantParam(`/university/programs/${slug}/courses/${courseSlug}/lessons/${course.modules[0].lessons[0].slug}`)}
              className="inline-block px-8 py-4 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Start First Lesson
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
