import express from 'express';
import authRouter from './auth';
import forumRouter from './forum';
import postRouter from './posts';
import uploadRouter from './uploads';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/api', authRouter);
  app.use('/api', uploadRouter);
  app.use('/api', postRouter);
  app.use('/api', forumRouter);

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  return app;
}
