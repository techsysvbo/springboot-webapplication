'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Menu, StopCircle, BookOpen } from 'lucide-react';
import { ResponseFormat } from '@/lib/types';
import { useChat } from '@/hooks/useChat';
import { useVersions } from '@/hooks/useVersions';
import MessageBubble from './MessageBubble';
import Sidebar from './Sidebar';
import TopicChip from './TopicChip';

const SUGGESTED_TOPICS = [
  'What does the Bible say about love?',
  'Verses about strength and courage',
  'John 3:16 meaning',
  'What does the Bible say about prayer?',
  'Verses about peace and anxiety',
  'What is the purpose of life according to the Bible?',
  'Salvation and eternal life in the Bible',
  'Bible verses about faith and trust',
];

export default function ChatInterface() {
  const {
    messages,
    sessions,
    currentSessionId,
    selectedVersions,
    setSelectedVersions,
    format,
    setFormat,
    isLoading,
    sendMessage,
    newChat,
    loadSession,
    stopStreaming,
  } = useChat();

  const { versions, isLoading: versionsLoading } = useVersions();

  const [input,   setInput]   = useState('');
  const [isDark,  setIsDark]  = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Apply dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [input]);

  const handleSubmit = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    await sendMessage(text);
  }, [input, isLoading, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTopicClick = (topic: string) => {
    setInput(topic);
    textareaRef.current?.focus();
  };

  const showEmpty = messages.length === 0;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-cream)' }}>
      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        versions={versions}
        selectedVersions={selectedVersions}
        format={format}
        isDark={isDark}
        isOpen={sidebarOpen}
        onNewChat={() => { newChat(); setSidebarOpen(false); }}
        onSelectSession={(id) => { loadSession(id); setSidebarOpen(false); }}
        onVersionChange={setSelectedVersions}
        onFormatChange={(f: ResponseFormat) => setFormat(f)}
        onToggleDark={() => setIsDark(!isDark)}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header
          className="flex items-center justify-between px-4 py-3 shrink-0"
          style={{
            background:   'var(--color-cream)',
            borderBottom: '1px solid var(--color-border)',
            boxShadow:    '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg transition-colors hover:opacity-70"
              style={{ color: 'var(--color-navy)' }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xl">🕊️</span>
              <span className="font-bold text-lg hidden sm:block" style={{ color: 'var(--color-navy)' }}>
                BibleAI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <BookOpen size={14} />
            <span className="hidden sm:inline">
              {selectedVersions.join(' · ')} · {format.replace('_', ' ')}
            </span>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {showEmpty ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg"
                  style={{
                    background:  'linear-gradient(135deg, var(--color-navy) 0%, var(--color-navy-light) 100%)',
                    boxShadow:   '0 8px 32px rgba(26,39,68,0.2)',
                  }}
                >
                  🕊️
                </div>

                <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-navy)' }}>
                  Ask anything about the Bible
                </h1>
                <p className="text-base mb-8 max-w-md" style={{ color: 'var(--color-text-muted)' }}>
                  Get scripture-backed answers from {selectedVersions.join(', ')} and other versions.
                  Every answer is grounded in God&apos;s Word.
                </p>

                <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                  {SUGGESTED_TOPICS.map((topic) => (
                    <TopicChip key={topic} label={topic} onClick={handleTopicClick} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {/* Loading dots */}
                {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
                  <div className="flex gap-3 mb-6">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ background: 'var(--color-gold)', color: 'var(--color-navy-dark)' }}
                    >
                      🕊️
                    </div>
                    <div
                      className="rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1"
                      style={{ background: 'var(--color-parchment)', border: '1px solid var(--color-border)' }}
                    >
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full animate-bounce"
                          style={{
                            background:       'var(--color-gold)',
                            animationDelay:   `${i * 0.15}s`,
                            animationDuration: '1s',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </main>

        {/* Input area */}
        <footer
          className="shrink-0 px-4 py-4"
          style={{ borderTop: '1px solid var(--color-border)', background: 'var(--color-cream)' }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              className="flex gap-3 rounded-2xl px-4 py-3 shadow-md transition-shadow hover:shadow-lg"
              style={{
                background: 'var(--color-parchment)',
                border:     '1.5px solid var(--color-border)',
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any Bible topic, verse, or question…"
                rows={1}
                className="flex-1 resize-none bg-transparent outline-none text-sm leading-relaxed"
                style={{
                  color:            'var(--color-text)',
                  minHeight:        '24px',
                  maxHeight:        '160px',
                  fontFamily:       'inherit',
                  overflowY:        'auto',
                }}
                disabled={isLoading}
              />
              <div className="flex items-end gap-2">
                {isLoading ? (
                  <button
                    onClick={stopStreaming}
                    className="p-2 rounded-xl transition-colors hover:opacity-70"
                    style={{ color: 'var(--color-gold-dark)' }}
                    title="Stop generating"
                  >
                    <StopCircle size={20} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="p-2 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: input.trim() ? 'var(--color-navy)' : 'var(--color-border)',
                      color:      input.trim() ? 'var(--color-gold)' : 'var(--color-text-muted)',
                    }}
                    title="Send message"
                  >
                    <Send size={16} />
                  </button>
                )}
              </div>
            </div>

            <p className="text-center text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
              BibleAI answers are grounded in scripture. Press Enter to send, Shift+Enter for new line.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
