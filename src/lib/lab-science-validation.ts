export type ValidationSeverity = 'critical' | 'major' | 'minor';

export type LabValidationParameter = {
  id: string;
  label: string;
  description: string;
  severity: ValidationSeverity;
  required: boolean;
};

export type LabValidationProfile = {
  labSlug: string;
  title: string;
  parameters: LabValidationParameter[];
};

/**
 * Reusable science QA checklist to apply across labs.
 * Use this as the baseline rubric when testing each lab one-by-one.
 */
export const CORE_SCIENCE_VALIDATION_PARAMETERS: LabValidationParameter[] = [
  {
    id: 'model-consistency',
    label: 'Model Consistency',
    description: 'Simulation logic must align with accepted scientific principles and expected trends.',
    severity: 'critical',
    required: true,
  },
  {
    id: 'measurement-integrity',
    label: 'Measurement Integrity',
    description: 'Displayed metrics, units, and recorded values must be numerically consistent.',
    severity: 'critical',
    required: true,
  },
  {
    id: 'variable-control',
    label: 'Independent/Controlled Variables',
    description: 'Independent variable must be explicit; controlled variables must be stable and visible.',
    severity: 'major',
    required: true,
  },
  {
    id: 'observation-clarity',
    label: 'Observation Clarity',
    description: 'Visual evidence should be clearly visible to students on mobile and desktop.',
    severity: 'major',
    required: true,
  },
  {
    id: 'narration-continuity',
    label: 'Narration Continuity',
    description: 'Teacher narration must not jump abruptly between unrelated messages.',
    severity: 'major',
    required: true,
  },
  {
    id: 'assessment-alignment',
    label: 'Assessment Alignment',
    description: 'Quiz prompts and expected answers should match what the simulation actually demonstrates.',
    severity: 'critical',
    required: true,
  },
  {
    id: 'edge-case-behavior',
    label: 'Edge-Case Behavior',
    description: 'Reset/retry/repeat paths should not corrupt state or produce impossible outcomes.',
    severity: 'major',
    required: true,
  },
  {
    id: 'student-safety-language',
    label: 'Safety & Scientific Framing',
    description: 'Safety notes and scientific claims should avoid overgeneralization and unsafe guidance.',
    severity: 'minor',
    required: true,
  },
];

export const SCIENCE_LAB_VALIDATION_PROFILES: Record<string, LabValidationProfile> = {
  'photosynthesis-oxygen-production': {
    labSlug: 'photosynthesis-oxygen-production',
    title: 'Photosynthesis & Oxygen Production',
    parameters: [
      ...CORE_SCIENCE_VALIDATION_PARAMETERS,
      {
        id: 'light-rate-trend',
        label: 'Light-to-Rate Trend',
        description: 'Low, medium, high light conditions should show a generally increasing oxygen rate in tested range.',
        severity: 'critical',
        required: true,
      },
      {
        id: 'oxygen-visibility',
        label: 'Oxygen Bubble Visibility',
        description: 'Bubble contrast/size/frequency should be visible enough for mobile learners.',
        severity: 'major',
        required: true,
      },
    ],
  },
  osmosis: {
    labSlug: 'osmosis',
    title: 'Osmosis Through Semi-Permeable Membrane',
    parameters: [
      ...CORE_SCIENCE_VALIDATION_PARAMETERS,
      {
        id: 'tonicity-directionality',
        label: 'Tonicity Directionality',
        description:
          'Water movement direction must be consistent with relative solute concentration and membrane permeability.',
        severity: 'critical',
        required: true,
      },
      {
        id: 'membrane-selectivity',
        label: 'Membrane Selectivity',
        description:
          'Narration and visuals must consistently indicate water passage while larger solutes are restricted.',
        severity: 'major',
        required: true,
      },
    ],
  },
  'transpiration-in-plants': {
    labSlug: 'transpiration-in-plants',
    title: 'Transpiration in Plants',
    parameters: [
      ...CORE_SCIENCE_VALIDATION_PARAMETERS,
      {
        id: 'condition-rate-ordering',
        label: 'Condition-to-Rate Ordering',
        description:
          'Selected light/wind conditions should produce a monotonic transpiration trend in expected order.',
        severity: 'critical',
        required: true,
      },
      {
        id: 'droplet-observability',
        label: 'Droplet Observability',
        description:
          'Condensation evidence should remain visible and interpretable on small screens.',
        severity: 'major',
        required: true,
      },
    ],
  },
  'respiration-in-seeds': {
    labSlug: 'respiration-in-seeds',
    title: 'Respiration in Germinating Seeds',
    parameters: [
      ...CORE_SCIENCE_VALIDATION_PARAMETERS,
      {
        id: 'control-vs-test-separation',
        label: 'Control vs Test Separation',
        description:
          'Flask A (living seeds) and Flask B (boiled control) outcomes must stay clearly differentiated.',
        severity: 'critical',
        required: true,
      },
      {
        id: 'co2-heat-consistency',
        label: 'CO2 and Heat Consistency',
        description:
          'Temperature and limewater outcomes must use consistent units and match the narrated conclusion.',
        severity: 'critical',
        required: true,
      },
    ],
  },
};

