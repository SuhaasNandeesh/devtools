import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { sortJSONKeys } from '../../utils/engines';

export const JSONFormatter: React.FC = () => {
  const [inputText, setInputText] = useState('{"title":"Offline DevTools","offline":true,"nested":{"array":[1,2,3],"active":true}}');
  const [outputText, setOutputText] = useState('');
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab' | 'minify'>('2');
  const [sortKeys, setSortKeys] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!inputText || !inputText.trim()) {
      setOutputText('');
      setErrorMsg(null);
      return;
    }

    try {
      const parsed = JSON.parse(inputText);
      setErrorMsg(null);

      let processed = parsed;
      if (sortKeys) {
        processed = sortJSONKeys(parsed);
      }

      if (indentSize === 'minify') {
        setOutputText(JSON.stringify(processed));
      } else {
        const spacing = indentSize === 'tab' ? '\t' : parseInt(indentSize, 10);
        setOutputText(JSON.stringify(processed, null, spacing));
      }
    } catch (e: any) {
      let visualError = e.message;
      try {
        const match = e.message.match(/position (\d+)/);
        if (match) {
          const position = parseInt(match[1], 10);
          const sub = inputText.substring(0, position);
          const lines = sub.split('\n');
          const lineNum = lines.length;
          const colNum = lines[lines.length - 1].length + 1;
          visualError = `Syntax Error at line ${lineNum}, column ${colNum}: ${e.message}`;
        }
      } catch {
        // Fallback
      }
      
      setErrorMsg(visualError);
      setOutputText('');
    }
  }, [inputText, indentSize, sortKeys]);

  return (
    <ToolLayout
      title="JSON Formatter & Minifier"
      description="Format, prettify, sort keys, validate, and minify JSON data offline. Displays character positions and line numbers for syntax errors."
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
              <label className="flex items-center gap-2" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={sortKeys}
                  onChange={(e) => setSortKeys(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span>Sort Keys</span>
              </label>

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
                <option value="tab">1 Tab</option>
                <option value="minify">Minify</option>
              </select>
            </div>
          </div>

          <ToolInput
            value={inputText}
            onChange={setInputText}
            placeholder="Paste your raw JSON string here..."
            label="Raw JSON Input"
          />
        </GlassCard>

        {/* Formatted Output Pane */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Formatted JSON</h2>
          <ToolOutput
            value={errorMsg ? '' : outputText}
            error={errorMsg}
            label={indentSize === 'minify' ? 'Minified JSON String' : 'Pretty-Printed JSON'}
            fileName={indentSize === 'minify' ? 'minified.json' : 'formatted.json'}
            sourceTool="JSON Formatter"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
