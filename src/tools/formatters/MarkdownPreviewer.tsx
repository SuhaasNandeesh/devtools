import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { markdownToHtml } from '../../utils/engines';

export const MarkdownPreviewer: React.FC = () => {
  const [inputText, setInputText] = useState(`# Markdown Previewer

Welcome to the premium offline **Markdown Editor**!

## Features

- **Split Pane**: Edit markdown and see live previews in real time.
- **Fast & Zero Dependency**: Processes elements 100% locally client-side.
- **Standard Layouts**: Supports headers, lists, code blocks, images, and links.

### Example Code Block
\`\`\`js
const greet = () => {
  console.log("Offline DevTools is amazing!");
};
\`\`\`

Created by [DevSuite](file:///Users/suhaasnandeesh/Code/ai-app/devtools). Enjoy offline productivity!`);
  const [htmlOutput, setHtmlOutput] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'html'>('split');

  useEffect(() => {
    setHtmlOutput(markdownToHtml(inputText));
  }, [inputText]);

  return (
    <ToolLayout
      title="Markdown to HTML Previewer"
      description="Dual-pane interactive Markdown editor and renderer. Convert document layouts to standard clean HTML tags in real-time."
      category="Formatters"
    >
      {/* Top Navigation Mode Selection */}
      <GlassCard style={{ marginBottom: 'var(--space-4)', padding: 'var(--space-3) var(--space-6)' }}>
        <div className="flex justify-between items-center w-full flex-wrap gap-4">
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>View Mode:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('split')}
              className="glass-button"
              style={{
                fontSize: '0.75rem',
                padding: 'var(--space-1) var(--space-3)',
                borderColor: viewMode === 'split' ? 'var(--accent-primary)' : 'var(--border-primary)',
                background: viewMode === 'split' ? 'hsla(var(--primary-h), var(--primary-s), 50%, 0.15)' : 'transparent'
              }}
            >
              Split View
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className="glass-button"
              style={{
                fontSize: '0.75rem',
                padding: 'var(--space-1) var(--space-3)',
                borderColor: viewMode === 'preview' ? 'var(--accent-primary)' : 'var(--border-primary)',
                background: viewMode === 'preview' ? 'hsla(var(--primary-h), var(--primary-s), 50%, 0.15)' : 'transparent'
              }}
            >
              Visual Preview
            </button>
            <button
              onClick={() => setViewMode('html')}
              className="glass-button"
              style={{
                fontSize: '0.75rem',
                padding: 'var(--space-1) var(--space-3)',
                borderColor: viewMode === 'html' ? 'var(--accent-primary)' : 'var(--border-primary)',
                background: viewMode === 'html' ? 'hsla(var(--primary-h), var(--primary-s), 50%, 0.15)' : 'transparent'
              }}
            >
              Raw HTML Code
            </button>
          </div>
        </div>
      </GlassCard>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'split' ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
          gap: 'var(--space-6)'
        }}
      >
        {/* Editor Pane */}
        {(viewMode === 'split' || viewMode === 'html') && (
          <GlassCard style={{ display: viewMode === 'html' && 'none' ? 'block' : 'none' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Markdown Editor</h2>
            <ToolInput
              value={inputText}
              onChange={setInputText}
              placeholder="Type your markdown here..."
              label="Markdown Source"
            />
          </GlassCard>
        )}
        
        {/* Force showing editor in split mode */}
        {viewMode === 'split' && (
          <GlassCard>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Markdown Editor</h2>
            <ToolInput
              value={inputText}
              onChange={setInputText}
              placeholder="Type your markdown here..."
              label="Markdown Source"
            />
          </GlassCard>
        )}

        {/* Visual Live Glass Previewer */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <GlassCard>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Visual Preview</h2>
            <div
              style={{
                padding: 'var(--space-4)',
                minHeight: '260px',
                maxHeight: '480px',
                overflowY: 'auto',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--glass-bg)',
                lineHeight: 1.6,
                fontSize: '0.9rem',
                color: 'var(--text-primary)'
              }}
              className="markdown-preview-body"
              dangerouslySetInnerHTML={{ __html: htmlOutput }}
            />
          </GlassCard>
        )}

        {/* Raw HTML Code Output Pane */}
        {(viewMode === 'html') && (
          <GlassCard>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Generated HTML</h2>
            <ToolOutput
              value={htmlOutput}
              label="Raw HTML Code"
              fileName="markdown.html"
              sourceTool="Markdown Previewer"
            />
          </GlassCard>
        )}
      </div>
    </ToolLayout>
  );
};
