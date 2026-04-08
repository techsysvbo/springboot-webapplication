import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import chatRouter from './routes/chat';
import versionsRouter from './routes/versions';
import searchRouter from './routes/search';
import verseRouter from './routes/verse';
import compareRouter from './routes/compare';
import topicsRouter from './routes/topics';
import dailyRouter from './routes/daily';
import bookmarksRouter from './routes/bookmarks';

const app = express();
const PORT = parseInt(process.env.PORT ?? '5000', 10);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN ?? '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));

// General rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
}));

// Stricter limit for chat endpoint
app.use('/api/chat', rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Chat rate limit exceeded, please wait a moment.' },
}));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

app.use('/api/chat',      chatRouter);
app.use('/api/versions',  versionsRouter);
app.use('/api/search',    searchRouter);
app.use('/api/verse',     verseRouter);
app.use('/api/compare',   compareRouter);
app.use('/api/topics',    topicsRouter);
app.use('/api/daily',     dailyRouter);
app.use('/api/bookmarks', bookmarksRouter);

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message, err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Bible API running on port ${PORT}`);
});

// Graceful shutdown
function shutdown(signal: string): void {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

export default app;
