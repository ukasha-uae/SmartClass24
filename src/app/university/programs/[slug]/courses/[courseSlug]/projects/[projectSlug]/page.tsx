/**
 * S24 Innovation Academy Project Submission Page
 * Students build the project in the code editor and submit it for grading
 */
'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, Award, CheckCircle2, Circle, Send, Clock } from 'lucide-react';
import { getUniversityProgram } from '@/lib/university-data';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useCodeSaves, useProjectSubmissions } from '@/firebase/university-hooks';
import { CodeFile, ProjectSubmission } from '@/types/university';

const UniversityCodeEditor = dynamic(() => import('@/components/university/UniversityCodeEditor').then(mod => mod.default ?? mod), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
  </div>
});

export default function ProjectPage({ params }: { params: Promise<{ slug: string; courseSlug: string; projectSlug: string }> }) {
  const { slug, courseSlug, projectSlug } = use(params);
  const addTenantParam = useTenantLink();

  const program = getUniversityProgram(slug);
  const course = program?.courses.find(c => c.slug === courseSlug);
  const project = course?.modules.flatMap(m => m.projects).find(p => p.slug === projectSlug);

  const { saveCode, loadCode } = useCodeSaves();
  const { submitProject, getStudentSubmissions } = useProjectSubmissions();

  const [files, setFiles] = useState<CodeFile[] | null>(null);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!project) return;
    let cancelled = false;
    loadCode(project.id).then(saved => {
      if (!cancelled) setFiles(saved && saved.length > 0 ? saved : project.startingTemplate?.startingFiles ?? []);
    });
    getStudentSubmissions(project.id).then(existing => {
      if (!cancelled) setSubmissions(existing);
    });
    return () => { cancelled = true; };
  }, [project, loadCode, getStudentSubmissions]);

  const handleSave = useCallback((updatedFiles: CodeFile[]) => {
    if (!project) return;
    setFiles(updatedFiles);
    saveCode(project.id, updatedFiles);
  }, [project, saveCode]);

  const handleSubmit = useCallback(async () => {
    if (!project || !files) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const submissionId = await submitProject(project.id, files);
      if (!submissionId) {
        setSubmitError('Sign in to submit your project.');
        return;
      }
      const updated = await getStudentSubmissions(project.id);
      setSubmissions(updated);
    } finally {
      setIsSubmitting(false);
    }
  }, [project, files, submitProject, getStudentSubmissions]);

  if (!program || !course || !project) {
    notFound();
  }

  const latestSubmission = submissions[submissions.length - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 text-center text-sm font-medium">
        🚧 Under Construction - Grading is currently reviewed manually
      </div>

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-10">
        <div className="container mx-auto px-4">
          <Link
            href={addTenantParam(`/university/programs/${slug}/courses/${courseSlug}`)}
            className="inline-flex items-center text-green-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full">
              Project Assignment
            </span>
            <span className="px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full">
              {project.points} points
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{project.title}</h1>
          <p className="text-lg text-green-100 max-w-3xl">{project.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {files && (
              <UniversityCodeEditor
                initialFiles={files}
                environment={project.startingTemplate?.environment ?? 'html-css-js'}
                onSave={handleSave}
                showPreview={true}
                showConsole={true}
                height="600px"
                instructions={project.startingTemplate?.instructions}
              />
            )}

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Ready to submit?</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Your code auto-saves as you work. Submitting sends your latest files for review.
                  </p>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !files}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center space-x-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting…' : 'Submit Project'}</span>
                </button>
              </div>
              {submitError && (
                <p className="mt-3 text-sm text-red-600">{submitError}</p>
              )}

              {latestSubmission && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Last submitted {new Date(latestSubmission.submittedAt).toLocaleString()} · Status: {latestSubmission.status}
                    </span>
                  </div>
                  {latestSubmission.grade ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                      <Award className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900">
                          Score: {latestSubmission.grade.score}/{project.rubric.totalPoints}
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{latestSubmission.grade.feedback}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Awaiting review by an instructor.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Requirements</h3>
              <div className="space-y-3">
                {project.requirements.map(req => (
                  <div key={req.id} className="flex items-start space-x-2">
                    <Circle className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{req.title}</div>
                      <div className="text-xs text-gray-600">{req.description}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{req.points} pts</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Grading Rubric</h3>
              <div className="space-y-3">
                {project.rubric.criteria.map(criterion => (
                  <div key={criterion.id} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{criterion.name}</div>
                      <div className="text-xs text-gray-600">{criterion.description}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Max {criterion.maxPoints} pts</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600">
                Passing score: {project.rubric.passingScore}/{project.rubric.totalPoints}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
