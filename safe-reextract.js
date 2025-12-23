/**
 * SAFE RE-EXTRACTION - Copy subjects directly from original jhs-data.ts
 * This preserves the exact structure without any transformation errors
 */

const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, 'src', 'lib', 'jhs-data.ts');
const TARGET_DIR = path.join(__dirname, 'src', 'lib', 'data', 'jhs', 'subjects');
const BACKUP_DIR = path.join(__dirname, 'src', 'lib', 'data', 'jhs', 'subjects-backup');

// Subject boundaries (exact from jhs-data.ts)
const SUBJECTS = [
  {
    name: 'English Language',
    slug: 'english-language',
    startLine: 21,
    endLine: 6353,
    exportName: 'englishLanguageSubject',
    icon: 'Book'
  },
  {
    name: 'Mathematics',
    slug: 'core-mathematics',
    startLine: 6354,
    endLine: 7425,
    exportName: 'mathematicsSubject',
    icon: 'Calculator'
  },
  {
    name: 'Integrated Science',
    slug: 'integrated-science',
    startLine: 7426,
    endLine: 7624,
    exportName: 'integratedScienceSubject',
    icon: 'FlaskConical'
  },
  {
    name: 'Social Studies',
    slug: 'social-studies',
    startLine: 7625,
    endLine: 7827,
    exportName: 'socialStudiesSubject',
    icon: 'Globe'
  },
  {
    name: 'Religious and Moral Education',
    slug: 'rme',
    startLine: 7828,
    endLine: 8002,
    exportName: 'rmeSubject',
    icon: 'Users'
  },
  {
    name: 'Creative Arts & Design',
    slug: 'creative-arts-design',
    startLine: 8003,
    endLine: 8185,
    exportName: 'creativeArtsSubject',
    icon: 'Palette'
  },
  {
    name: 'Career Technology',
    slug: 'career-technology',
    startLine: 8186,
    endLine: 8345,
    exportName: 'careerTechnologySubject',
    icon: 'Briefcase'
  },
  {
    name: 'Computing',
    slug: 'computing',
    startLine: 8346,
    endLine: 8537,
    exportName: 'computingSubject',
    icon: 'Computer'
  },
  {
    name: 'Local Language',
    slug: 'local-language',
    startLine: 8538,
    endLine: 8711,
    exportName: 'localLanguageSubject',
    icon: 'Languages'
  },
  {
    name: 'French',
    slug: 'french',
    startLine: 8712,
    endLine: 8890,
    exportName: 'frenchSubject',
    icon: 'BookOpen'
  },
  {
    name: 'Arabic',
    slug: 'arabic',
    startLine: 8891,
    endLine: 9001,
    exportName: 'arabicSubject',
    icon: 'BookOpen'
  },
];

function backupExistingFiles() {
  console.log('📦 Creating backup of existing subject files...\n');
  
  if (fs.existsSync(TARGET_DIR)) {
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    
    const files = fs.readdirSync(TARGET_DIR).filter(f => f.endsWith('.ts'));
    for (const file of files) {
      const source = path.join(TARGET_DIR, file);
      const dest = path.join(BACKUP_DIR, file);
      fs.copyFileSync(source, dest);
    }
    console.log(`✅ Backed up ${files.length} files to subjects-backup/\n`);
  }
}

function safeExtractSubject(subjectConfig) {
  console.log(`📝 Extracting ${subjectConfig.name}...`);
  
  // Read source file
  const content = fs.readFileSync(SOURCE_FILE, 'utf-8');
  const lines = content.split('\n');
  
  // Extract exact lines (0-indexed)
  const startIdx = subjectConfig.startLine - 1;
  const endIdx = subjectConfig.endLine;
  const subjectLines = lines.slice(startIdx, endIdx);
  
  // Create file content with proper imports
  const fileContent = `import { ${subjectConfig.icon} } from 'lucide-react';
import type { Subject } from '@/types/subjects';

/**
 * ${subjectConfig.name} Curriculum Data
 * Extracted from jhs-data.ts lines ${subjectConfig.startLine}-${subjectConfig.endLine}
 * 
 * This file is part of the JHS data architecture refactoring.
 * See: DATA_ARCHITECTURE_MIGRATION.md
 */

export const ${subjectConfig.exportName}: Subject = ${subjectLines.join('\n').trim()};
`;
  
  // Write to file
  const targetFile = path.join(TARGET_DIR, `${subjectConfig.slug}.ts`);
  fs.writeFileSync(targetFile, fileContent, 'utf-8');
  
  const sizeKB = (fileContent.length / 1024).toFixed(2);
  console.log(`   ✅ ${subjectConfig.slug}.ts (${subjectLines.length} lines, ${sizeKB} KB)`);
}

function validateExtraction() {
  console.log('\n🧪 Validating extracted files...\n');
  
  let validCount = 0;
  let errorCount = 0;
  
  for (const subject of SUBJECTS) {
    const filePath = path.join(TARGET_DIR, `${subject.slug}.ts`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`   ❌ Missing: ${subject.slug}.ts`);
      errorCount++;
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Validation checks
    const hasImport = content.includes(`import { ${subject.icon} }`);
    const hasTypeImport = content.includes(`import type { Subject }`);
    const hasExport = content.includes(`export const ${subject.exportName}: Subject =`);
    const hasOpeningBrace = content.includes('= {');
    const hasClosingSemi = content.trim().endsWith('};');
    
    if (hasImport && hasTypeImport && hasExport && hasOpeningBrace && hasClosingSemi) {
      console.log(`   ✅ ${subject.slug}.ts - Valid structure`);
      validCount++;
    } else {
      console.log(`   ⚠️  ${subject.slug}.ts - Potential issues`);
      if (!hasImport) console.log('      - Missing icon import');
      if (!hasTypeImport) console.log('      - Missing type import');
      if (!hasExport) console.log('      - Missing export statement');
      if (!hasClosingSemi) console.log('      - Missing closing semicolon');
      errorCount++;
    }
  }
  
  return { validCount, errorCount };
}

function main() {
  console.log('🚀 SAFE Subject Re-extraction from Original File\n');
  console.log('='.repeat(60) + '\n');
  console.log('⚠️  SAFETY MEASURES:\n');
  console.log('   1. Backing up existing files before overwriting');
  console.log('   2. Extracting directly from original jhs-data.ts');
  console.log('   3. Original file remains untouched');
  console.log('   4. Can restore from backup if needed\n');
  console.log('='.repeat(60) + '\n');
  
  try {
    // Backup existing files
    backupExistingFiles();
    
    // Extract all subjects
    console.log('📦 Extracting subjects from original file...\n');
    for (const subject of SUBJECTS) {
      safeExtractSubject(subject);
    }
    
    // Validate
    const { validCount, errorCount } = validateExtraction();
    
    console.log('\n' + '='.repeat(60));
    console.log(`\n✅ Extraction complete!`);
    console.log(`   Valid files: ${validCount}/${SUBJECTS.length}`);
    console.log(`   Issues: ${errorCount}`);
    
    if (errorCount === 0) {
      console.log('\n🎉 All files extracted successfully!');
      console.log('\n📝 Next step: Run npm run typecheck');
    } else {
      console.log('\n⚠️  Some files may have issues. Review above.');
    }
    
    console.log('\n💾 Backup location: src/lib/data/jhs/subjects-backup/');
    console.log('   (Restore with: cp subjects-backup/* subjects/)');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    console.error('\n💾 Your original files are backed up in subjects-backup/');
    process.exit(1);
  }
}

main();
