import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';
import { generateLoremIpsum } from '../../utils/engines';

export const LoremIpsumGenerator: React.FC = () => {
  const [count, setCount] = useState(5);
  const [unit, setUnit] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [outputText, setOutputText] = useState('');

  const triggerGenerate = () => {
    const res = generateLoremIpsum(count, unit);
    setOutputText(res);
  };

  useEffect(() => {
    triggerGenerate();
  }, [count, unit]);

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate standard offline Latin placeholder text (Lorem Ipsum) by words, sentences, or paragraphs for layouts testing."
      category="Generators"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {/* Controls Pane */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Configuration</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <div className="flex justify-between" style={{ fontSize: '0.85rem', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                <span>Count:</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{count} {unit}</span>
              </div>
              <input
                type="range"
                min="1"
                max={unit === 'words' ? 250 : unit === 'sentences' ? 30 : 15}
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 'var(--space-2)' }}>Generator Unit:</label>
              <div className="flex gap-2">
                {(['words', 'sentences', 'paragraphs'] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => {
                      setUnit(u);
                      setCount(u === 'words' ? 50 : u === 'sentences' ? 10 : 5);
                    }}
                    className="glass-button flex-1"
                    style={{
                      fontSize: '0.75rem',
                      padding: 'var(--space-2) 0',
                      textTransform: 'capitalize',
                      borderColor: unit === u ? 'var(--accent-primary)' : 'var(--border-primary)',
                      background: unit === u ? 'hsla(var(--primary-h), var(--primary-s), 50%, 0.15)' : 'transparent'
                    }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={triggerGenerate}
              className="glass-button w-full"
              style={{ padding: 'var(--space-3) 0', fontWeight: 600, fontSize: '0.85rem', marginTop: 'var(--space-2)' }}
            >
              Regenerate Placeholder Text
            </button>
          </div>
        </GlassCard>

        {/* Output Panel */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Placeholder Output</h2>
          <ToolOutput
            value={outputText}
            label={`Generated ${unit}`}
            fileName="lorem_ipsum.txt"
            sourceTool="Lorem Ipsum"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
