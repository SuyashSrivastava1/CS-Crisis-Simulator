import express from 'express';
import cors from 'cors';
import config from './config/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

import scenarioRouter from './routes/scenario.js';
import evaluateRouter from './routes/evaluate.js';
import hintRouter from './routes/hint.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = config.port;

// CORS configuration
app.use(cors({
  origin: '*', // For local development, allow all origins. Can be restricted in production.
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// API Routes
app.use('/api/generate-scenario', scenarioRouter);
app.use('/api/evaluate', evaluateRouter);
app.use('/api/hint', hintRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Serve frontend static files in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Fallback to index.html for Single Page App routing in production
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'An unexpected error occurred on the server.'
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Health Check: http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel Serverless Function
export default app;
