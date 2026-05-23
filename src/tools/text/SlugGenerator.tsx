import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { generateTextSlug } from '../../utils/engines';

export const SlugGenerator: React.FC = () => {
  const [text, setText] = useState('Café Noël & Crème Brûlée: The Ultimate Dev-Guide (2026)!');
  const [lowercase, setLowercase] = useState(true);

  const slug = generateTextSlug(text, { lowercase });

  return (
    <ToolLayout
      title="Slug Generator"
      description="Convert article titles or raw Unicode text strings into clean, SEO-optimized, URL-safe hyphenated slugs offline."
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
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Source Title</h3>

          <ToolInput
            value={text}
            onChange={setText}
            placeholder="Type your title or string here..."
            label="Input Text"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={lowercase}
                onChange={(e) => setLowercase(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <span>Force Lowercase Slug</span>
            </label>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4">
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>SEO Safe Slug</h3>
          <ToolOutput
            value={slug}
            label="Generated Slug"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
