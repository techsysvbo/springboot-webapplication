'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Citation } from '@/lib/types';

interface ScriptureCardProps {
  citation: Citation;
}

export default function ScriptureCard({ citation }: ScriptureCardProps) {
  const [copied,    setCopied]    = useState(false);
  const [expanded,  setExpanded]  = useState(false);

  const TRUNCATE_LENGTH = 200;
  const isLong = citation.text.length > TRUNCATE_LENGTH;
  const displayText = isLong && !expanded
    ? citation.text.slice(0, TRUNCATE_LENGTH) + '…'
    : citation.text;

  const handleCopy = () => {
    const text = `"${citation.text}" — ${citation.reference} (${citation.version})`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="verse-card rounded-lg p-4 my-2 shadow-sm">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm font-semibold" style={{ color: 'var(--color-gold-dark)' }}>
          {citation.reference}
          <span
            className="ml-2 text-xs font-normal px-1.5 py-0.5 rounded"
            style={{ background: 'var(--color-gold)', color: 'var(--color-navy-dark)' }}
          >
            {citation.version}
          </span>
        </span>
        <button
          onClick={handleCopy}
          className="shrink-0 p-1 rounded transition-colors hover:opacity-70"
          style={{ color: 'var(--color-text-muted)' }}
          title="Copy verse"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>

      <p className="text-sm leading-relaxed italic" style={{ color: 'var(--color-text)' }}>
        &ldquo;{displayText}&rdquo;
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 flex items-center gap-1 text-xs transition-colors hover:opacity-70"
          style={{ color: 'var(--color-gold-dark)' }}
        >
          {expanded ? (
            <><ChevronUp size={12} /> Show less</>
          ) : (
            <><ChevronDown size={12} /> Read more</>
          )}
        </button>
      )}
    </div>
  );
}
