/**
 * Feature Flag System for SmartClass24
 * Provides granular control over feature rollout
 */

export const FEATURE_FLAGS = {
  V1_LAUNCH: {
    enabled: true,
    // Campus Access Control
    showPrimary: true,              // Primary can access Arena Challenge only
    showJHS: true,                 // JHS can access Arena Challenge only
    showSHS: true,                 // SHS has full access
    // Feature Access by Campus - V1: Arena + Virtual Labs Only
    primaryHasLessons: false,       // Primary: no lessons (V2)
    primaryHasVirtualLabs: false,  // Primary: no virtual labs
    primaryHasArena: true,         // Primary: Arena Challenge only
    jhsHasLessons: false,          // JHS: no lessons (V2)
    jhsHasVirtualLabs: false,      // JHS: no virtual labs
    jhsHasArena: true,            // JHS: Arena Challenge only
    shsHasLessons: false,          // SHS: no lessons (V2) - Redirect to Arena
    shsHasVirtualLabs: true,       // SHS: virtual labs access (V1)
    shsHasArena: true,            // SHS: Arena Challenge access (V1)
    // Global Settings
    showNigeria: false,            // Ghana only for V1
    showCarousel: true,           // Carousel mode for SHS lessons
    showTraditionalLesson: false, // Hide traditional view
    showAdmin: false,              // Hide admin
    showTeacher: false,            // Hide teacher
    showParent: false,             // Hide parent
    showCommunity: false,         // Hide community
    showStudyGroups: false,        // Hide study groups
    // Challenge Arena Modes
    showChallengeArena: true,      // Show Arena Challenge
    showChallengeArenaBoss: true,  // Show boss battles (Premium unlock)
    showChallengeArenaTournament: true, // Show tournaments (Premium unlock)
    showChallengeArenaSchool: true,      // Show school battles (Premium unlock)
    showChallengeArenaPractice: true,    // Show practice mode
    showChallengeArenaQuickMatch: true,  // Show quick match
    // Virtual Labs - V1 Selection (5-10 best labs)
    v1VirtualLabs: [
      // Biology (3)
      'food-tests',
      'osmosis',
      'photosynthesis-oxygen-production',
      // Chemistry (3)
      'litmus-test',
      'neutralization-reaction',
      'flame-test',
      // Physics (4)
      'ohms-law',
      'simple-circuits',
      'heat-transfer',
      'reflection-of-light',
    ],
  },
  CAROUSEL_MODE: {
    enabled: true,
    autostart: true, // Automatically start carousel mode for eligible lessons
    subjects: ['mathematics', 'core-mathematics', 'integrated-science', 'english-language'], // Support both formats
    levels: ['shs', 'shs1', 'shs2', 'shs3', 'jhs', 'jhs1', 'jhs2', 'jhs3'], // Support all SHS and JHS levels
    topics: [
      'algebra', 
      'algebra-3', 
      // SHS3 Topics
      'shs3-quadratic-equations',
      'shs3-factorization',
      'shs3-completing-the-square',
      'shs3-quadratic-formula',
      'shs3-sequences-series',
      'shs3-functions-relations',
      'shs3-linear-programming',
      'shs3-matrices-determinants',
      'shs3-circle-theorems-1',
      'shs3-circle-theorems-2',
      'shs3-polygons-angles',
      'shs3-similarity-congruence',
      'shs3-geometric-constructions',
      'shs3-coordinate-geometry',
      'shs3-trigonometric-ratios',
      'shs3-trigonometric-identities',
      'shs3-trig-graphs',
      'shs3-trigonometric-equations',
      'shs3-applications-of-trigonometry',
      'shs3-measures-of-central-tendency',
      'shs3-measures-of-dispersion',
      'shs3-probability-fundamentals',
      'shs3-probability-distributions',
      'shs3-sine-cosine-rules',
      'shs3-bearings-scale-drawing',
      'shs3-cumulative-frequency-box-plots',
      'shs3-problem-solving-strategies',
      'shs3-wassce-revision',
      // SHS2 Topics
      'shs2-number-bases',
      'shs2-binary-operations',
      'shs2-algebraic-factorization',
      'shs2-simultaneous-linear-equations',
      'shs2-variation',
      'shs2-mensuration',
      'shs2-trigonometry-ratios',
      'shs2-circle-geometry',
      'shs2-transformation-geometry',
      'shs2-statistics-measures',
      'shs2-probability-combined',
      // SHS1 Topics
      'shs1-types-of-numbers',
      'shs1-fractions-decimals-percentages',
      'sets-venn-diagrams',
      'cm-algebraic-expressions',
      'shs1-linear-equations-inequalities',
      'shs1-directed-numbers',
      'shs1-approximation-estimation',
      'shs1-factors-multiples',
      'shs1-geometry-lines-angles',
      'shs1-geometry-triangles-quadrilaterals',
      'shs1-geometry-constructions-loci',
      'shs1-data-collection-presentation',
      'shs1-introduction-to-probability',
      'shs1-logical-reasoning',
      'shs1-business-mathematics',
      // Integrated Science Topics
      'chem-shs1-intro-nature-scope',
      'chem-shs1-intro-scientific-methods-safety',
      'is-dm-matter-states-properties',
      'is-dm-cells-structure-function',
      'is-dm-cells-cell-division',
      'is-dm-rocks-soil-types-formation',
      'is-dm-nutrition-balanced-diet',
      'is-dm-digestion-process',
      'is-dm-respiration-aerobic-anaerobic',
      'is-dm-photosynthesis-process',
      'is-dm-genetics-inheritance',
      'is-en-forms-of-energy-types',
      'is-en-forms-of-energy-transformation-conservation',
      'is-en-heat-energy-temperature',
      'is-im-acids-bases-salts-properties-reactions',
      'is-im-acids-bases-salts-ph-scale',
      'is-im-agricultural-science-crop-animal-production',
      'is-im-agricultural-science-soil-fertility-conservation',
      'is-dm-rocks-soil-composition',
      'is-diversity-matter-shs1',
      'is-measurement-units-instruments',
      'is-accuracy-precision-measurement',
      // SHS2 Integrated Science Topics
      'is-cy-life-cycles-plants-animals',
      'is-cy-life-cycles-human-development',
      'is-cy-nutrient-cycles-nitrogen-carbon',
      'is-cy-nutrient-cycles-water',
      'is-cy-reproduction-asexual-sexual',
      'is-cy-reproduction-fertilization-development',
      'is-em-electricity-magnetism-concepts',
      'is-en-electricity-magnetism-simple-circuits',
      'is-en-work-machines-force-work-power',
      'is-en-work-machines-simple-machines-uses',
      // SHS3 Integrated Science Topics
      'is-sy-human-body-systems-overview',
      'is-sy-human-body-systems-functions-interactions',
      'is-sy-plant-systems-photosynthesis',
      'is-sy-plant-systems-transport',
      'is-sy-ecosystems-components-relationships',
      'is-sy-ecosystems-energy-flow-food-chains', // NEW: Ecosystems Energy Flow
      'is-im-environmental-chemistry-pollution-effects', // NEW: Environmental Chemistry
      'is-im-environmental-chemistry-waste-management', // NEW: Waste Management
      // English Language SHS1 Topics
      'eng-ls-effective-listening',
      'eng-ls-oral-presentations', // NEW: Oral Presentations and Discussions
      'eng-ls-pronunciation-intonation', // NEW: Pronunciation, Stress, and Intonation
      'eng-rw-reading-comprehension', // NEW: Reading Comprehension Strategies
    ],
    lessons: [
      'quadratic-equations',
      'shs3-quadratic-equations', // Support both with and without prefix
      'factorization',
      'completing-the-square',
      'quadratic-formula',
      'sequences-series', // Phase 2: Sequences and Series
      'functions-relations', // Phase 2: Functions and Relations
      'linear-programming', // Phase 2: Linear Programming
      'matrices-determinants', // Phase 2: Matrices and Determinants
      'circle-theorems-1', // Phase 3: Circle Theorems I (Geometry)
      'circle-theorems-2', // Phase 3: Circle Theorems II (Geometry)
      'polygons-angles', // Phase 3: Polygons and Angles (Geometry)
      'similarity-congruence', // Phase 3: Similarity and Congruence (Geometry)
      'geometric-constructions', // Phase 3: Geometric Constructions (Geometry)
      'coordinate-geometry', // Phase 3: Coordinate Geometry (Geometry)
      'trigonometric-ratios', // Phase 4: Trigonometric Ratios (Trigonometry)
      'trigonometric-identities', // Phase 4: Trigonometric Identities (Trigonometry)
      'trig-graphs', // Phase 4: Graphs of Trig Functions (Trigonometry)
      'trigonometric-equations', // Phase 4: Trigonometric Equations (Trigonometry)
      'applications-of-trigonometry', // Phase 4: Applications of Trigonometry
      'measures-of-central-tendency', // Phase 5: Measures of Central Tendency (Statistics)
      'measures-of-dispersion', // Phase 5: Measures of Dispersion (Statistics)
      'probability-fundamentals', // Phase 5: Probability Fundamentals (Statistics)
      'probability-distributions', // Phase 5: Probability Distributions (Statistics)
      'sine-cosine-rules', // Geometry II: Sine and Cosine Rules
      'shs3-bearings-scale-drawing', // Geometry II: Bearings and Scale Drawing
      'shs3-cumulative-frequency-box-plots', // Data Handling: Cumulative Frequency & Box Plots
      'shs3-problem-solving-strategies', // Problem Solving: Structured Problem-Solving
      'shs3-wassce-revision', // Problem Solving: Integrated WASSCE Revision
      // SHS2 Lessons
      'shs2-number-bases', // SHS2: Number Bases
      'shs2-binary-operations', // SHS2: Binary Operations
      'shs2-algebraic-factorization', // SHS2: Algebraic Factorization
      'shs2-simultaneous-linear-equations', // SHS2: Simultaneous Linear Equations
      'shs2-variation', // SHS2: Variation (Direct, Inverse, Joint)
      'shs2-mensuration', // SHS2: Mensuration
      'shs2-trigonometry-ratios', // SHS2: Trigonometry Ratios
      'shs2-circle-geometry', // SHS2: Circle Geometry
      'shs2-transformation-geometry', // SHS2: Transformation Geometry
      'shs2-statistics-measures', // SHS2: Statistics (Mean, Median, Mode, Range)
      'shs2-probability-combined', // SHS2: Probability (Combined Events)
      // SHS1 Lessons
      'shs1-types-of-numbers', // SHS1: Types of Numbers
      'shs1-fractions-decimals-percentages', // SHS1: Fractions, Decimals & Percentages
      'sets-venn-diagrams', // SHS1: Sets and Venn Diagrams
      'cm-algebraic-expressions', // SHS1: Algebraic Expressions
      'shs1-linear-equations-inequalities', // SHS1: Linear Equations & Inequalities
      'shs1-directed-numbers', // SHS1: Directed Numbers
      'shs1-approximation-estimation', // SHS1: Approximation & Estimation
      'shs1-factors-multiples', // SHS1: Factors & Multiples
      'shs1-geometry-lines-angles', // SHS1: Geometry: Lines & Angles
      'shs1-geometry-triangles-quadrilaterals', // SHS1: Geometry: Triangles & Quadrilaterals
      'shs1-geometry-constructions-loci', // SHS1: Geometry: Constructions & Loci
      'shs1-data-collection-presentation', // SHS1: Data Collection & Presentation
      'shs1-introduction-to-probability', // SHS1: Introduction to Probability
      'shs1-logical-reasoning', // SHS1: Logical Reasoning
      'shs1-business-mathematics', // SHS1: Business Mathematics
      // Integrated Science Lessons (SHS1)
      'chem-shs1-intro-nature-scope', // Nature and Scope of Chemistry
      'chem-shs1-intro-scientific-methods-safety', // Scientific Methods and Laboratory Safety
      'is-dm-matter-states-properties', // States and Changes of Matter
      'is-dm-cells-structure-function', // Cell Structure and Function
      'is-dm-cells-cell-division', // Cell Division
      'is-dm-rocks-soil-types-formation', // Types and Formation of Rocks
      'is-dm-nutrition-balanced-diet', // Nutrition and Balanced Diet
      'is-dm-digestion-process', // Digestion and Digestive System
      'is-dm-respiration-aerobic-anaerobic', // Respiration: Aerobic and Anaerobic
      'is-dm-photosynthesis-process', // Photosynthesis: Making Food from Sunlight
      'is-dm-genetics-inheritance', // Genetics and Inheritance
      'is-en-forms-of-energy-types', // Forms of Energy
      'is-en-forms-of-energy-transformation-conservation', // Energy Transformation and Conservation
      'is-en-heat-energy-temperature', // Heat Energy and Temperature
      'is-im-acids-bases-salts-properties-reactions', // Acids, Bases, and Salts
      'is-im-acids-bases-salts-ph-scale', // Acids, Bases, and Salts: The pH Scale
      'is-im-agricultural-science-crop-animal-production', // Crop and Animal Production (Basics)
      'is-im-agricultural-science-soil-fertility-conservation', // Soil Fertility and Conservation
      'is-dm-rocks-soil-composition', // Soil Composition and Importance
      'is-diversity-matter-shs1', // Elements, Compounds & Mixtures
      'is-measurement-units-instruments', // Units and Instruments (Measurement)
      'is-accuracy-precision-measurement', // Accuracy and Precision in Measurement
      // Integrated Science Lessons (SHS2)
      'is-cy-life-cycles-plants-animals', // Life Cycles: Plants and Animals
      'is-cy-life-cycles-human-development', // Life Cycles: Human Development
      'is-cy-nutrient-cycles-nitrogen-carbon', // Nutrient Cycles: Nitrogen and Carbon
      'is-cy-nutrient-cycles-water', // Nutrient Cycles: Water Cycle
      'is-cy-reproduction-asexual-sexual', // Reproduction: Asexual and Sexual
      'is-cy-reproduction-fertilization-development', // Reproduction: Fertilization and Development
      // Integrated Science Lessons (SHS3)
      'is-sy-ecosystems-energy-flow-food-chains', // Ecosystems: Energy Flow & Food Chains
      'is-em-electricity-magnetism-concepts', // Electricity and Magnetism: Concepts
      'is-en-electricity-magnetism-simple-circuits', // Electricity and Magnetism: Simple Circuits
      'is-en-work-machines-force-work-power', // Work and Machines: Force, Work, Power
      'is-en-work-machines-simple-machines-uses', // Work and Machines: Simple Machines & Uses
      // Integrated Science Lessons (SHS3)
      'is-sy-human-body-systems-overview', // Human Body Systems: Overview
      'is-sy-human-body-systems-functions-interactions', // Human Body Systems: Functions & Interactions
      'is-sy-plant-systems-photosynthesis', // Plant Systems: Photosynthesis
      'is-sy-plant-systems-transport', // Plant Systems: Transport
      'is-sy-ecosystems-components-relationships', // Ecosystems: Components & Relationships
      'is-im-environmental-chemistry-pollution-effects', // Environmental Chemistry: Pollution & Effects
      'is-im-environmental-chemistry-waste-management', // Environmental Chemistry: Waste Management
      // English Language SHS1 Lessons
      'eng-ls-effective-listening', // Effective Listening Strategies
      'eng-ls-oral-presentations', // Oral Presentations and Discussions
      'eng-ls-pronunciation-intonation', // Pronunciation, Stress, and Intonation
      'eng-rw-reading-comprehension', // Reading Comprehension Strategies
      // English Language JHS Lessons
      'nouns', // JHS: Nouns - Types, Gender, Number, Case, Functions
      // English Language JHS Topics (for backward compatibility with old URLs)
      'grammar-usage-1', // JHS: Grammar & Usage topic (contains nouns lesson)
    ], // SHS3 (29) + SHS2 (12) + SHS1 (16) + Science SHS1 (22) + Science SHS2 (10) + Science SHS3 (5) + English SHS1 (3) + English JHS (1) = 98 lessons total
  },
};

/**
 * Check if carousel mode is enabled for a specific lesson context
 */
export function isCarouselEnabled(
  level: string,
  subject: string,
  topic?: string,
  lesson?: string
): boolean {
  // Global kill switch
  if (!FEATURE_FLAGS.CAROUSEL_MODE.enabled) {
    return false;
  }

  // Check environment variable override
  if (typeof window !== 'undefined') {
    const envOverride = process.env.NEXT_PUBLIC_ENABLE_CAROUSEL;
    if (envOverride === 'false') {
      return false;
    }
  }

  // Normalize inputs
  const normalizedLevel = level.toLowerCase();
  const normalizedSubject = subject.toLowerCase();
  const normalizedTopic = topic?.toLowerCase();
  const normalizedLesson = lesson?.toLowerCase();

  // Check lesson-level filter (most specific)
  if (normalizedLesson) {
    const allowedLessons = FEATURE_FLAGS.CAROUSEL_MODE.lessons;
    if (allowedLessons.length > 0 && !allowedLessons.includes('*')) {
      if (!allowedLessons.includes(normalizedLesson)) {
        return false;
      }
    }
  }

  // Check topic-level filter
  // Skip topic check if topicSlug === lessonSlug (backward compatibility with old URLs)
  if (normalizedTopic && normalizedTopic !== normalizedLesson) {
    const allowedTopics = FEATURE_FLAGS.CAROUSEL_MODE.topics;
    if (allowedTopics.length > 0 && !allowedTopics.includes('*')) {
      if (!allowedTopics.includes(normalizedTopic)) {
        return false;
      }
    }
  }

  // Check level filter
  const allowedLevels = FEATURE_FLAGS.CAROUSEL_MODE.levels;
  if (allowedLevels.length > 0 && !allowedLevels.includes('*')) {
    if (!allowedLevels.includes(normalizedLevel)) {
      return false;
    }
  }

  // Check subject filter
  const allowedSubjects = FEATURE_FLAGS.CAROUSEL_MODE.subjects;
  if (allowedSubjects.length > 0 && !allowedSubjects.includes('*')) {
    if (!allowedSubjects.includes(normalizedSubject)) {
      return false;
    }
  }

  return true;
}

/**
 * Get carousel mode configuration for admin/debugging
 */
export function getCarouselConfig() {
  return {
    ...FEATURE_FLAGS.CAROUSEL_MODE,
    envOverride: process.env.NEXT_PUBLIC_ENABLE_CAROUSEL,
  };
}

/**
 * Check if a campus has access to a specific feature
 */
export function hasCampusFeature(
  campus: 'primary' | 'jhs' | 'shs',
  feature: 'lessons' | 'virtualLabs' | 'arena'
): boolean {
  if (!FEATURE_FLAGS.V1_LAUNCH.enabled) return true; // Fallback to allow all if V1 flags disabled

  const campusKey = campus.toLowerCase() as 'primary' | 'jhs' | 'shs';
  const featureKey = feature === 'lessons' ? 'HasLessons' :
                     feature === 'virtualLabs' ? 'HasVirtualLabs' :
                     'HasArena';

  const flagKey = `${campusKey}${featureKey}` as keyof typeof FEATURE_FLAGS.V1_LAUNCH;
  return FEATURE_FLAGS.V1_LAUNCH[flagKey] as boolean;
}

/**
 * Get allowed features for a campus
 */
export function getCampusFeatures(campus: 'primary' | 'jhs' | 'shs') {
  return {
    lessons: hasCampusFeature(campus, 'lessons'),
    virtualLabs: hasCampusFeature(campus, 'virtualLabs'),
    arena: hasCampusFeature(campus, 'arena'),
  };
}

/**
 * Expansion helpers for planned rollout phases
 */
export const ROLLOUT_PHASES = {
  PHASE_1_SHS3_CORE: {
    subjects: ['mathematics'],
    levels: ['shs3'],
    topics: ['algebra'],
    lessons: [
      'quadratic-equations',
      'factorization',
      'completing-the-square',
      'quadratic-formula',
    ],
  },
  PHASE_2_SHS3_ALL_MATH: {
    subjects: ['mathematics'],
    levels: ['shs3'],
    topics: ['*'], // All topics
    lessons: ['*'], // All lessons
  },
  PHASE_3_ALL_SHS_MATH: {
    subjects: ['mathematics'],
    levels: ['shs1', 'shs2', 'shs3'],
    topics: ['*'],
    lessons: ['*'],
  },
  PHASE_4_ALL_MATH: {
    subjects: ['mathematics'],
    levels: ['jhs1', 'jhs2', 'jhs3', 'shs1', 'shs2', 'shs3'],
    topics: ['*'],
    lessons: ['*'],
  },
  PHASE_5_EXPAND_SUBJECTS: {
    subjects: ['mathematics', 'english', 'science'],
    levels: ['*'],
    topics: ['*'],
    lessons: ['*'],
  },
  PHASE_6_ALL_SUBJECTS: {
    subjects: ['*'],
    levels: ['*'],
    topics: ['*'],
    lessons: ['*'],
  },
};

/**
 * Apply a rollout phase to feature flags
 */
export function applyRolloutPhase(phase: keyof typeof ROLLOUT_PHASES) {
  const phaseConfig = ROLLOUT_PHASES[phase];
  FEATURE_FLAGS.CAROUSEL_MODE = {
    enabled: true,
    autostart: true,
    ...phaseConfig,
  };
}
