'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Global error boundary for the entire app
 * Catches errors thrown by components, including FirebaseErrorListener
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Global error caught:', error);
    
    // You can log to external error tracking service here
    // e.g., Sentry, LogRocket, etc.
  }, [error]);

  // Check if it's a Firebase permission error
  const isPermissionError = error.message.includes('permission') || 
                            error.message.includes('Missing or insufficient permissions');

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
          <div className="mb-6 flex items-center justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">
            {isPermissionError ? 'Configuration Error' : 'Something went wrong!'}
          </h1>
          
          <div className="mb-6 space-y-3 text-center text-gray-600">
            {isPermissionError ? (
              <>
                <p className="font-medium">
                  The app needs configuration updates to work properly.
                </p>
                <p className="text-sm">
                  Our team has been notified and is working on it. Please try again in a few minutes.
                </p>
              </>
            ) : (
              <>
                <p>
                  We apologize for the inconvenience. An unexpected error occurred.
                </p>
                <details className="mt-4 rounded-md bg-gray-50 p-4 text-left text-xs">
                  <summary className="cursor-pointer font-medium text-gray-700">
                    Technical details
                  </summary>
                  <pre className="mt-2 overflow-auto whitespace-pre-wrap text-red-600">
                    {error.message}
                  </pre>
                </details>
              </>
            )}
          </div>
          
          <button
            onClick={reset}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="mt-3 w-full rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Go to Homepage
          </button>
        </div>
      </body>
    </html>
  );
}
