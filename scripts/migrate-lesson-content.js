/**
 * Lesson Content Migration Script
 * Automatically converts hardcoded country-specific references to template variables
 * 
 * Usage:
 *   node scripts/migrate-lesson-content.js --dry-run          # Preview changes without applying
 *   node scripts/migrate-lesson-content.js --apply            # Apply changes to files
 *   node scripts/migrate-lesson-content.js --file path.tsx    # Migrate single file
 *   node scripts/migrate-lesson-content.js --subject math     # Migrate specific subject
 */

const fs = require('fs');
const path = require('path');

// Migration patterns: [regex, replacement, description]
const MIGRATION_PATTERNS = [
  // Currency patterns
  [/₵\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g, '{{currency}}$1', 'Ghana Cedi symbol'],
  [/GH₵\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g, '{{currency}}$1', 'GH₵ prefix'],
  [/GHS\s*(\d+(?:,\d{3})*(?:\.\d{2})?)/g, '{{currency}}$1', 'GHS currency code'],
  [/Cedis/gi, '{{currency:name}}', 'Cedis currency name'],
  [/Ghana Cedis/gi, '{{currency:full}}', 'Full currency name'],
  [/pesewas/gi, '{{currency:subunit}}', 'Currency subunit'],
  
  // Exam patterns
  [/\bBECE\b/g, '{{exam:primary}}', 'Primary exam'],
  [/\bWASSCE\b/g, '{{exam:secondary}}', 'Secondary exam'],
  [/Basic Education Certificate Examination/gi, '{{exam:primary:full}}', 'BECE full name'],
  [/West African Senior School Certificate Examination/gi, '{{exam:secondary:full}}', 'WASSCE full name'],
  
  // Academic level patterns
  [/\bJHS\s+([1-3])\b/g, '{{level:jhs:$1}}', 'JHS with class number'],
  [/\bJHS\b/g, '{{level:jhs}}', 'JHS general'],
  [/Junior High School/gi, '{{level:jhs:full}}', 'JHS full name'],
  [/\bSHS\s+([1-3])\b/g, '{{level:shs:$1}}', 'SHS with class number'],
  [/\bSHS\b/g, '{{level:shs}}', 'SHS general'],
  [/Senior High School/gi, '{{level:shs:full}}', 'SHS full name'],
  
  // Cities (capital)
  [/\bAccra\b/g, '{{city:capital}}', 'Capital city'],
  
  // Cities (major)
  [/\bKumasi\b/g, '{{city:second}}', 'Second largest city'],
  [/\bTamale\b/g, '{{city:third}}', 'Third largest city'],
  [/\bTakoradi\b/g, '{{city:major}}', 'Major city'],
  [/\bCape Coast\b/g, '{{city:major}}', 'Major city'],
  [/\bSunyani\b/g, '{{city:major}}', 'Major city'],
  
  // Landmarks
  [/\bLake Volta\b/g, '{{landmark:lake}}', 'Major lake'],
  [/\bKakum National Park\b/g, '{{landmark:park}}', 'National park'],
  [/\bCape Coast Castle\b/g, '{{landmark:castle}}', 'Historical castle'],
  [/\bElmina Castle\b/g, '{{landmark:castle}}', 'Historical castle'],
  [/\bMole National Park\b/g, '{{landmark:park}}', 'National park'],
  [/\bKwame Nkrumah Memorial Park\b/g, '{{landmark:memorial}}', 'Memorial site'],
  
  // Historical figures
  [/\bKwame Nkrumah\b/g, '{{figure:independence}}', 'Independence leader'],
  [/\bYaa Asantewaa\b/g, '{{figure:warrior}}', 'Historical warrior'],
  [/\bKofi Annan\b/g, '{{figure:diplomat}}', 'International figure'],
  
  // Institutions
  [/\bUniversity of Ghana\b/g, '{{institution:university:premier}}', 'Premier university'],
  [/\bKNUST\b/g, '{{institution:university:tech}}', 'Tech university'],
  [/\bGES\b/g, '{{institution:education}}', 'Education service'],
  [/Ghana Education Service/gi, '{{institution:education:full}}', 'Education service full'],
  
  // Foods
  [/\bJollof rice\b/gi, '{{food:rice}}', 'Popular rice dish'],
  [/\bBanku\b/g, '{{food:staple}}', 'Staple food'],
  [/\bFufu\b/g, '{{food:staple}}', 'Staple food'],
  [/\bWaakye\b/g, '{{food:popular}}', 'Popular dish'],
  [/\bKelewele\b/g, '{{food:snack}}', 'Popular snack'],
  
  // Resources
  [/\bcocoa\b/gi, '{{resource:cash_crop}}', 'Major cash crop'],
  [/\bgold\b/gi, '{{resource:mineral}}', 'Major mineral'],
  [/\bbauxite\b/gi, '{{resource:mineral}}', 'Mineral resource'],
  
  // Country name
  [/\bGhana\b/g, '{{country}}', 'Country name'],
  [/\bGhanaian\b/g, '{{country:adjective}}', 'Country adjective'],
];

// Statistics tracking
const stats = {
  filesScanned: 0,
  filesModified: 0,
  totalReplacements: 0,
  replacementsByType: {},
  errors: [],
};

/**
 * Scan a file and find all potential migrations
 */
function scanFile(filePath, content) {
  const replacements = [];
  
  for (const [regex, replacement, description] of MIGRATION_PATTERNS) {
    const matches = content.matchAll(new RegExp(regex.source, regex.flags));
    
    for (const match of matches) {
      replacements.push({
        original: match[0],
        replacement: match[0].replace(regex, replacement),
        description,
        position: match.index,
        line: content.substring(0, match.index).split('\n').length,
      });
    }
  }
  
  return replacements;
}

/**
 * Apply migrations to file content
 */
function migrateContent(content) {
  let newContent = content;
  let replacementCount = 0;
  
  for (const [regex, replacement, description] of MIGRATION_PATTERNS) {
    const matches = newContent.match(regex);
    if (matches) {
      newContent = newContent.replace(regex, replacement);
      replacementCount += matches.length;
      
      // Track by type
      const type = description.split(' ')[0];
      stats.replacementsByType[type] = (stats.replacementsByType[type] || 0) + matches.length;
    }
  }
  
  return { newContent, replacementCount };
}

/**
 * Recursively find all lesson files
 */
function findLessonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (!file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
        findLessonFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.json')) {
      // Include lesson files
      if (filePath.includes('lesson') || filePath.includes('quiz') || filePath.includes('content')) {
        fileList.push(filePath);
      }
    }
  }
  
  return fileList;
}

/**
 * Filter files by subject
 */
function filterBySubject(files, subject) {
  const subjectMap = {
    math: ['mathematics', 'math'],
    science: ['science', 'integrated-science', 'physics', 'chemistry', 'biology'],
    english: ['english', 'language'],
    social: ['social-studies', 'history', 'geography'],
  };
  
  const keywords = subjectMap[subject.toLowerCase()] || [subject.toLowerCase()];
  
  return files.filter(file => 
    keywords.some(keyword => file.toLowerCase().includes(keyword))
  );
}

/**
 * Generate report
 */
function generateReport(dryRun) {
  console.log('\n' + '='.repeat(80));
  console.log('📊 LESSON CONTENT MIGRATION REPORT');
  console.log('='.repeat(80) + '\n');
  
  console.log(`Mode: ${dryRun ? '🔍 DRY RUN (no changes applied)' : '✅ APPLIED'}`);
  console.log(`Files Scanned: ${stats.filesScanned}`);
  console.log(`Files Modified: ${stats.filesModified}`);
  console.log(`Total Replacements: ${stats.totalReplacements}\n`);
  
  if (Object.keys(stats.replacementsByType).length > 0) {
    console.log('Replacements by Type:');
    console.log('-'.repeat(80));
    for (const [type, count] of Object.entries(stats.replacementsByType).sort((a, b) => b[1] - a[1])) {
      console.log(`  ${type.padEnd(20)} : ${count.toString().padStart(4)} replacements`);
    }
    console.log();
  }
  
  if (stats.errors.length > 0) {
    console.log('⚠️  Errors:');
    console.log('-'.repeat(80));
    for (const error of stats.errors) {
      console.log(`  ${error}`);
    }
    console.log();
  }
  
  console.log('='.repeat(80) + '\n');
}

/**
 * Main migration function
 */
function migrate(options = {}) {
  const {
    dryRun = true,
    singleFile = null,
    subject = null,
    baseDir = path.join(process.cwd(), 'src'),
  } = options;
  
  console.log('🚀 Starting lesson content migration...\n');
  
  // Get files to migrate
  let files = [];
  if (singleFile) {
    files = [singleFile];
  } else {
    files = findLessonFiles(baseDir);
    
    if (subject) {
      files = filterBySubject(files, subject);
      console.log(`📚 Filtering by subject: ${subject}`);
    }
  }
  
  console.log(`📁 Found ${files.length} lesson files to scan\n`);
  
  // Process each file
  for (const filePath of files) {
    try {
      stats.filesScanned++;
      
      const content = fs.readFileSync(filePath, 'utf8');
      const { newContent, replacementCount } = migrateContent(content);
      
      if (replacementCount > 0) {
        stats.filesModified++;
        stats.totalReplacements += replacementCount;
        
        console.log(`✏️  ${path.relative(process.cwd(), filePath)}`);
        console.log(`   ${replacementCount} replacements found`);
        
        if (!dryRun) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log('   ✅ Changes applied');
        }
        console.log();
      }
    } catch (error) {
      stats.errors.push(`${filePath}: ${error.message}`);
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
    }
  }
  
  // Generate report
  generateReport(dryRun);
  
  if (dryRun) {
    console.log('💡 To apply these changes, run with --apply flag');
  } else {
    console.log('✨ Migration complete!');
    console.log('🔍 Please review the changes and test the application');
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: !args.includes('--apply'),
  singleFile: args.includes('--file') ? args[args.indexOf('--file') + 1] : null,
  subject: args.includes('--subject') ? args[args.indexOf('--subject') + 1] : null,
};

// Show help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Lesson Content Migration Script
================================

Automatically converts hardcoded country-specific references to template variables.

Usage:
  node scripts/migrate-lesson-content.js [options]

Options:
  --dry-run           Preview changes without applying them (default)
  --apply             Apply changes to files
  --file <path>       Migrate a single file
  --subject <name>    Migrate specific subject (math, science, english, social)
  --help, -h          Show this help message

Examples:
  # Preview all changes
  node scripts/migrate-lesson-content.js --dry-run

  # Apply changes to all lessons
  node scripts/migrate-lesson-content.js --apply

  # Migrate only Math lessons
  node scripts/migrate-lesson-content.js --subject math --apply

  # Migrate single file
  node scripts/migrate-lesson-content.js --file src/lessons/math/percentages.tsx --apply

Pattern Examples:
  ₵50              →  {{currency}}50
  BECE             →  {{exam:primary}}
  JHS 2            →  {{level:jhs:2}}
  Accra            →  {{city:capital}}
  Lake Volta       →  {{landmark:lake}}
  Ghana            →  {{country}}
  `);
  process.exit(0);
}

// Run migration
migrate(options);
