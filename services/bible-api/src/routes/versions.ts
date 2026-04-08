import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import * as cache from '../lib/cache';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'versions:all';
  const cached = await cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const versions = await prisma.bibleVersion.findMany({
      orderBy: [{ isDefault: 'desc' }, { abbreviation: 'asc' }],
    });
    await cache.set(cacheKey, versions, 86400);
    res.json(versions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch versions', message: (err as Error).message });
  }
});

export default router;
