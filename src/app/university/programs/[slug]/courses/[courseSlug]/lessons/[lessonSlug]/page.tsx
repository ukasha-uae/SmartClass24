/**
 * University Lesson Page
 * Interactive lesson with theory, code editor, and checkpoints
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, BookOpen, Code, CheckCircle2, Award } from 'lucide-react';
import UniversityCodeEditor from '@/components/university/UniversityCodeEditor';
import { webDevelopmentProgram } from '@/lib/university-data';
import { CodeExecutionResult } from '@/types/university';
import { use } from 'react';

export default function LessonPage({ params }: { params: Promise<{ slug: string; courseSlug: string; lessonSlug: string }> }) {
  const resolvedParams = use(params);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Under Construction Banner */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 text-center text-sm font-medium">
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
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <BookOpen className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">Introduction</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{lesson.content.introduction}</p>
            </div>

            {/* Content Sections */}
            {lesson.content.sections.map((section) => (
              <div key={section.id} className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{section.title}</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line mb-6">
                  {section.content}
                </div>

                {/* Code Examples */}
                {section.codeExamples && section.codeExamples.length > 0 && (
                  <div className="space-y-4">
                    {section.codeExamples.map((example) => (
                      <div key={example.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
                          <div className="text-sm font-semibold text-gray-700">{example.explanation}</div>
                        </div>
                        <div className="bg-gray-900 p-4">
                          <pre className="text-sm text-gray-100 overflow-x-auto">
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
                        // Simple validation simulation
                        const passed = Math.random() > 0.3;
                        return (
                          <div key={rule.type} className="flex items-center justify-between p-2 bg-white rounded">
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
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Summary</h2>
              <p className="text-gray-700 mb-6">{lesson.content.summary}</p>
              
              <h3 className="font-semibold text-gray-900 mb-3">Key Takeaways</h3>
              <ul className="space-y-2">
                {lesson.content.keyTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            {lesson.resources.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Additional Resources</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {lesson.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-green-500 transition-colors"
                    >
                      <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-semibold text-gray-900">{resource.title}</div>
                        <div className="text-sm text-gray-600">{resource.description}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors">
                Previous Lesson
              </button>
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors flex items-center space-x-2">
                <span>Next Lesson</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Lesson Progress</span>
                    <span className="font-semibold text-gray-900">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Module Progress</span>
                    <span className="font-semibold text-gray-900">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Module Lessons</h3>
                <div className="space-y-2">
                  {module.lessons.map((l, idx) => (
                    <Link
                      key={l.id}
                      href={`/university/programs/${resolvedParams.slug}/courses/${resolvedParams.courseSlug}/lessons/${l.slug}`}
                      className={`flex items-center space-x-2 p-2 rounded transition-colors ${
                        l.slug === lesson.slug
                          ? 'bg-green-100 text-green-700'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-sm flex-1">{l.title}</span>
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
