#!/usr/bin/env node

/**
 * Generate Documentation Prompt Script
 * 
 * After a commit, this script generates prompts for updating documentation
 * based on which files were changed.
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

function getChangedFiles() {
  try {
    const output = execSync('git diff-tree --no-commit-id --name-only -r HEAD', {
      cwd: projectRoot,
      encoding: 'utf-8',
    });
    return output.split('\n').filter(Boolean);
  } catch (error) {
    // No commits yet or error
    return [];
  }
}

function shouldHaveDoc(filePath) {
  // Check if file should have documentation
  const ext = extname(filePath);
  if (!['.tsx', '.ts'].includes(ext)) return false;
  
  // Ignore patterns
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

function generateTasks() {
  const changedFiles = getChangedFiles();
  
  if (changedFiles.length === 0) {
    return null;
  }
  
  const tasks = [];
  
  for (const file of changedFiles) {
    if (!shouldHaveDoc(file)) continue;
    
    const fullPath = join(projectRoot, file);
    if (!existsSync(fullPath)) continue;
    
    const docPath = getExpectedDocPath(file);
    const fullDocPath = join(projectRoot, docPath);
    const docExists = existsSync(fullDocPath);
    
    if (!docExists) {
      tasks.push({
        type: 'create',
        file,
        docPath,
        message: 'Documentation file missing - needs to be created',
      });
    } else {
      // Check if doc is older than code
      const codeTime = statSync(fullPath).mtime;
      const docTime = statSync(fullDocPath).mtime;
      
      if (docTime < codeTime) {
        tasks.push({
          type: 'update',
          file,
          docPath,
          message: 'Documentation may be outdated - review needed',
        });
      }
    }
  }
  
  return tasks;
}

function formatPrompt(tasks) {
  if (!tasks || tasks.length === 0) {
    return null;
  }
  
  let prompt = '# Documentation Tasks from Last Commit\n\n';
  prompt += '**Generated:** ' + new Date().toISOString() + '\n\n';
  prompt += '---\n\n';
  
  const createTasks = tasks.filter(t => t.type === 'create');
  const updateTasks = tasks.filter(t => t.type === 'update');
  
  if (createTasks.length > 0) {
    prompt += '## 🆕 New Documentation Needed\n\n';
    for (const task of createTasks) {
      prompt += `### ${task.file}\n\n`;
      prompt += `**Action:** Create \`${task.docPath}\`\n\n`;
      prompt += `**Template:** Use .cursor/rules/documentation-rules.mdc\n\n`;
      prompt += '**Sections to complete:**\n';
      prompt += '- [ ] Purpose\n';
      prompt += '- [ ] Dependencies\n';
      prompt += '- [ ] Props/API\n';
      prompt += '- [ ] Usage Example\n';
      prompt += '- [ ] State Management\n';
      prompt += '- [ ] Related Components\n';
      prompt += '- [ ] Future Enhancements\n\n';
      prompt += '---\n\n';
    }
  }
  
  if (updateTasks.length > 0) {
    prompt += '## 🔄 Documentation Updates Needed\n\n';
    for (const task of updateTasks) {
      prompt += `### ${task.file}\n\n`;
      prompt += `**Action:** Review and update \`${task.docPath}\`\n\n`;
      prompt += '**Check:**\n';
      prompt += '- [ ] Purpose still accurate?\n';
      prompt += '- [ ] Dependencies changed?\n';
      prompt += '- [ ] Props/API modified?\n';
      prompt += '- [ ] Usage examples still valid?\n';
      prompt += '- [ ] State management changed?\n';
      prompt += '- [ ] Update "Last Updated" timestamp\n\n';
      prompt += '---\n\n';
    }
  }
  
  prompt += '## 📋 How to Complete\n\n';
  prompt += '1. Open Cursor Chat\n';
  prompt += '2. Paste: `@docs Please complete the documentation tasks above`\n';
  prompt += '3. Review the generated documentation\n';
  prompt += '4. Commit the documentation updates\n\n';
  
  return prompt;
}

function main() {
  const tasks = generateTasks();
  
  if (!tasks || tasks.length === 0) {
    console.log('✅ No documentation tasks needed');
    return;
  }
  
  const prompt = formatPrompt(tasks);
  
  // Ensure .cursor directory exists
  const cursorDir = join(projectRoot, '.cursor');
  if (!existsSync(cursorDir)) {
    mkdirSync(cursorDir, { recursive: true });
  }
  
  // Write prompt file
  const promptPath = join(cursorDir, 'doc-tasks.md');
  writeFileSync(promptPath, prompt, 'utf-8');
  
  console.log('📝 Documentation tasks generated!');
  console.log(`📋 Review: .cursor/doc-tasks.md`);
  console.log(`📊 Tasks: ${tasks.length} file(s) need documentation updates`);
}

main();

