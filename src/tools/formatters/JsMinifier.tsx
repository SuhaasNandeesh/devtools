import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { minifyJsTs } from '../../utils/engines';

export const JsMinifier: React.FC = () => {
  const [inputText, setInputText] = useState(`// Premium Client-Side Minifier
const devSuite = {
  name: "Offline Devtools",
  features: ["Secure", "Offline", "Fast"],
  logProgress: function() {
    /* Multi-line comments
       will be stripped out */
    console.log("Minifying: " + this.name);
  }
};
devSuite.logProgress();`);
  const [outputText, setOutputText] = useState('');
  const [stats, setStats] = useState<{ original: number; minified: number; savings: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!inputText || !inputText.trim()) {
      setOutputText('');
      setStats(null);
      setErrorMsg(null);
      return;
    }

    try {
      const minified = minifyJsTs(inputText);
      setErrorMsg(null);
      setOutputText(minified);

      const origBytes = new TextEncoder().encode(inputText).length;
      const minBytes = new TextEncoder().encode(minified).length;
      const savingsPercent = origBytes > 0 ? ((origBytes - minBytes) / origBytes) * 100 : 0;
      
      setStats({
        original: origBytes,
        minified: minBytes,
        savings: Number(savingsPercent.toFixed(1))
      });
    } catch (e: any) {
      setErrorMsg(e.message || 'Error minifying JavaScript/TypeScript code');
      setOutputText('');
      setStats(null);
    }
  }, [inputText]);

  return (
    <ToolLayout
      title="JavaScript/TypeScript Minifier"
      description="Compress, compact, and minify your JS/TS scripts offline. Safely strips multi-line and trailing comments and optimizes variable spacings."
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
          <div className="flex justify-between items-center w-full flex-wrap gap-2" style={{ marginBottom: 'var(--space-2)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>JavaScript Code Input</h2>
            
            {stats && (
              <div
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'hsla(140, 70%, 50%, 0.15)',
                  border: '1px solid hsla(140, 70%, 50%, 0.3)',
                  color: 'hsl(140, 80%, 45%)',
                  fontWeight: 500
                }}
              >
                Saved {stats.savings}% ({stats.original} B → {stats.minified} B)
              </div>
            )}
          </div>

          <ToolInput
            value={inputText}
            onChange={setInputText}
            placeholder="Paste your raw JS/TS script here..."
            label="Raw Source Code"
          />
        </GlassCard>

        {/* Formatted Output Pane */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Minified Script Output</h2>
          <ToolOutput
            value={errorMsg ? '' : outputText}
            error={errorMsg}
            label="Minified Code String"
            fileName="minified.js"
            sourceTool="JS Minifier"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
