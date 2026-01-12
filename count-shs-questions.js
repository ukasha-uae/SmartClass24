const fs = require('fs');
const path = require('path');

const subjects = {
  'Core Subjects': [
    'core-mathematics',
    'integrated-science',
    'english-language',
    'social-studies'
  ],
  'Science Program': [
    'chemistry',
    'physics',
    'biology',
    'elective-mathematics'
  ],
  'Arts Program': [
    'literature',
    'history',
    'geography',
    'economics',
    'government'
  ],
  'Business Program': [
    'accounting',
    'business-management',
    'cost-accounting'
  ],
  'Visual Arts/Home Economics': [
    'general-knowledge-art',
    'food-nutrition'
  ],
  'Technical Program': [
    'technical-drawing',
    'building-construction',
    'woodwork',
    'metalwork',
    'electronics',
    'auto-mechanics'
  ]
};

const basePath = path.join(__dirname, 'src', 'lib', 'questions', 'shs');

const results = {};
let grandTotal = 0;

console.log('\n=================================================');
console.log('SHS QUESTION BANK - COMPREHENSIVE AUDIT REPORT');
console.log('=================================================\n');

for (const [program, subjectList] of Object.entries(subjects)) {
  console.log(`\n${program}`);
  console.log('='.repeat(program.length));
  
  let programTotal = 0;
  
  for (const subject of subjectList) {
    const filePath = path.join(basePath, `${subject}.ts`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  ❌ ${subject}.ts - FILE NOT FOUND`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Count question objects by matching id property
    const idMatches = content.match(/\bid:\s*['"`][^'"`]+['"`]/g);
    const count = idMatches ? idMatches.length : 0;
    
    // Check for correct ChallengeQuestion type
    const hasChallengeQuestionImport = content.includes('ChallengeQuestion');
    const hasCorrectExport = content.includes('ChallengeQuestion[]');
    
    let status = '✓';
    let issues = [];
    
    if (!hasChallengeQuestionImport) {
      status = '⚠';
      issues.push('Missing ChallengeQuestion import');
    }
    
    if (!hasCorrectExport) {
      status = '⚠';
      issues.push('Incorrect export type');
    }
    
    if (count === 0) {
      status = '❌';
      issues.push('NO QUESTIONS');
    }
    
    const subjectName = subject
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    console.log(`  ${status} ${subjectName.padEnd(30)} ${count.toString().padStart(3)} questions${issues.length > 0 ? ' - ' + issues.join(', ') : ''}`);
    
    programTotal += count;
    grandTotal += count;
  }
  
  console.log(`  ${'-'.repeat(45)}`);
  console.log(`  Program Total: ${programTotal} questions\n`);
}

console.log('\n=================================================');
console.log(`GRAND TOTAL: ${grandTotal} questions across all SHS subjects`);
console.log('=================================================\n');
