import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { computeTextDiff } from '../../utils/engines';

export const TextDiff: React.FC = () => {
  const [text1, setText1] = useState('Apple\nBanana\nOrange\nCherry');
  const [text2, setText2] = useState('Apple\nBlueberry\nBanana\nStrawberry\nOrange');
  
  const diff = computeTextDiff(text1, text2);

  return (
    <ToolLayout
      title="Text Diff & Comparison"
      description="Compare two sets of text files or code side by side. Displays highlighted line insertions (green) and deletions (red) in real-time."
      category="Text Utilities"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-6)'
          }}
        >
          <GlassCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Original Text (Left)</h3>
            <ToolInput
              value={text1}
              onChange={setText1}
              placeholder="Paste original text here..."
              label="Original File Content"
            />
          </GlassCard>

          <GlassCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Modified Text (Right)</h3>
            <ToolInput
              value={text2}
              onChange={setText2}
              placeholder="Paste modified text here..."
              label="Modified File Content"
            />
          </GlassCard>
        </div>

        <GlassCard>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Line-by-Line Visual Difference</h3>
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
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}
          >
            {diff.length === 0 ? (
              <span style={{ color: 'var(--text-muted)' }}>No text entered or compared.</span>
            ) : (
              diff.map((line, index) => {
                let backgroundColor = 'transparent';
                let textColor = 'var(--text-secondary)';
                let prefix = ' ';
                let borderColor = 'transparent';

                if (line.type === 'added') {
                  backgroundColor = 'hsla(142, 70%, 45%, 0.15)';
                  textColor = 'hsl(142, 75%, 65%)';
                  prefix = '+';
                  borderColor = 'hsla(142, 70%, 45%, 0.4)';
                } else if (line.type === 'removed') {
                  backgroundColor = 'hsla(350, 70%, 45%, 0.15)';
                  textColor = 'hsl(350, 75%, 65%)';
                  prefix = '-';
                  borderColor = 'hsla(350, 70%, 45%, 0.4)';
                }

                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      padding: '4px 8px',
                      backgroundColor,
                      color: textColor,
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '2px',
                      borderLeft: `3px solid ${borderColor}`
                    }}
                  >
                    <span style={{ width: '20px', userSelect: 'none', opacity: 0.5 }}>{prefix}</span>
                    <span>{line.value || ' '}</span>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
