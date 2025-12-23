#!/usr/bin/env node

/**
 * Pre-Push Check Script
 * 
 * Runs all CI checks locally before pushing to GitHub.
 * This ensures the branch will pass GitHub Actions checks.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const checks = [
  { name: 'Documentation Validation', cmd: 'npm run docs:validate' },
  { name: 'TypeScript Type Check', cmd: 'npm run type-check' },
  { name: 'ESLint', cmd: 'npm run lint' },
  { name: 'Prettier Format Check', cmd: 'npm run format:check' },
  { name: 'Tests', cmd: 'npm test -- --run' },
];

console.log('🔍 Running pre-push checks...\n');

let allPassed = true;
const results = [];

for (const check of checks) {
  process.stdout.write(`⏳ ${check.name}... `);
  
  try {
    execSync(check.cmd, { stdio: 'pipe' });
    console.log('✅ PASS');
    results.push({ name: check.name, passed: true });
  } catch (error) {
    console.log('❌ FAIL');
    results.push({ name: check.name, passed: false, error });
    allPassed = false;
  }
}

console.log('\n' + '='.repeat(50));
console.log('📊 Results Summary:');
console.log('='.repeat(50) + '\n');

results.forEach(result => {
  const status = result.passed ? '✅' : '❌';
  console.log(`${status} ${result.name}`);
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('✅ All checks passed! Ready to push.\n');
  console.log('Next steps:');
  console.log('1. git push -u origin <branch-name>');
  console.log('2. Create PR on GitHub');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please fix issues before pushing.\n');
  process.exit(1);
}

