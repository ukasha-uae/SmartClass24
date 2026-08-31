/**
 * S24 Innovation Academy Certificate Page
 * Checks program completion, lets an eligible student claim their certificate
 */
'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Award, CheckCircle2, Circle, Loader2, Printer } from 'lucide-react';
import { getUniversityProgram } from '@/lib/university-data';
import { useTenantLink } from '@/hooks/useTenantLink';
import { useFirebase } from '@/firebase/provider';
import { useCertificates, ProgramCompletionStatus } from '@/firebase/university-hooks';
import { CertificateRecord } from '@/types/university';

export default function CertificatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const addTenantParam = useTenantLink();
  const { user, isUserLoading } = useFirebase();
  const { checkProgramCompletion, getCertificate, issueCertificate } = useCertificates();

  const program = getUniversityProgram(slug);

  const [status, setStatus] = useState<ProgramCompletionStatus | null>(null);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [studentName, setStudentName] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!program || isUserLoading) return;
    if (!user) {
      setIsLoading(false);
      return;
    }
    setStudentName(user.displayName || '');

    let cancelled = false;
    Promise.all([getCertificate(program.id), checkProgramCompletion(program)]).then(([existing, completion]) => {
      if (cancelled) return;
      setCertificate(existing);
      setStatus(completion);
      setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, [program, user, isUserLoading, getCertificate, checkProgramCompletion]);

  if (!program) notFound();

  const handleClaim = async () => {
    if (!studentName.trim()) return;
    setIsClaiming(true);
    const record = await issueCertificate(program, studentName.trim());
    setCertificate(record);
    setIsClaiming(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href={addTenantParam(`/university/programs/${slug}`)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Program
        </Link>

        {isLoading || isUserLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          </div>
        ) : !user ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-700">Sign in to check your certificate eligibility.</p>
          </div>
        ) : certificate ? (
          <div id="certificate-print" className="bg-white rounded-2xl shadow-xl border-8 border-green-600 p-12 text-center">
            <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <div className="text-sm uppercase tracking-widest text-gray-500 mb-2">Certificate of Completion</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{program.certificate.title}</h1>
            <p className="text-gray-600 mb-1">This certifies that</p>
            <p className="text-2xl font-semibold text-green-700 mb-6">{certificate.studentName}</p>
            <p className="text-gray-600 mb-8">has successfully completed all lessons and projects in the program.</p>
            <div className="flex justify-between items-end text-sm text-gray-500 border-t border-gray-200 pt-4">
              <div>Issued by {certificate.issuer}</div>
              <div>{new Date(certificate.issuedAt).toLocaleDateString()}</div>
            </div>
            <div className="mt-4 text-xs text-gray-400">Verification code: {certificate.verificationCode}</div>
            <div className="mt-1 text-xs text-gray-400 print:hidden">
              Share this link: {typeof window !== 'undefined' ? `${window.location.origin}/university/verify/${certificate.id}` : ''}
            </div>
            <button
              onClick={() => window.print()}
              className="mt-8 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold inline-flex items-center space-x-2 print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{program.certificate.title}</h1>
            <p className="text-gray-600 mb-6">Complete every lesson and pass every project to unlock your certificate.</p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3">
                {status && status.completedLessons === status.totalLessons && status.totalLessons > 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                <span className="text-gray-800">
                  Lessons completed: {status?.completedLessons ?? 0}/{status?.totalLessons ?? 0}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {status && status.passedProjects === status.totalProjects && status.totalProjects > 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
                <span className="text-gray-800">
                  Projects passed: {status?.passedProjects ?? 0}/{status?.totalProjects ?? 0}
                </span>
              </div>
            </div>

            {status?.eligible ? (
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">Name to print on certificate</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Your full name"
                />
                <button
                  onClick={handleClaim}
                  disabled={isClaiming || !studentName.trim()}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-semibold inline-flex items-center space-x-2"
                >
                  <Award className="w-4 h-4" />
                  <span>{isClaiming ? 'Issuing…' : 'Claim Certificate'}</span>
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Keep going — finish the remaining lessons and projects to unlock your certificate.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
