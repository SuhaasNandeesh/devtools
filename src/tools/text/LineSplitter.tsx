import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { splitLinesByDelimiter } from '../../utils/engines';

export const LineSplitter: React.FC = () => {
  const [text, setText] = useState('apple,banana,orange,cherry,blueberry,strawberry,mango,grapes');
  const [mode, setMode] = useState<'delimiter' | 'size'>('delimiter');
  const [limit, setLimit] = useState<number>(10);
  const [delimiter, setDelimiter] = useState<string>(',');

  const resultList = splitLinesByDelimiter(text, limit, { mode, delimiter });

  return (
    <ToolLayout
      title="Huge Line Splitter"
      description="Split large CSV, logs, or long horizontal text strings into neat vertical chunks based on custom separators or character size bounds offline."
      category="Text Utilities"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        <GlassCard className="flex flex-col gap-4">
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Split Configuration</h3>

          <ToolInput
            value={text}
            onChange={setText}
            placeholder="Paste horizontal data dump here..."
            label="Raw Input Text"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 'var(--space-2)' }}>
                Splitting Strategy
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => setMode('delimiter')}
                  className={`glass-button ${mode === 'delimiter' ? 'active' : ''}`}
                  style={{ flex: 1, padding: 'var(--space-2)', fontSize: '0.8rem' }}
                >
                  By Custom Delimiter
                </button>
                <button
                  onClick={() => setMode('size')}
                  className={`glass-button ${mode === 'size' ? 'active' : ''}`}
                  style={{ flex: 1, padding: 'var(--space-2)', fontSize: '0.8rem' }}
                >
                  By Character Size Chunk
                </button>
              </div>
            </div>

            {mode === 'delimiter' ? (
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Custom Separator / Delimiter
                </label>
                <input
                  type="text"
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="glass-input font-mono"
                  placeholder="e.g. , or ; or \n"
                  style={{ width: '100%' }}
                />
              </div>
            ) : (
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Max Characters per Block
                </label>
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="glass-input font-mono"
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Split Results ({resultList.length} blocks)</h3>
          </div>

          <div
            className="font-mono"
            style={{
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-primary)',
              background: 'hsla(224, 25%, 3%, 0.25)',
              maxHeight: '400px',
              overflowY: 'auto',
              fontSize: '0.85rem',
              lineHeight: 1.6,
              wordBreak: 'break-all'
            }}
          >
            {resultList.map((block, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)',
                  padding: '6px var(--space-2)',
                  borderBottom: idx === resultList.length - 1 ? 'none' : '1px solid var(--border-primary)',
                  backgroundColor: idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
                }}
              >
                <span
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    minWidth: '24px',
                    userSelect: 'none'
                  }}
                >
                  [{idx + 1}]
                </span>
                <span style={{ color: 'var(--text-primary)' }}>{block}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
