/**
 * Localization Demo Component
 * Demonstrates the internationalization system in action
 * 
 * Usage: Import this component to test localization features
 */

'use client';

import React, { useState } from 'react';
import { useLocalization } from '@/hooks/useLocalization';
import { getActiveCountryOptions } from '@/lib/localization/countries';

export function LocalizationDemo() {
  const {
    country,
    countryId,
    setCountry,
    formatCurrency,
    localizeContent,
    getPrimaryExam,
    getSecondaryExam,
    getCapital,
    getJuniorSecondaryName,
    getSeniorSecondaryName,
  } = useLocalization();

  const countries = getActiveCountryOptions();
  const [amount, setAmount] = useState(100);

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">
          🌍 Internationalization Demo
        </h1>
        <p className="text-gray-600">
          See how content adapts to different West African countries
        </p>
      </div>

      {/* Country Selector */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Select Country</h2>
        <div className="flex gap-4 flex-wrap">
          {countries.map((c) => (
            <button
              key={c.id}
              onClick={() => setCountry(c.id)}
              className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
                countryId === c.id
                  ? 'bg-blue-600 text-white scale-110'
                  : 'bg-white hover:bg-blue-100'
              }`}
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Current Country Info */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Current Configuration</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Country</p>
            <p className="text-2xl font-bold">{country.flag} {country.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Capital</p>
            <p className="text-2xl font-bold">{getCapital()}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Currency</p>
            <p className="text-2xl font-bold">
              {country.currency.symbol} {country.currency.name} ({country.currency.code})
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Regions/States</p>
            <p className="text-2xl font-bold">{country.regions.length}</p>
          </div>
        </div>
      </div>

      {/* Education System */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">📚 Education System</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Primary School:</span>
            <span className="bg-purple-200 px-4 py-2 rounded">
              {country.academicStructure.primary.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Junior Secondary:</span>
            <span className="bg-purple-200 px-4 py-2 rounded">
              {getJuniorSecondaryName()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Senior Secondary:</span>
            <span className="bg-purple-200 px-4 py-2 rounded">
              {getSeniorSecondaryName()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Primary Exam:</span>
            <span className="bg-purple-200 px-4 py-2 rounded font-bold">
              {getPrimaryExam()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-semibold">Secondary Exam:</span>
            <span className="bg-purple-200 px-4 py-2 rounded font-bold">
              {getSecondaryExam()}
            </span>
          </div>
        </div>
      </div>

      {/* Currency Formatter */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">💰 Currency Formatting</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="bg-white p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Formatted:</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(amount)}
            </p>
          </div>
        </div>
      </div>

      {/* Template Variables Demo */}
      <div className="bg-pink-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🎯 Template Variables</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Template:</p>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              &quot;If rice costs {'{{'}currency{'}}'}50 at {'{{'}city:capital{'}}'}&hellip;&quot;
            </code>
            <p className="text-xs text-gray-500 mt-3 mb-1">Localized:</p>
            <p className="text-lg font-semibold">
              {localizeContent("If rice costs {{currency}}50 at {{city:capital}}, how much is it?")}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Template:</p>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              &quot;Prepare for {'{{'}exam:primary{'}}'} and {'{{'}exam:secondary{'}}'}!&quot;
            </code>
            <p className="text-xs text-gray-500 mt-3 mb-1">Localized:</p>
            <p className="text-lg font-semibold">
              {localizeContent("Prepare for {{exam:primary}} and {{exam:secondary}}!")}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Template:</p>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              &quot;{'{{'}landmark:lake{'}}'} is a beautiful natural wonder&hellip;&quot;
            </code>
            <p className="text-xs text-gray-500 mt-3 mb-1">Localized:</p>
            <p className="text-lg font-semibold">
              {localizeContent("{{landmark:lake}} is a beautiful natural wonder in {{country}}.")}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">Template:</p>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
              &quot;Students in {'{{'}level:jhs:1{'}}'} study&hellip;&quot;
            </code>
            <p className="text-xs text-gray-500 mt-3 mb-1">Localized:</p>
            <p className="text-lg font-semibold">
              {localizeContent("Students in {{level:jhs:1}} study Mathematics and {{food:staple}}.")}
            </p>
          </div>
        </div>
      </div>

      {/* Cultural Context */}
      <div className="bg-orange-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🎭 Cultural Context</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold mb-2">Major Festivals</h3>
            <ul className="space-y-1">
              {country.culturalContext.festivals.slice(0, 3).map((f) => (
                <li key={f.name} className="text-sm">• {f.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Famous Landmarks</h3>
            <ul className="space-y-1">
              {country.culturalContext.landmarks.slice(0, 3).map((l) => (
                <li key={l.name} className="text-sm">• {l.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Common Foods</h3>
            <ul className="space-y-1">
              {country.culturalContext.commonFoods.slice(0, 3).map((f) => (
                <li key={f} className="text-sm">• {f}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Natural Resources</h3>
            <ul className="space-y-1">
              {country.culturalContext.resources.slice(0, 3).map((r) => (
                <li key={r.name} className="text-sm">• {r.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Real-World Example */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🎓 Real-World Example</h2>
        <div className="bg-white/10 p-4 rounded-lg">
          <p className="text-lg leading-relaxed">
            {localizeContent(
              `Welcome to SmartClass24! You're studying in {{country}}, preparing for your {{exam:primary}} examination. Our lessons use examples from {{city:capital}} and {{city:second}}, featuring landmarks like {{landmark:lake}}. All prices are shown in {{currency:code}} ({{currency}}), and you'll learn about {{resource:agricultural}} production. Get ready to excel in {{level:jhs}}!`
            )}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-600 text-sm">
        <p>✨ Switch countries above to see content automatically adapt!</p>
        <p className="mt-2">This demonstrates how SmartClass24 serves students across West Africa.</p>
      </div>
    </div>
  );
}

export default LocalizationDemo;
