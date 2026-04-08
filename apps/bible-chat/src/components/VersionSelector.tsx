'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { BibleVersion } from '@/lib/types';

interface VersionSelectorProps {
  versions:         BibleVersion[];
  selected:         string[];
  onChange:         (selected: string[]) => void;
  isLoading?:       boolean;
}

export default function VersionSelector({
  versions,
  selected,
  onChange,
  isLoading,
}: VersionSelectorProps) {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = versions.filter(
    (v) =>
      v.abbreviation.toLowerCase().includes(search.toLowerCase()) ||
      v.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (abbr: string) => {
    if (selected.includes(abbr)) {
      const next = selected.filter((s) => s !== abbr);
      if (next.length > 0) onChange(next);
    } else {
      onChange([...selected, abbr]);
    }
  };

  const label = selected.length === 0
    ? 'Select versions'
    : selected.length === 1
      ? selected[0]
      : `${selected[0]} +${selected.length - 1}`;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        style={{
          background: 'var(--color-parchment)',
          border:     '1px solid var(--color-gold)',
          color:      'var(--color-navy)',
          minWidth:   '120px',
        }}
        disabled={isLoading}
      >
        <span className="flex-1 text-left">{isLoading ? 'Loading…' : label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute bottom-full mb-2 left-0 z-50 rounded-xl shadow-xl py-2 min-w-56"
          style={{
            background: 'var(--color-cream)',
            border:     '1px solid var(--color-border)',
          }}
        >
          {/* Search */}
          <div className="px-3 pb-2">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: 'var(--color-parchment)' }}>
              <Search size={12} style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="text"
                placeholder="Search versions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 text-xs bg-transparent outline-none"
                style={{ color: 'var(--color-text)' }}
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filtered.map((v) => (
              <button
                key={v.id}
                onClick={() => toggle(v.abbreviation)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:opacity-80 transition-colors text-left"
              >
                <div
                  className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                  style={{
                    background: selected.includes(v.abbreviation) ? 'var(--color-gold)' : 'transparent',
                    border:     `1.5px solid ${selected.includes(v.abbreviation) ? 'var(--color-gold)' : 'var(--color-border)'}`,
                  }}
                >
                  {selected.includes(v.abbreviation) && (
                    <Check size={10} style={{ color: 'var(--color-navy-dark)' }} />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                    {v.abbreviation}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {v.fullName}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
