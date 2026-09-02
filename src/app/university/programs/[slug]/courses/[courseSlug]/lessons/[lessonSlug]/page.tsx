/**
 * S24 Innovation Academy Lesson Page
 * Interactive lesson with theory, code editor, and checkpoints
 */

'use client';

import { useState, useEffect, useCallback, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight, BookOpen, Code, CheckCircle2, Award } from 'lucide-react';
import dynamic from 'next/dynamic';
import { webDevelopmentProgram } from '@/lib/university-data';
import { CodeExecutionResult, CodeFile } from '@/types/university';
import { ValidationOutcome } from '@/lib/university-validation';
import { useCodeSaves, useUniversityProgress } from '@/firebase/university-hooks';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useFullscreen } from '@/contexts/FullscreenContext';
import MarkdownContent from '@/components/university/MarkdownContent';
import LessonCheckpoints from '@/components/university/LessonCheckpoints';

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

export default function LessonPage({ params }: { params: Promise<{ slug: string; courseSlug: string; lessonSlug: string }> }) {
  const resolvedParams = use(params);
  const addTenantParam = useTenantLink();
  const { setFullscreen } = useFullscreen();
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationOutcome[]>([]);
  const [savedFiles, setSavedFiles] = useState<CodeFile[]>([]);
  const [isCodeLoading, setIsCodeLoading] = useState(true);
  const [markedComplete, setMarkedComplete] = useState(false);
  const { saveCode, loadCode } = useCodeSaves();
  const { markLessonComplete, getProgress } = useUniversityProgress();

  // Sololearn-style focus mode: hide the site header/footer/bottom-nav while a lesson is in session.
  // Keep scrolling enabled since lesson content is taller than the viewport.
  useEffect(() => {
    setFullscreen(true, { lockScroll: false });
    return () => setFullscreen(false);
  }, [setFullscreen]);

  // Get lesson data (in real app, this would come from params)
  const program = webDevelopmentProgram;
  const course = program.courses[0];
  // Search every module, not just the first, so lessons in later modules are reachable
  const allLessons = course.modules.flatMap(m => m.lessons);
  const lesson = allLessons.find(l => l.slug === resolvedParams.lessonSlug);


  if (!lesson) {
    notFound();
  }

  const lessonIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;
  const currentModule = course.modules.find(m => m.lessons.some(l => l.id === lesson.id))!;
  const courseHref = addTenantParam(`/university/programs/${resolvedParams.slug}/courses/${resolvedParams.courseSlug}`);

  // Restore any previously saved code for this lesson (Firestore, falling back to localStorage)
  useEffect(() => {
    let cancelled = false;
    setIsCodeLoading(true);
    loadCode(lesson.id).then(files => {
      if (cancelled) return;
      setSavedFiles(files ?? []);
      setIsCodeLoading(false);
    });
    return () => { cancelled = true; };
  }, [lesson.id, loadCode]);

  // Reflect already-completed status (e.g. from a previous visit) so the manual button doesn't re-fire writes
  useEffect(() => {
    let cancelled = false;
    getProgress(program.id, course.id).then(progress => {
      if (!cancelled && progress?.completedLessons?.includes(lesson.id)) {
        setMarkedComplete(true);
      }
    });
    return () => { cancelled = true; };
  }, [lesson.id, program.id, course.id, getProgress]);

  const handleExecute = (result: CodeExecutionResult) => {
    setExecutionResult(result);
  };

  const handleSave = (files: CodeFile[]) => {
    saveCode(lesson.id, files);
  };

  const handleValidate = useCallback((results: ValidationOutcome[]) => {
    setValidationResults(results);

    const allPassed = results.length > 0 && results.every(r => r.passed);
    if (allPassed && !markedComplete) {
      setMarkedComplete(true);
      markLessonComplete(program.id, course.id, lesson.id);
    }
  }, [markedComplete, markLessonComplete, program.id, course.id, lesson.id]);

  const handleManualComplete = useCallback(() => {
    if (markedComplete) return;
    setMarkedComplete(true);
    markLessonComplete(program.id, course.id, lesson.id);
  }, [markedComplete, markLessonComplete, program.id, course.id, lesson.id]);

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
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-1.5 sm:py-2 text-center text-xs sm:text-sm font-medium shadow-sm px-2">
        🚧 Under Construction - Code editor and features being actively developed
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
              <Link
                href={`/university/programs/${resolvedParams.slug}`}
                className="text-gray-600 hover:text-gray-900 transition-colors shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="min-w-0">
                <div className="text-xs sm:text-sm text-gray-500 truncate">{course.title}</div>
                <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">{lesson.title}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <span className="hidden sm:inline text-sm text-gray-600">{lesson.estimatedTime}</span>
              <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 text-xs sm:text-sm font-semibold rounded-full whitespace-nowrap">
                {lesson.type.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
        {/* Sololearn-style thin progress bar: position within the current module */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-gradient-to-r from-green-600 to-emerald-500 transition-all duration-300"
            style={{ width: `${((currentModule.lessons.findIndex(l => l.id === lesson.id) + 1) / currentModule.lessons.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-28 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Introduction */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 border border-green-100">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-6">
                <div className="p-1.5 sm:p-2 bg-green-600 rounded-lg">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Introduction</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">{lesson.content.introduction}</p>
            </div>

            {/* Content Sections */}
            {lesson.content.sections.map((section) => (
              <div key={section.id} className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 border border-gray-100">
                <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-900">{section.title}</h2>
                <MarkdownContent 
                  content={section.content}
                  className="text-gray-700 mb-6"
                />

                {/* Code Examples */}
                {section.codeExamples && section.codeExamples.length > 0 && (
                  <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
                    {section.codeExamples.map((example) => (
                      <div key={example.id} className="rounded-lg sm:rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-3 sm:px-5 py-2 sm:py-3 border-b border-gray-200">
                          <div className="text-xs sm:text-sm font-medium text-gray-800">{example.explanation}</div>
                        </div>
                        <div className="bg-[#1e1e1e] p-3 sm:p-5">
                          <pre className="text-xs sm:text-sm text-gray-100 overflow-x-auto font-mono">
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
              // Wait for the saved-code lookup to resolve before mounting the editor so restored files aren't overwritten
              if (isCodeLoading) {
                return (
                  <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                );
              }
              return (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Hands-On Practice</h2>
                </div>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                  Now it's your turn! Complete the coding challenge below using what you've learned.
                </p>
                
                <UniversityCodeEditor
                  initialFiles={savedFiles.length > 0 ? savedFiles : config.startingFiles}
                  environment={config.environment}
                  validationRules={config.validation}
                  onExecute={handleExecute}
                  onValidate={handleValidate}
                  onSave={handleSave}
                  showPreview={true}
                  showConsole={true}
                  height="600px"
                  instructions={config.instructions}
                />

                {/* Validation Results */}
                {validationResults.length > 0 && (
                  <div className="mt-4 sm:mt-6 bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">Validation Results</h3>
                    <div className="space-y-2">
                      {validationResults.map((result) => (
                        <div key={result.ruleId} className="flex items-center justify-between p-2 bg-white rounded gap-2">
                          <div className="flex items-center space-x-2 min-w-0">
                            {result.passed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0" />
                            )}
                            <span className={`text-sm sm:text-base truncate ${result.passed ? 'text-gray-900' : 'text-gray-500'}`}>
                              {result.message}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-semibold text-gray-600 shrink-0">
                            {result.points}/{result.maxPoints} pts
                          </span>
                        </div>
                      ))}
                    </div>
                    {markedComplete && (
                      <div className="mt-3 flex items-center space-x-2 text-green-700 text-sm font-semibold">
                        <Award className="w-4 h-4" />
                        <span>All checks passed — lesson marked complete!</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Hints */}
                {config.hints && config.hints.length > 0 && (
                  <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">💡 Hints</h3>
                    <ul className="space-y-1 text-xs sm:text-sm text-blue-800">
                      {config.hints.map((hint: string, idx: number) => (
                        <li key={idx}>• {hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              );
            })()}

            {/* Checkpoints */}
            <LessonCheckpoints checkpoints={lesson.checkpoints} />

            {/* Summary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 border border-green-100">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-6">
                <div className="p-1.5 sm:p-2 bg-green-600 rounded-lg">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Summary</h2>
              </div>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">{lesson.content.summary}</p>
              
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 sm:mb-4">Key Takeaways</h3>
              <div className="space-y-2 sm:space-y-3">
                {lesson.content.keyTakeaways.map((takeaway, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-white/70 rounded-xl p-3 sm:p-4 border border-green-100">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm sm:text-base text-gray-800 font-medium">{takeaway}</span>
                  </div>
                ))}
              </div>

              {/* Theory-only lessons have no auto-graded exercise, so completion is a manual action */}
              {!lesson.interactive && (
                <button
                  onClick={handleManualComplete}
                  disabled={markedComplete}
                  className="mt-6 w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{markedComplete ? 'Lesson Complete' : 'Mark Lesson Complete'}</span>
                </button>
              )}
            </div>

            {/* Resources */}
            {lesson.resources.length > 0 && (
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 border border-gray-100">
                <h2 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 text-gray-900">Additional Resources</h2>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  {lesson.resources.map((resource) => (
                    <a
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start space-x-3 sm:space-x-4 p-3 sm:p-5 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50/50 transition-all duration-200"
                    >
                      <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-600 transition-colors">
                        <BookOpen className="w-5 h-5 text-green-600 group-hover:text-white flex-shrink-0" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{resource.title}</div>
                        <div className="text-xs sm:text-sm text-gray-600">{resource.description}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation (desktop only — mobile uses the sticky bottom bar) */}
            <div className="hidden lg:flex justify-between gap-4">
              <Link
                href={prevLesson ? addTenantParam(`/university/programs/${resolvedParams.slug}/courses/${resolvedParams.courseSlug}/lessons/${prevLesson.slug}`) : courseHref}
                className="px-8 py-4 bg-white border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 text-gray-700 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {prevLesson ? 'Previous Lesson' : 'Back to Course'}
              </Link>
              <Link
                href={nextLesson ? addTenantParam(`/university/programs/${resolvedParams.slug}/courses/${resolvedParams.courseSlug}/lessons/${nextLesson.slug}`) : courseHref}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <span>{nextLesson ? 'Next Lesson' : 'Back to Course'}</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Sidebar (below content on mobile, sticky rail on desktop) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:sticky lg:top-24 border border-gray-100">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-4 flex items-center">
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
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-4">Module Lessons</h3>
                <div className="space-y-2">
                  {currentModule.lessons.map((l, idx) => (
                    <Link
                      key={l.id}
                      href={`/university/programs/${resolvedParams.slug}/courses/${resolvedParams.courseSlug}/lessons/${l.slug}`}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                        l.slug === lesson.slug
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                          : 'hover:bg-green-50 text-gray-700 border border-transparent hover:border-green-200'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
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

      {/* Mobile sticky bottom nav bar (Sololearn-style Continue button) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex items-center gap-3">
        <Link
          href={prevLesson ? addTenantParam(`/university/programs/${resolvedParams.slug}/courses/${resolvedParams.courseSlug}/lessons/${prevLesson.slug}`) : courseHref}
          className="shrink-0 p-3 rounded-xl border-2 border-gray-300 text-gray-600 active:bg-gray-100 transition-colors"
          aria-label={prevLesson ? 'Previous lesson' : 'Back to course'}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Link
          href={nextLesson ? addTenantParam(`/university/programs/${resolvedParams.slug}/courses/${resolvedParams.courseSlug}/lessons/${nextLesson.slug}`) : courseHref}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 active:from-green-700 active:to-emerald-700 text-white rounded-xl font-bold transition-colors shadow-md flex items-center justify-center space-x-2"
        >
          <span>{nextLesson ? 'Continue' : 'Finish Course'}</span>
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
