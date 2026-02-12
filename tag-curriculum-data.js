/**
 * CURRICULUM DATA TAGGING SCRIPT
 * Purpose: Add curriculum metadata to existing lesson data
 * Target: west-african curriculum (JHS & SHS lessons)
 * 
 * Usage:
 *   node tag-curriculum-data.js --file src/lib/jhs-data.ts --backup
 *   node tag-curriculum-data.js --all --backup
 * 
 * What it does:
 *   1. Reads TypeScript lesson data files
 *   2. Adds curriculumId, region, examAlignment to lessons
 *   3. Preserves existing structure and formatting
 *   4. Creates .backup files before modifying
 */

const fs = require('fs');
const path = require('path');

// =========================================================================
// CONFIGURATION
// =========================================================================

const CURRICULUM_METADATA = {
  curriculumId: 'west-african',
  region: ['ghana', 'nigeria', 'sierra-leone', 'liberia', 'gambia'],
  examAlignment: ['BECE', 'WASSCE', 'NECO']
};

const FILES_TO_TAG = [
  'src/lib/jhs-data.ts',
  'src/lib/integrated-science-shs1-lessons-data.ts',
  'src/lib/integrated-science-shs2-lessons-data.ts',
  'src/lib/integrated-science-shs3-lessons-data.ts',
  'src/lib/english-shs1-lessons-data.ts',
  'src/lib/english-shs2-lessons-data.ts',
  'src/lib/english-shs1-lessons-data-pronunciation.ts'
];

const BACKUP_SUFFIX = '.backup';
const DRY_RUN = process.argv.includes('--dry-run');
const CREATE_BACKUP = process.argv.includes('--backup');
const TAG_ALL = process.argv.includes('--all');

// =========================================================================
// HELPER FUNCTIONS
// =========================================================================

/**
 * Create backup of file before modifying
 */
function createBackup(filePath) {
  const backupPath = filePath + BACKUP_SUFFIX;
  if (fs.existsSync(filePath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`   📋 Backup created: ${backupPath}`);
    return true;
  }
  return false;
}

/**
 * Check if lesson already has curriculum metadata
 */
function hasCurriculumMetadata(lessonText) {
  return lessonText.includes('curriculumId:') || 
         lessonText.includes('curriculumId :');
}

/**
 * Add curriculum metadata to a lesson object
 * Improved pattern matching for nested lesson structures
 */
function tagLessonObject(lessonText) {
  // Skip if already tagged
  if (hasCurriculumMetadata(lessonText)) {
    return { modified: false, text: lessonText };
  }

  // Improved pattern: Find lesson title field and insert after it
  // Handles various indentation and quote styles
  const titlePattern = /(\s+title:\s*['"][^'"]+['"],?\s*\n)/;
  
  if (titlePattern.test(lessonText)) {
    const match = lessonText.match(titlePattern);
    const indent = match[0].match(/^(\s+)/)?.[1] || '    ';
    
    const curriculumFields = 
      `${indent}// Curriculum metadata\n` +
      `${indent}curriculumId: '${CURRICULUM_METADATA.curriculumId}',\n` +
      `${indent}region: ${JSON.stringify(CURRICULUM_METADATA.region)},\n` +
      `${indent}examAlignment: ${JSON.stringify(CURRICULUM_METADATA.examAlignment)},\n`;
    
    const modifiedText = lessonText.replace(
      titlePattern,
      `$1${curriculumFields}`
    );
    
    return { modified: true, text: modifiedText };
  }

  return { modified: false, text: lessonText };
}

/**
 * Process a single file
 */
function processFile(filePath) {
  console.log(`\n📄 Processing: ${filePath}`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  File not found: ${filePath}`);
    return { success: false, reason: 'not_found' };
  }

  // Create backup if requested
  if (CREATE_BACKUP && !DRY_RUN) {
    createBackup(filePath);
  }

  // Read file content
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Count lessons to tag - count lesson objects (not quiz objects)
  // Simple heuristic: count lesson objects (imperfect but good enough)
  const lessonCount = (content.match(/\s+id:\s*["'][^"']+["'],/g) || []).length;
  console.log(`   📊 Estimated lessons: ${lessonCount}`);

  // Tag lessons using improved line-by-line approach
  let modifiedContent = content;
  let tagsAdded = 0;

  // Find all lesson objects by looking for the pattern:
  // - Has 'id:' field
  // - Has 'slug:' field  
  // - Has 'title:' field
  // - NOT already tagged with curriculumId
  // Insert curriculum metadata right after the title field
  
  const lines = content.split('\n');
  const result = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    result.push(line);
    
    // Check if this line contains a title field for a lesson
    if (/\s+title:\s*['"][^'"]+['"],?\s*$/.test(line)) {
      // Look back to confirm this is a lesson object (has id and slug)
      let isLesson = false;
      for (let j = Math.max(0, i - 5); j < i; j++) {
        const prevLine = lines[j];
        if (/\s+id:\s*['"][^'"]+['"],?\s*$/.test(prevLine)) {
          // Check for slug too
          for (let k = j; k <= i; k++) {
            if (/\s+slug:\s*['"][^'"]+['"],?\s*$/.test(lines[k])) {
              isLesson = true;
              break;
            }
          }
          break;
        }
      }
      
      // Check if next few lines already have curriculumId
      let alreadyTagged = false;
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (/curriculumId:/.test(lines[j])) {
          alreadyTagged = true;
          break;
        }
      }
      
      // If this is a lesson and not already tagged, insert curriculum metadata
      if (isLesson && !alreadyTagged) {
        const indent = line.match(/^(\s+)/)?.[1] || '    ';
        result.push(`${indent}// Curriculum metadata`);
        result.push(`${indent}curriculumId: '${CURRICULUM_METADATA.curriculumId}',`);
        result.push(`${indent}region: ${JSON.stringify(CURRICULUM_METADATA.region)},`);
        result.push(`${indent}examAlignment: ${JSON.stringify(CURRICULUM_METADATA.examAlignment)},`);
        tagsAdded++;
      }
    }
    
    i++;
  }
  
  modifiedContent = result.join('\n');

  if (DRY_RUN) {
    console.log(`   [DRY RUN] Would add curriculum metadata to ~${tagsAdded} lessons`);
    return { success: true, reason: 'dry_run', modified: true, tagsAdded };
  }

  // Write modified content back to file
  if (tagsAdded > 0) {
    fs.writeFileSync(filePath, modifiedContent, 'utf8');
    console.log(`   ✅ Tagged ${tagsAdded} lessons`);
    return { success: true, reason: 'tagged', modified: true, tagsAdded };
  } else {
    console.log(`   ⚠️  No lessons tagged (may need manual review)`);
    return { success: true, reason: 'no_changes', modified: false };
  }
}

/**
 * Validate TypeScript after tagging
 */
function validateTypeScript() {
  console.log('\n🔍 Running TypeScript validation...');
  
  const { execSync } = require('child_process');
  
  try {
    execSync('npm run typecheck', { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname)
    });
    console.log('   ✅ TypeScript validation passed');
    return true;
  } catch (error) {
    console.log('   ❌ TypeScript validation failed (review errors above)');
    return false;
  }
}

// =========================================================================
// MAIN EXECUTION
// =========================================================================

function main() {
  console.log('╔═══════════════════════════════════════════════════════════════╗');
  console.log('║   SmartClass24 Curriculum Data Tagging Script                ║');
  console.log('╚═══════════════════════════════════════════════════════════════╝');
  console.log(`\nMode: ${DRY_RUN ? '🔍 DRY RUN' : '✍️ EXECUTE'}`);
  console.log(`Backup: ${CREATE_BACKUP ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`\n${new Date().toISOString()}\n`);

  const results = [];

  // Determine which files to process
  let filesToProcess = [];
  
  if (TAG_ALL) {
    filesToProcess = FILES_TO_TAG;
  } else {
    // Check for --file argument
    const fileArgIndex = process.argv.indexOf('--file');
    if (fileArgIndex !== -1 && process.argv[fileArgIndex + 1]) {
      filesToProcess = [process.argv[fileArgIndex + 1]];
    } else {
      console.log('❌ Error: Please specify --file <path> or --all');
      console.log('\nUsage:');
      console.log('  node tag-curriculum-data.js --file src/lib/jhs-data.ts --backup');
      console.log('  node tag-curriculum-data.js --all --backup --dry-run');
      process.exit(1);
    }
  }

  console.log(`Processing ${filesToProcess.length} file(s)...`);

  // Process each file
  for (const filePath of filesToProcess) {
    const result = processFile(filePath);
    results.push({ filePath, ...result });
  }

  // Summary
  console.log('\n' + '═'.repeat(65));
  console.log('SUMMARY');
  console.log('═'.repeat(65));

  const successCount = results.filter(r => r.success).length;
  const modifiedCount = results.filter(r => r.modified).length;
  const totalTags = results.reduce((sum, r) => sum + (r.tagsAdded || 0), 0);

  console.log(`\n✅ Successful: ${successCount}/${results.length}`);
  console.log(`📝 Modified: ${modifiedCount}`);
  console.log(`🏷️  Total tags added: ${totalTags}`);

  // Detailed results
  console.log('\nDetails:');
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    const reason = result.reason || 'unknown';
    const tags = result.tagsAdded ? ` (${result.tagsAdded} tags)` : '';
    console.log(`  ${status} ${result.filePath} - ${reason}${tags}`);
  });

  // Run TypeScript validation if changes were made
  if (modifiedCount > 0 && !DRY_RUN) {
    const validationPassed = validateTypeScript();
    
    if (!validationPassed) {
      console.log('\n⚠️  TypeScript validation failed. Review errors and fix manually.');
      console.log('   You can restore backups if needed (.backup files)');
      process.exit(1);
    }
  }

  console.log('\n✅ TAGGING COMPLETE!');
  
  if (!DRY_RUN && modifiedCount > 0) {
    console.log('\nNext steps:');
    console.log('  1. Review changes: git diff');
    console.log('  2. Test locally: npm run dev');
    console.log('  3. Run migration script: node migrate-curriculum-to-firestore.js --dry-run');
    console.log('  4. Commit changes: git add -A && git commit -m "Add curriculum metadata to lesson data"');
  }
  
  console.log('');
}

// Run script
if (require.main === module) {
  main();
}

module.exports = {
  tagLessonObject,
  hasCurriculumMetadata,
  processFile
};
