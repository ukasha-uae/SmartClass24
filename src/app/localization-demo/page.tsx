'use client';
import LocalizationDemo from '@/components/LocalizationDemo';
import { useTenantLink } from '@/hooks/useTenantLink';

export default function LocalizationDemoPage() {
  const addTenantParam = useTenantLink();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            🌍 Internationalization System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience how SmartClass24 adapts to different West African countries.
            Switch between Ghana and Nigeria to see currency, exams, cities, and cultural
            context change automatically.
          </p>
        </div>

        <LocalizationDemo />

        <div className="mt-12 text-center">
          <a 
            href={addTenantParam('/settings')}
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Change Country in Settings →
          </a>
        </div>
      </div>
    </div>
  );
}
