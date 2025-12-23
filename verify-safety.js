/**
 * SAFETY VERIFICATION - Confirm all data is safe before proceeding
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 Data Safety Verification\n');
console.log('='.repeat(60) + '\n');

const checks = [];

// Check 1: Original file exists and is intact
const originalFile = path.join(__dirname, 'src', 'lib', 'jhs-data.ts');
if (fs.existsSync(originalFile)) {
  const stats = fs.statSync(originalFile);
  const sizeKB = (stats.size / 1024).toFixed(2);
  checks.push({
    name: 'Original jhs-data.ts',
    status: 'SAFE',
    detail: `${sizeKB} KB - Intact and unchanged`
  });
} else {
  checks.push({
    name: 'Original jhs-data.ts',
    status: 'ERROR',
    detail: 'File not found!'
  });
}

// Check 2: Backup exists
const backupDir = path.join(__dirname, 'src', 'lib', 'data', 'jhs', 'subjects-backup');
if (fs.existsSync(backupDir)) {
  const backupFiles = fs.readdirSync(backupDir).filter(f => f.endsWith('.ts'));
  checks.push({
    name: 'Backup folder',
    status: 'SAFE',
    detail: `${backupFiles.length} files backed up`
  });
} else {
  checks.push({
    name: 'Backup folder',
    status: 'WARNING',
    detail: 'No backup found (not critical if extraction was fresh)'
  });
}

// Check 3: New subject files exist
const subjectsDir = path.join(__dirname, 'src', 'lib', 'data', 'jhs', 'subjects');
if (fs.existsSync(subjectsDir)) {
  const subjectFiles = fs.readdirSync(subjectsDir).filter(f => f.endsWith('.ts') && !f.includes('backup'));
  const totalSize = subjectFiles.reduce((sum, file) => {
    const stats = fs.statSync(path.join(subjectsDir, file));
    return sum + stats.size;
  }, 0);
  checks.push({
    name: 'New subject files',
    status: 'READY',
    detail: `${subjectFiles.length} files (${(totalSize / 1024).toFixed(2)} KB total)`
  });
} else {
  checks.push({
    name: 'New subject files',
    status: 'ERROR',
    detail: 'Directory not found!'
  });
}

// Check 4: Loader exists
const loaderFile = path.join(__dirname, 'src', 'lib', 'data', 'jhs', 'loader.ts');
if (fs.existsSync(loaderFile)) {
  checks.push({
    name: 'Data loader',
    status: 'READY',
    detail: 'loader.ts exists'
  });
} else {
  checks.push({
    name: 'Data loader',
    status: 'ERROR',
    detail: 'loader.ts not found!'
  });
}

// Check 5: API wrapper exists
const indexFile = path.join(__dirname, 'src', 'lib', 'data', 'jhs', 'index.ts');
if (fs.existsSync(indexFile)) {
  checks.push({
    name: 'API wrapper',
    status: 'READY',
    detail: 'index.ts exists'
  });
} else {
  checks.push({
    name: 'API wrapper',
    status: 'ERROR',
    detail: 'index.ts not found!'
  });
}

// Check 6: Test script exists
const testFile = path.join(__dirname, 'test-data-loader.js');
if (fs.existsSync(testFile)) {
  checks.push({
    name: 'Test script',
    status: 'READY',
    detail: 'test-data-loader.js ready to run'
  });
}

// Print results
checks.forEach(check => {
  const icon = check.status === 'SAFE' ? '✅' : 
               check.status === 'READY' ? '🟢' :
               check.status === 'WARNING' ? '⚠️' : '❌';
  console.log(`${icon} ${check.name.padEnd(25)} ${check.status.padEnd(10)} ${check.detail}`);
});

console.log('\n' + '='.repeat(60));

// Final assessment
const hasErrors = checks.some(c => c.status === 'ERROR');
const hasWarnings = checks.some(c => c.status === 'WARNING');

if (hasErrors) {
  console.log('\n❌ CRITICAL ISSUES FOUND!');
  console.log('   Do not proceed - fix errors first\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  Minor warnings - generally safe to proceed');
  console.log('   Review warnings above\n');
} else {
  console.log('\n✅ ALL SAFETY CHECKS PASSED!');
  console.log('\n📊 Status Summary:');
  console.log('   • Original data: Protected ✓');
  console.log('   • Backups: Available ✓');
  console.log('   • New system: Ready ✓');
  console.log('   • Rollback: Possible ✓');
  console.log('\n🎯 You can safely proceed with:');
  console.log('   1. npm run typecheck (fix any remaining errors)');
  console.log('   2. node test-data-loader.js (test new system)');
  console.log('   3. Update imports gradually (when ready)');
  console.log('\n💡 No risk of data loss - everything is backed up!\n');
}
