'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage as ChatMessageType } from '@/lib/types';
import ScriptureCard from './ScriptureCard';

interface MessageBubbleProps {
  message: ChatMessageType;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-6">
        <div
          className="max-w-[75%] px-5 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-sm"
          style={{
            background: 'var(--color-navy)',
            color:      '#f5f0e8',
          }}
        >
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-6">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm mt-1 shadow-sm"
        style={{ background: 'var(--color-gold)', color: 'var(--color-navy-dark)' }}
      >
        🕊️
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold mb-1" style={{ color: 'var(--color-gold-dark)' }}>
          BibleAI
        </div>

        <div
          className="rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm"
          style={{ background: 'var(--color-parchment)', border: '1px solid var(--color-border)' }}
        >
          <div
            className={`prose prose-sm max-w-none text-sm leading-relaxed ${message.isStreaming && !message.content ? 'min-h-8' : ''} ${message.isStreaming && message.content ? 'streaming-cursor' : ''}`}
            style={{ color: 'var(--color-text)' }}
          >
            {message.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            ) : message.isStreaming ? (
              <span className="inline-block w-4 h-4 rounded-sm animate-pulse" style={{ background: 'var(--color-gold)' }} />
            ) : null}
          </div>

          {/* Citations / Scripture cards */}
          {!message.isStreaming && message.citations && message.citations.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
                📖 Scripture References
              </p>
              <div className="space-y-2">
                {message.citations.map((c, i) => (
                  <ScriptureCard key={i} citation={c} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-xs mt-1 ml-1" style={{ color: 'var(--color-text-muted)' }}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
