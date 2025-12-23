#!/usr/bin/env node

/**
 * GitHub Issue Creation Script
 *
 * Creates GitHub issues for documentation gaps, test coverage gaps,
 * or technical debt identified during the agent workflow.
 *
 * Usage:
 *   npm run create-issue -- --type=docs --file=src/component.ts
 *   npm run create-issue -- --type=test --file=src/component.ts --coverage=65
 *   npm run create-issue -- --type=debt --title="Refactor auth module" --description="..."
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};

  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      parsed[key] = value || true;
    }
  });

  return parsed;
}

function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}

function createDocsIssue(file, branch) {
  const title = `docs: Document ${file}`;
  const body = `## Context
Identified during feature branch: \`${branch}\`

## Task
Create documentation for \`${file}\`

## Acceptance Criteria
- [ ] \`.md\` file exists alongside code file
- [ ] Purpose section explains why it exists
- [ ] Usage examples are copy-paste ready
- [ ] API/Props documented with TypeScript types
- [ ] Related docs cross-linked

## Template
Follow the documentation template in \`.cursor/agents/documenter.md\`
`;

  return { title, body, labels: ['documentation', 'good-first-issue'] };
}

function createTestIssue(file, branch, coverage) {
  const title = `test: Improve coverage for ${file}`;
  const body = `## Context
Identified during feature branch: \`${branch}\`

## Current State
- File: \`${file}\`
- Coverage: ${coverage || 'Unknown'}%
- Target: 80%+

## Task
Add tests to improve coverage

## Acceptance Criteria
- [ ] Line coverage >= 80%
- [ ] Branch coverage >= 75%
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] No implementation details tested (test behavior)

## Template
Follow the testing patterns in \`.cursor/agents/tester.md\`
`;

  return { title, body, labels: ['testing'] };
}

function createDebtIssue(customTitle, description, branch) {
  const title = `chore: ${customTitle}`;
  const body = `## Context
Identified during feature branch: \`${branch}\`

## Issue
${description || 'Technical debt requiring attention'}

## Impact
[Describe what breaks or suffers if not addressed]

## Suggested Approach
[How to fix this]

## Acceptance Criteria
- [ ] [Define completion criteria]
`;

  return { title, body, labels: ['tech-debt'] };
}

function checkGhCli() {
  try {
    execSync('gh --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

function createIssue(title, body, labels) {
  const labelArgs = labels.map(l => `--label "${l}"`).join(' ');

  try {
    // Write body to temp file to handle multi-line
    const tempFile = '.github-issue-body.tmp';
    require('fs').writeFileSync(tempFile, body);

    const cmd = `gh issue create --title "${title}" --body-file ${tempFile} ${labelArgs}`;
    const result = execSync(cmd, { encoding: 'utf-8' });

    require('fs').unlinkSync(tempFile);

    return result.trim();
  } catch (error) {
    throw new Error(`Failed to create issue: ${error.message}`);
  }
}

function main() {
  const args = parseArgs();

  if (!args.type) {
    console.log(`
Usage:
  npm run create-issue -- --type=docs --file=src/component.ts
  npm run create-issue -- --type=test --file=src/component.ts --coverage=65
  npm run create-issue -- --type=debt --title="Title" --description="..."

Types:
  docs  - Documentation gap
  test  - Test coverage gap
  debt  - Technical debt
`);
    process.exit(1);
  }

  // Check gh CLI is available
  if (!checkGhCli()) {
    console.error('❌ GitHub CLI (gh) is not installed or not authenticated.');
    console.error('   Install: https://cli.github.com/');
    console.error('   Auth: gh auth login');
    process.exit(1);
  }

  const branch = getCurrentBranch();
  let issue;

  switch (args.type) {
    case 'docs':
      if (!args.file) {
        console.error('❌ --file is required for docs issues');
        process.exit(1);
      }
      issue = createDocsIssue(args.file, branch);
      break;

    case 'test':
      if (!args.file) {
        console.error('❌ --file is required for test issues');
        process.exit(1);
      }
      issue = createTestIssue(args.file, branch, args.coverage);
      break;

    case 'debt':
      if (!args.title) {
        console.error('❌ --title is required for debt issues');
        process.exit(1);
      }
      issue = createDebtIssue(args.title, args.description, branch);
      break;

    default:
      console.error(`❌ Unknown issue type: ${args.type}`);
      console.error('   Valid types: docs, test, debt');
      process.exit(1);
  }

  console.log(`\n📝 Creating ${args.type} issue...`);
  console.log(`   Title: ${issue.title}`);
  console.log(`   Labels: ${issue.labels.join(', ')}`);

  try {
    const url = createIssue(issue.title, issue.body, issue.labels);
    console.log(`\n✅ Issue created: ${url}\n`);
  } catch (error) {
    console.error(`\n❌ ${error.message}`);
    console.log('\nIssue body (copy manually if needed):');
    console.log('---');
    console.log(issue.body);
    console.log('---');
    process.exit(1);
  }
}

main();
