"""
Script to extract individual subjects from jhs-data.ts into separate files.
This automates the data splitting process for the architecture refactoring.
"""

import re
import os
from pathlib import Path

# Define subject boundaries (line numbers from jhs-data.ts)
# Line numbers are exact - found via grep search
SUBJECTS = [
    {
        'name': 'English Language',
        'slug': 'english-language',
        'start_line': 21,
        'end_line': 6353,  # Ends right before Mathematics starts
        'export_name': 'englishLanguageSubject'
    },
    {
        'name': 'Mathematics',
        'slug': 'core-mathematics',
        'start_line': 6354,
        'end_line': 7425,
        'export_name': 'mathematicsSubject'
    },
    {
        'name': 'Integrated Science',
        'slug': 'integrated-science',
        'start_line': 7426,
        'end_line': 7624,
        'export_name': 'integratedScienceSubject'
    },
    {
        'name': 'Social Studies',
        'slug': 'social-studies',
        'start_line': 7625,
        'end_line': 7827,
        'export_name': 'socialStudiesSubject'
    },
    {
        'name': 'Religious and Moral Education',
        'slug': 'rme',
        'start_line': 7828,
        'end_line': 8002,
        'export_name': 'rmeSubject'
    },
    {
        'name': 'Creative Arts & Design',
        'slug': 'creative-arts-design',
        'start_line': 8003,
        'end_line': 8185,
        'export_name': 'creativeArtsSubject'
    },
    {
        'name': 'Career Technology',
        'slug': 'career-technology',
        'start_line': 8186,
        'end_line': 8345,
        'export_name': 'careerTechnologySubject'
    },
    {
        'name': 'Computing',
        'slug': 'computing',
        'start_line': 8346,
        'end_line': 8537,
        'export_name': 'computingSubject'
    },
    {
        'name': 'Local Language',
        'slug': 'local-language',
        'start_line': 8538,
        'end_line': 8711,
        'export_name': 'localLanguageSubject'
    },
    {
        'name': 'French',
        'slug': 'french',
        'start_line': 8712,
        'end_line': 8890,
        'export_name': 'frenchSubject'
    },
    {
        'name': 'Arabic',
        'slug': 'arabic',
        'start_line': 8891,
        'end_line': 9001,  # Ends before closing bracket and helper functions
        'export_name': 'arabicSubject'
    },
]

SOURCE_FILE = r'c:\Users\asus\OneDrive\Desktop\smartjhs\src\lib\jhs-data.ts'
TARGET_DIR = r'c:\Users\asus\OneDrive\Desktop\smartjhs\src\lib\data\jhs\subjects'

def extract_subject(subject_config):
    """Extract a single subject from jhs-data.ts"""
    print(f"\n📦 Extracting {subject_config['name']}...")
    
    # Read the source file
    with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    # Extract the subject data
    start = subject_config['start_line'] - 1  # Convert to 0-indexed
    end = subject_config['end_line']
    subject_lines = lines[start:end]
    
    # Find the subject object declaration
    subject_data = ''.join(subject_lines)
    
    # Create the new file content
    file_content = f'''import {{ Subject }} from "@/types/subjects";

/**
 * {subject_config['name']} Curriculum Data
 * Extracted from jhs-data.ts as part of data architecture refactoring
 * 
 * Lines {subject_config['start_line']}-{subject_config['end_line']} from original file
 */

export const {subject_config['export_name']}: Subject = {subject_data}
'''
    
    # Write to new file
    target_file = os.path.join(TARGET_DIR, f"{subject_config['slug']}.ts")
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(file_content)
    
    print(f"   ✅ Created {subject_config['slug']}.ts ({len(subject_lines)} lines)")
    return target_file

def create_subjects_directory():
    """Create the subjects directory if it doesn't exist"""
    Path(TARGET_DIR).mkdir(parents=True, exist_ok=True)
    print(f"📁 Created directory: {TARGET_DIR}")

def validate_extraction():
    """Validate that extracted files are valid TypeScript"""
    print("\n🧪 Validating extracted files...")
    
    for subject in SUBJECTS:
        file_path = os.path.join(TARGET_DIR, f"{subject['slug']}.ts")
        
        if not os.path.exists(file_path):
            print(f"   ❌ Missing: {subject['slug']}.ts")
            continue
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Basic validation checks
        has_import = 'import' in content
        has_export = f"export const {subject['export_name']}" in content
        has_braces = content.count('{') == content.count('}')
        
        if has_import and has_export and has_braces:
            print(f"   ✅ Valid: {subject['slug']}.ts")
        else:
            print(f"   ⚠️  Issues found in {subject['slug']}.ts")
            if not has_import:
                print("      - Missing import statement")
            if not has_export:
                print("      - Missing export statement")
            if not has_braces:
                print("      - Unbalanced braces")

def generate_extraction_report():
    """Generate a report of what was extracted"""
    print("\n📊 Extraction Report:")
    print("=" * 60)
    
    total_lines = 0
    for subject in SUBJECTS:
        lines = subject['end_line'] - subject['start_line'] + 1
        total_lines += lines
        print(f"{subject['name']:30} {lines:6,} lines")
    
    print("=" * 60)
    print(f"{'TOTAL':30} {total_lines:6,} lines")
    print(f"\n✨ Created {len(SUBJECTS)} subject files")

def main():
    """Main extraction process"""
    print("🚀 JHS Data Architecture Refactoring")
    print("=" * 60)
    
    # Step 1: Create directory
    create_subjects_directory()
    
    # Step 2: Extract each subject
    print("\n📦 Extracting subjects...")
    for subject in SUBJECTS:
        try:
            extract_subject(subject)
        except Exception as e:
            print(f"   ❌ Error extracting {subject['name']}: {str(e)}")
    
    # Step 3: Validate
    validate_extraction()
    
    # Step 4: Generate report
    generate_extraction_report()
    
    print("\n✅ Extraction complete!")
    print("\n📝 Next steps:")
    print("   1. Review extracted files in src/lib/data/jhs/subjects/")
    print("   2. Run TypeScript compiler to check for errors")
    print("   3. Update imports in src/app/ files")
    print("   4. Test data loading with new loader.ts")

if __name__ == '__main__':
    main()
