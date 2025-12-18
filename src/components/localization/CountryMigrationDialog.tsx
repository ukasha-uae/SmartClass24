'use client';

import { useState, useEffect } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import CountrySelector from '../CountrySelector';

interface CountryMigrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newCountryId: string) => void;
  currentCountryName: string;
}

/**
 * Dialog shown to existing users when switching countries
 * Warns about data/content changes
 */
export default function CountryMigrationDialog({
  isOpen,
  onClose,
  onConfirm,
  currentCountryName,
}: CountryMigrationDialogProps) {
  const { countryId } = useLocalization();
  const [selectedCountryId, setSelectedCountryId] = useState(countryId);
  const [confirmed, setConfirmed] = useState(false);

  // Reset state when dialog opens/closes or countryId changes
  useEffect(() => {
    if (isOpen) {
      setSelectedCountryId(countryId);
      setConfirmed(false);
    }
  }, [isOpen, countryId]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmed && selectedCountryId !== countryId) {
      onConfirm(selectedCountryId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Change Your Country</h2>
          <p className="text-gray-600">
            You're currently set to <strong>{currentCountryName}</strong>. 
            Changing your country will update:
          </p>
        </div>

        {/* What Changes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-3">📝 What will change:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">💰</span>
              <span><strong>Currency:</strong> All prices will display in the new country's currency</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📚</span>
              <span><strong>Exams:</strong> Content will reference the new country's examination system</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🏫</span>
              <span><strong>Academic Levels:</strong> JHS/SHS names may change (e.g., JSS/SSS in Nigeria)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🌍</span>
              <span><strong>Examples:</strong> Cities, landmarks, and cultural references will update</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🗺️</span>
              <span><strong>Regions:</strong> Your region selection will reset</span>
            </li>
          </ul>
        </div>

        {/* What Stays */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-bold mb-3">✅ What stays the same:</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="mr-2">📊</span>
              <span>Your progress, achievements, and scores</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🔖</span>
              <span>Your bookmarks and notes</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">👥</span>
              <span>Your account and profile</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📖</span>
              <span>Core lesson content (curriculum is shared across WAEC countries)</span>
            </li>
          </ul>
        </div>

        {/* Country Selector */}
        <div className="mb-6">
          <h3 className="font-bold mb-3">Select New Country:</h3>
          <CountrySelector
            variant="compact"
            showSearch={false}
            onSelect={setSelectedCountryId}
            autoApply={false}
            selectedCountryId={selectedCountryId}
          />
        </div>

        {/* Confirmation Checkbox */}
        <label className="flex items-start space-x-3 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 w-4 h-4"
          />
          <span className="text-sm">
            I understand that changing my country will update how content is displayed, 
            but my progress and data will remain intact.
          </span>
        </label>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmed || selectedCountryId === countryId}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              confirmed && selectedCountryId !== countryId
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Change
          </button>
        </div>
      </div>
    </div>
  );
}
