import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { ArrowLeftRight } from 'lucide-react';

export const UrlEncoderDecoder: React.FC = () => {
  const [inputText, setInputText] = useState('https://example.com/search?query=offline devtools & active=true');
  const [outputText, setOutputText] = useState('');
  const [encodeMode, setEncodeMode] = useState<'component' | 'full'>('component');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const runEncode = () => {
    if (!inputText) {
      setOutputText('');
      setErrorMsg(null);
      return;
    }
    try {
      setErrorMsg(null);
      if (encodeMode === 'component') {
        setOutputText(encodeURIComponent(inputText));
      } else {
        setOutputText(encodeURI(inputText));
      }
    } catch (err: any) {
      setErrorMsg('Failed to encode string.');
    }
  };

  const runDecode = () => {
    if (!outputText) {
      setInputText('');
      setErrorMsg(null);
      return;
    }
    try {
      setErrorMsg(null);
      setInputText(decodeURIComponent(outputText));
    } catch (err: any) {
      setErrorMsg('Malformed URI sequence. Unable to decode.');
    }
  };

  // Run encoding automatically when inputs/mode change
  useEffect(() => {
    runEncode();
  }, [inputText, encodeMode]);

  return (
    <ToolLayout
      title="URL Encoder & Decoder Workspace"
      description="Safely translate text blocks into URL-compliant ASCII structures or reverse encoded URI sequences back into human-readable characters."
      category="Converters"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-6)',
          width: '100%',
          alignItems: 'start'
        }}
        className="mime-grid-responsive"
      >
        {/* Left Column: Plain text encoder inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Settings panel */}
          <GlassCard style={{ padding: 'var(--space-4)', gap: 'var(--space-4)' }}>
            <div className="flex justify-between items-center w-full" style={{ flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Encoding Mode Parameter
              </span>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {[
                  { id: 'component', label: 'Strict Query Parameter (encodeURIComponent)' },
                  { id: 'full', label: 'Full Host Address (encodeURI)' }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => setEncodeMode(mode.id as any)}
                    className="glass-button glass-button-secondary"
                    style={{
                      padding: '4px 10px',
                      fontSize: '0.66rem',
                      background: encodeMode === mode.id ? 'var(--accent-glow)' : 'transparent',
                      borderColor: encodeMode === mode.id ? 'var(--accent-primary)' : 'var(--border-primary)',
                      color: encodeMode === mode.id ? 'var(--accent-primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Plain Text input */}
          <GlassCard style={{ gap: 'var(--space-4)' }}>
            <div className="flex justify-between items-center w-full">
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Source Plain String</h2>
              <button
                onClick={runEncode}
                className="glass-button"
                style={{ padding: '2px 10px', fontSize: '0.64rem', gap: '4px' }}
              >
                <span>Encode</span>
                <ArrowLeftRight size={10} />
              </button>
            </div>
            
            <ToolInput
              value={inputText}
              onChange={setInputText}
              placeholder="Type raw unescaped string here (e.g. query spacing)..."
              label="Decoded Raw URL"
            />
          </GlassCard>
        </div>

        {/* Right Column: Encoded Outputs */}
        <div style={{ position: 'sticky', top: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <GlassCard style={{ gap: 'var(--space-4)' }}>
            <div className="flex justify-between items-center w-full">
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Encoded URL String</h2>
              <button
                onClick={runDecode}
                className="glass-button"
                style={{ padding: '2px 10px', fontSize: '0.64rem', gap: '4px' }}
              >
                <span>Decode</span>
                <ArrowLeftRight size={10} />
              </button>
            </div>

            <ToolOutput
              value={outputText}
              label="URL Encoded Entity Output"
              error={errorMsg}
              fileName="encoded-url.txt"
              sourceTool="URL Converter"
            />
          </GlassCard>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mime-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </ToolLayout>
  );
};
