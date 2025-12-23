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
  console.log('\n📋 Ready to push!');
  console.log(`   git push origin feature/${featureName}`);
  console.log('   Then create a Pull Request on GitHub\n');

  rl.close();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

