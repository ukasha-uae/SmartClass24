/**
 * Public certificate verification page — anyone with the link can confirm authenticity
 */
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useCertificates } from '@/firebase/university-hooks';
import { CertificateRecord } from '@/types/university';

export default function VerifyCertificatePage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = use(params);
  const { verifyCertificate } = useCertificates();

  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    verifyCertificate(certificateId).then(result => {
      if (!cancelled) {
        setCertificate(result);
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [certificateId, verifyCertificate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
        ) : certificate ? (
          <>
            <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-1">Certificate Verified</h1>
            <p className="text-gray-600 mb-6">This certificate is authentic.</p>
            <div className="bg-gray-50 rounded-lg p-4 text-left space-y-1 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="font-semibold">{certificate.studentName}</span></div>
              <div><span className="text-gray-500">Program:</span> <span className="font-semibold">{certificate.programTitle}</span></div>
              <div><span className="text-gray-500">Issuer:</span> <span className="font-semibold">{certificate.issuer}</span></div>
              <div><span className="text-gray-500">Issued:</span> <span className="font-semibold">{new Date(certificate.issuedAt).toLocaleDateString()}</span></div>
              <div><span className="text-gray-500">Code:</span> <span className="font-mono">{certificate.verificationCode}</span></div>
            </div>
          </>
        ) : (
          <>
            <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-900 mb-1">Certificate Not Found</h1>
            <p className="text-gray-600">This link doesn't match any issued certificate.</p>
          </>
        )}
        <Link href="/university" className="inline-flex items-center justify-center mt-6 text-green-600 hover:text-green-700 font-semibold">
          <Award className="w-4 h-4 mr-2" />
          Visit S24 Innovation Academy
        </Link>
      </div>
    </div>
  );
}
