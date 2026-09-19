import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'video-uploader-plugin',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url?.startsWith('/api/upload-video') && req.method === 'POST') {
              const url = new URL(req.url, 'http://localhost:3000');
              const filename = url.searchParams.get('name') || (url.searchParams.get('type') === 'intro' ? 'intro.mp4' : 'video.mp4');
              const safeName = filename.endsWith('.mp4') ? filename : `${filename}.mp4`;
              const chunks: Buffer[] = [];
              req.on('data', (chunk) => chunks.push(chunk));
              req.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const publicPath = path.resolve(__dirname, 'public', safeName);
                fs.writeFileSync(publicPath, buffer);
                try {
                  const distDir = path.resolve(__dirname, 'dist');
                  if (fs.existsSync(distDir)) {
                    fs.writeFileSync(path.resolve(distDir, safeName), buffer);
                  }
                } catch (e) {}
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({success: true, file: safeName, size: buffer.length}));
              });
              return;
            }
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
