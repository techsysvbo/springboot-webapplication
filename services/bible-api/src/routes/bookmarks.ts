import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/db';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

// GET /api/bookmarks
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  try {
    const bookmarks = await prisma.userBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookmarks', message: (err as Error).message });
  }
});

const BookmarkSchema = z.object({
  verseId: z.string().uuid(),
  note:    z.string().max(500).optional(),
});

// POST /api/bookmarks
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = BookmarkSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const userId = req.user!.userId;
  const { verseId, note } = parsed.data;

  try {
    const verse = await prisma.bibleVerse.findUnique({ where: { id: verseId } });
    if (!verse) {
      res.status(404).json({ error: 'Verse not found' });
      return;
    }

    const bookmark = await prisma.userBookmark.upsert({
      where:  { userId_verseId: { userId, verseId } },
      update: { note },
      create: { id: uuidv4(), userId, verseId, note },
    });
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save bookmark', message: (err as Error).message });
  }
});

// DELETE /api/bookmarks/:verseId
router.delete('/:verseId', async (req: Request, res: Response): Promise<void> => {
  const userId  = req.user!.userId;
  const verseId = req.params.verseId;

  try {
    await prisma.userBookmark.deleteMany({ where: { userId, verseId } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete bookmark', message: (err as Error).message });
  }
});

export default router;
