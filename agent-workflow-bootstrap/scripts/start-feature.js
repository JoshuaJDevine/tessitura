#!/usr/bin/env node

/**
 * Start Feature Script
 *
 * Creates a new feature branch and initializes the feature folder structure.
 * This is typically invoked by the Designer agent at the start of a feature.
 */

import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function sanitizeFeatureName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    return status.trim();
  } catch {
    return null;
  }
}

function getCurrentBranch() {
  try {
    return execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}

function getActiveFeatures() {
  const featuresDir = join(projectRoot, '.cursor', 'features', 'active');
  if (!existsSync(featuresDir)) return [];
  return readdirSync(featuresDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

async function main() {
  console.log('\n🚀 Starting New Feature\n');
  console.log('This will:');
  console.log('  1. Checkout main and pull latest');
  console.log('  2. Create a feature branch');
  console.log('  3. Create the feature folder structure\n');

  // Check for uncommitted changes
  const status = checkGitStatus();
  if (status) {
    console.log('⚠️  Warning: You have uncommitted changes:\n');
    console.log(status);
    const proceed = await question('\nStash changes and continue? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('Aborted. Commit or stash your changes first.');
      rl.close();
      process.exit(0);
    }
    execSync('git stash', { stdio: 'inherit' });
    console.log('✅ Changes stashed\n');
  }

  // Check for active features
  const activeFeatures = getActiveFeatures();
  if (activeFeatures.length > 0) {
    console.log('⚠️  Warning: You have active features in progress:');
    activeFeatures.forEach(f => console.log(`   - ${f}`));
    const proceed = await question('\nStart a new feature anyway? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('Aborted. Complete or archive active features first.');
      rl.close();
      process.exit(0);
    }
  }

  // Get feature details
  const rawFeatureName = await question('Feature name (e.g., "add user auth"): ');
  if (!rawFeatureName.trim()) {
    console.log('❌ Feature name is required');
    rl.close();
    process.exit(1);
  }

  const featureName = sanitizeFeatureName(rawFeatureName);
  if (!featureName || featureName.length < 3) {
    console.log('❌ Invalid feature name (must be at least 3 characters)');
    rl.close();
    process.exit(1);
  }

  console.log(`\n📝 Sanitized name: "${featureName}"`);

  const branchName = `feature/${featureName}`;

  // Checkout main and pull
  console.log('\n📦 Updating main branch...');
  try {
    execSync('git checkout main', { stdio: 'inherit' });
    execSync('git pull origin main', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to update main branch');
    rl.close();
    process.exit(1);
  }

  // Create feature branch
  console.log(`\n🌿 Creating branch: ${branchName}`);
  try {
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to create branch (may already exist)');
    rl.close();
    process.exit(1);
  }

  // Create feature folder structure
  const featureDir = join(projectRoot, '.cursor', 'features', 'active', featureName);
  mkdirSync(featureDir, { recursive: true });

  // Create initial README for the feature
  const today = new Date().toISOString().split('T')[0];
  const readme = `# Feature: ${rawFeatureName}

**Branch:** ${branchName}
**Started:** ${today}
**Status:** In Progress

## Workflow Progress

- [ ] Designer - Requirements & ADR
- [ ] Coder - Implementation
- [ ] Tester - Test Coverage
- [ ] Documenter - Documentation
- [ ] Closer - PR & Cleanup

## Agent Documents

| Agent | Document | Status |
|-------|----------|--------|
| Designer | [designer.md](./designer.md) | Pending |
| Coder | [coder.md](./coder.md) | Pending |
| Tester | [tester.md](./tester.md) | Pending |
| Documenter | [documenter.md](./documenter.md) | Pending |
| Closer | [closer.md](./closer.md) | Pending |

## Notes

[Add any notes about this feature here]
`;

  writeFileSync(join(featureDir, 'README.md'), readme);

  console.log(`\n✅ Feature initialized!`);
  console.log(`\n📁 Feature folder: .cursor/features/active/${featureName}/`);
  console.log(`🌿 Branch: ${branchName}`);
  console.log(`\n📋 Next Steps:`);
  console.log(`   1. Invoke @designer with your feature request`);
  console.log(`   2. Designer will create the ADR and requirements`);
  console.log(`   3. Follow the cascade: Designer → Coder → Tester → Documenter → Closer`);
  console.log(`\n💡 Example prompt for Designer:`);
  console.log(`   @designer I want to build ${rawFeatureName}. Help me clarify the requirements.`);
  console.log('');

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
