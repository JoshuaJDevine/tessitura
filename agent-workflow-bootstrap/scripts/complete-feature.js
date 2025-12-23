#!/usr/bin/env node

/**
 * Complete Feature Script
 *
 * Archives a completed feature folder from active to completed.
 * Run this AFTER the PR has been merged via GitHub.
 */

import { readdirSync, renameSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
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
  return new Promise(resolve => rl.question(query, resolve));
}

function getActiveFeatures() {
  const featuresDir = join(projectRoot, '.cursor', 'features', 'active');
  if (!existsSync(featuresDir)) return [];
  return readdirSync(featuresDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

async function main() {
  console.log('\n🎉 Complete Feature\n');

  const activeFeatures = getActiveFeatures();

  if (activeFeatures.length === 0) {
    console.log('✅ No active features to complete');
    rl.close();
    process.exit(0);
  }

  console.log('Active features:');
  activeFeatures.forEach((f, i) => {
    console.log(`   ${i + 1}. ${f}`);
  });

  const selection = await question('\nSelect feature number to complete: ');
  const index = parseInt(selection) - 1;

  if (isNaN(index) || index < 0 || index >= activeFeatures.length) {
    console.log('❌ Invalid selection');
    rl.close();
    process.exit(1);
  }

  const featureName = activeFeatures[index];

  // Verify all agents completed
  const featureDir = join(projectRoot, '.cursor', 'features', 'active', featureName);
  const expectedFiles = ['designer.md', 'coder.md', 'tester.md', 'documenter.md', 'closer.md'];
  const missingFiles = expectedFiles.filter(f => !existsSync(join(featureDir, f)));

  if (missingFiles.length > 0) {
    console.log('\n⚠️  Warning: Some agent documents are missing:');
    missingFiles.forEach(f => console.log(`   - ${f}`));
    const proceed = await question('\nComplete anyway? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('Aborted. Complete all agent phases first.');
      rl.close();
      process.exit(0);
    }
  }

  // Ensure completed directory exists
  const completedDir = join(projectRoot, '.cursor', 'features', 'completed');
  mkdirSync(completedDir, { recursive: true });

  // Update README with completion date
  const readmePath = join(featureDir, 'README.md');
  if (existsSync(readmePath)) {
    let readme = readFileSync(readmePath, 'utf-8');
    const today = new Date().toISOString().split('T')[0];
    readme = readme.replace('**Status:** In Progress', `**Status:** Completed\n**Completed:** ${today}`);
    writeFileSync(readmePath, readme);
  }

  // Move folder
  const destPath = join(completedDir, featureName);
  renameSync(featureDir, destPath);

  console.log(`\n✅ Feature archived: .cursor/features/completed/${featureName}/`);
  console.log('\n📋 Post-Merge Cleanup:\n');
  console.log('1. Switch back to main:');
  console.log('   git checkout main\n');
  console.log('2. Pull latest changes (includes your merged PR):');
  console.log('   git pull origin main\n');
  console.log('3. Delete local feature branch:');
  console.log(`   git branch -d feature/${featureName}\n`);
  console.log('4. (Optional) Delete remote branch:');
  console.log(`   git push origin --delete feature/${featureName}\n`);
  console.log('✨ Feature complete! Ready for next feature.\n');

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
