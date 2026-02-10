'use client';

import { useState, useEffect } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { useTenant } from '@/hooks/useTenant';
import CountrySelector from './CountrySelector';
import RegionSelector from './RegionSelector';
import { Button } from './ui/button';
import { CheckCircle2, Globe, MapPin } from 'lucide-react';

interface CountryOnboardingProps {
  onComplete?: () => void;
  autoShow?: boolean;
}

/**
 * First-time onboarding flow for country selection
 * Shows automatically for new users who haven't set a country yet
 */
export default function CountryOnboarding({
  onComplete,
  autoShow = true,
}: CountryOnboardingProps) {
  const { countryId } = useLocalization();
  const { branding } = useTenant();
  const [step, setStep] = useState(1);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const completed = localStorage.getItem('country-onboarding-completed');
    if (!completed && autoShow) {
      setHasSeenOnboarding(false);
    }
  }, [autoShow]);

  const handleComplete = () => {
    localStorage.setItem('country-onboarding-completed', 'true');
    setHasSeenOnboarding(true);
    onComplete?.();
  };

  if (hasSeenOnboarding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {step === 1 && (
          <div className="p-8 text-center">
            <div className="mb-6">
              <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
                <Globe className="h-12 w-12 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold mb-3">Welcome to {branding.name}!</h1>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                Let's personalize your learning experience by selecting your country
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
              <h3 className="font-bold mb-3 text-left">🎯 Why this matters:</h3>
              <ul className="space-y-2 text-sm text-left">
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Content tailored to <strong>your country's curriculum</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Prices shown in <strong>your local currency</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Examples from <strong>your cities and landmarks</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-green-600">✓</span>
                  <span>Preparation for <strong>your exams</strong> (BECE, WASSCE, etc.)</span>
                </li>
              </ul>
            </div>

            <Button
              size="lg"
              onClick={() => setStep(2)}
              className="w-full sm:w-auto px-8"
            >
              Get Started →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Select Your Country</h2>
                <span className="text-sm text-gray-500">Step 1 of 2</span>
              </div>
              <p className="text-gray-600">
                Choose the country where you're studying. This can be changed later in Settings.
              </p>
            </div>

            <div className="mb-8">
              <CountrySelector variant="card" showSearch={false} />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
              >
                ← Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!countryId}
              >
                Next: Choose Region →
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Select Your Region</h2>
                <span className="text-sm text-gray-500">Step 2 of 2</span>
              </div>
              <p className="text-gray-600">
                Optional: Choose your region for more localized content. You can skip this step.
              </p>
            </div>

            <div className="mb-8">
              <RegionSelector variant="grid" showSearch={true} />
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">You're all set!</h4>
                  <p className="text-sm text-gray-600">
                    You can change your country and region anytime in Settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
              >
                ← Back
              </Button>
              <Button
                onClick={handleComplete}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Setup ✓
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
