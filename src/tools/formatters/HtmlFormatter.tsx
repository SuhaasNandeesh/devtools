import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { formatHtml } from '../../utils/engines';

export const HtmlFormatter: React.FC = () => {
  const [inputText, setInputText] = useState('<div><section><h1>Title</h1><p>Welcome to DevTools!</p><hr><img src="logo.png" /></section></div>');
  const [outputText, setOutputText] = useState('');
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'minify'>('2');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!inputText || !inputText.trim()) {
      setOutputText('');
      setErrorMsg(null);
      return;
    }

    try {
      if (!inputText.trim().startsWith('<') && !inputText.toLowerCase().includes('html')) {
        // Warning-style message but let it proceed
      }
      
      const minify = indentSize === 'minify';
      const size = indentSize === 'minify' ? 2 : parseInt(indentSize, 10);
      const res = formatHtml(inputText, minify, size);
      
      setErrorMsg(null);
      setOutputText(res);
    } catch (e: any) {
      setErrorMsg(e.message || 'Malformed HTML markup');
      setOutputText('');
    }
  }, [inputText, indentSize]);

  return (
    <ToolLayout
      title="HTML Formatter & Minifier"
      description="Format, indent, structure, and minify HTML templates offline. Bypasses indentation for void / self-closing tag elements."
      category="Formatters"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {/* Input Configuration Pane */}
        <GlassCard>
          <div className="flex justify-between items-center w-full flex-wrap gap-2">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Configuration</h2>
            <div className="flex items-center gap-4">
              <select
                value={indentSize}
                onChange={(e) => setIndentSize(e.target.value as any)}
                className="glass-input"
                style={{
                  width: 'auto',
                  padding: '2px var(--space-2)',
                  fontSize: '0.75rem',
                  border: '1px solid var(--border-primary)',
                  cursor: 'pointer'
                }}
              >
                <option value="2">2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="minify">Minify</option>
              </select>
            </div>
          </div>

          <ToolInput
            value={inputText}
            onChange={setInputText}
            placeholder="Paste your raw HTML tags here..."
            label="Raw HTML Input"
          />
        </GlassCard>

        {/* Formatted Output Pane */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Formatted HTML</h2>
          <ToolOutput
            value={errorMsg ? '' : outputText}
            error={errorMsg}
            label={indentSize === 'minify' ? 'Minified HTML Code' : 'Pretty-Printed HTML'}
            fileName={indentSize === 'minify' ? 'minified.html' : 'formatted.html'}
            sourceTool="HTML Formatter"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
