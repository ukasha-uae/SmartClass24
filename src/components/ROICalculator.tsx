'use client';

import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, TrendingUp, Users, BookOpen, Clock, Award, CheckCircle2 } from 'lucide-react';

/**
 * ROI Calculator Component for SmartClass24 Partners Page
 * 
 * Calculates return on investment for schools considering SmartClass24
 * vs. traditional methods or competitor platforms.
 * 
 * @example
 * ```tsx
 * <ROICalculator />
 * ```
 */
export default function ROICalculator() {
  // Input state
  const [numStudents, setNumStudents] = useState<number>(500);
  const [numTeachers, setNumTeachers] = useState<number>(25);
  const [currentSolution, setCurrentSolution] = useState<'none' | 'competitor' | 'manual'>('manual');
  const [teacherHourlyRate, setTeacherHourlyRate] = useState<number>(15); // USD per hour
  const [region, setRegion] = useState<'west-africa' | 'middle-east' | 'international'>('west-africa');

  // Pricing tiers for SmartClass24
  const getSmartClass24Pricing = (students: number): number => {
    if (students <= 200) return 299;
    if (students <= 500) return 599;
    if (students <= 1000) return 999;
    if (students <= 2000) return 1599;
    return 1599 + Math.ceil((students - 2000) / 500) * 400; // $400 per 500 students above 2000
  };

  // Competitor pricing (average of Gradely, uLesson, Cyberschool)
  const getCompetitorPricing = (students: number): number => {
    const baseRate = students <= 500 ? 1000 : students <= 1000 ? 1800 : 3000;
    return baseRate;
  };

  // ROI Calculations
  const calculations = useMemo(() => {
    const smartClass24Monthly = getSmartClass24Pricing(numStudents);
    const smartClass24Annual = smartClass24Monthly * 12;

    // Manual/traditional method costs
    const manualCosts = {
      // Teacher time for content creation (avg 10 hours/week)
      contentCreation: numTeachers * teacherHourlyRate * 10 * 52,
      // Grading time saved (avg 5 hours/week per teacher)
      gradingTime: numTeachers * teacherHourlyRate * 5 * 52,
      // Physical materials (textbooks, worksheets, etc.)
      physicalMaterials: numStudents * 50, // $50 per student annually
      // Physical lab equipment (if teaching science)
      labEquipment: 5000, // One-time but amortized annually
      // Photocopying/printing
      printing: numStudents * 20, // $20 per student annually
    };

    const totalManualCosts = Object.values(manualCosts).reduce((sum, cost) => sum + cost, 0);

    // Competitor costs
    const competitorMonthly = getCompetitorPricing(numStudents);
    const competitorSetupFee = 500; // Average setup fee
    const competitorAnnual = competitorMonthly * 12 + competitorSetupFee;

    // Savings calculations
    const savingsVsManual = totalManualCosts - smartClass24Annual;
    const savingsVsCompetitor = competitorAnnual - smartClass24Annual;

    // Time savings (converted to hours annually)
    const teacherTimeSaved = numTeachers * (10 + 5) * 52; // Content + grading hours

    // ROI percentage
    const roiVsManual = (savingsVsManual / smartClass24Annual) * 100;
    const roiVsCompetitor = (savingsVsCompetitor / smartClass24Annual) * 100;

    // Per-student cost
    const costPerStudentSmartClass24 = smartClass24Annual / numStudents;
    const costPerStudentManual = totalManualCosts / numStudents;
    const costPerStudentCompetitor = competitorAnnual / numStudents;

    // Payback period (in months)
    const paybackPeriodManual = smartClass24Annual / (totalManualCosts / 12);
    const paybackPeriodCompetitor = smartClass24Annual / (competitorAnnual / 12);

    return {
      smartClass24: {
        monthly: smartClass24Monthly,
        annual: smartClass24Annual,
        perStudent: costPerStudentSmartClass24,
        setupFee: 0,
      },
      manual: {
        annual: totalManualCosts,
        perStudent: costPerStudentManual,
        breakdown: manualCosts,
      },
      competitor: {
        monthly: competitorMonthly,
        annual: competitorAnnual,
        perStudent: costPerStudentCompetitor,
        setupFee: competitorSetupFee,
      },
      savings: {
        vsManual: savingsVsManual,
        vsCompetitor: savingsVsCompetitor,
      },
      roi: {
        vsManual: roiVsManual,
        vsCompetitor: roiVsCompetitor,
      },
      time: {
        teacherHoursSaved: teacherTimeSaved,
        teacherWeeksSaved: teacherTimeSaved / 40, // 40-hour work weeks
      },
      payback: {
        vsManual: paybackPeriodManual,
        vsCompetitor: paybackPeriodCompetitor,
      },
    };
  }, [numStudents, numTeachers, teacherHourlyRate, region]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number): string => {
    return `${value > 0 ? '+' : ''}${value.toFixed(0)}%`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Calculator className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">ROI Calculator</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover how much your school can save by switching to SmartClass24. 
          Calculate your return on investment vs. traditional methods or competitor platforms.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          Your School Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Number of Students */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users className="w-4 h-4" />
              Number of Students
            </label>
            <input
              type="number"
              min="50"
              max="10000"
              step="50"
              value={numStudents}
              onChange={(e) => setNumStudents(parseInt(e.target.value) || 500)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
            />
            <p className="text-xs text-gray-500">Students enrolled in your school</p>
          </div>

          {/* Number of Teachers */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <BookOpen className="w-4 h-4" />
              Number of Teachers
            </label>
            <input
              type="number"
              min="5"
              max="500"
              step="5"
              value={numTeachers}
              onChange={(e) => setNumTeachers(parseInt(e.target.value) || 25)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
            />
            <p className="text-xs text-gray-500">Teachers using the platform</p>
          </div>

          {/* Teacher Hourly Rate */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <DollarSign className="w-4 h-4" />
              Teacher Hourly Rate (USD)
            </label>
            <input
              type="number"
              min="5"
              max="100"
              step="5"
              value={teacherHourlyRate}
              onChange={(e) => setTeacherHourlyRate(parseInt(e.target.value) || 15)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
            />
            <p className="text-xs text-gray-500">Average hourly compensation for teachers</p>
          </div>

          {/* Region */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Award className="w-4 h-4" />
              School Region
            </label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as any)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
            >
              <option value="west-africa">West Africa (Ghana, Nigeria, etc.)</option>
              <option value="middle-east">Middle East (UAE, Saudi Arabia, etc.)</option>
              <option value="international">International / Other</option>
            </select>
            <p className="text-xs text-gray-500">Your school&apos;s location</p>
          </div>

          {/* Current Solution */}
          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <CheckCircle2 className="w-4 h-4" />
              Current Learning Solution
            </label>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setCurrentSolution('manual')}
                className={`p-4 border-2 rounded-lg transition ${
                  currentSolution === 'manual'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Manual/Traditional</div>
                <div className="text-xs text-gray-600 mt-1">Paper-based, physical materials</div>
              </button>
              <button
                onClick={() => setCurrentSolution('competitor')}
                className={`p-4 border-2 rounded-lg transition ${
                  currentSolution === 'competitor'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">Competitor Platform</div>
                <div className="text-xs text-gray-600 mt-1">Another EdTech solution</div>
              </button>
              <button
                onClick={() => setCurrentSolution('none')}
                className={`p-4 border-2 rounded-lg transition ${
                  currentSolution === 'none'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="font-semibold">No Solution</div>
                <div className="text-xs text-gray-600 mt-1">Starting from scratch</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* SmartClass24 Pricing */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl shadow-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">SmartClass24</h3>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-3xl font-bold">{formatCurrency(calculations.smartClass24.monthly)}</div>
              <div className="text-sm opacity-90">per month</div>
            </div>
            <div className="pt-2 border-t border-white/30">
              <div className="text-sm opacity-90">Annual Cost</div>
              <div className="text-xl font-semibold">{formatCurrency(calculations.smartClass24.annual)}</div>
            </div>
            <div className="pt-2 border-t border-white/30">
              <div className="text-sm opacity-90">Per Student</div>
              <div className="text-xl font-semibold">{formatCurrency(calculations.smartClass24.perStudent)}</div>
            </div>
            <div className="pt-2 border-t border-white/30">
              <div className="text-sm opacity-90">Setup Fee</div>
              <div className="text-xl font-semibold">{formatCurrency(calculations.smartClass24.setupFee)}</div>
            </div>
          </div>
        </div>

        {/* Current Solution Costs */}
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4 border-2 border-gray-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {currentSolution === 'manual' ? 'Manual Method' : currentSolution === 'competitor' ? 'Competitor' : 'Baseline'}
            </h3>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-sm text-gray-600">Annual Cost</div>
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(
                  currentSolution === 'manual' ? calculations.manual.annual : 
                  currentSolution === 'competitor' ? calculations.competitor.annual : 0
                )}
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="text-sm text-gray-600">Per Student</div>
              <div className="text-xl font-semibold text-gray-900">
                {formatCurrency(
                  currentSolution === 'manual' ? calculations.manual.perStudent : 
                  currentSolution === 'competitor' ? calculations.competitor.perStudent : 0
                )}
              </div>
            </div>
            {currentSolution === 'competitor' && (
              <div className="pt-2 border-t border-gray-200">
                <div className="text-sm text-gray-600">Setup Fee</div>
                <div className="text-xl font-semibold text-gray-900">
                  {formatCurrency(calculations.competitor.setupFee)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Savings */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl shadow-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold">Your Savings</h3>
          </div>
          <div className="space-y-2">
            <div>
              <div className="text-sm opacity-90">Annual Savings</div>
              <div className="text-3xl font-bold">
                {formatCurrency(
                  currentSolution === 'manual' ? calculations.savings.vsManual : 
                  currentSolution === 'competitor' ? calculations.savings.vsCompetitor : 0
                )}
              </div>
            </div>
            <div className="pt-2 border-t border-white/30">
              <div className="text-sm opacity-90">ROI</div>
              <div className="text-xl font-semibold">
                {formatPercentage(
                  currentSolution === 'manual' ? calculations.roi.vsManual : 
                  currentSolution === 'competitor' ? calculations.roi.vsCompetitor : 0
                )}
              </div>
            </div>
            <div className="pt-2 border-t border-white/30">
              <div className="text-sm opacity-90">Payback Period</div>
              <div className="text-xl font-semibold">
                {currentSolution === 'none' ? 'Immediate' : 
                  `${Math.max(0.1, currentSolution === 'manual' ? calculations.payback.vsManual : calculations.payback.vsCompetitor).toFixed(1)} months`
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      {currentSolution === 'manual' && (
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Manual Method Cost Breakdown</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Content Creation (Teacher Time)</span>
                <span className="font-semibold">{formatCurrency(calculations.manual.breakdown.contentCreation)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Grading Time (Teacher Hours)</span>
                <span className="font-semibold">{formatCurrency(calculations.manual.breakdown.gradingTime)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Physical Materials (Textbooks)</span>
                <span className="font-semibold">{formatCurrency(calculations.manual.breakdown.physicalMaterials)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Lab Equipment (Amortized)</span>
                <span className="font-semibold">{formatCurrency(calculations.manual.breakdown.labEquipment)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Printing & Photocopying</span>
                <span className="font-semibold">{formatCurrency(calculations.manual.breakdown.printing)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-500">
                <span className="text-green-700 font-semibold">Total Annual Costs</span>
                <span className="font-bold text-green-700">{formatCurrency(calculations.manual.annual)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Savings */}
      <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-600" />
          Time Savings
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-sm text-blue-600 font-semibold mb-2">Teacher Hours Saved Annually</div>
            <div className="text-4xl font-bold text-blue-900">{calculations.time.teacherHoursSaved.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Hours per year</div>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-sm text-blue-600 font-semibold mb-2">Equivalent Work Weeks</div>
            <div className="text-4xl font-bold text-blue-900">{calculations.time.teacherWeeksSaved.toFixed(0)}</div>
            <div className="text-sm text-gray-600 mt-1">40-hour work weeks</div>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-sm text-blue-600 font-semibold mb-2">Value of Time Saved</div>
            <div className="text-4xl font-bold text-blue-900">
              {formatCurrency(calculations.time.teacherHoursSaved * teacherHourlyRate)}
            </div>
            <div className="text-sm text-gray-600 mt-1">Annual value (USD)</div>
          </div>
        </div>
      </div>

      {/* Benefits Summary */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Beyond the Numbers: SmartClass24 Benefits</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Instant Deployment</div>
                <div className="text-sm opacity-90">Go live in &lt;3 weeks vs. 6-12 weeks for competitors</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Challenge Arena</div>
                <div className="text-sm opacity-90">Gamified learning increases engagement by 40%+</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">12+ Virtual Labs</div>
                <div className="text-sm opacity-90">Hands-on science without $10,000 lab equipment</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">White-Label Branding</div>
                <div className="text-sm opacity-90">Custom logo, colors, and domain included</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">2,000+ Past Questions</div>
                <div className="text-sm opacity-90">WASSCE/BECE exam prep with step-by-step solutions</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Offline-First PWA</div>
                <div className="text-sm opacity-90">Works without internet, syncs when online</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">24/7 WhatsApp Support</div>
                <div className="text-sm opacity-90">Real humans, real-time responses</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">Multi-Country Support</div>
                <div className="text-sm opacity-90">5+ countries, one platform (Ghana, Nigeria, UAE, etc.)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Ready to Save {formatCurrency(
            currentSolution === 'manual' ? calculations.savings.vsManual : 
            currentSolution === 'competitor' ? calculations.savings.vsCompetitor : 
            calculations.smartClass24.annual
          )} Annually?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Join schools like Wisdom Warehouse (UAE) who switched to SmartClass24 and never looked back.
          Get a free demo customized with your school&apos;s branding in just 24 hours.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="https://smartclass24.app/partners"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition"
          >
            Schedule Free Demo
          </a>
          <a
            href="mailto:hello@smartclass24.app"
            className="px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-lg border-2 border-blue-600 transition"
          >
            Contact Sales
          </a>
          <a
            href="https://wa.me/233244432795"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition"
          >
            WhatsApp Us
          </a>
        </div>
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            No credit card required • Free 30-day trial • Cancel anytime
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center text-xs text-gray-500">
        <p>
          * Calculations are estimates based on industry averages and may vary by school. 
          Competitor pricing based on average of Gradely, uLesson, and Cyberschool as of February 2026.
          Manual method costs assume 10 hours/week content creation and 5 hours/week grading per teacher.
          Actual savings depend on school size, region, and current practices.
        </p>
      </div>
    </div>
  );
}
