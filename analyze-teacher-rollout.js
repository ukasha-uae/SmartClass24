/**
 * SYSTEMATIC ROLLOUT - Add Enhanced TeacherVoice to ALL Virtual Labs
 * 
 * This script will:
 * 1. Find all lab files that don't have TeacherVoice
 * 2. Add the import statement
 * 3. Provide guidance on where to add the component
 * 4. Show examples from already-enhanced labs
 */

const fs = require('fs');
const path = require('path');

const LABS_DIR = path.join(__dirname, 'src', 'components', 'virtual-labs');

// Labs that already have TeacherVoice (enhanced versions)
const ENHANCED_LABS = [
  'food-test-lab-enhanced.tsx',
  'water-test-lab-enhanced.tsx',
  'refraction-lab-enhanced.tsx',
  'separation-techniques-lab-enhanced.tsx',
  'thermal-expansion-lab-enhanced.tsx',
  'work-energy-lab-enhanced.tsx',
  'transpiration-lab-enhanced.tsx'
];

function findLabsNeedingUpdate() {
  console.log('🔍 Scanning virtual labs directory...\n');
  
  const allFiles = fs.readdirSync(LABS_DIR)
    .filter(file => file.endsWith('.tsx') && file.includes('lab'))
    .filter(file => file !== 'TeacherVoice.tsx');
  
  const labsWithTeacher = [];
  const labsWithoutTeacher = [];
  
  for (const file of allFiles) {
    const filePath = path.join(LABS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (content.includes('TeacherVoice')) {
      labsWithTeacher.push(file);
    } else {
      labsWithoutTeacher.push(file);
    }
  }
  
  return { labsWithTeacher, labsWithoutTeacher, totalLabs: allFiles.length };
}

function analyzeLabStructure(filename) {
  const filePath = path.join(LABS_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check for common patterns
  const hasState = content.includes('useState');
  const hasSteps = content.includes('step') || content.includes('phase');
  const hasResults = content.includes('result') || content.includes('observation');
  const hasInteractions = content.includes('onClick') || content.includes('onDrop');
  
  return {
    hasState,
    hasSteps,
    hasResults,
    hasInteractions,
    lines: content.split('\n').length
  };
}

function generateRolloutPlan() {
  const { labsWithTeacher, labsWithoutTeacher, totalLabs } = findLabsNeedingUpdate();
  
  console.log('📊 Virtual Labs Analysis\n');
  console.log('='.repeat(70) + '\n');
  console.log(`Total Labs:              ${totalLabs}`);
  console.log(`✅ With TeacherVoice:     ${labsWithTeacher.length} (${((labsWithTeacher.length / totalLabs) * 100).toFixed(1)}%)`);
  console.log(`⏳ Need Update:           ${labsWithoutTeacher.length} (${((labsWithoutTeacher.length / totalLabs) * 100).toFixed(1)}%)`);
  console.log('\n' + '='.repeat(70) + '\n');
  
  console.log('✅ Labs Already Enhanced:\n');
  labsWithTeacher.forEach((lab, idx) => {
    console.log(`   ${idx + 1}. ${lab}`);
  });
  
  console.log('\n⏳ Labs Needing Update:\n');
  labsWithoutTeacher.slice(0, 20).forEach((lab, idx) => {
    const analysis = analyzeLabStructure(lab);
    console.log(`   ${idx + 1}. ${lab.padEnd(45)} (${analysis.lines} lines)`);
  });
  
  if (labsWithoutTeacher.length > 20) {
    console.log(`   ... and ${labsWithoutTeacher.length - 20} more\n`);
  }
  
  return { labsWithTeacher, labsWithoutTeacher };
}

function generateImplementationGuide() {
  console.log('\n📝 Implementation Guide\n');
  console.log('='.repeat(70) + '\n');
  
  console.log('STEP 1: Import TeacherVoice\n');
  console.log('Add this import at the top of each lab file:\n');
  console.log(`import { TeacherVoice } from './TeacherVoice';\n`);
  
  console.log('STEP 2: Add State for Teacher Messages\n');
  console.log('Inside your component, add:\n');
  console.log(`const [teacherMessage, setTeacherMessage] = useState('');\n`);
  
  console.log('STEP 3: Place TeacherVoice Component\n');
  console.log('Add the component at the bottom of your return statement:\n');
  console.log(`
<TeacherVoice 
  message={teacherMessage}
  autoPlay={true}
  theme="science"  // or 'math', 'accounting', 'default'
  teacherName="Dr. Science"
  emotion={/* dynamic based on state */}
  context={{
    /* add quiz scores, attempts, etc. */
  }}
  quickActions={[
    {
      label: 'Show Hint',
      onClick: () => {/* your hint logic */}
    },
    {
      label: 'Reset',
      onClick: () => {/* reset logic */}
    }
  ]}
/>
`);
  
  console.log('\nSTEP 4: Update Teacher Messages Dynamically\n');
  console.log('Examples of when to update teacher messages:\n');
  console.log(`
// When lab starts
setTeacherMessage('Welcome! Let\\'s begin this experiment...');

// When user completes a step
setTeacherMessage('Great work! Now let\\'s move to the next step...');

// When user makes an error
setTeacherMessage('Not quite right. Try again or click for a hint!');

// When quiz is completed
setTeacherMessage('Excellent! You scored ' + score + ' out of ' + total + '!');
`);
  
  console.log('\n='.repeat(70) + '\n');
}

function generateAutoUpdateScript(labsToUpdate) {
  console.log('🤖 Auto-Update Strategy\n');
  console.log('='.repeat(70) + '\n');
  
  console.log('Option 1: MANUAL UPDATE (Recommended for quality)\n');
  console.log('   Pros: Full control, custom messages per lab');
  console.log('   Cons: Time-consuming for ' + labsToUpdate.length + ' labs');
  console.log('   Estimate: ~10 minutes per lab = ' + Math.ceil(labsToUpdate.length * 10 / 60) + ' hours\n');
  
  console.log('Option 2: BATCH UPDATE (Fast but needs review)\n');
  console.log('   Pros: Updates all labs in minutes');
  console.log('   Cons: Generic messages, needs customization after');
  console.log('   Estimate: ~30 minutes total + review time\n');
  
  console.log('Option 3: HYBRID APPROACH (Best balance)\n');
  console.log('   1. Auto-add imports and basic TeacherVoice to all labs');
  console.log('   2. Manually customize messages for priority labs');
  console.log('   3. Generic messages for others initially');
  console.log('   Estimate: 1-2 hours\n');
  
  console.log('='.repeat(70) + '\n');
  
  console.log('💡 RECOMMENDED: Start with 5-10 high-priority labs manually,');
  console.log('   then use batch update for the rest.\n');
}

function identifyPriorityLabs() {
  console.log('⭐ Priority Labs (Most Used/Popular)\n');
  console.log('='.repeat(70) + '\n');
  
  const priorityLabs = [
    'acid-base-neutralization-lab.tsx',
    'enzyme-starch-lab.tsx',
    'cell-division-lab.tsx',
    'density-lab.tsx',
    'flame-test-lab.tsx',
    'hookes-law-lab.tsx',
    'photosynthesis-lab.tsx',
    'rusting-lab.tsx',
    'hydrogen-pop-test-lab.tsx',
    'litmus-test-lab.tsx'
  ];
  
  console.log('Suggested order for manual enhancement:\n');
  priorityLabs.forEach((lab, idx) => {
    const filePath = path.join(LABS_DIR, lab);
    if (fs.existsSync(filePath)) {
      console.log(`   ${idx + 1}. ${lab}`);
    }
  });
  
  console.log('\n💡 These are commonly accessed in the curriculum\n');
}

function main() {
  console.log('🚀 Virtual Labs TeacherVoice Rollout Plan\n');
  console.log('='.repeat(70) + '\n');
  
  const { labsWithTeacher, labsWithoutTeacher } = generateRolloutPlan();
  
  generateImplementationGuide();
  
  identifyPriorityLabs();
  
  generateAutoUpdateScript(labsWithoutTeacher);
  
  console.log('📋 Summary\n');
  console.log('='.repeat(70) + '\n');
  console.log(`✅ ${labsWithTeacher.length} labs already have TeacherVoice`);
  console.log(`⏳ ${labsWithoutTeacher.length} labs need update`);
  console.log(`📊 ${((labsWithTeacher.length / (labsWithTeacher.length + labsWithoutTeacher.length)) * 100).toFixed(1)}% complete\n`);
  
  console.log('🎯 NEXT STEPS:\n');
  console.log('   1. Review this plan');
  console.log('   2. Decide: Manual, Batch, or Hybrid approach');
  console.log('   3. Run: node batch-add-teacher.js (for automated approach)');
  console.log('   4. Or: Update manually starting with priority labs\n');
  
  // Save report
  const report = {
    timestamp: new Date().toISOString(),
    totalLabs: labsWithTeacher.length + labsWithoutTeacher.length,
    enhanced: labsWithTeacher,
    needsUpdate: labsWithoutTeacher,
    completionPercentage: ((labsWithTeacher.length / (labsWithTeacher.length + labsWithoutTeacher.length)) * 100).toFixed(1)
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'teacher-rollout-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('💾 Detailed report saved: teacher-rollout-report.json\n');
}

main();
