import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { countWordsAndTokens } from '../../utils/engines';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState('Offline Developer Tools suite is an ultra-premium, 100% offline toolbox designed with beautiful glassmorphism. It empowers engineers to decode, format, split, convert and compute hash signatures securely without any data ever leaving their devices. Fast, fluid and gorgeous.');

  const stats = countWordsAndTokens(text);

  const formatMinSec = (minFloat: number): string => {
    const totalSec = Math.round(minFloat * 60);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  };

  return (
    <ToolLayout
      title="Word & Token Counter"
      description="Live typing text analyzer counting words, characters, sentences, average reading or speaking speeds, and mapping word density frequency charts offline."
      category="Text Utilities"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Statistics Grid cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'var(--space-4)'
          }}
        >
          {[
            { label: 'Words', val: stats.words },
            { label: 'Chars (with space)', val: stats.charsWithSpaces },
            { label: 'Chars (no space)', val: stats.charsNoSpaces },
            { label: 'Sentences', val: stats.sentences },
            { label: 'Paragraphs', val: stats.paragraphs },
            { label: 'Est. Read Time', val: formatMinSec(stats.readingTimeMin) },
            { label: 'Est. Speak Time', val: formatMinSec(stats.speakingTimeMin) }
          ].map((item, idx) => (
            <GlassCard
              key={idx}
              style={{
                textAlign: 'center',
                padding: 'var(--space-4) var(--space-2)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</div>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: 'var(--accent-primary)',
                  marginTop: '4px'
                }}
              >
                {item.val}
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Input box and density breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-6)'
          }}
        >
          <GlassCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Input Text</h3>
            <ToolInput
              value={text}
              onChange={setText}
              placeholder="Start typing your paragraph here..."
              label="Live Editor"
            />
          </GlassCard>

          <GlassCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Word Density Map (Top 10)</h3>
            {stats.density.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: 'var(--space-6)' }}>
                No words counted yet to build density map.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {stats.density.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'between', fontSize: '0.8rem' }}>
                      <span className="font-mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.word}</span>
                      <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {item.count} times ({item.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div
                      style={{
                        height: '6px',
                        width: '100%',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${item.percentage}%`,
                          background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                          borderRadius: '3px'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

      </div>
    </ToolLayout>
  );
};
