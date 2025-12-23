#!/usr/bin/env node

/**
 * Documentation Validation Script
 *
 * Checks that all components, hooks, and stores have corresponding .md files.
 * Used by the Closer agent and in pre-push checks.
 */

import { readdir, stat } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Directories to check - adjust for your project structure
const CHECK_DIRS = ['src/components', 'src/hooks', 'src/store', 'src/utils'];

// Files/patterns to ignore
const IGNORE_PATTERNS = [
  /\.test\./,
  /\.spec\./,
  /\.types\./,
  /\.stories\./,
  /\.d\.ts$/,
  /[\\\/]ui[\\\/]/, // shadcn/ui components
  /index\.(ts|tsx)$/,
  /main\.(ts|tsx)$/,
  /vite\.config/,
  /tailwind\.config/,
  /postcss\.config/,
];

// Extensions to check
const CODE_EXTENSIONS = ['.tsx', '.ts'];

async function getAllCodeFiles(dir, baseDir = dir) {
  const files = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await getAllCodeFiles(fullPath, baseDir);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        const ext = extname(entry.name);
        if (CODE_EXTENSIONS.includes(ext)) {
          const shouldIgnore = IGNORE_PATTERNS.some(pattern => pattern.test(fullPath));
          if (!shouldIgnore) {
            files.push(fullPath);
          }
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist
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
  console.log('\n🔍 Validating documentation...\n');

  let totalFiles = 0;
  const missingDocs = [];
  const hasDocs = [];

  for (const dir of CHECK_DIRS) {
    const fullDir = join(projectRoot, dir);
    const files = await getAllCodeFiles(fullDir, fullDir);

    for (const file of files) {
      totalFiles++;
      const docPath = getExpectedDocPath(file);
      const exists = await fileExists(docPath);

      if (exists) {
        hasDocs.push(file);
      } else {
        missingDocs.push({
          file: file.replace(projectRoot, '').replace(/^[\\\/]/, ''),
          expectedDoc: docPath.replace(projectRoot, '').replace(/^[\\\/]/, ''),
        });
      }
    }
  }

  // Report results
  console.log('📊 Results:\n');
  console.log(`   Total files checked: ${totalFiles}`);
  console.log(`   Files with docs: ${hasDocs.length}`);
  console.log(`   Files missing docs: ${missingDocs.length}`);

  if (totalFiles === 0) {
    console.log('\n⚠️  No files found to check. Verify CHECK_DIRS in this script.\n');
    process.exit(0);
  }

  const coverage = ((hasDocs.length / totalFiles) * 100).toFixed(1);
  console.log(`   Documentation coverage: ${coverage}%\n`);

  if (missingDocs.length > 0) {
    console.log('❌ Missing documentation:\n');
    missingDocs.forEach(({ file, expectedDoc }) => {
      console.log(`   ${file}`);
      console.log(`   → Create: ${expectedDoc}\n`);
    });

    console.log('💡 To create documentation:');
    console.log('   1. Follow the template in .cursor/agents/documenter.md');
    console.log('   2. Or create GitHub issues: npm run create-issue -- --type=docs --file=<path>\n');

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
