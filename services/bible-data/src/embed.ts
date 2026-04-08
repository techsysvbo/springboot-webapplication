import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const DRY_RUN = process.argv.includes('--dry-run');
const BATCH_SIZE = 100;

interface VerseWithBook {
  id: string;
  text: string;
  chapter: number;
  verse: number;
  bookName: string;
  versionAbbr: string;
}

async function fetchUnembeddedVerses(offset: number): Promise<VerseWithBook[]> {
  const results = await prisma.$queryRaw<VerseWithBook[]>`
    SELECT
      bv.id,
      bv.text,
      bv.chapter,
      bv.verse,
      bb.name AS "bookName",
      bver.abbreviation AS "versionAbbr"
    FROM bible_verses bv
    JOIN bible_books bb ON bv.book_id = bb.id
    JOIN bible_versions bver ON bv.version_id = bver.id
    LEFT JOIN bible_embeddings be ON be.verse_id = bv.id
    WHERE be.id IS NULL
    ORDER BY bver.id, bb.id, bv.chapter, bv.verse
    LIMIT ${BATCH_SIZE} OFFSET ${offset}
  `;
  return results;
}

async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  });
  return response.data.map((d) => d.embedding);
}

async function storeEmbedding(verseId: string, embedding: number[]): Promise<void> {
  const id = randomUUID();
  const vectorStr = `[${embedding.join(',')}]`;
  await prisma.$executeRaw`
    INSERT INTO bible_embeddings (id, verse_id, embedding, created_at)
    VALUES (${id}, ${verseId}, ${vectorStr}::vector, NOW())
    ON CONFLICT (verse_id) DO UPDATE SET embedding = EXCLUDED.embedding
  `;
}

async function main(): Promise<void> {
  if (DRY_RUN) {
    console.log('🔍 DRY RUN mode — no embeddings will be stored');
  }

  console.log('🔢 Starting embedding generation...');

  let offset = 0;
  let totalProcessed = 0;
  let totalErrors = 0;

  while (true) {
    const verses = await fetchUnembeddedVerses(offset);
    if (verses.length === 0) {
      console.log('✅ All verses have been embedded.');
      break;
    }

    console.log(`\n📦 Processing batch of ${verses.length} verses (offset: ${offset})...`);

    const texts = verses.map(
      (v) => `${v.bookName} ${v.chapter}:${v.verse} (${v.versionAbbr}): ${v.text}`
    );

    let embeddings: number[][] = [];
    try {
      embeddings = await generateEmbeddings(texts);
    } catch (err) {
      console.error(`❌ Failed to generate embeddings for batch at offset ${offset}:`, err);
      totalErrors += verses.length;
      offset += BATCH_SIZE;
      continue;
    }

    for (let i = 0; i < verses.length; i++) {
      const v = verses[i];
      const embedding = embeddings[i];

      if (!embedding) {
        console.error(`  ⚠️  No embedding returned for verse ${v.id}`);
        totalErrors++;
        continue;
      }

      if (!DRY_RUN) {
        try {
          await storeEmbedding(v.id, embedding);
          totalProcessed++;
        } catch (err) {
          console.error(`  ❌ Failed to store embedding for verse ${v.id}:`, err);
          totalErrors++;
        }
      } else {
        console.log(`  [DRY] Would embed: ${v.bookName} ${v.chapter}:${v.verse} (${v.versionAbbr})`);
        totalProcessed++;
      }
    }

    console.log(`  ✅ Batch complete. Total processed: ${totalProcessed}, errors: ${totalErrors}`);
    offset += BATCH_SIZE;

    // Small delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  console.log(`\n🎉 Embedding complete! Processed: ${totalProcessed}, Errors: ${totalErrors}`);
}

main()
  .catch((err) => {
    console.error('❌ Embed script failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
