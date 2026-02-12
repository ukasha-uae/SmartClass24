/**
 * FIRESTORE MIGRATION SCRIPT V2
 * Purpose: Migrate curriculum data from TypeScript files → Firestore collections
 * Target: west-african curriculum (JHS & SHS lessons)
 * 
 * Usage:
 *   node migrate-curriculum-to-firestore.js --curriculum west-african --dry-run
 *   node migrate-curriculum-to-firestore.js --curriculum west-african --execute
 * 
 * Requirements:
 *   - Firebase Admin SDK initialized
 *   - Service account key in environment
 *   - Firestore indexes deployed
 *   - Security rules updated with curriculum isolation
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
// NOTE: Update with your service account path
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://smartclass24-default-rtdb.firebaseio.com'
});

const db = admin.firestore();

// =========================================================================
// CONFIGURATION
// =========================================================================

const CURRICULUM_ID = 'west-african';
const BATCH_SIZE = 500; // Firestore batch write limit
const DRY_RUN = process.argv.includes('--dry-run');

const CURRICULUM_METADATA = {
  id: CURRICULUM_ID,
  name: 'West African (BECE/WASSCE)',
  description: 'Curriculum aligned with BECE (JHS) and WASSCE/NECO (SHS) exam systems across Ghana, Nigeria, Sierra Leone, Liberia, and Gambia',
  system: 'west-african',
  examSystems: ['BECE', 'WASSCE', 'NECO'],
  gradeLevels: ['JHS 1', 'JHS 2', 'JHS 3', 'SHS 1', 'SHS 2', 'SHS 3'],
  countries: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'],
  status: 'active',
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedAt: admin.firestore.FieldValue.serverTimestamp()
};

// =========================================================================
// DATA IMPORT
// =========================================================================

// Import JHS data (9000+ questions)
// NOTE: Update path based on your project structure
const jhsData = require('./src/lib/jhs-data.ts');

// Import SHS data files
const integratedScienceSHS1 = require('./src/lib/integrated-science-shs1-lessons-data.ts');
const coreMathsSHS1 = require('./src/lib/core-maths-shs1-lessons-data.ts');
// ... import other SHS subject files

// =========================================================================
// HELPER FUNCTIONS
// =========================================================================

/**
 * Add curriculum metadata to lesson object
 */
function enrichLessonWithCurriculum(lesson) {
  return {
    ...lesson,
    curriculumId: CURRICULUM_ID,
    region: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'],
    examAlignment: ['BECE', 'WASSCE', 'NECO'],
    versionId: '1.0.0',
    approvalStatus: 'approved',
    lastModified: admin.firestore.FieldValue.serverTimestamp(),
    author: 'system-migration'
  };
}

/**
 * Add curriculum metadata to quiz question
 */
function enrichQuestionWithCurriculum(question, lessonId, topicId, subjectId) {
  return {
    ...question,
    curriculumId: CURRICULUM_ID,
    lessonId,
    topicId,
    subjectId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    author: 'system-migration'
  };
}

/**
 * Create curriculum document in Firestore
 */
async function createCurriculumDocument() {
  console.log(`\n📚 Creating curriculum document: ${CURRICULUM_ID}`);
  
  if (DRY_RUN) {
    console.log('   [DRY RUN] Would create:', CURRICULUM_METADATA);
    return;
  }
  
  try {
    await db.collection('curriculums').doc(CURRICULUM_ID).set(CURRICULUM_METADATA);
    console.log('   ✅ Curriculum document created');
  } catch (error) {
    console.error('   ❌ Error creating curriculum:', error.message);
    throw error;
  }
}

/**
 * Migrate a single subject's content
 */
async function migrateSubject(subject) {
  console.log(`\n📖 Migrating subject: ${subject.name}`);
  
  const subjectData = {
    id: subject.id,
    slug: subject.slug,
    name: subject.name,
    description: subject.description,
    standardName: subject.name, // Can be customized per curriculum
    curriculumId: CURRICULUM_ID,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  if (DRY_RUN) {
    console.log('   [DRY RUN] Would create subject:', subjectData.name);
  } else {
    await db.collection('curriculums')
           .doc(CURRICULUM_ID)
           .collection('subjects')
           .doc(subject.id)
           .set(subjectData);
    console.log('   ✅ Subject created');
  }
  
  // Migrate topics for this subject
  for (const yearGroup of subject.curriculum) {
    for (const topic of yearGroup.topics) {
      await migrateTopic(subject.id, topic, yearGroup.year);
    }
  }
}

/**
 * Migrate a single topic's content
 */
async function migrateTopic(subjectId, topic, gradeLevel) {
  console.log(`   📝 Migrating topic: ${topic.title}`);
  
  const topicData = {
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    curriculumId: CURRICULUM_ID,
    gradeLevel,
    sequenceOrder: topic.sequenceOrder || 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  if (DRY_RUN) {
    console.log(`      [DRY RUN] Would create topic: ${topicData.title} (${topic.lessons.length} lessons)`);
  } else {
    await db.collection('curriculums')
           .doc(CURRICULUM_ID)
           .collection('subjects')
           .doc(subjectId)
           .collection('topics')
           .doc(topic.id)
           .set(topicData);
    console.log(`      ✅ Topic created (${topic.lessons.length} lessons)`);
  }
  
  // Migrate lessons for this topic
  for (const lesson of topic.lessons) {
    await migrateLesson(subjectId, topic.id, lesson);
  }
}

/**
 * Migrate a single lesson
 */
async function migrateLesson(subjectId, topicId, lesson) {
  const enrichedLesson = enrichLessonWithCurriculum(lesson);
  
  if (DRY_RUN) {
    console.log(`         [DRY RUN] Would create lesson: ${lesson.title}`);
    return;
  }
  
  try {
    await db.collection('curriculums')
           .doc(CURRICULUM_ID)
           .collection('subjects')
           .doc(subjectId)
           .collection('topics')
           .doc(topicId)
           .collection('lessons')
           .doc(lesson.id)
           .set(enrichedLesson);
    
    // Migrate quiz questions for this lesson
    if (lesson.endOfLessonQuiz?.length > 0) {
      await migrateQuizQuestions(lesson.endOfLessonQuiz, lesson.id, topicId, subjectId);
    }
    
    console.log(`         ✅ Lesson migrated: ${lesson.title} (${lesson.endOfLessonQuiz?.length || 0} questions)`);
  } catch (error) {
    console.error(`         ❌ Error migrating lesson ${lesson.id}:`, error.message);
  }
}

/**
 * Migrate quiz questions in batches
 */
async function migrateQuizQuestions(questions, lessonId, topicId, subjectId) {
  const batch = db.batch();
  let batchCount = 0;
  
  for (const question of questions) {
    const enrichedQuestion = enrichQuestionWithCurriculum(question, lessonId, topicId, subjectId);
    const questionRef = db.collection('quizzes')
                          .doc(CURRICULUM_ID)
                          .collection('questions')
                          .doc(); // Auto-generate ID
    
    batch.set(questionRef, enrichedQuestion);
    batchCount++;
    
    // Firestore batch limit is 500 writes
    if (batchCount >= BATCH_SIZE) {
      if (!DRY_RUN) {
        await batch.commit();
        console.log(`            💾 Committed batch of ${batchCount} questions`);
      }
      batchCount = 0;
    }
  }
  
  // Commit remaining questions
  if (batchCount > 0 && !DRY_RUN) {
    await batch.commit();
    console.log(`            💾 Committed final batch of ${batchCount} questions`);
  }
}

/**
 * Validate migration integrity
 */
async function validateMigration() {
  console.log('\n🔍 Validating migration...');
  
  if (DRY_RUN) {
    console.log('   [DRY RUN] Skipping validation');
    return;
  }
  
  try {
    // Count subjects
    const subjectsSnapshot = await db.collection('curriculums')
                                      .doc(CURRICULUM_ID)
                                      .collection('subjects')
                                      .get();
    console.log(`   ✅ Subjects migrated: ${subjectsSnapshot.size}`);
    
    // Count topics (collection group query)
    const topicsSnapshot = await db.collectionGroup('topics')
                                    .where('curriculumId', '==', CURRICULUM_ID)
                                    .get();
    console.log(`   ✅ Topics migrated: ${topicsSnapshot.size}`);
    
    // Count lessons (collection group query)
    const lessonsSnapshot = await db.collectionGroup('lessons')
                                     .where('curriculumId', '==', CURRICULUM_ID)
                                     .get();
    console.log(`   ✅ Lessons migrated: ${lessonsSnapshot.size}`);
    
    // Count quiz questions
    const questionsSnapshot = await db.collection('quizzes')
                                       .doc(CURRICULUM_ID)
                                       .collection('questions')
                                       .get();
    console.log(`   ✅ Quiz questions migrated: ${questionsSnapshot.size}`);
    
    console.log('\n✅ Migration validation complete!');
  } catch (error) {
    console.error('   ❌ Validation error:', error.message);
    throw error;
  }
}

// =========================================================================
// MAIN MIGRATION FLOW
// =========================================================================

async function main() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║   SmartClass24 Curriculum Migration to Firestore (V2)        ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log(`\nCurriculum: ${CURRICULUM_ID}`);
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (no changes)' : '✍️ EXECUTE (will write to Firestore)'}`);
  console.log(`\n${new Date().toISOString()}\n`);
  
  try {
    // Step 1: Create curriculum document
    await createCurriculumDocument();
    
    // Step 2: Migrate JHS subjects
    console.log('\n📚 MIGRATING JHS CURRICULUM');
    for (const subject of jhsData.subjects) {
      await migrateSubject(subject);
    }
    
    // Step 3: Migrate SHS subjects
    console.log('\n📚 MIGRATING SHS CURRICULUM');
    // TODO: Iterate through SHS subject files
    // await migrateSubject(integratedScienceSHS1);
    // await migrateSubject(coreMathsSHS1);
    
    // Step 4: Validate migration
    await validateMigration();
    
    console.log('\n✅ MIGRATION COMPLETE!');
    console.log('\nNext steps:');
    console.log('  1. Review Firestore console: https://console.firebase.google.com/project/smartclass24/firestore');
    console.log('  2. Test curriculum fetching in dev environment');
    console.log('  3. Update lesson components to use Firestore data');
    console.log('  4. Deploy Firestore indexes: firebase deploy --only firestore:indexes');
    console.log('  5. Deploy security rules: firebase deploy --only firestore:rules\n');
    
  } catch (error) {
    console.error('\n❌ MIGRATION FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
  
  process.exit(0);
}

// Run migration
if (require.main === module) {
  main();
}

module.exports = {
  enrichLessonWithCurriculum,
  enrichQuestionWithCurriculum
};
