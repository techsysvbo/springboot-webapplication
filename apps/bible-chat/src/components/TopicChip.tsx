'use client';

interface TopicChipProps {
  label:    string;
  onClick:  (label: string) => void;
}

export default function TopicChip({ label, onClick }: TopicChipProps) {
  return (
    <button
      onClick={() => onClick(label)}
      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
      style={{
        background:   'var(--color-parchment)',
        color:        'var(--color-navy)',
        border:       '1px solid var(--color-gold)',
        boxShadow:    '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      {label}
    </button>
  );
}
