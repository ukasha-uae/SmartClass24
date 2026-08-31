/**
 * Admin: S24 Innovation Academy Project Grading
 * Lists pending project submissions and lets an admin score them against the rubric
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Award, Loader2, FileCode, CheckCircle2 } from 'lucide-react';
import { useFirebase } from '@/firebase/provider';
import { useToast } from '@/hooks/use-toast';
import { isAdmin } from '@/lib/admin-config';
import { useProjectSubmissions } from '@/firebase/university-hooks';
import { findProjectById } from '@/lib/university-data';
import { ProjectSubmission } from '@/types/university';

export default function UniversitySubmissionsAdminPage() {
  const router = useRouter();
  const { user, isUserLoading } = useFirebase();
  const { toast } = useToast();
  const { getAllSubmissions, gradeSubmission } = useProjectSubmissions();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadPending = useCallback(async () => {
    setIsLoading(true);
    const pending = await getAllSubmissions('submitted');
    setSubmissions(pending);
    setIsLoading(false);
  }, [getAllSubmissions]);

  useEffect(() => {
    async function checkAccess() {
      if (isUserLoading) return;
      if (!user?.email) {
        router.push('/');
        return;
      }
      const authorized = await isAdmin(user.email);
      if (!authorized) {
        toast({ title: 'Access Denied', description: 'Admin privileges required', variant: 'destructive' });
        router.push('/');
        return;
      }
      setIsAuthorized(true);
      setIsCheckingAuth(false);
      loadPending();
    }
    checkAccess();
  }, [user, isUserLoading, router, toast, loadPending]);

  const selected = submissions.find(s => s.id === selectedId);
  const projectInfo = selected ? findProjectById(selected.projectId) : null;

  const selectSubmission = (submission: ProjectSubmission) => {
    setSelectedId(submission.id);
    setFeedback('');
    const info = findProjectById(submission.projectId);
    const initialScores: Record<string, number> = {};
    info?.project.rubric.criteria.forEach(c => { initialScores[c.id] = 0; });
    setCriteriaScores(initialScores);
  };

  const handleGrade = async () => {
    if (!selected || !projectInfo) return;
    setIsSaving(true);
    const criteriaScoresArr = Object.entries(criteriaScores).map(([criterionId, score]) => ({ criterionId, score }));
    const totalScore = criteriaScoresArr.reduce((sum, c) => sum + c.score, 0);

    const success = await gradeSubmission(selected.id, {
      score: totalScore,
      feedback,
      criteriaScores: criteriaScoresArr,
      gradedAt: new Date().toISOString(),
      gradedBy: user?.uid ?? 'admin',
    });

    setIsSaving(false);
    if (success) {
      toast({ title: 'Graded', description: `Score: ${totalScore}/${projectInfo.project.rubric.totalPoints}` });
      setSelectedId(null);
      loadPending();
    } else {
      toast({ title: 'Error', description: 'Failed to save grade', variant: 'destructive' });
    }
  };

  if (isCheckingAuth || isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8">
        <div className="container mx-auto px-4">
          <Link href="/admin/dashboard" className="inline-flex items-center text-green-100 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold">S24 Innovation Academy - Project Grading</h1>
          <p className="text-green-100 mt-2">{submissions.length} submission(s) awaiting review</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4 space-y-2 h-fit">
          <h2 className="font-bold text-gray-900 mb-2">Pending Submissions</h2>
          {isLoading && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
          {!isLoading && submissions.length === 0 && (
            <p className="text-sm text-gray-500">Nothing to grade right now.</p>
          )}
          {submissions.map(submission => {
            const info = findProjectById(submission.projectId);
            return (
              <button
                key={submission.id}
                onClick={() => selectSubmission(submission)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedId === submission.id ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <div className="font-semibold text-sm text-gray-900">{info?.project.title ?? submission.projectId}</div>
                <div className="text-xs text-gray-500">{new Date(submission.submittedAt).toLocaleString()}</div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {!selected && (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              Select a submission to review.
            </div>
          )}

          {selected && projectInfo && (
            <>
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{projectInfo.project.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{projectInfo.project.description}</p>
                <div className="space-y-4">
                  {selected.files.map(file => (
                    <div key={file.path} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-800 text-white text-xs px-3 py-2 flex items-center space-x-2">
                        <FileCode className="w-3 h-3" />
                        <span>{file.path}</span>
                      </div>
                      <pre className="bg-[#1e1e1e] text-gray-100 text-xs p-4 overflow-x-auto max-h-64"><code>{file.content}</code></pre>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-900 mb-4">Score Against Rubric</h3>
                <div className="space-y-4">
                  {projectInfo.project.rubric.criteria.map(criterion => (
                    <div key={criterion.id}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-semibold text-gray-900">{criterion.name}</label>
                        <span className="text-xs text-gray-500">Max {criterion.maxPoints} pts</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{criterion.description}</p>
                      <input
                        type="number"
                        min={0}
                        max={criterion.maxPoints}
                        value={criteriaScores[criterion.id] ?? 0}
                        onChange={(e) => setCriteriaScores(prev => ({
                          ...prev,
                          [criterion.id]: Math.min(criterion.maxPoints, Math.max(0, Number(e.target.value)))
                        }))}
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="text-sm font-semibold text-gray-900 block mb-1">Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    placeholder="Notes for the student…"
                  />
                </div>

                <button
                  onClick={handleGrade}
                  disabled={isSaving}
                  className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center space-x-2"
                >
                  <Award className="w-4 h-4" />
                  <span>{isSaving ? 'Saving…' : 'Submit Grade'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
