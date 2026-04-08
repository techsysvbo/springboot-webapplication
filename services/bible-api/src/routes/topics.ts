import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import * as cache from '../lib/cache';

const router = Router();

// GET /api/topics
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const cacheKey = 'topics:all';
  const cached = await cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const topics = await prisma.bibleTopic.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { verses: true } } },
    });
    await cache.set(cacheKey, topics, 3600);
    res.json(topics);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch topics', message: (err as Error).message });
  }
});

// GET /api/topics/:topicName/verses?versions=KJV&limit=20
router.get('/:topicName/verses', async (req: Request, res: Response): Promise<void> => {
  const topicName = req.params.topicName;
  const versions  = typeof req.query.versions === 'string' ? req.query.versions.split(',') : ['KJV'];
  const limit     = Math.min(parseInt(req.query.limit as string ?? '20', 10), 100);

  const cacheKey = `topic:${topicName}:${versions.sort().join(',')}:${limit}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const topic = await prisma.bibleTopic.findFirst({
      where: { name: { equals: topicName, mode: 'insensitive' } },
    });
    if (!topic) {
      res.status(404).json({ error: `Topic "${topicName}" not found` });
      return;
    }

    const versionRecords = await prisma.bibleVersion.findMany({ where: { abbreviation: { in: versions } } });
    const versionIds = versionRecords.map((v) => v.id);

    const verseTopics = await prisma.verseTopic.findMany({
      where: { topicId: topic.id, verse: { versionId: { in: versionIds } } },
      include: {
        verse: {
          include: { book: true, version: true },
        },
      },
      take: limit,
    });

    const result = {
      topic: { id: topic.id, name: topic.name, description: topic.description },
      verses: verseTopics.map((vt) => ({
        id:        vt.verse.id,
        reference: `${vt.verse.book.name} ${vt.verse.chapter}:${vt.verse.verse}`,
        bookName:  vt.verse.book.name,
        chapter:   vt.verse.chapter,
        verse:     vt.verse.verse,
        text:      vt.verse.text,
        version:   vt.verse.version.abbreviation,
      })),
    };

    await cache.set(cacheKey, result, 600);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch topic verses', message: (err as Error).message });
  }
});

export default router;
