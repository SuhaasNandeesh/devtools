import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { formatXml } from '../../utils/engines';

export const XmlFormatter: React.FC = () => {
  const [inputText, setInputText] = useState('<root><user id="1"><name>John Doe</name><email>john@example.com</email><status active="true" /></user></root>');
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
      // Basic check for well-formedness: if starts with '<' and contains closing bracket
      if (!inputText.trim().startsWith('<')) {
        throw new Error('XML must start with a opening tag element.');
      }
      
      const minify = indentSize === 'minify';
      const size = indentSize === 'minify' ? 2 : parseInt(indentSize, 10);
      const res = formatXml(inputText, minify, size);
      
      setErrorMsg(null);
      setOutputText(res);
    } catch (e: any) {
      setErrorMsg(e.message || 'Malformed XML data');
      setOutputText('');
    }
  }, [inputText, indentSize]);

  return (
    <ToolLayout
      title="XML Formatter & Minifier"
      description="Format, prettify, structure, and minify XML data locally offline. Cleans extra whitespaces and validates tag hierarchies."
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
            placeholder="Paste your raw XML markup here..."
            label="Raw XML Input"
          />
        </GlassCard>

        {/* Formatted Output Pane */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Formatted XML</h2>
          <ToolOutput
            value={errorMsg ? '' : outputText}
            error={errorMsg}
            label={indentSize === 'minify' ? 'Minified XML String' : 'Pretty-Printed XML'}
            fileName={indentSize === 'minify' ? 'minified.xml' : 'formatted.xml'}
            sourceTool="XML Formatter"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
