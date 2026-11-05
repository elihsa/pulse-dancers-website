import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function stripHmrPlugin() {
  return {
    name: 'strip-hmr',
    generateBundle(options, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && fileName.startsWith('index-') && fileName.endsWith('.js')) {
          console.log('Stripping HMR from:', fileName);
          // Find the first occurrence of the lucide-react license comment
          const licenseIdx = chunk.code.indexOf('@license lucide-react');
          if (licenseIdx !== -1) {
            // Find the start of the comment block
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

export default defineConfig({
  plugins: [
    stripHmrPlugin(),
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