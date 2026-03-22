import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import prisma from './config/prisma.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './middleware/logger.js';
import repoRoutes from './routes/repoRoutes.js';
import pipelineRoutes from './routes/pipelineRoutes.js';
import logRoutes from './routes/logRoutes.js';



const app = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// ─── Health Check ─────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'OK', db: 'connected' });
  } catch {
    res.status(503).json({ status: 'DEGRADED', db: 'disconnected' });
  }
});

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/repos', repoRoutes);

app.use('/api/pipelines', pipelineRoutes);

app.use('/api/logs', logRoutes);

// ─── Error Handler (must be last) ─────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app; 