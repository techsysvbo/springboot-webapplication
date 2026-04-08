import { generateEmbedding, semanticSearch, keywordSearch, VerseResult } from './embeddings';
import { streamChat, Message } from './llm';
import prisma from './db';

export interface Citation {
  reference: string;
  text: string;
  version: string;
  bookName: string;
  chapter: number;
  verse: number;
}

export interface RAGResult {
  answer: string;
  citations: Citation[];
  intent: string;
  confidence: number;
}

const INTENTS = ['verse_lookup', 'topical_search', 'doctrinal_question', 'comparison', 'devotional', 'general'] as const;
type Intent = typeof INTENTS[number];

const SYSTEM_PROMPT = `You are BibleAI, a reverent and knowledgeable Bible assistant. Your ONLY knowledge source is the Holy Bible.

STRICT RULES:
1. Answer ONLY using the provided Bible passages. Never add information not found in the given scriptures.
2. ALWAYS cite specific verses using format: (Book Chapter:Verse, VERSION)
3. If the provided passages don't answer the question, say: "The Bible passages I found don't directly address this. Please try rephrasing or ask about a related topic."
4. Be respectful of all Christian denominations. Note differences when Catholic deuterocanonical books are relevant.
5. For devotional format: be warm, encouraging, pastoral
6. For academic format: be precise, reference original language notes when relevant
7. For simple format: use plain language, avoid jargon
8. For deep study format: provide thorough theological analysis
9. Never speculate beyond what scripture says.
10. Start responses by directly answering the question, then provide supporting verses.`;

export async function classifyIntent(query: string): Promise<Intent> {
  const lowerQuery = query.toLowerCase();

  if (/^(what does|where is|find|read|give me)\s+\w+\s+\d+:\d+/.test(lowerQuery) ||
      /\b[a-z]+\s+\d+:\d+\b/.test(lowerQuery)) {
    return 'verse_lookup';
  }
  if (/\bcompare\b|\bversions?\b|\bdifference\b|\bkjv vs\b|\bniv vs\b/.test(lowerQuery)) {
    return 'comparison';
  }
  if (/\bdevotional\b|\bmeditat\b|\breflect\b|\bencourag\b|\binspir\b/.test(lowerQuery)) {
    return 'devotional';
  }
  if (/\bwhat does\b|\bteach\b|\bdoctrin\b|\btheolog\b|\bbelief\b|\bbiblical view\b/.test(lowerQuery)) {
    return 'doctrinal_question';
  }
  if (/\bverses? about\b|\bpassages? about\b|\bwhat does the bible say\b|\btopics?\b/.test(lowerQuery)) {
    return 'topical_search';
  }

  return 'general';
}

export async function retrieveVerses(
  query: string,
  versionIds: string[],
  limit = 8
): Promise<Citation[]> {
  let results: VerseResult[] = [];

  try {
    const embedding = await generateEmbedding(query);
    results = await semanticSearch(embedding, versionIds, limit);
  } catch (err) {
    console.warn('[RAG] Semantic search failed, falling back to keyword search:', err);
  }

  // Keyword fallback if semantic returns nothing
  if (results.length === 0) {
    try {
      results = await keywordSearch(query, versionIds, limit);
    } catch (err) {
      console.warn('[RAG] Keyword search also failed:', err);
    }
  }

  // Expand with cross-references for the top result
  if (results.length > 0) {
    try {
      const topVerseId = results[0].id;
      const crossRefs = await prisma.verseReference.findMany({
        where: { fromVerseId: topVerseId },
        include: {
          toVerse: {
            include: { book: true, version: true },
          },
        },
        take: 3,
      });
      for (const ref of crossRefs) {
        const v = ref.toVerse;
        if (versionIds.includes(v.versionId)) {
          results.push({
            id: v.id,
            versionId: v.versionId,
            bookId: v.bookId,
            chapter: v.chapter,
            verse: v.verse,
            text: v.text,
            bookName: v.book.name,
            versionAbbr: v.version.abbreviation,
            similarity: 0.5,
          });
        }
      }
    } catch {
      // cross-reference expansion is best-effort
    }
  }

  return results.map((r) => ({
    reference: `${r.bookName} ${r.chapter}:${r.verse}`,
    text: r.text,
    version: r.versionAbbr,
    bookName: r.bookName,
    chapter: r.chapter,
    verse: r.verse,
  }));
}

export async function* generateAnswer(
  query: string,
  citations: Citation[],
  intent: Intent | string,
  format: string
): AsyncIterable<string> {
  const formatInstructions: Record<string, string> = {
    simple: 'Use plain, easy-to-understand language. Avoid theological jargon.',
    devotional: 'Be warm, encouraging, and pastoral. Speak to the heart.',
    academic: 'Be precise and scholarly. Reference Greek/Hebrew context where relevant.',
    deep_study: 'Provide thorough theological analysis with cross-references and historical context.',
  };

  const passagesText = citations.length > 0
    ? citations.map((c) => `${c.reference} (${c.version}): "${c.text}"`).join('\n')
    : 'No specific passages found. Provide a general answer about this topic using only well-known scriptures.';

  const userMessage = `
USER QUESTION: ${query}

INTENT: ${intent}
RESPONSE FORMAT: ${format} — ${formatInstructions[format] ?? formatInstructions.simple}

RELEVANT BIBLE PASSAGES:
${passagesText}

Please provide a helpful, scripture-based answer using ONLY the passages above.
`.trim();

  const messages: Message[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user',   content: userMessage },
  ];

  yield* streamChat(messages, { temperature: 0.6 });
}
