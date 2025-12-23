#!/usr/bin/env node

/**
 * Branch Name Validation Script
 *
 * Validates that the current branch follows naming conventions.
 * Used in pre-commit hooks and by agents.
 */

import { execSync } from 'child_process';

const VALID_PREFIXES = ['feature/', 'fix/', 'hotfix/', 'release/', 'chore/'];
const MAIN_BRANCHES = ['main', 'master', 'develop'];

function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  } catch (error) {
    console.error('Error getting current branch');
    process.exit(1);
  }
}

function isKebabCase(str) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
}

function validateBranchName(branch) {
  // Main branches are always valid
  if (MAIN_BRANCHES.includes(branch)) {
    return { valid: true, reason: 'Main branch' };
  }

  // Check for valid prefix
  const hasValidPrefix = VALID_PREFIXES.some(prefix => branch.startsWith(prefix));
  if (!hasValidPrefix) {
    return {
      valid: false,
      reason: `Branch must start with one of: ${VALID_PREFIXES.join(', ')}`,
      suggestion: `feature/${branch.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    };
  }

  // Extract the name part after the prefix
  const prefix = VALID_PREFIXES.find(p => branch.startsWith(p));
  const namePart = branch.substring(prefix.length);

  // Check kebab-case
  if (!isKebabCase(namePart)) {
    return {
      valid: false,
      reason: `Branch name must be kebab-case (lowercase with hyphens)`,
      suggestion: `${prefix}${namePart.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    };
  }

  // Check length
  if (namePart.length < 3) {
    return {
      valid: false,
      reason: 'Branch name too short (minimum 3 characters after prefix)',
    };
  }

  if (namePart.length > 50) {
    return {
      valid: false,
      reason: 'Branch name too long (maximum 50 characters after prefix)',
    };
  }

  return { valid: true };
}

function main() {
  const branch = getCurrentBranch();
  const result = validateBranchName(branch);

  if (result.valid) {
    console.log(`✅ Branch name valid: ${branch}`);
    process.exit(0);
  } else {
    console.error(`\n❌ Invalid branch name: ${branch}\n`);
    console.error(`   Reason: ${result.reason}`);
    if (result.suggestion) {
      console.error(`   Suggestion: ${result.suggestion}`);
    }
    console.error('\n   Valid prefixes: ' + VALID_PREFIXES.join(', '));
    console.error('   Format: <prefix><kebab-case-name>\n');
    process.exit(1);
  }
}

main();
