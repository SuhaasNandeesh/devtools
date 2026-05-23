import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { formatCss } from '../../utils/engines';

export const CssFormatter: React.FC = () => {
  const [inputText, setInputText] = useState('body{background-color:hsl(240,10%,3%);color:hsl(0,0%,100%);margin:0}h1,h2{font-family:"Outfit",sans-serif;margin-bottom:var(--space-4)}@media (max-width:768px){body{font-size:14px}}');
  const [outputText, setOutputText] = useState('');
  const [indentSize, setIndentSize] = useState<'2' | 'minify'>('2');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!inputText || !inputText.trim()) {
      setOutputText('');
      setErrorMsg(null);
      return;
    }

    try {
      const minify = indentSize === 'minify';
      const res = formatCss(inputText, minify);
      setErrorMsg(null);
      setOutputText(res);
    } catch (e: any) {
      setErrorMsg(e.message || 'Error processing CSS stylesheet');
      setOutputText('');
    }
  }, [inputText, indentSize]);

  return (
    <ToolLayout
      title="CSS Beautifier & Minifier"
      description="Format, prettify, ruleset-indent, and compress CSS stylesheets locally offline. Supports media queries and selectors spacing rules."
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
                <option value="2">Beautify</option>
                <option value="minify">Minify</option>
              </select>
            </div>
          </div>

          <ToolInput
            value={inputText}
            onChange={setInputText}
            placeholder="Paste your raw CSS rules here..."
            label="Raw CSS Input"
          />
        </GlassCard>

        {/* Formatted Output Pane */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Formatted CSS</h2>
          <ToolOutput
            value={errorMsg ? '' : outputText}
            error={errorMsg}
            label={indentSize === 'minify' ? 'Minified Stylesheet' : 'Pretty-Printed CSS'}
            fileName={indentSize === 'minify' ? 'minified.css' : 'formatted.css'}
            sourceTool="CSS Formatter"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
