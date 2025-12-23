#!/usr/bin/env node

/**
 * Pre-Push Check Script
 *
 * Runs all CI checks locally before pushing to GitHub.
 * This ensures the branch will pass GitHub Actions checks.
 *
 * Used by the Closer agent before creating the PR.
 */

import { execSync } from 'child_process';

const checks = [
  {
    name: 'Branch Name',
    cmd: 'node scripts/validate-branch-name.js',
    critical: true,
  },
  {
    name: 'TypeScript',
    cmd: 'npm run type-check',
    critical: true,
  },
  {
    name: 'ESLint',
    cmd: 'npm run lint',
    critical: true,
  },
  {
    name: 'Prettier',
    cmd: 'npm run format:check',
    critical: false, // Can auto-fix
  },
  {
    name: 'Tests',
    cmd: 'npm test -- --run',
    critical: true,
  },
  {
    name: 'Documentation',
    cmd: 'npm run docs:validate',
    critical: false, // Closer can create issues
  },
];

console.log('\n🔍 Running pre-push checks...\n');
console.log('=' . repeat(60) + '\n');

let allPassed = true;
let criticalFailed = false;
const results = [];

for (const check of checks) {
  process.stdout.write(`⏳ ${check.name}... `);

  try {
    execSync(check.cmd, { stdio: 'pipe' });
    console.log('✅ PASS');
    results.push({ ...check, passed: true });
  } catch (error) {
    console.log(check.critical ? '❌ FAIL' : '⚠️  WARN');
    results.push({ ...check, passed: false, error });
    allPassed = false;
    if (check.critical) {
      criticalFailed = true;
    }
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 Results Summary');
console.log('='.repeat(60) + '\n');

results.forEach(result => {
  const status = result.passed ? '✅' : result.critical ? '❌' : '⚠️ ';
  const suffix = !result.passed && !result.critical ? ' (non-blocking)' : '';
  console.log(`${status} ${result.name}${suffix}`);
});

console.log('\n' + '='.repeat(60));

if (criticalFailed) {
  console.log('\n❌ Critical checks failed. Please fix before pushing.\n');

  // Provide specific guidance
  const failedCritical = results.filter(r => !r.passed && r.critical);
  console.log('To fix:\n');
  failedCritical.forEach(check => {
    switch (check.name) {
      case 'Branch Name':
        console.log(`  ${check.name}: Rename branch to follow convention`);
        console.log('    git branch -m feature/<kebab-case-name>\n');
        break;
      case 'TypeScript':
        console.log(`  ${check.name}: Fix type errors`);
        console.log('    npm run type-check\n');
        break;
      case 'ESLint':
        console.log(`  ${check.name}: Fix linting errors`);
        console.log('    npm run lint:fix\n');
        break;
      case 'Tests':
        console.log(`  ${check.name}: Fix failing tests`);
        console.log('    npm test\n');
        break;
      default:
        console.log(`  ${check.name}: Run the check and fix issues`);
        console.log(`    ${check.cmd}\n`);
    }
  });

  process.exit(1);
} else if (!allPassed) {
  console.log('\n⚠️  Some non-critical checks have warnings.\n');
  console.log('The Closer agent should:');
  console.log('  - Run: npm run format (for Prettier)');
  console.log('  - Create GitHub issues for documentation gaps\n');
  console.log('You may proceed with push, but consider addressing warnings.\n');
  process.exit(0);
} else {
  console.log('\n✅ All checks passed! Ready to push.\n');
  console.log('Next steps:');
  console.log('  1. git push -u origin <branch-name>');
  console.log('  2. Create PR on GitHub\n');
  process.exit(0);
}
