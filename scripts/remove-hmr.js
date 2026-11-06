#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Removes the Vite HMR client that plugin-react injects into production
// bundles (dev-only dead code). The HMR section is a long prefix of
// devtool/HMR-transport code, ending where the CommonJS interop helper and
// module-utility declarations begin (e.g. "function Ju(p){return
// p&&p.__esModule&&...}var Bu={exports:{}},ko={},Du={exports:{}},Ee={};").
// Everything from the interop helper onward is needed by the app, so we cut
// right before it — but only when the detected prefix is actually HMR
// code, verified by required markers.

const HMR_MARKERS = [
  '__HMR_HOISTED_EXPORTS__',
  'hmr',
  '__vite_ssr_import__' ,
  'createWebSocket',
  'data-vite-dev-id',
];

function removeHmrRuntime() {
  const distDir = join(process.cwd(), 'dist', 'assets');
  const files = readdirSync(distDir).filter(f => f.startsWith('index-') && f.endsWith('.js'));

  for (const file of files) {
    const filePath = join(distDir, file);
    const content = readFileSync(filePath, 'utf-8');

    const reactIdx = content.indexOf('@license React');
    if (reactIdx === -1) {
      console.log(`Could not find @license React in ${file}, skipping`);
      continue;
    }

    // Search only the prefix before the React license.
    const prefix = content.slice(0, reactIdx);

    // 1) The var declaration of the module utilities (must stay).
    //    Variable names are minified: match the shape, not the names.
    const moduleUtilsRe = /var\s+\w+=\{exports:\{\}\},\s*\w+=\{\},\s*\w+=\{exports:\{\}\},\s*\w+=\{\};/;
    const muMatch = moduleUtilsRe.exec(prefix);

    // 2) The CJS interop helper immediately before it (may stay).
    const interopRe = /function\s+\w+\(p\)\{return p&&p\.__esModule&&Object\.prototype\.hasOwnProperty\.call\(p,"default"\)\?p\.default:p\}/;

    let cutIdx = -1;
    if (muMatch) {
      // Cut before the interop helper if it sits right before the vars,
      // otherwise before the vars declaration itself.
      let interopStart = -1;
      const beforeVars = prefix.slice(0, muMatch.index);
      const interopMatch = interopRe.exec(beforeVars);
      if (interopMatch) {
        // Verify nothing else app-critical sits between the helper and the vars.
        const between = beforeVars.slice(interopMatch.index + interopMatch[0].length, muMatch.index);
        if (/^[;,\s]*$/.test(between)) interopStart = interopMatch.index;
      }
      cutIdx = interopStart !== -1 ? interopStart : muMatch.index;

      // Safety: the removed prefix must actually be HMR/devtool code.
      const removed = content.slice(0, cutIdx);
      const markerHits = HMR_MARKERS.filter(m => removed.includes(m)).length;
      if (markerHits < 2 || removed.length < 5000) {
        console.log(`Skipping HMR removal from ${file}: removed prefix looks wrong (${removed.length} chars, ${markerHits} HMR markers)`);
        continue;
      }
    }

    if (cutIdx === -1) {
      // No module-utility boundary found — do not touch the file rather than
      // risk cutting into live code (previous fallback cut at the license
      // comment and dropped the module-utility declarations, breaking the app).
      console.log(`Skipping HMR removal from ${file}: no safe cut boundary found`);
      continue;
    }

    writeFileSync(filePath, content.slice(cutIdx));
    console.log(`Removed HMR from ${file} (kept from "${content.slice(cutIdx, cutIdx + 40)}…", removed ${cutIdx} chars)`);
  }
}

removeHmrRuntime();
