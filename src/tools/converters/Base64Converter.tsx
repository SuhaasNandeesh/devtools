import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { base64Encode, base64Decode } from '../../utils/engines';

export const Base64Converter: React.FC = () => {
  const [inputText, setInputText] = useState('Offline DevTools!');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleModeChange = (newMode: 'encode' | 'decode') => {
    setMode(newMode);
    // Swap inputs dynamically to prevent base64 decoder failures
    if (newMode === 'encode') {
      setInputText('Offline DevTools!');
    } else {
      setInputText('T2ZmbGluZSBEZXZUb29scyE=');
    }
  };

  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      setErrorMsg(null);
      return;
    }

    try {
      if (mode === 'encode') {
        setOutputText(base64Encode(inputText));
        setErrorMsg(null);
      } else {
        setOutputText(base64Decode(inputText));
        setErrorMsg(null);
      }
    } catch (e: any) {
      setErrorMsg(`Base64 execution failed: ${e.message}`);
      setOutputText('');
    }
  }, [inputText, mode]);

  return (
    <ToolLayout
      title="Base64 Text Encoder & Decoder"
      description="Safely encode plain text strings to Base64 standard strings and decode Base64 data back to plain text. Engineered with complete UTF-8 compatibility for safe emoji and special character processing."
      category="Converters"
    >
      <div
        className="flex flex-col gap-6"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'stretch'
        }}
      >
        {/* Left Input Pane with toggle */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-center w-full flex-wrap gap-2" style={{ marginBottom: 'var(--space-2)' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Configuration</h2>
            <div
              style={{
                display: 'flex',
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '4px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <button
                onClick={() => handleModeChange('encode')}
                className="glass-button"
                style={{
                  padding: 'var(--space-1) var(--space-3)',
                  border: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: mode === 'encode' ? 'var(--accent-primary)' : 'transparent',
                  color: mode === 'encode' ? 'white' : 'var(--text-secondary)'
                }}
              >
                Encode Text
              </button>
              <button
                onClick={() => handleModeChange('decode')}
                className="glass-button"
                style={{
                  padding: 'var(--space-1) var(--space-3)',
                  border: 'none',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  background: mode === 'decode' ? 'var(--accent-primary)' : 'transparent',
                  color: mode === 'decode' ? 'white' : 'var(--text-secondary)'
                }}
              >
                Decode Base64
              </button>
            </div>
          </div>

          <ToolInput
            value={inputText}
            onChange={setInputText}
            placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste base64 code to decode...'}
            label={mode === 'encode' ? 'Raw Text String' : 'Base64 Encoded String'}
          />
        </GlassCard>

        {/* Right Output Pane */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Result</h2>
          <ToolOutput
            value={errorMsg ? '' : outputText}
            error={errorMsg}
            label={mode === 'encode' ? 'Base64 Encoded Output' : 'Decoded UTF-8 Output'}
            fileName={mode === 'encode' ? 'encoded-base64.txt' : 'decoded-text.txt'}
            sourceTool={mode === 'encode' ? 'Base64 Encoder' : 'Base64 Decoder'}
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
