import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/server/routes/api.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  // Mount API router
  app.use('/api', apiRouter);

  if (!isProd) {
    // Development mode: mount Vite dev server middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[NETRAK] Dev server mounted with Vite middleware on port', PORT);
  } else {
    // Production mode: serve built assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[NETRAK] Production server serving static files from dist');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NETRAK] Security Platform active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[NETRAK] Failed to start server:', err);
  process.exit(1);
});
