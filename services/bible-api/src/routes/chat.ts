import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/db';
import * as cache from '../lib/cache';
import { classifyIntent, retrieveVerses, generateAnswer, Citation } from '../lib/rag';

const router = Router();

const ChatRequestSchema = z.object({
  message:   z.string().min(1).max(2000),
  sessionId: z.string().uuid().optional(),
  versions:  z.array(z.string()).min(1).default(['KJV']),
  format:    z.enum(['simple', 'devotional', 'academic', 'deep_study']).default('simple'),
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const parsed = ChatRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
    return;
  }

  const { message, versions, format } = parsed.data;
  let { sessionId } = parsed.data;

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const sendEvent = (event: string, data: unknown): void => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    // Resolve version IDs from abbreviations
    const versionRecords = await prisma.bibleVersion.findMany({
      where: { abbreviation: { in: versions } },
    });
    const versionIds = versionRecords.map((v) => v.id);

    if (versionIds.length === 0) {
      sendEvent('error', { message: 'No valid Bible versions found' });
      res.end();
      return;
    }

    // Session management
    if (sessionId) {
      const existing = await prisma.chatSession.findUnique({ where: { id: sessionId } });
      if (!existing) sessionId = undefined;
    }

    if (!sessionId) {
      const session = await prisma.chatSession.create({
        data: { id: uuidv4(), title: message.slice(0, 60) },
      });
      sessionId = session.id;
    }

    // Save user message
    const userMessageId = uuidv4();
    await prisma.chatMessage.create({
      data: { id: userMessageId, sessionId: sessionId!, role: 'user', content: message },
    });

    // Check cache for same query
    const cacheKey = `chat:${message}:${versions.sort().join(',')}:${format}`;
    const cached = await cache.get<{ answer: string; citations: Citation[] }>(cacheKey);

    let citations: Citation[] = [];
    let fullAnswer = '';

    if (cached) {
      // Stream cached answer token by token to maintain SSE contract
      const tokens = cached.answer.split(' ');
      for (const token of tokens) {
        sendEvent('token', { token: token + ' ' });
        fullAnswer += token + ' ';
      }
      citations = cached.citations;
    } else {
      // Run RAG pipeline
      const intent = await classifyIntent(message);
      citations = await retrieveVerses(message, versionIds, 8);

      for await (const token of generateAnswer(message, citations, intent, format)) {
        sendEvent('token', { token });
        fullAnswer += token;
      }

      await cache.set(cacheKey, { answer: fullAnswer, citations }, 300);
    }

    // Save assistant message
    const assistantMessageId = uuidv4();
    await prisma.chatMessage.create({
      data: {
        id: assistantMessageId,
        sessionId: sessionId!,
        role: 'assistant',
        content: fullAnswer,
        metadata: JSON.parse(JSON.stringify({ citations, versions, format })),
      },
    });

    sendEvent('citations', { citations });
    sendEvent('done', { sessionId, messageId: assistantMessageId });
    res.end();
  } catch (err) {
    console.error('[Chat] Error:', err);
    sendEvent('error', { message: err instanceof Error ? err.message : 'An unexpected error occurred' });
    res.end();
  }
});

export default router;
