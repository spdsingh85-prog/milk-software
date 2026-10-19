import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint for Cloud Run container probes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', app: 'Hawsapur Mahila Dugdh Ltd', timestamp: Date.now() });
});

// Production: serve built static assets from dist
const distPath = path.join(__dirname, 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Fallback to index.html for SPA client-side routing
app.get('*', (_req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('Hawsapur Mahila Dugdh Ltd - Building assets...');
  }
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
