#!/usr/bin/env node

/**
 * Complete Feature Script
 * 
 * Archives a completed feature lifecycle file and provides push instructions.
 */

import { readdirSync, renameSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('🎉 Complete Feature\n');

  const activeFeaturesDir = join(projectRoot, '.cursor', 'features', 'active');
  
  if (!existsSync(activeFeaturesDir)) {
    console.log('❌ No active features directory found');
    process.exit(1);
  }

  const activeFeatures = readdirSync(activeFeaturesDir).filter((f) => f.endsWith('.md'));

  if (activeFeatures.length === 0) {
    console.log('✅ No active features to complete');
    process.exit(0);
  }

  console.log('Active features:');
  activeFeatures.forEach((f, i) => {
    console.log(`   ${i + 1}. ${f.replace('.md', '')}`);
  });

  const selection = await question('\nSelect feature number to complete: ');
  const index = parseInt(selection) - 1;

  if (isNaN(index) || index < 0 || index >= activeFeatures.length) {
    console.log('❌ Invalid selection');
    process.exit(1);
  }

  const featureFile = activeFeatures[index];
  const featureName = featureFile.replace('.md', '');

  // Ensure completed directory exists
  const completedDir = join(projectRoot, '.cursor', 'features', 'completed');
  mkdirSync(completedDir, { recursive: true });

  // Move file
  const sourcePath = join(activeFeaturesDir, featureFile);
  const destPath = join(completedDir, featureFile);
  renameSync(sourcePath, destPath);

  console.log(`\n✅ Feature archived: .cursor/features/completed/${featureFile}`);
  console.log('\n📋 Pre-Push Checklist:');
  console.log('\n1. Format code:');
  console.log('   npm run format');
  console.log('\n2. Run all checks (automated):');
  console.log('   npm run pre-push');
  console.log('   ');
  console.log('   Or manually:');
  console.log('   npm run docs:validate');
  console.log('   npm run type-check');
  console.log('   npm run lint');
  console.log('   npm run format:check');
  console.log('   npm test -- --run');
  console.log('\n3. Commit any formatting changes:');
  console.log('   git add -A');
  console.log('   git commit -m "style: format code with Prettier"');
  console.log('\n4. Push branch to GitHub:');
  console.log(`   git push -u origin feature/${featureName}`);
  console.log('\n5. Create Pull Request:');
  console.log('   GitHub will provide a PR URL in the output');
  console.log('   Visit that URL to create the PR');
  console.log('\n6. Review and Merge:');
  console.log('   - Wait for CI/CD checks to pass');
  console.log('   - Request reviews if needed');
  console.log('   - Merge through GitHub interface');
  console.log('\n⚠️  NEVER merge to main locally - always use GitHub PRs\n');

  rl.close();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

