import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import * as cache from '../lib/cache';

const router = Router();

// GET /api/compare?book=John&chapter=3&verse=16&versions=KJV,ASV,WEB
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const book     = typeof req.query.book     === 'string' ? req.query.book     : '';
  const chapter  = parseInt(req.query.chapter  as string ?? '', 10);
  const verse    = parseInt(req.query.verse    as string ?? '', 10);
  const versions = typeof req.query.versions  === 'string' ? req.query.versions.split(',') : ['KJV', 'ASV', 'WEB'];

  if (!book || isNaN(chapter) || isNaN(verse)) {
    res.status(400).json({ error: 'book, chapter, and verse are required' });
    return;
  }

  const cacheKey = `compare:${book}:${chapter}:${verse}:${versions.sort().join(',')}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    const bookRecord = await prisma.bibleBook.findFirst({
      where: {
        OR: [
          { name:         { equals: book, mode: 'insensitive' } },
          { abbreviation: { equals: book, mode: 'insensitive' } },
        ],
      },
    });
    if (!bookRecord) {
      res.status(404).json({ error: `Book "${book}" not found` });
      return;
    }

    const versionRecords = await prisma.bibleVersion.findMany({ where: { abbreviation: { in: versions } } });
    const versionIds = versionRecords.map((v) => v.id);

    const verses = await prisma.bibleVerse.findMany({
      where: { bookId: bookRecord.id, chapter, verse, versionId: { in: versionIds } },
      include: { version: true, book: true },
    });

    const result = {
      reference: `${bookRecord.name} ${chapter}:${verse}`,
      bookName:  bookRecord.name,
      chapter,
      verse,
      comparisons: versions.map((abbr) => {
        const v = verses.find((v) => v.version.abbreviation === abbr);
        return {
          version: abbr,
          text:    v ? v.text : null,
          found:   !!v,
        };
      }),
    };

    await cache.set(cacheKey, result, 3600);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Compare failed', message: (err as Error).message });
  }
});

export default router;
