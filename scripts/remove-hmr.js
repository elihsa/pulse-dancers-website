#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

function removeHmrRuntime() {
  const distDir = join(process.cwd(), 'dist', 'assets');
  const files = readdirSync(distDir).filter(f => f.startsWith('index-') && f.endsWith('.js'));
  
  for (const file of files) {
    const filePath = join(distDir, file);
    let content = readFileSync(filePath, 'utf-8');
    
    // The bundle structure:
    // 1. HMR runtime + Vite HMR transport (0 - ~16500)
    // 2. Module utility: function $u(p){return p&&p.__esModule...}  -- NEEDED by app code
    // 3. Module utilities: var Ou={exports:{}}, yo={}, Iu={exports:{}}, Pe={}
    // 4. React vendor code (starts with @license React)
    // 5. lucide-react icons
    // 6. App code
    
    // Find the $u utility function - it's needed by app code for default exports
    const dollarUIdx = content.indexOf('function $u(p)');
    if (dollarUIdx === -1) {
      // Fallback: find module utilities
      const utilIdx = content.indexOf('var Ou={exports:{}}');
      if (utilIdx === -1) {
        // Fallback: find React license
        const licenseIdx = content.indexOf('@license React');
        if (licenseIdx === -1) {
          console.log(`Could not find $u, module utilities, or React license in ${file}`);
          continue;
        }
        // Find the comment start
        let commentStart = licenseIdx;
        for (let i = licenseIdx - 1; i >= 0; i--) {
          if (content[i] === '/' && content[i + 1] === '*' && content[i + 2] === '*') {
            commentStart = i;
            break;
          }
        }
        const newContent = content.slice(commentStart);
        writeFileSync(filePath, newContent);
        console.log(`Removed HMR from ${file} (fallback to React license, removed ${commentStart} chars)`);
        continue;
      }
      const newContent = content.slice(utilIdx);
      writeFileSync(filePath, newContent);
      console.log(`Removed HMR from ${file} (kept module utilities, removed ${utilIdx} chars)`);
      continue;
    }
    
    // Find the start of the $u function (it might be part of a larger statement)
    let startIdx = dollarUIdx;
    // Look backwards for the start of the statement (var/const/let/function or ; or newline)
    for (let i = dollarUIdx - 1; i >= 0; i--) {
      if (content[i] === ';' || content[i] === '\n') {
        // Check if previous word is var/const/let/function
        const prev = content.slice(Math.max(0, i-10), i).trim();
        if (prev === 'var' || prev === 'const' || prev === 'let' || prev === 'function' || prev.endsWith('var') || prev.endsWith('const') || prev.endsWith('let') || prev.endsWith('function')) {
          startIdx = i + 1;
          break;
        }
      }
    }
    
    // Remove everything before the $u function
    const newContent = content.slice(startIdx);
    writeFileSync(filePath, newContent);
    console.log(`Removed HMR from ${file} (kept $u function, removed ${startIdx} chars)`);
  }
}

removeHmrRuntime();