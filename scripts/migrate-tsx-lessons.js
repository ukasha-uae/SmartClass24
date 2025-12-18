/**
 * TSX Lesson Content Migration Script
 * Wraps template variables in localizeContent() for TSX files
 * 
 * Usage:
 *   node scripts/migrate-tsx-lessons.js --dry-run   # Preview changes
 *   node scripts/migrate-tsx-lessons.js --apply      # Apply changes
 */

const fs = require('fs');
const path = require('path');

// Find all TSX lesson files that were migrated
function findTsxLessonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
        findTsxLessonFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') && filePath.includes('lesson-intros')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

// Check if file needs localization imports
function needsLocalizationImport(content) {
  return !content.includes('import { useLocalization }') && 
         !content.includes('from \'@/hooks/useLocalization\'');
}

// Add localization import if needed
function addLocalizationImport(content) {
  // Find the import section (usually at the top)
  const importMatch = content.match(/(import.*?from.*?;[\s\n]*)+/);
  
  if (importMatch) {
    const lastImport = importMatch[0];
    const importStatement = "import { useLocalization } from '@/hooks/useLocalization';\n";
    return content.replace(lastImport, lastImport + importStatement);
  }
  
  // If no imports found, add at the very top after 'use client'
  if (content.includes("'use client'")) {
    return content.replace("'use client';", "'use client';\n\nimport { useLocalization } from '@/hooks/useLocalization';");
  }
  
  return "import { useLocalization } from '@/hooks/useLocalization';\n\n" + content;
}

// Add localizeContent destructuring to component
function addLocalizeContent(content) {
  // Find the component function
  const componentMatch = content.match(/export default function (\w+)\([^)]*\)\s*{/);
  
  if (componentMatch) {
    const hookStatement = "\n  const { localizeContent } = useLocalization();\n";
    return content.replace(componentMatch[0], componentMatch[0] + hookStatement);
  }
  
  return content;
}

// Wrap template variables in JSX with localizeContent
function wrapTemplateVariablesInJSX(content) {
  // Pattern: text with {{template}} inside JSX elements
  // This is tricky - we need to handle various cases:
  
  // Case 1: Inside JSX text content: <p>Text {{template}} more text</p>
  // Replace with: <p>{localizeContent("Text {{template}} more text")}</p>
  
  // Case 2: Inside JSX attributes like className (should skip these)
  
  let modifiedContent = content;
  let changeCount = 0;
  
  // Find all JSX elements with template variables in text content
  // Pattern: >([^<]*\{\{[^}]+\}\}[^<]*)<
  const jsxTextPattern = />([^<]*\{\{[^}]+\}\}[^<]*)</g;
  
  modifiedContent = modifiedContent.replace(jsxTextPattern, (match, textContent) => {
    // Skip if already wrapped in localizeContent
    if (match.includes('localizeContent(')) {
      return match;
    }
    
    // Skip if it's inside a script tag or code block
    if (match.includes('<script') || match.includes('<code')) {
      return match;
    }
    
    changeCount++;
    // Wrap the text content in localizeContent
    // Need to escape quotes in the content
    const escapedContent = textContent
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .trim();
    
    return `>{localizeContent("${escapedContent}")}<`;
  });
  
  return { modifiedContent, changeCount };
}

// Process a single TSX file
function processTsxFile(filePath, apply = false) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let changes = [];
  
  // Check if file has template variables
  if (!content.includes('{{')) {
    return { modified: false, changes: [] };
  }
  
  // Step 1: Add localization import if needed
  if (needsLocalizationImport(content)) {
    content = addLocalizationImport(content);
    modified = true;
    changes.push('Added localization import');
  }
  
  // Step 2: Add localizeContent hook if not present
  if (!content.includes('const { localizeContent }') && !content.includes('localizeContent')) {
    content = addLocalizeContent(content);
    modified = true;
    changes.push('Added localizeContent hook');
  }
  
  // Step 3: Wrap template variables in localizeContent
  const { modifiedContent, changeCount } = wrapTemplateVariablesInJSX(content);
  if (changeCount > 0) {
    content = modifiedContent;
    modified = true;
    changes.push(`Wrapped ${changeCount} template variables`);
  }
  
  // Apply changes if requested
  if (apply && modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  return { modified, changes };
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  
  console.log('\n🔧 TSX Lesson Migration Tool\n');
  console.log(`Mode: ${apply ? '✅ APPLY' : '🔍 DRY RUN'}\n`);
  
  const baseDir = path.join(process.cwd(), 'src', 'components', 'lesson-intros');
  const files = findTsxLessonFiles(baseDir);
  
  console.log(`Found ${files.length} TSX lesson files\n`);
  
  let modifiedCount = 0;
  let totalChanges = 0;
  
  for (const filePath of files) {
    const { modified, changes } = processTsxFile(filePath, apply);
    
    if (modified) {
      modifiedCount++;
      totalChanges += changes.length;
      
      const relativePath = path.relative(process.cwd(), filePath);
      console.log(`✏️  ${relativePath}`);
      for (const change of changes) {
        console.log(`   - ${change}`);
      }
      console.log();
    }
  }
  
  console.log('='.repeat(80));
  console.log(`📊 Summary:`);
  console.log(`   Files scanned: ${files.length}`);
  console.log(`   Files modified: ${modifiedCount}`);
  console.log(`   Total changes: ${totalChanges}`);
  console.log('='.repeat(80));
  
  if (!apply && modifiedCount > 0) {
    console.log('\n💡 Run with --apply to make these changes\n');
  }
}

main();
