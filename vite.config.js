import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

function stripHmrPlugin() {
  return {
    name: 'strip-hmr',
    generateBundle(options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && fileName.startsWith('index-') && fileName.endsWith('.js')) {
          console.log('Stripping HMR from:', fileName);
          const licenseIdx = chunk.code.indexOf('@license lucide-react');
          if (licenseIdx !== -1) {
            let commentStart = licenseIdx;
            for (let i = licenseIdx - 1; i >= 0; i--) {
              if (chunk.code[i] === '/' && chunk.code[i + 1] === '*' && chunk.code[i + 2] === '*') {
                commentStart = i;
                break;
              }
            }
            chunk.code = chunk.code.slice(commentStart);
            console.log(`Stripped ${commentStart} chars from ${fileName}`);
          }
        }
      }
    },
  };
}

function buildInfoPlugin() {
  return {
    name: 'build-info',
    closeBundle() {
      const projectRoot = process.cwd();
      console.log('Build info plugin running from:', projectRoot);
      const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf-8'));
      const buildInfo = {
        version: pkg.version,
        name: pkg.name,
        buildDate: new Date().toISOString(),
        buildTimestamp: Date.now(),
        gitCommit: (() => {
          try {
            return require('child_process')
              .execSync('git rev-parse --short HEAD', { cwd: projectRoot, encoding: 'utf-8', stdio: 'pipe' })
              .trim();
          } catch (e) {
            console.log('Git commit error:', e.message);
            return 'unknown';
          }
        })(),
        gitBranch: (() => {
          try {
            return require('child_process')
              .execSync('git rev-parse --abbrev-ref HEAD', { cwd: projectRoot, encoding: 'utf-8', stdio: 'pipe' })
              .trim();
          } catch (e) {
            console.log('Git branch error:', e.message);
            return 'unknown';
          }
        })(),
      };
      fs.writeFileSync(
        path.resolve('dist/build-info.json'),
        JSON.stringify(buildInfo, null, 2)
      );
      console.log('Build info written:', buildInfo);
    },
  };
}

export default defineConfig({
  plugins: [
    stripHmrPlugin(),
    buildInfoPlugin(),
    react({
      fastRefresh: false,
    }),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react'],
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
    modulePreload: false,
    rollupOptions: { output: { manualChunks: undefined } },
  },
  server: {
    host: "0.0.0.0",
    port: 4000,
    strictPort: true,
    hmr: { port: 4000, overlay: false },
    proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
  },
  define: {
    'import.meta.vitest': 'undefined',
    '__HMR_PROTOCOL__': '""',
    '__HMR_HOSTNAME__': '""',
    '__HMR_PORT__': '0',
    '__HMR_BASE__': '""',
    '__HMR_DIRECT_TARGET__': '""',
    '__HMR_TIMEOUT__': '0',
    '__WS_TOKEN__': '""',
    '__HMR_CONFIG_NAME__': '""',
    '__HMR_ENABLE_OVERLAY__': 'false',
    '__BASE__': '"/"',
    'process.env.NODE_ENV': '"production"',
  },
});