import OpenAI from 'openai';
import prisma from './db';

export interface VerseResult {
  id: string;
  versionId: string;
  bookId: number;
  chapter: number;
  verse: number;
  text: string;
  bookName: string;
  versionAbbr: string;
  similarity?: number;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return response.data[0].embedding;
}

export async function semanticSearch(
  embedding: number[],
  versionIds: string[],
  limit: number
): Promise<VerseResult[]> {
  const vectorStr = `[${embedding.join(',')}]`;
  const results = await prisma.$queryRaw<VerseResult[]>`
    SELECT
      bv.id,
      bv.version_id AS "versionId",
      bv.book_id    AS "bookId",
      bv.chapter,
      bv.verse,
      bv.text,
      bb.name             AS "bookName",
      bver.abbreviation   AS "versionAbbr",
      1 - (be.embedding <=> ${vectorStr}::vector) AS similarity
    FROM bible_embeddings be
    JOIN bible_verses  bv   ON be.verse_id = bv.id
    JOIN bible_books   bb   ON bv.book_id  = bb.id
    JOIN bible_versions bver ON bv.version_id = bver.id
    WHERE bver.id = ANY(${versionIds}::uuid[])
    ORDER BY be.embedding <=> ${vectorStr}::vector
    LIMIT ${limit}
  `;
  return results;
}

export async function keywordSearch(
  query: string,
  versionIds: string[],
  limit: number
): Promise<VerseResult[]> {
  const results = await prisma.$queryRaw<VerseResult[]>`
    SELECT
      bv.id,
      bv.version_id AS "versionId",
      bv.book_id    AS "bookId",
      bv.chapter,
      bv.verse,
      bv.text,
      bb.name            AS "bookName",
      bver.abbreviation  AS "versionAbbr",
      ts_rank(to_tsvector('english', bv.text), plainto_tsquery('english', ${query})) AS similarity
    FROM bible_verses bv
    JOIN bible_books   bb   ON bv.book_id  = bb.id
    JOIN bible_versions bver ON bv.version_id = bver.id
    WHERE bver.id = ANY(${versionIds}::uuid[])
      AND to_tsvector('english', bv.text) @@ plainto_tsquery('english', ${query})
    ORDER BY similarity DESC
    LIMIT ${limit}
  `;
  return results;
}
