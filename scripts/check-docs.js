#!/usr/bin/env node

/**
 * Check Documentation Script
 * 
 * Pre-commit hook to check if documentation is up to date
 * with staged code changes.
 */

import { execSync } from 'child_process';
import { existsSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

function getStagedFiles() {
  try {
    const output = execSync('git diff --cached --name-only', {
      cwd: projectRoot,
      encoding: 'utf-8',
    });
    return output.split('\n').filter(Boolean);
  } catch (error) {
    return [];
  }
}

function shouldHaveDoc(filePath) {
  const ext = extname(filePath);
  if (!['.tsx', '.ts'].includes(ext)) return false;
  
  const ignorePatterns = [
    /\.test\./,
    /\.spec\./,
    /\.types\./,
    /\.stories\./,
    /ui\//,
    /main\.tsx$/,
    /index\.tsx$/,
    /index\.ts$/,
    /vite\.config/,
    /tailwind\.config/,
    /postcss\.config/,
  ];
  
  return !ignorePatterns.some(pattern => pattern.test(filePath));
}

function getExpectedDocPath(filePath) {
  const dir = dirname(filePath);
  const name = basename(filePath, extname(filePath));
  return join(dir, `${name}.md`);
}

function checkDocs() {
  const stagedFiles = getStagedFiles();
  const codeFiles = stagedFiles.filter(shouldHaveDoc);
  
  if (codeFiles.length === 0) {
    return { ok: true, issues: [] };
  }
  
  const issues = [];
  
  for (const file of codeFiles) {
    const fullPath = join(projectRoot, file);
    if (!existsSync(fullPath)) continue;
    
    const docPath = getExpectedDocPath(file);
    const fullDocPath = join(projectRoot, docPath);
    
    if (!existsSync(fullDocPath)) {
      issues.push({
        type: 'missing',
        file,
        docPath,
        message: `Missing documentation file: ${docPath}`,
      });
    } else {
      // Check if doc is older than code
      const codeTime = statSync(fullPath).mtime;
      const docTime = statSync(fullDocPath).mtime;
      
      if (docTime < codeTime) {
        issues.push({
          type: 'outdated',
          file,
          docPath,
          message: `Documentation may be outdated: ${docPath}`,
        });
      }
    }
  }
  
  return {
    ok: issues.length === 0,
    issues,
  };
}

function generatePrompt(issues) {
  let prompt = '@docs Please update the following documentation:\n\n';
  
  for (const issue of issues) {
    if (issue.type === 'missing') {
      prompt += `**Create:** \`${issue.docPath}\`\n`;
      prompt += `- Use template from .cursor/rules/documentation-rules.mdc\n`;
      prompt += `- Document the component in \`${issue.file}\`\n\n`;
    } else {
      prompt += `**Update:** \`${issue.docPath}\`\n`;
      prompt += `- Review changes in \`${issue.file}\`\n`;
      prompt += `- Update all relevant sections\n`;
      prompt += `- Update "Last Updated" timestamp\n\n`;
    }
  }
  
  prompt += '\n---\n\n';
  prompt += 'For each file:\n';
  prompt += '1. Review the code changes\n';
  prompt += '2. Update the .md file sections:\n';
  prompt += '   - Purpose (if changed)\n';
  prompt += '   - Props/API (if interface changed)\n';
  prompt += '   - Usage examples (if API changed)\n';
  prompt += '   - Dependencies (if imports changed)\n';
  prompt += '3. Update "Last Updated" with today\'s date and reason\n';
  
  return prompt;
}

function main() {
  const result = checkDocs();
  
  if (result.ok) {
    console.log('✅ Documentation is up to date');
    process.exit(0);
  }
  
  console.error('\n❌ Documentation needs updating!\n');
  
  for (const issue of result.issues) {
    console.error(`   ${issue.message}`);
  }
  
  console.error('\n💡 To fix:\n');
  
  const prompt = generatePrompt(result.issues);
  
  // Ensure .cursor directory exists
  const cursorDir = join(projectRoot, '.cursor');
  if (!existsSync(cursorDir)) {
    mkdirSync(cursorDir, { recursive: true });
  }
  
  const promptPath = join(cursorDir, 'doc-prompt.txt');
  writeFileSync(promptPath, prompt, 'utf-8');
  
  console.error('   1. Open Cursor Chat');
  console.error('   2. Paste the prompt from: .cursor/doc-prompt.txt');
  console.error('   3. Review and commit documentation updates');
  console.error('   4. Commit your code changes again\n');
  
  process.exit(1);
}

main();

