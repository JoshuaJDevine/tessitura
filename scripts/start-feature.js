#!/usr/bin/env node

/**
 * Start Feature Script
 * 
 * Creates a new feature branch and initializes the feature lifecycle file.
 * This ensures every feature goes through the architecture → code → docs workflow.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
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
  return new Promise((resolve) => rl.question(query, resolve));
}

/**
 * Sanitize feature name to be git-friendly (kebab-case)
 * @param {string} name - The raw feature name
 * @returns {string} - Sanitized name suitable for git branch
 */
function sanitizeFeatureName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

async function main() {
  console.log('🚀 Starting New Feature\n');

  // Check for uncommitted changes
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (status.trim()) {
      console.log('⚠️  Warning: You have uncommitted changes:');
      console.log(status);
      const proceed = await question('Continue anyway? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        console.log('Aborted.');
        process.exit(0);
      }
    }
  } catch (error) {
    console.error('Error checking git status');
  }

  // Check for active features
  const featuresDir = join(projectRoot, '.cursor', 'features', 'active');
  if (existsSync(featuresDir)) {
    const activeFeatures = readdirSync(featuresDir).filter((f) => f.endsWith('.md'));
    if (activeFeatures.length > 0) {
      console.log('⚠️  Warning: You have active features in progress:');
      activeFeatures.forEach((f) => console.log(`   - ${f}`));
      const proceed = await question('Start a new feature anyway? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        console.log('Aborted.');
        process.exit(0);
      }
    }
  }

  // Get feature details
  const rawFeatureName = await question('Feature name (e.g., "canvas-zoom"): ');
  if (!rawFeatureName.trim()) {
    console.log('❌ Feature name is required');
    process.exit(1);
  }

  // Sanitize feature name for git branch
  const featureName = sanitizeFeatureName(rawFeatureName);
  if (!featureName) {
    console.log('❌ Invalid feature name (contains only special characters)');
    process.exit(1);
  }

  console.log(`📝 Sanitized name: "${featureName}"`);
  
  const branchName = `feature/${featureName}`;
  const description = await question('Brief description: ');
  const engineer = await question('Your name: ');

  // Create branch
  console.log(`\n📦 Creating branch: ${branchName}`);
  try {
    execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to create branch');
    process.exit(1);
  }

  // Load template
  const templatePath = join(projectRoot, '.cursor', 'templates', 'feature-template.md');
  let template = readFileSync(templatePath, 'utf-8');

  // Fill in template
  const today = new Date().toISOString().split('T')[0];
  template = template
    .replace('[Feature Name]', featureName)
    .replace('[branch-name]', branchName)
    .replace('[YYYY-MM-DD]', today)
    .replace('[Your Name]', engineer || 'Unknown')
    .replace('[Describe what you want to build and why]', description || 'TODO: Add description');

  // Ensure directories exist
  const activeFeaturesDir = join(projectRoot, '.cursor', 'features', 'active');
  mkdirSync(activeFeaturesDir, { recursive: true });

  // Write feature file
  const featureFile = join(activeFeaturesDir, `${featureName}.md`);
  writeFileSync(featureFile, template, 'utf-8');

  console.log(`\n✅ Feature file created: .cursor/features/active/${featureName}.md`);
  console.log('\n📋 Next Steps:');
  console.log('   1. Open .cursor/features/active/' + featureName + '.md');
  console.log('   2. Fill in the "Engineer Request" section with your requirements');
  console.log('   3. Run: @architect Review feature request and create implementation plan');
  console.log('   4. Follow the prompts in each phase\n');
  console.log('💡 The feature file will guide you through: Architecture → Implementation → Documentation\n');

  rl.close();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

