import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { escapeString, unescapeString } from '../../utils/engines';

export const StringEscaper: React.FC = () => {
  const [text, setText] = useState('<div class="premium">"DevTools" \& \'Developer\'</div>');
  const [format, setFormat] = useState<'html' | 'json' | 'sql' | 'csharp'>('html');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  const result = mode === 'escape' ? escapeString(text, format) : unescapeString(text, format);

  const formats: { id: typeof format; name: string }[] = [
    { id: 'html', name: 'HTML Entities' },
    { id: 'json', name: 'JSON Strings' },
    { id: 'sql', name: 'SQL Quotes' },
    { id: 'csharp', name: 'C# Strings' }
  ];

  return (
    <ToolLayout
      title="String Escaper & Unescaper"
      description="Bidirectionally escape or unescape special control characters for safe insertion into HTML markup, JSON payloads, database SQL statements, or C# string definitions offline."
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
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Input Source</h3>
          
          <ToolInput
            value={text}
            onChange={setText}
            placeholder="Type raw text or encoded sequence here..."
            label="Input Value"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Mode
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button
                  onClick={() => setMode('escape')}
                  className={`glass-button ${mode === 'escape' ? 'active' : ''}`}
                  style={{ flex: 1, padding: 'var(--space-2)', fontSize: '0.8rem' }}
                >
                  Escape
                </button>
                <button
                  onClick={() => setMode('unescape')}
                  className={`glass-button ${mode === 'unescape' ? 'active' : ''}`}
                  style={{ flex: 1, padding: 'var(--space-2)', fontSize: '0.8rem' }}
                >
                  Unescape
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Syntax Target
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="glass-input"
                  style={{ width: '100%', height: '38px', padding: '0 var(--space-2)' }}
                >
                  {formats.map((item) => (
                    <option key={item.id} value={item.id} style={{ background: '#0e1118', color: '#fff' }}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4">
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Processed Result</h3>
          <ToolOutput
            value={result}
            label="Outcome"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
