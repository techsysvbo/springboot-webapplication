import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import * as cache from '../lib/cache';
import { generateEmbedding, semanticSearch, keywordSearch } from '../lib/embeddings';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const q       = typeof req.query.q       === 'string' ? req.query.q.trim()       : '';
  const versions = typeof req.query.versions === 'string' ? req.query.versions.split(',') : ['KJV'];
  const limit   = Math.min(parseInt(req.query.limit as string ?? '20', 10), 50);

  if (!q || q.length < 2) {
    res.status(400).json({ error: 'Query parameter "q" is required (min 2 chars)' });
    return;
  }

  const cacheKey = `search:${q}:${versions.sort().join(',')}:${limit}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const versionRecords = await prisma.bibleVersion.findMany({ where: { abbreviation: { in: versions } } });
    const versionIds = versionRecords.map((v) => v.id);

    if (versionIds.length === 0) {
      res.status(400).json({ error: 'No valid versions found' });
      return;
    }

    let results;
    try {
      const embedding = await generateEmbedding(q);
      results = await semanticSearch(embedding, versionIds, limit);
    } catch {
      results = await keywordSearch(q, versionIds, limit);
    }

    const response = results.map((r) => ({
      id:         r.id,
      reference:  `${r.bookName} ${r.chapter}:${r.verse}`,
      bookName:   r.bookName,
      chapter:    r.chapter,
      verse:      r.verse,
      text:       r.text,
      version:    r.versionAbbr,
      similarity: r.similarity,
    }));

    await cache.set(cacheKey, response, 600);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', message: (err as Error).message });
  }
});

export default router;
