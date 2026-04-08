'use client';

import { Plus, MessageSquare, Sun, Moon, BookOpen } from 'lucide-react';
import { ChatSession, BibleVersion, ResponseFormat } from '@/lib/types';
import VersionSelector from './VersionSelector';

interface SidebarProps {
  sessions:         ChatSession[];
  currentSessionId: string | null;
  versions:         BibleVersion[];
  selectedVersions: string[];
  format:           ResponseFormat;
  isDark:           boolean;
  isOpen:           boolean;
  onNewChat:        () => void;
  onSelectSession:  (id: string) => void;
  onVersionChange:  (versions: string[]) => void;
  onFormatChange:   (f: ResponseFormat) => void;
  onToggleDark:     () => void;
  onClose:          () => void;
}

const FORMAT_OPTIONS: { value: ResponseFormat; label: string; icon: string }[] = [
  { value: 'simple',     label: 'Simple',     icon: '📖' },
  { value: 'devotional', label: 'Devotional',  icon: '🙏' },
  { value: 'academic',   label: 'Academic',    icon: '📚' },
  { value: 'deep_study', label: 'Deep Study',  icon: '🔬' },
];

export default function Sidebar({
  sessions,
  currentSessionId,
  versions,
  selectedVersions,
  format,
  isDark,
  isOpen,
  onNewChat,
  onSelectSession,
  onVersionChange,
  onFormatChange,
  onToggleDark,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 flex flex-col transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          width:      '280px',
          background: 'var(--color-navy)',
          borderRight: '1px solid rgba(201,168,76,0.2)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shadow-md"
            style={{ background: 'var(--color-gold)' }}
          >
            🕊️
          </div>
          <div>
            <div className="text-gradient-gold font-bold text-lg leading-none">BibleAI</div>
            <div className="text-xs mt-0.5" style={{ color: 'rgba(201,168,76,0.7)' }}>
              Scripture-powered AI
            </div>
          </div>
        </div>

        {/* New Chat */}
        <div className="px-3 py-3">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 active:scale-98"
            style={{
              background: 'var(--color-gold)',
              color:      'var(--color-navy-dark)',
              boxShadow:  '0 2px 8px rgba(201,168,76,0.3)',
            }}
          >
            <Plus size={16} />
            New Chat
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {sessions.length === 0 ? (
            <div className="text-center py-6" style={{ color: 'rgba(201,168,76,0.5)' }}>
              <BookOpen size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(201,168,76,0.5)' }}>
                Recent
              </p>
              {sessions.slice(0, 30).map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors hover:opacity-80"
                  style={{
                    background: session.id === currentSessionId
                      ? 'rgba(201,168,76,0.15)'
                      : 'transparent',
                    color: session.id === currentSessionId
                      ? 'var(--color-gold)'
                      : 'rgba(245,240,232,0.75)',
                    border: session.id === currentSessionId
                      ? '1px solid rgba(201,168,76,0.3)'
                      : '1px solid transparent',
                  }}
                >
                  <MessageSquare size={14} className="shrink-0 opacity-70" />
                  <span className="text-sm truncate">{session.title}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bottom controls */}
        <div className="px-3 py-4 space-y-3" style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}>
          {/* Version selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 px-1" style={{ color: 'rgba(201,168,76,0.5)' }}>
              Bible Version
            </p>
            <VersionSelector
              versions={versions}
              selected={selectedVersions}
              onChange={onVersionChange}
            />
          </div>

          {/* Format selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1.5 px-1" style={{ color: 'rgba(201,168,76,0.5)' }}>
              Response Style
            </p>
            <div className="grid grid-cols-2 gap-1">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFormatChange(opt.value)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors"
                  style={{
                    background: format === opt.value ? 'rgba(201,168,76,0.2)' : 'transparent',
                    color:      format === opt.value ? 'var(--color-gold)' : 'rgba(245,240,232,0.6)',
                    border:     format === opt.value ? '1px solid rgba(201,168,76,0.4)' : '1px solid transparent',
                  }}
                >
                  <span>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dark mode */}
          <button
            onClick={onToggleDark}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-80"
            style={{ color: 'rgba(245,240,232,0.6)' }}
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </aside>
    </>
  );
}
