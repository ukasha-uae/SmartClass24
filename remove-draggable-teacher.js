const fs = require('fs');
const path = require('path');

const labsDir = path.join(__dirname, 'src', 'components', 'virtual-labs');

// Files with the draggable teacher pattern
const filesToFix = [
    'metal-acid-reaction-lab-enhanced.tsx',
    'magnetic-field-lab-enhanced.tsx',
    'hookes-law-lab-enhanced.tsx',
    'heat-transfer-lab-enhanced.tsx',
    'expansion-of-air-lab-enhanced.tsx',
    'evaporation-lab-enhanced.tsx',
    'condensation-lab-enhanced.tsx'
];

console.log('🔍 Removing draggable teacher wrapper from labs...\n');

filesToFix.forEach(filename => {
    const filePath = path.join(labsDir, filename);
    
    if (!fs.existsSync(filePath)) {
        console.log(`⏭️  Skipped: ${filename} (file not found)`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern to match the draggable teacher wrapper
    const draggablePattern = /\s*{\/\* Draggable Teacher Voice \*\/}\s*<motion\.div\s+drag\s+dragMomentum={false}\s+dragElastic={0}\s+dragConstraints={{[^}]+}}\s+onDragEnd={\([^)]+\)\s*=>\s*{\s*setTeacherPosition\([^)]+\);\s*}}\s+initial={{[^}]+}}\s+style={{[^}]+}}\s+className="[^"]*"\s*>\s*<Card className="[^"]*">\s*<CardHeader[^>]*>\s*<div className="[^"]*">\s*<GripVertical[^\/]*\/>\s*<CardTitle[^>]*>Teacher Guide \(Drag to Move\)<\/CardTitle>\s*<\/div>\s*<\/CardHeader>\s*<CardContent[^>]*>\s*<TeacherVoice\s+message={teacherMessage}\s+onComplete={handleTeacherComplete}\s*\/>\s*<\/CardContent>\s*<\/Card>\s*<\/motion\.div>/gs;
    
    // Simpler replacement - just add TeacherVoice directly
    const replacement = `\n            {/* Teacher Voice */}\n            <TeacherVoice \n                message={teacherMessage}\n                onComplete={handleTeacherComplete}\n            />`;
    
    const originalLength = content.length;
    content = content.replace(draggablePattern, replacement);
    
    if (content.length !== originalLength) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${filename}`);
    } else {
        console.log(`⚠️  Pattern not found: ${filename} (may need manual review)`);
    }
});

console.log('\n✨ Done! Draggable teacher wrappers removed.');
console.log('📝 TeacherVoice component now displays directly with Phase 2 enhancements.');
