/**
 * CURRICULUM ADAPTER TEST EXAMPLES
 * Run this file to verify content transformations work correctly
 * 
 * Usage:
 * 1. Open browser console at: http://localhost:9002/?tenant=wisdomwarehouse
 * 2. Import and run test functions
 * 3. Verify Ghana → US transformations in output
 */

import { contentAdapter } from './curriculum-content-adapter';
import type { Lesson, Quiz, McqQuiz, TrueFalseQuiz } from '@/lib/types';
import type { TenantConfig } from '@/tenancy/types';

// =========================================================================
// MOCK DATA FOR TESTING
// =========================================================================

const MOCK_WISDOM_WAREHOUSE_TENANT: TenantConfig = {
  id: 'wisdomwarehouse',
  slug: 'wisdomwarehouse',
  name: 'Wisdom Warehouse International',
  market: 'middle-east',
  curriculum: {
    system: 'alternative-holistic',
    examSystems: [],
    gradeLevels: ['K-12'],
  },
  branding: {
    name: 'Wisdom Warehouse',
    logoUrl: '/wisdomwarehouse-logo.png',
    primaryColor: '#2563eb',
    accentColor: '#1e40af',
    domain: 'smartclass24.com',
    supportEmail: 'support@wisdomwarehouse.com',
  },
  features: {
    enableJHSCampus: false,
    enableSHSCampus: false,
    enableUniversityCampus: true,
    enableVirtualLabs: true,
    enableArenaChallenge: true,
    enableLocalization: false,
    enableParentDashboard: true,
    enableB2BOnly: true,
  },
  content: {
    curriculumLabel: 'Holistic & Personalized Learning',
    subjectsEnabled: ['Mathematics', 'Science', 'English'],
  },
  license: {
    tier: 'enterprise',
    maxStudents: 500,
  },
  status: 'active',
};

const MOCK_SMARTCLASS24_TENANT: TenantConfig = {
  id: 'smartclass24',
  slug: 'smartclass24',
  name: 'SmartClass24',
  market: 'west-africa',
  curriculum: {
    system: 'west-african',
    examSystems: ['WASSCE', 'BECE'],
    gradeLevels: ['JHS', 'SHS'],
  },
  branding: {
    name: 'SmartClass24',
    logoUrl: '/logo.png',
    primaryColor: '#10b981',
    accentColor: '#047857',
    domain: 'smartclass24.com',
    supportEmail: 'support@smartclass24.com',
  },
  features: {
    enableJHSCampus: true,
    enableSHSCampus: true,
    enableUniversityCampus: false,
    enableVirtualLabs: true,
    enableArenaChallenge: true,
    enableLocalization: true,
    enableParentDashboard: true,
    enableB2BOnly: false,
  },
  content: {
    curriculumLabel: 'West African Curriculum',
    subjectsEnabled: ['Mathematics', 'Integrated Science', 'English', 'Social Studies'],
  },
  license: {
    tier: 'standard',
    maxStudents: 10000,
  },
  status: 'active',
};

const MOCK_LESSON: Lesson = {
  id: 'test-lesson-1',
  slug: 'ghana-economy',
  title: 'Understanding Ghana\'s Economy',
  curriculumId: 'west-african',
  region: ['ghana', 'west-africa'],
  examAlignment: ['BECE'],
  objectives: [
    'Understand how the cedi is used in Ghana',
    'Learn about trade in Accra and Kumasi',
    'Prepare for BECE economics questions',
  ],
  introduction: 'In Ghana, people use cedis (GH₵) to buy goods at the market. The capital city, Accra, is the main commercial hub. Students take the BECE exam in JHS 3.',
  keyConcepts: [
    {
      title: 'Currency in Ghana',
      content: 'Ghanaians use the cedi as their official currency. 1 cedi = 100 pesewas. You can buy groundnuts at the chop bar for 5 cedis.',
    },
    {
      title: 'Transport and Trade',
      content: 'People use tro-tros to travel from Kumasi to the lorry park in Accra. This helps business across Ghana.',
    },
  ],
  activities: {
    type: 'quiz',
    questions: [],
  },
  pastQuestions: [
    {
      question: 'Calculate how many cedis you need to buy 3 items at 2.50 cedis each in a chop bar in Accra.',
      solution: 'Total = 3 × 2.50 cedis = 7.50 cedis',
    },
  ],
  summary: 'Ghana\'s economy uses the cedi. Students in JHS prepare for the BECE exam to advance to SHS.',
  endOfLessonQuiz: [
    {
      id: 'q1',
      type: 'mcq',
      question: 'What currency is used in Ghana?',
      options: ['Dollar', 'Cedi', 'Naira', 'Pound'],
      answer: 'Cedi',
      explanation: 'Ghana uses the cedi (GH₵) as its official currency.',
      curriculumId: 'west-african',
      region: ['ghana'],
      examAlignment: ['BECE'],
    } as McqQuiz,
    {
      id: 'q2',
      type: 'truefalse',
      statement: 'Students in Ghana take the BECE exam at the end of JHS 3.',
      answer: 'true',
      reason: 'The Basic Education Certificate Examination (BECE) is taken by all JHS 3 students in Ghana.',
      curriculumId: 'west-african',
      region: ['ghana'],
      examAlignment: ['BECE'],
    } as TrueFalseQuiz,
  ],
};

// =========================================================================
// TEST FUNCTIONS
// =========================================================================

export function testLessonTransformation() {
  console.log('='.repeat(80));
  console.log('TEST: Lesson Transformation');
  console.log('='.repeat(80));
  
  // Test with SmartClass24 (no transformation)
  console.log('\n📚 SmartClass24 Tenant (Original Content):');
  const sc24Lesson = contentAdapter.adaptLessonForTenant(MOCK_LESSON, MOCK_SMARTCLASS24_TENANT);
  console.log('Title:', sc24Lesson.title);
  console.log('Introduction:', sc24Lesson.introduction);
  console.log('Key Concept 1:', sc24Lesson.keyConcepts[0].content.substring(0, 100) + '...');
  
  // Test with Wisdom Warehouse (with transformation)
  console.log('\n🏢 Wisdom Warehouse Tenant (Adapted Content):');
  const wwLesson = contentAdapter.adaptLessonForTenant(MOCK_LESSON, MOCK_WISDOM_WAREHOUSE_TENANT);
  console.log('Title:', wwLesson.title);
  console.log('Introduction:', wwLesson.introduction);
  console.log('Key Concept 1:', wwLesson.keyConcepts[0].content.substring(0, 100) + '...');
  
  // Check transformations
  console.log('\n✅ Transformation Verification:');
  console.log('Ghana removed:', !wwLesson.introduction.includes('Ghana'));
  console.log('Cedi → Dollar:', wwLesson.introduction.includes('dollar'));
  console.log('JHS → Grade:', wwLesson.introduction.includes('Grade'));
  console.log('BECE → Assessment:', wwLesson.objectives[2].includes('assessment'));
  
  return { sc24Lesson, wwLesson };
}

export function testQuizTransformation() {
  console.log('\n' + '='.repeat(80));
  console.log('TEST: Quiz Transformation');
  console.log('='.repeat(80));
  
  const quiz = MOCK_LESSON.endOfLessonQuiz![0] as McqQuiz;
  
  console.log('\n📝 Original Quiz (SmartClass24):');
  console.log('Question:', quiz.question);
  console.log('Explanation:', quiz.explanation);
  
  console.log('\n🎯 Adapted Quiz (Wisdom Warehouse):');
  const adaptedQuiz = contentAdapter.adaptQuizForTenant(quiz, MOCK_WISDOM_WAREHOUSE_TENANT) as McqQuiz;
  console.log('Question:', adaptedQuiz.question);
  console.log('Explanation:', adaptedQuiz.explanation);
  
  console.log('\n✅ Verification:');
  console.log('Ghana removed:', !adaptedQuiz.question.includes('Ghana'));
  console.log('Currency adapted:', adaptedQuiz.explanation?.includes('dollar'));
  
  return adaptedQuiz;
}

export function testTextTransformation() {
  console.log('\n' + '='.repeat(80));
  console.log('TEST: Text Transformation');
  console.log('='.repeat(80));
  
  const testCases = [
    'Students in Ghana use cedis at the chop bar.',
    'The BECE exam is taken in JHS 3 across Ghana.',
    'Travel from Accra to Kumasi costs 50 cedis by tro-tro.',
    'Ghanaians buy groundnuts and jollof rice at the market.',
    'The Ghana Education Service oversees WASSCE exams for SHS 3 students.',
  ];
  
  console.log('\n📋 Transformation Examples:\n');
  
  testCases.forEach((text, idx) => {
    const preview = contentAdapter.previewTransformation(text, 'wisdomwarehouse');
    console.log(`Example ${idx + 1}:`);
    console.log(`Original:    "${preview.original}"`);
    console.log(`Transformed: "${preview.transformed}"`);
    console.log('');
  });
}

export function testGradeLevelLabels() {
  console.log('\n' + '='.repeat(80));
  console.log('TEST: Grade Level Labels');
  console.log('='.repeat(80));
  
  const levels = ['JHS 1', 'JHS 2', 'JHS 3', 'SHS 1', 'SHS 2', 'SHS 3'];
  
  console.log('\n📊 SmartClass24 (Original):');
  levels.forEach(level => {
    const label = contentAdapter.getGradeLevelLabel(level, MOCK_SMARTCLASS24_TENANT);
    console.log(`${level} → ${label}`);
  });
  
  console.log('\n📊 Wisdom Warehouse (Adapted):');
  levels.forEach(level => {
    const label = contentAdapter.getGradeLevelLabel(level, MOCK_WISDOM_WAREHOUSE_TENANT);
    console.log(`${level} → ${label}`);
  });
}

export function testCurriculumLabels() {
  console.log('\n' + '='.repeat(80));
  console.log('TEST: Curriculum Labels');
  console.log('='.repeat(80));
  
  const sc24Label = contentAdapter.getCurriculumLabel(MOCK_SMARTCLASS24_TENANT);
  const wwLabel = contentAdapter.getCurriculumLabel(MOCK_WISDOM_WAREHOUSE_TENANT);
  
  console.log('\n📚 Curriculum Labels:');
  console.log(`SmartClass24:       "${sc24Label}"`);
  console.log(`Wisdom Warehouse:   "${wwLabel}"`);
}

export function testTransformationRules() {
  console.log('\n' + '='.repeat(80));
  console.log('TEST: Transformation Rules Inventory');
  console.log('='.repeat(80));
  
  const rules = contentAdapter.getTransformationRules('wisdomwarehouse');
  
  if (rules) {
    console.log('\n📖 Active Transformation Rules:\n');
    console.table(rules);
    console.log(`\nTotal Rules: ${Object.keys(rules).length}`);
  } else {
    console.log('No transformation rules for this tenant.');
  }
}

export function testPerformance() {
  console.log('\n' + '='.repeat(80));
  console.log('TEST: Performance Benchmarks');
  console.log('='.repeat(80));
  
  const iterations = 1000;
  
  // Test lesson transformation
  console.log(`\n⏱️  Transforming lesson ${iterations} times...`);
  const startLesson = performance.now();
  for (let i = 0; i < iterations; i++) {
    contentAdapter.adaptLessonForTenant(MOCK_LESSON, MOCK_WISDOM_WAREHOUSE_TENANT);
  }
  const endLesson = performance.now();
  const avgLesson = (endLesson - startLesson) / iterations;
  
  console.log(`Average time per lesson: ${avgLesson.toFixed(3)}ms`);
  
  // Test quiz transformation
  console.log(`\n⏱️  Transforming quiz ${iterations} times...`);
  const quiz = MOCK_LESSON.endOfLessonQuiz![0];
  const startQuiz = performance.now();
  for (let i = 0; i < iterations; i++) {
    contentAdapter.adaptQuizForTenant(quiz, MOCK_WISDOM_WAREHOUSE_TENANT);
  }
  const endQuiz = performance.now();
  const avgQuiz = (endQuiz - startQuiz) / iterations;
  
  console.log(`Average time per quiz: ${avgQuiz.toFixed(3)}ms`);
  
  // Test text transformation
  console.log(`\n⏱️  Transforming text ${iterations} times...`);
  const testText = 'Students in Ghana use cedis to buy items at the chop bar in Accra.';
  const startText = performance.now();
  for (let i = 0; i < iterations; i++) {
    contentAdapter.transformText(testText, 'wisdomwarehouse');
  }
  const endText = performance.now();
  const avgText = (endText - startText) / iterations;
  
  console.log(`Average time per text: ${avgText.toFixed(3)}ms`);
  
  console.log('\n✅ Performance Summary:');
  console.log(`Lesson transformation: ${avgLesson.toFixed(3)}ms (acceptable: < 10ms)`);
  console.log(`Quiz transformation: ${avgQuiz.toFixed(3)}ms (acceptable: < 5ms)`);
  console.log(`Text transformation: ${avgText.toFixed(3)}ms (acceptable: < 1ms)`);
}

// =========================================================================
// RUN ALL TESTS
// =========================================================================

export function runAllTests() {
  console.clear();
  console.log('🧪 CURRICULUM CONTENT ADAPTER - TEST SUITE');
  console.log('Starting comprehensive test suite...\n');
  
  try {
    testTextTransformation();
    testLessonTransformation();
    testQuizTransformation();
    testGradeLevelLabels();
    testCurriculumLabels();
    testTransformationRules();
    testPerformance();
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    console.log('\nNext Steps:');
    console.log('1. Integrate adapter into lesson display components');
    console.log('2. Test with real curriculum data (jhs-data.ts)');
    console.log('3. Deploy to production after local testing');
    console.log('4. Monitor Wisdom Warehouse feedback');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
  }
}

// =========================================================================
// EXPORT FOR BROWSER CONSOLE
// =========================================================================

if (typeof window !== 'undefined') {
  (window as any).curriculumAdapterTests = {
    runAllTests,
    testLessonTransformation,
    testQuizTransformation,
    testTextTransformation,
    testGradeLevelLabels,
    testCurriculumLabels,
    testTransformationRules,
    testPerformance,
  };
  
  console.log('✅ Curriculum Adapter Tests loaded!');
  console.log('Run: curriculumAdapterTests.runAllTests()');
}
