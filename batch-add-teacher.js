/**
 * BATCH ADD TeacherVoice - Automated rollout to all labs
 * 
 * This script will:
 * 1. Add TeacherVoice import to labs that don't have it
 * 2. Add basic state management
 * 3. Insert TeacherVoice component at the end of return statement
 * 4. Add initial welcome message
 * 
 * SAFETY: Creates backup before modifying any file
 */

const fs = require('fs');
const path = require('path');

const LABS_DIR = path.join(__dirname, 'src', 'components', 'virtual-labs');
const BACKUP_DIR = path.join(__dirname, 'src', 'components', 'virtual-labs-backup-teacher');

// Load the rollout report
const report = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'teacher-rollout-report.json'), 'utf-8')
);

function createBackup() {
  console.log('📦 Creating backup of all lab files...\n');
  
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  const labFiles = fs.readdirSync(LABS_DIR).filter(f => f.endsWith('.tsx'));
  
  labFiles.forEach(file => {
    const source = path.join(LABS_DIR, file);
    const dest = path.join(BACKUP_DIR, file);
    fs.copyFileSync(source, dest);
  });
  
  console.log(`✅ Backed up ${labFiles.length} files to virtual-labs-backup-teacher/\n`);
}

function addTeacherVoiceImport(content) {
  // Check if import already exists
  if (content.includes("from './TeacherVoice'") || content.includes('from "@/components/virtual-labs/TeacherVoice"')) {
    return content;
  }
  
  // Find the last import statement
  const lines = content.split('\n');
  let lastImportIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ')) {
      lastImportIndex = i;
    }
    // Stop searching after we pass imports
    if (lastImportIndex > -1 && !lines[i].trim().startsWith('import') && lines[i].trim() !== '') {
      break;
    }
  }
  
  if (lastImportIndex > -1) {
    lines.splice(lastImportIndex + 1, 0, "import { TeacherVoice } from './TeacherVoice';");
    return lines.join('\n');
  }
  
  return content;
}

function addTeacherState(content) {
  // Check if state already exists
  if (content.includes('teacherMessage')) {
    return content;
  }
  
  // Find the component function declaration
  const lines = content.split('\n');
  let componentStartIndex = -1;
  let firstStateIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Find component declaration
    if ((line.includes('export default function') || line.includes('export function')) && 
        line.includes('Lab')) {
      componentStartIndex = i;
    }
    
    // Find first useState after component start
    if (componentStartIndex > -1 && line.includes('useState') && firstStateIndex === -1) {
      firstStateIndex = i;
      break;
    }
  }
  
  // Add state after first useState or after component declaration
  if (firstStateIndex > -1) {
    lines.splice(firstStateIndex + 1, 0, "  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\\'s explore together.');");
    return lines.join('\n');
  } else if (componentStartIndex > -1) {
    // Find opening brace of component
    for (let i = componentStartIndex; i < lines.length; i++) {
      if (lines[i].includes('{')) {
        lines.splice(i + 1, 0, "  const [teacherMessage, setTeacherMessage] = useState('Welcome to this experiment! Let\\'s explore together.');");
        break;
      }
    }
    return lines.join('\n');
  }
  
  return content;
}

function addTeacherComponent(content, labName) {
  // Check if TeacherVoice component already exists
  if (content.includes('<TeacherVoice')) {
    return content;
  }
  
  // Find the last closing div/fragment before the final export
  const lines = content.split('\n');
  let lastClosingIndex = -1;
  
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    
    // Find the closing of the main return statement
    if ((line.startsWith('</div>') || line.startsWith('</motion.div>') || line.startsWith('</>')) &&
        !line.includes('//')) {
      lastClosingIndex = i;
      break;
    }
  }
  
  if (lastClosingIndex > -1) {
    const indent = lines[lastClosingIndex].match(/^(\s*)/)[0];
    
    const teacherComponent = `
${indent}{/* Enhanced Teacher Voice with Phase 2 Features */}
${indent}<TeacherVoice 
${indent}  message={teacherMessage}
${indent}  autoPlay={true}
${indent}  theme="science"
${indent}  teacherName="Dr. Lab Instructor"
${indent}  emotion="explaining"
${indent}  quickActions={[
${indent}    {
${indent}      label: 'Reset Experiment',
${indent}      onClick: () => {
${indent}        // Add reset logic here
${indent}        setTeacherMessage('Experiment reset! Ready to start fresh.');
${indent}      }
${indent}    }
${indent}  ]}
${indent}/>
`;
    
    lines.splice(lastClosingIndex, 0, teacherComponent);
    return lines.join('\n');
  }
  
  return content;
}

function updateLab(filename) {
  console.log(`🔧 Updating ${filename}...`);
  
  const filePath = path.join(LABS_DIR, filename);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const originalLength = content.length;
  
  // Step 1: Add import
  content = addTeacherVoiceImport(content);
  
  // Step 2: Add state
  content = addTeacherState(content);
  
  // Step 3: Add component
  content = addTeacherComponent(content, filename.replace('.tsx', ''));
  
  // Write back
  fs.writeFileSync(filePath, content, 'utf-8');
  
  const added = content.length - originalLength;
  console.log(`   ✅ Updated (added ${added} characters)\n`);
  
  return added > 0;
}

function main() {
  console.log('🚀 Batch Adding TeacherVoice to All Labs\n');
  console.log('='.repeat(70) + '\n');
  
  // Create backup first
  createBackup();
  
  console.log('🔧 Updating labs...\n');
  
  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  for (const lab of report.needsUpdate) {
    try {
      const updated = updateLab(lab);
      if (updated) {
        successCount++;
      } else {
        skippedCount++;
        console.log(`   ⏭️  Skipped ${lab} (already has TeacherVoice)\n`);
      }
    } catch (error) {
      errorCount++;
      console.log(`   ❌ Error updating ${lab}: ${error.message}\n`);
    }
  }
  
  console.log('='.repeat(70) + '\n');
  console.log('📊 Batch Update Complete!\n');
  console.log(`   ✅ Successfully updated: ${successCount}`);
  console.log(`   ⏭️  Skipped (already done): ${skippedCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📊 Total labs with TeacherVoice: ${report.enhanced.length + successCount}\n`);
  
  const newPercentage = ((report.enhanced.length + successCount) / report.totalLabs * 100).toFixed(1);
  console.log(`   🎯 Completion: ${newPercentage}%\n`);
  
  console.log('='.repeat(70) + '\n');
  console.log('📝 NEXT STEPS:\n');
  console.log('   1. Run: npm run dev (test the changes)');
  console.log('   2. Visit a few labs to verify TeacherVoice works');
  console.log('   3. Customize messages for priority labs');
  console.log('   4. Review backup at: virtual-labs-backup-teacher/\n');
  
  console.log('💾 ROLLBACK if needed:\n');
  console.log('   Copy-Item src\\components\\virtual-labs-backup-teacher\\* src\\components\\virtual-labs\\ -Force\n');
}

main();
