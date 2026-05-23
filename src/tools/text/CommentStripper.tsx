import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { stripCodeComments } from '../../utils/engines';

export const CommentStripper: React.FC = () => {
  const [code, setCode] = useState(`// This is a single-line comment in JavaScript
const port = 8080; /* Multi-line server setup block */
console.log("Server listening..."); // Log to console`);
  
  const [lang, setLang] = useState<'javascript' | 'python' | 'cpp' | 'html' | 'css'>('javascript');

  const result = stripCodeComments(code, lang);

  const languages: { id: typeof lang; name: string }[] = [
    { id: 'javascript', name: 'JS / TS' },
    { id: 'python', name: 'Python' },
    { id: 'cpp', name: 'C++' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' }
  ];

  return (
    <ToolLayout
      title="Code Comment Stripper"
      description="Remove single-line, block, and multi-line comments from various code blocks like JS/TS, Python, C++, HTML, and CSS offline."
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
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Raw Code Input</h3>
          
          <ToolInput
            value={code}
            onChange={setCode}
            placeholder="Paste code blocks here..."
            label="Source Code"
          />

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Target Programming Language
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {languages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLang(item.id)}
                  className={`glass-button ${lang === item.id ? 'active' : ''}`}
                  style={{ flex: 1, padding: 'var(--space-2)', minWidth: '80px', fontSize: '0.8rem' }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4">
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Stripped Outcome</h3>
          <ToolOutput
            value={result}
            label="Clean Code"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
