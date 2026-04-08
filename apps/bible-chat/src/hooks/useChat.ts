'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage, ChatSession, ResponseFormat, Citation } from '@/lib/types';

const STORAGE_KEY = 'bibleai-sessions';

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments (non-security-sensitive client-side ID)
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function loadSessions(): ChatSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatSession[]) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions: ChatSession[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function useChat() {
  const [sessions, setSessions]               = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedVersions, setSelectedVersions] = useState<string[]>(['KJV']);
  const [format, setFormat]                   = useState<ResponseFormat>('simple');
  const [isLoading, setIsLoading]             = useState(false);
  const abortRef                              = useRef<AbortController | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadSessions();
    setSessions(stored);
  }, []);

  const currentSession = sessions.find((s) => s.id === currentSessionId) ?? null;
  const messages: ChatMessage[] = currentSession?.messages ?? [];

  const newChat = useCallback(() => {
    const session: ChatSession = {
      id:        generateId(),
      title:     'New Chat',
      messages:  [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSessions((prev) => {
      const updated = [session, ...prev];
      saveSessions(updated);
      return updated;
    });
    setCurrentSessionId(session.id);
  }, []);

  const loadSession = useCallback((id: string) => {
    setCurrentSessionId(id);
  }, []);

  const updateSessionMessages = useCallback(
    (sessionId: string, updater: (msgs: ChatMessage[]) => ChatMessage[]) => {
      setSessions((prev) => {
        const updated = prev.map((s) => {
          if (s.id !== sessionId) return s;
          const newMsgs = updater(s.messages);
          return { ...s, messages: newMsgs, updatedAt: new Date().toISOString() };
        });
        saveSessions(updated);
        return updated;
      });
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      // Ensure we have a session
      let sessionId = currentSessionId;
      if (!sessionId) {
        const session: ChatSession = {
          id:        generateId(),
          title:     text.slice(0, 60),
          messages:  [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setSessions((prev) => {
          const updated = [session, ...prev];
          saveSessions(updated);
          return updated;
        });
        setCurrentSessionId(session.id);
        sessionId = session.id;
      }

      // Add user message
      const userMsg: ChatMessage = {
        id:        generateId(),
        role:      'user',
        content:   text,
        createdAt: new Date().toISOString(),
      };
      updateSessionMessages(sessionId, (msgs) => [...msgs, userMsg]);

      // Add placeholder assistant message
      const assistantId = generateId();
      const assistantMsg: ChatMessage = {
        id:          assistantId,
        role:        'assistant',
        content:     '',
        isStreaming: true,
        citations:   [],
        createdAt:   new Date().toISOString(),
      };
      updateSessionMessages(sessionId, (msgs) => [...msgs, assistantMsg]);

      setIsLoading(true);
      abortRef.current = new AbortController();

      try {
        const res = await fetch('/api/chat', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ message: text, sessionId, versions: selectedVersions, format }),
          signal:  abortRef.current.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error('Stream failed');
        }

        const reader  = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer    = '';
        let fullContent = '';
        let citations: Citation[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          let eventType = '';
          let dataLine  = '';

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              dataLine = line.slice(6).trim();
            } else if (line === '') {
              // Process event
              if (dataLine) {
                try {
                  const payload = JSON.parse(dataLine);
                  if (eventType === 'token') {
                    fullContent += payload.token ?? '';
                    updateSessionMessages(sessionId!, (msgs) =>
                      msgs.map((m) =>
                        m.id === assistantId ? { ...m, content: fullContent } : m
                      )
                    );
                  } else if (eventType === 'citations') {
                    citations = payload.citations ?? [];
                  } else if (eventType === 'error') {
                    fullContent = `⚠️ ${payload.message ?? 'An error occurred'}`;
                    updateSessionMessages(sessionId!, (msgs) =>
                      msgs.map((m) =>
                        m.id === assistantId ? { ...m, content: fullContent, isStreaming: false } : m
                      )
                    );
                  }
                } catch {
                  // parse error — skip
                }
              }
              eventType = '';
              dataLine  = '';
            }
          }
        }

        // Finalize message
        updateSessionMessages(sessionId!, (msgs) =>
          msgs.map((m) =>
            m.id === assistantId
              ? { ...m, content: fullContent, citations, isStreaming: false }
              : m
          )
        );

        // Update session title from first message
        setSessions((prev) => {
          const updated = prev.map((s) => {
            if (s.id !== sessionId || s.title !== 'New Chat') return s;
            return { ...s, title: text.slice(0, 60) };
          });
          saveSessions(updated);
          return updated;
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          updateSessionMessages(sessionId!, (msgs) =>
            msgs.map((m) =>
              m.id === assistantId
                ? { ...m, content: '⚠️ Failed to get response. Please try again.', isStreaming: false }
                : m
            )
          );
        }
      } finally {
        setIsLoading(false);
        abortRef.current = null;
      }
    },
    [currentSessionId, selectedVersions, format, isLoading, updateSessionMessages]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    messages,
    sessions,
    currentSessionId,
    currentSession,
    selectedVersions,
    setSelectedVersions,
    format,
    setFormat,
    isLoading,
    sendMessage,
    newChat,
    loadSession,
    stopStreaming,
  };
}
