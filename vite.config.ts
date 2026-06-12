import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

// Plugin to scan public/images/ and expose as a virtual module
function imageListPlugin() {
  const virtualId = 'virtual:image-list';
  return {
    name: 'image-list',
    resolveId(id: string) {
      if (id === virtualId) return '\0' + virtualId;
    },
    load(id: string) {
      if (id === '\0' + virtualId) {
        try {
          const imagesDir = path.resolve(__dirname, 'public/images');
          if (!fs.existsSync(imagesDir)) return `export default [];`;
          const files = fs.readdirSync(imagesDir)
            .filter(f => /\.(png|jpe?g|webp|gif|svg|jfif)$/i.test(f))
            .map(f => `/images/${f}`);
          return `export default ${JSON.stringify(files)};`;
        } catch {
          return `export default [];`;
        }
      }
    },
  } as any;
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), imageListPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
