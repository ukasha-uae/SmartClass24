/**
 * Lesson Audit Script
 * Scans all lesson content and evaluates carousel readiness
 * 
 * Usage: node scripts/audit-lessons.js
 */

const fs = require('fs');
const path = require('path');

// Validation logic (duplicated from lessonValidator.ts for Node.js)
function validateLesson(lessonData) {
  const errors = [];
  const warnings = [];
  const recommendations = [];

  if (!lessonData.objectives || lessonData.objectives.length === 0) {
    errors.push('No learning objectives defined');
  }

  if (!lessonData.content || lessonData.content.length === 0) {
    errors.push('No content sections defined');
  }

  // Check content sections
  if (lessonData.content) {
    lessonData.content.forEach((section, index) => {
      if (!section.title) {
        warnings.push(`Section ${index + 1} missing title`);
      }
      if (section.text && section.text.length > 800) {
        warnings.push(`Section ${index + 1} has long text (${section.text.length} chars)`);
      }
    });
  }

  // Check past questions
  if (!lessonData.pastQuestions || lessonData.pastQuestions.length === 0) {
    warnings.push('No past questions available');
  }

  // Calculate slides
  let slideCount = 0;
  if (lessonData.objectives) slideCount += 1;
  if (lessonData.content) slideCount += lessonData.content.length;
  if (lessonData.summary) slideCount += 1;
  if (lessonData.pastQuestions) slideCount += lessonData.pastQuestions.length;
  if (lessonData.activities) slideCount += lessonData.activities.length;
  if (lessonData.quiz) slideCount += 1;

  if (slideCount > 20) {
    warnings.push(`High slide count (${slideCount})`);
    recommendations.push('Consider splitting into multiple lessons');
  }

  const isValid = errors.length === 0;
  const carouselReady = isValid && warnings.length < 3;

  return {
    isValid,
    carouselReady,
    errors,
    warnings,
    recommendations,
    slideCount,
  };
}

function extractLessonData(content) {
  try {
    // Try to parse as JSON first
    if (content.trim().startsWith('{')) {
      return JSON.parse(content);
    }

    // Try to extract from TypeScript/JavaScript export
    const exportMatch = content.match(/export\s+(?:const|default)\s+\w+\s*=\s*({[\s\S]*});?\s*$/m);
    if (exportMatch) {
      // This is a simplified parser - in production, use a proper parser
      return eval('(' + exportMatch[1] + ')');
    }

    // Try to find lesson object pattern
    const lessonMatch = content.match(/{\s*title:/);
    if (lessonMatch) {
      const startIndex = content.indexOf('{', lessonMatch.index - 10);
      if (startIndex !== -1) {
        const extracted = content.substring(startIndex);
        return eval('(' + extracted.substring(0, extracted.lastIndexOf('}') + 1) + ')');
      }
    }

    return null;
  } catch (error) {
    return null;
  }
}

function scanDirectory(dir, results = { total: 0, carouselReady: 0, needsWork: 0, lessons: [] }) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return results;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules and hidden directories
      if (!file.startsWith('.') && file !== 'node_modules') {
        scanDirectory(fullPath, results);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
      // Skip component files and only process content files
      if (fullPath.includes('content') && !fullPath.includes('components')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lessonData = extractLessonData(content);

          if (lessonData && lessonData.title) {
            results.total++;
            const validation = validateLesson(lessonData);

            if (validation.carouselReady) {
              results.carouselReady++;
            } else {
              results.needsWork++;
            }

            results.lessons.push({
              path: fullPath.replace(path.join(__dirname, '..'), ''),
              title: lessonData.title || 'Untitled',
              level: lessonData.level || 'Unknown',
              subject: lessonData.subject || 'Unknown',
              validation,
            });
          }
        } catch (error) {
          // Skip files that can't be parsed
        }
      }
    }
  });

  return results;
}

function generateReport(results) {
  console.log('\n=================================');
  console.log('CAROUSEL READINESS AUDIT REPORT');
  console.log('=================================\n');

  console.log(`📊 SUMMARY`);
  console.log(`Total Lessons Found: ${results.total}`);
  console.log(`✅ Carousel Ready: ${results.carouselReady} (${((results.carouselReady / results.total) * 100).toFixed(1)}%)`);
  console.log(`⚠️  Needs Work: ${results.needsWork} (${((results.needsWork / results.total) * 100).toFixed(1)}%)`);
  console.log('');

  // Group by readiness
  const ready = results.lessons.filter(l => l.validation.carouselReady);
  const needsWork = results.lessons.filter(l => !l.validation.carouselReady);

  // Categorize by subject
  const bySubject = {};
  results.lessons.forEach(lesson => {
    const subject = lesson.subject;
    if (!bySubject[subject]) {
      bySubject[subject] = { total: 0, ready: 0, needsWork: 0 };
    }
    bySubject[subject].total++;
    if (lesson.validation.carouselReady) {
      bySubject[subject].ready++;
    } else {
      bySubject[subject].needsWork++;
    }
  });

  console.log(`📚 BY SUBJECT`);
  Object.keys(bySubject).sort().forEach(subject => {
    const stats = bySubject[subject];
    console.log(`  ${subject}: ${stats.ready}/${stats.total} ready (${stats.needsWork} needs work)`);
  });
  console.log('');

  // Show lessons that need work with recommendations
  if (needsWork.length > 0 && needsWork.length <= 20) {
    console.log(`⚠️  LESSONS NEEDING WORK (showing first 20):`);
    needsWork.slice(0, 20).forEach(lesson => {
      console.log(`\n  📝 ${lesson.title}`);
      console.log(`     Path: ${lesson.path}`);
      console.log(`     Slides: ${lesson.validation.slideCount}`);
      if (lesson.validation.errors.length > 0) {
        console.log(`     ❌ Errors: ${lesson.validation.errors.join(', ')}`);
      }
      if (lesson.validation.warnings.length > 0) {
        console.log(`     ⚠️  Warnings: ${lesson.validation.warnings.slice(0, 2).join(', ')}`);
      }
    });
  }

  console.log('\n=================================\n');

  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'CAROUSEL_READINESS_REPORT.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed report saved to: CAROUSEL_READINESS_REPORT.json\n`);
}

// Main execution
console.log('🔍 Starting lesson audit...\n');

const contentDir = path.join(__dirname, '..', 'src', 'content');
const results = scanDirectory(contentDir);

if (results.total === 0) {
  console.log('❌ No lessons found. Check your content directory structure.');
  console.log(`   Looking in: ${contentDir}`);
} else {
  generateReport(results);
}
