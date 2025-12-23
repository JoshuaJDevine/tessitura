#!/usr/bin/env node

/**
 * Documentation Validation Script
 * 
 * Checks that all components, hooks, and stores have corresponding .md files.
 * Follows the self-documenting architecture pattern.
 */

import { readdir, stat } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Directories to check
const CHECK_DIRS = [
  'src/components',
  'src/hooks',
  'src/store',
];

// Files to ignore
const IGNORE_PATTERNS = [
  /\.test\./,
  /\.spec\./,
  /\.types\./,
  /\.stories\./,
  /\.d\.ts$/, // TypeScript declaration files (auto-generated)
  /\\ui\\/, // UI components don't need docs (shadcn/ui) - Windows path
  /\/ui\//, // UI components don't need docs (shadcn/ui) - Unix path
  /main\.tsx$/,
  /index\.tsx$/,
  /index\.ts$/,
];

// Extensions to check
const CHECK_EXTENSIONS = ['.tsx', '.ts'];

async function getAllFiles(dir, baseDir = dir) {
  const files = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = fullPath.replace(baseDir + '/', '');
      
      if (entry.isDirectory()) {
        const subFiles = await getAllFiles(fullPath, baseDir);
        files.push(...subFiles);
      } else       if (entry.isFile()) {
        const ext = extname(entry.name);
        if (CHECK_EXTENSIONS.includes(ext)) {
          // Check if file should be ignored
          const shouldIgnore = IGNORE_PATTERNS.some(pattern => 
            pattern.test(fullPath)
          );
          if (!shouldIgnore) {
            files.push(fullPath);
          }
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return files;
}

function getExpectedDocPath(filePath) {
  const dir = dirname(filePath);
  const name = basename(filePath, extname(filePath));
  return join(dir, `${name}.md`);
}

async function fileExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function validateDocs() {
  console.log('🔍 Validating documentation...\n');
  
  let totalFiles = 0;
  let missingDocs = [];
  let hasDocs = [];
  
  for (const dir of CHECK_DIRS) {
    const fullDir = join(projectRoot, dir);
    const files = await getAllFiles(fullDir, fullDir);
    
    for (const file of files) {
      totalFiles++;
      const docPath = getExpectedDocPath(file);
      const exists = await fileExists(docPath);
      
      if (exists) {
        hasDocs.push(file);
      } else {
        missingDocs.push({
          file: file.replace(projectRoot + '/', ''),
          expectedDoc: docPath.replace(projectRoot + '/', ''),
        });
      }
    }
  }
  
  // Report results
  console.log(`📊 Results:\n`);
  console.log(`   Total files checked: ${totalFiles}`);
  console.log(`   Files with docs: ${hasDocs.length}`);
  console.log(`   Files missing docs: ${missingDocs.length}\n`);
  
  if (missingDocs.length > 0) {
    console.log('❌ Missing documentation:\n');
    missingDocs.forEach(({ file, expectedDoc }) => {
      console.log(`   ${file}`);
      console.log(`   → Expected: ${expectedDoc}\n`);
    });
    console.log('\n💡 Tip: Create .md files for each component/hook/store following the pattern in .cursor/rules/documentation-rules.mdc\n');
    process.exit(1);
  } else {
    console.log('✅ All files have documentation!\n');
    process.exit(0);
  }
}

validateDocs().catch(error => {
  console.error('Error validating docs:', error);
  process.exit(1);
});

