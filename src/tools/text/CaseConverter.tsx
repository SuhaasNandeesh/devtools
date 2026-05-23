import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { convertCase } from '../../utils/engines';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState('Hello World! This is offline DevTools.');
  const [format, setFormat] = useState<'camel' | 'pascal' | 'snake' | 'kebab' | 'constant'>('camel');

  const result = convertCase(text, format);

  const formats: { id: typeof format; label: string; example: string }[] = [
    { id: 'camel', label: 'camelCase', example: 'helloWorld' },
    { id: 'pascal', label: 'PascalCase', example: 'HelloWorld' },
    { id: 'snake', label: 'snake_case', example: 'hello_world' },
    { id: 'kebab', label: 'kebab-case', example: 'hello-world' },
    { id: 'constant', label: 'CONSTANT_CASE', example: 'HELLO_WORLD' }
  ];

  return (
    <ToolLayout
      title="String Case Converter"
      description="Instantly convert text strings between multiple formatting casings: camelCase, PascalCase, snake_case, kebab-case, or CONSTANT_CASE offline."
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
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Source Text</h3>
          
          <ToolInput
            value={text}
            onChange={setText}
            placeholder="Type or paste source text here..."
            label="Input Text"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Target Casing Format</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {formats.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id)}
                  className={`glass-button ${format === fmt.id ? 'active' : ''}`}
                  style={{
                    flex: '1 1 calc(50% - var(--space-2))',
                    minWidth: '120px',
                    textAlign: 'left',
                    padding: 'var(--space-2) var(--space-3)'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{fmt.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>e.g. {fmt.example}</div>
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4">
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Converted Outcome</h3>
          <ToolOutput
            value={result}
            label="Result"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
