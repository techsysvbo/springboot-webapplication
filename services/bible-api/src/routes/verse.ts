import { Router, Request, Response } from 'express';
import prisma from '../lib/db';

const router = Router();

// GET /api/verse/:version/:book/:chapter/:verse
router.get('/:version/:book/:chapter/:verse', async (req: Request, res: Response): Promise<void> => {
  const { version, book, chapter, verse } = req.params;
  const chapterNum = parseInt(chapter, 10);
  const verseNum   = parseInt(verse, 10);

  if (isNaN(chapterNum) || isNaN(verseNum)) {
    res.status(400).json({ error: 'Chapter and verse must be numbers' });
    return;
  }

  try {
    const versionRecord = await prisma.bibleVersion.findUnique({ where: { abbreviation: version.toUpperCase() } });
    if (!versionRecord) {
      res.status(404).json({ error: `Version "${version}" not found` });
      return;
    }

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

    const verseRecord = await prisma.bibleVerse.findUnique({
      where: { versionId_bookId_chapter_verse: { versionId: versionRecord.id, bookId: bookRecord.id, chapter: chapterNum, verse: verseNum } },
      include: { book: true, version: true },
    });

    if (!verseRecord) {
      res.status(404).json({ error: `${bookRecord.name} ${chapterNum}:${verseNum} not found in ${version}` });
      return;
    }

    // Fetch cross-references
    const crossRefs = await prisma.verseReference.findMany({
      where: { fromVerseId: verseRecord.id },
      include: {
        toVerse: { include: { book: true, version: true } },
      },
    });

    res.json({
      id:         verseRecord.id,
      reference:  `${verseRecord.book.name} ${chapterNum}:${verseNum}`,
      bookName:   verseRecord.book.name,
      chapter:    chapterNum,
      verse:      verseNum,
      text:       verseRecord.text,
      version:    verseRecord.version.abbreviation,
      crossReferences: crossRefs.map((ref) => ({
        reference: `${ref.toVerse.book.name} ${ref.toVerse.chapter}:${ref.toVerse.verse}`,
        text:      ref.toVerse.text,
        version:   ref.toVerse.version.abbreviation,
        type:      ref.type,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch verse', message: (err as Error).message });
  }
});

export default router;
