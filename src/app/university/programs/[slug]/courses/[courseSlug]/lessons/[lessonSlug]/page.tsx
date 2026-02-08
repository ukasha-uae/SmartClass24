/**
 * S24 Innovation Academy Lesson Page
 * Interactive lesson with theory, code editor, and checkpoints
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, BookOpen, Code, CheckCircle2, Award } from 'lucide-react';
import dynamic from 'next/dynamic';
import { webDevelopmentProgram } from '@/lib/university-data';
import { CodeExecutionResult } from '@/types/university';
import MarkdownContent from '@/components/university/MarkdownContent';

// Dynamically import the code editor with no SSR to prevent hydration issues
const UniversityCodeEditor = dynamic(() => import('@/components/university/UniversityCodeEditor').then(mod => mod.default ?? mod), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading code editor...</p>
    </div>
  </div>
});

export default function LessonPage({ params }: { params: { slug: string; courseSlug: string; lessonSlug: string } }) {
  const resolvedParams = params;
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);

  // Get lesson data (in real app, this would come from params)
  const program = webDevelopmentProgram;
  const course = program.courses[0];
  const module = course.modules[0];
  const lesson = module.lessons.find(l => l.slug === resolvedParams.lessonSlug) || module.lessons[1];

  const handleExecute = (result: CodeExecutionResult) => {
    setExecutionResult(result);
  };

  const handleSave = (files: any[]) => {
    console.log('Files saved:', files);
    // In real app, save to Firestore
  };

  // Escape HTML for code blocks
  function escapeHtml(text: string) {
    return text.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30">
      {/* Under Construction Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 text-center text-sm font-medium shadow-sm">
        🚧 Under Construction - Code editor and features being actively developed
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/university/programs/${resolvedParams.slug}`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <div className="text-sm text-gray-500">{course.title}</div>
                <h1 className="text-lg font-semibold text-gray-900">{lesson.title}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">{lesson.estimatedTime}</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                {lesson.type.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Introduction */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-md p-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-600 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">{lesson.content.introduction}</p>
            </div>

            {/* Content Sections */}
            {lesson.content.sections.map((section) => (
              <div key={section.id} className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">{section.title}</h2>
                <MarkdownContent 
                  content={section.content}
                  className="text-gray-700 mb-6"
                />

                {/* Code Examples */}
                {section.codeExamples && section.codeExamples.length > 0 && (
                  <div className="space-y-4 mt-6">
                    {section.codeExamples.map((example) => (
                      <div key={example.id} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-5 py-3 border-b border-gray-200">
                          <div className="text-sm font-medium text-gray-800">{example.explanation}</div>
                        </div>
                        <div className="bg-[#1e1e1e] p-5">
                          <pre className="text-sm text-gray-100 overflow-x-auto font-mono">
                            <code>{example.code}</code>
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Interactive Code Editor */}
            {lesson.interactive && lesson.interactive.type === 'code-editor' && (() => {
              const config = lesson.interactive.config as any;
              return (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Code className="w-6 h-6 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Hands-On Practice</h2>
                </div>
                <p className="text-gray-700 mb-6">
                  Now it's your turn! Complete the coding challenge below using what you've learned.
                </p>
                
                <UniversityCodeEditor
                  initialFiles={config.startingFiles}
                  environment={config.environment}
                  onExecute={handleExecute}
                  onSave={handleSave}
                  showPreview={true}
                  showConsole={true}
                  height="600px"
                  instructions={config.instructions}
                />

                {/* Validation Results */}
                {executionResult && config.validation && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Validation Results</h3>
                    <div className="space-y-2">
                      {config.validation.map((rule: any, idx: number) => {
                        // Check if validation passed based on execution result
                        const passed = true; // Will be replaced with actual validation logic
                        return (
                          <div key={`validation-${idx}`} className="flex items-center justify-between p-2 bg-white rounded">
                            <div className="flex items-center space-x-2">
                              {passed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                              )}
                              <span className={passed ? 'text-gray-900' : 'text-gray-500'}>
                                {rule.description}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-600">
                              {passed ? `+${rule.points}` : '0'} pts
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Hints */}
                {config.hints && config.hints.length > 0 && (
                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">💡 Hints</h3>
                    <ul className="space-y-1 text-sm text-blue-800">
                      {config.hints.map((hint: string, idx: number) => (
                        <li key={idx}>• {hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              );
            })()}

            {/* Summary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-md p-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-600 rounded-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Summary</h2>
              </div>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">{lesson.content.summary}</p>
              
              <h3 className="font-bold text-lg text-gray-900 mb-4">Key Takeaways</h3>
              <div className="space-y-3">
                {lesson.content.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-white/70 rounded-xl p-4 border border-green-100">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-800 font-medium">{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            {lesson.resources.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-900">Additional Resources</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {lesson.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start space-x-4 p-5 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50/50 transition-all duration-200"
                    >
                      <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-600 transition-colors">
                        <BookOpen className="w-5 h-5 text-green-600 group-hover:text-white flex-shrink-0" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 mb-1">{resource.title}</div>
                        <div className="text-sm text-gray-600">{resource.description}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between gap-4">
              <button className="px-8 py-4 bg-white border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 text-gray-700 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md">
                Previous Lesson
              </button>
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2">
                <span>Next Lesson</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24 border border-gray-100">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 text-green-600 mr-2" />
                Progress
              </h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Lesson Progress</span>
                    <span className="font-bold text-green-600">65%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-500 h-3 rounded-full transition-all duration-300" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-medium">Module Progress</span>
                    <span className="font-bold text-green-600">40%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-500 h-3 rounded-full transition-all duration-300" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-lg text-gray-900 mb-4">Module Lessons</h3>
                <div className="space-y-2">
                  {module.lessons.map((l, idx) => (
                    <Link
                      key={l.id}
                      href={`/university/programs/${resolvedParams.slug}/courses/${resolvedParams.courseSlug}/lessons/${l.slug}`}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                        l.slug === lesson.slug
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                          : 'hover:bg-green-50 text-gray-700 border border-transparent hover:border-green-200'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        l.slug === lesson.slug
                          ? 'bg-white text-green-600'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="text-sm font-medium flex-1">{l.title}</span>
                    </Link>
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
