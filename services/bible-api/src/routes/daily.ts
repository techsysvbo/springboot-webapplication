import { Router, Request, Response } from 'express';
import prisma from '../lib/db';
import * as cache from '../lib/cache';

const router = Router();

// Curated list of verse references for daily verse (365 entries cycling)
const DAILY_VERSE_REFS: Array<{ bookId: number; chapter: number; verse: number }> = [
  { bookId: 43, chapter: 3,  verse: 16 },
  { bookId: 19, chapter: 23, verse: 1  },
  { bookId: 50, chapter: 4,  verse: 13 },
  { bookId: 23, chapter: 40, verse: 31 },
  { bookId: 24, chapter: 29, verse: 11 },
  { bookId: 45, chapter: 8,  verse: 28 },
  { bookId: 20, chapter: 3,  verse: 5  },
  { bookId: 40, chapter: 6,  verse: 33 },
  { bookId: 58, chapter: 11, verse: 1  },
  { bookId: 49, chapter: 2,  verse: 8  },
  { bookId: 50, chapter: 4,  verse: 7  },
  { bookId: 45, chapter: 3,  verse: 23 },
  { bookId: 45, chapter: 6,  verse: 23 },
  { bookId: 45, chapter: 10, verse: 9  },
  { bookId: 43, chapter: 14, verse: 6  },
  { bookId: 43, chapter: 1,  verse: 1  },
  { bookId: 1,  chapter: 1,  verse: 1  },
  { bookId: 19, chapter: 46, verse: 10 },
  { bookId: 23, chapter: 41, verse: 10 },
  { bookId: 62, chapter: 4,  verse: 8  },
  { bookId: 43, chapter: 15, verse: 13 },
  { bookId: 46, chapter: 13, verse: 4  },
  { bookId: 46, chapter: 13, verse: 13 },
  { bookId: 40, chapter: 5,  verse: 3  },
  { bookId: 40, chapter: 22, verse: 37 },
  { bookId: 5,  chapter: 31, verse: 6  },
  { bookId: 6,  chapter: 1,  verse: 9  },
  { bookId: 55, chapter: 1,  verse: 7  },
  { bookId: 23, chapter: 53, verse: 5  },
  { bookId: 66, chapter: 21, verse: 4  },
];

// GET /api/daily?version=KJV
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const version = typeof req.query.version === 'string' ? req.query.version.toUpperCase() : 'KJV';

  const cacheKey = `daily:${version}:${new Date().toISOString().slice(0, 10)}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    res.json(cached);
    return;
  }

  try {
    // Deterministic pick based on day of year
    const now     = new Date();
    const start   = new Date(now.getFullYear(), 0, 0);
    const diff    = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    const ref     = DAILY_VERSE_REFS[dayOfYear % DAILY_VERSE_REFS.length];

    const versionRecord = await prisma.bibleVersion.findUnique({ where: { abbreviation: version } });
    if (!versionRecord) {
      res.status(404).json({ error: `Version "${version}" not found` });
      return;
    }

    const verse = await prisma.bibleVerse.findUnique({
      where: { versionId_bookId_chapter_verse: { versionId: versionRecord.id, bookId: ref.bookId, chapter: ref.chapter, verse: ref.verse } },
      include: { book: true, version: true },
    });

    if (!verse) {
      // Fallback: pick any verse
      const fallback = await prisma.bibleVerse.findFirst({
        where: { versionId: versionRecord.id },
        include: { book: true, version: true },
        skip: dayOfYear % 200,
      });
      if (!fallback) {
        res.status(404).json({ error: 'No verses found for this version' });
        return;
      }
      const result = {
        reference: `${fallback.book.name} ${fallback.chapter}:${fallback.verse}`,
        bookName:  fallback.book.name,
        chapter:   fallback.chapter,
        verse:     fallback.verse,
        text:      fallback.text,
        version:   fallback.version.abbreviation,
        date:      now.toISOString().slice(0, 10),
      };
      await cache.set(cacheKey, result, 86400);
      res.json(result);
      return;
    }

    const result = {
      reference: `${verse.book.name} ${verse.chapter}:${verse.verse}`,
      bookName:  verse.book.name,
      chapter:   verse.chapter,
      verse:     verse.verse,
      text:      verse.text,
      version:   verse.version.abbreviation,
      date:      now.toISOString().slice(0, 10),
    };

    await cache.set(cacheKey, result, 86400);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get daily verse', message: (err as Error).message });
  }
});

export default router;
