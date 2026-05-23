import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { encodeHtmlAccents, decodeHtmlAccents } from '../../utils/engines';
import { Copy, Check } from 'lucide-react';

interface AccentItem {
  char: string;
  entity: string;
  name: string;
}

const COMMON_ACCENTS_REFERENCE: AccentItem[] = [
  { char: 'á', entity: '&aacute;', name: 'a - acute accent' },
  { char: 'é', entity: '&eacute;', name: 'e - acute accent' },
  { char: 'í', entity: '&iacute;', name: 'i - acute accent' },
  { char: 'ó', entity: '&oacute;', name: 'o - acute accent' },
  { char: 'ú', entity: '&uacute;', name: 'u - acute accent' },
  { char: 'ñ', entity: '&ntilde;', name: 'n - tilde' },
  { char: 'ü', entity: '&uuml;', name: 'u - umlaut' },
  { char: 'ç', entity: '&ccedil;', name: 'c - cedilla' },
  { char: 'ß', entity: '&szlig;', name: 'sharp s - German' },
  { char: 'À', entity: '&Agrave;', name: 'A - grave accent' },
  { char: 'è', entity: '&egrave;', name: 'e - grave accent' },
  { char: 'ö', entity: '&ouml;', name: 'o - umlaut' },
  { char: 'ä', entity: '&auml;', name: 'a - umlaut' },
  { char: 'æ', entity: '&aelig;', name: 'ae diphthong' },
  { char: 'œ', entity: '&oelig;', name: 'oe ligature' },
  { char: 'å', entity: '&aring;', name: 'a - ring accent' }
];

export const HtmlAccents: React.FC = () => {
  const [inputText, setInputText] = useState('Café, Niño, François, Müller');
  const [encodedOutput, setEncodedOutput] = useState('');
  const [copiedChar, setCopiedChar] = useState<string | null>(null);

  useEffect(() => {
    setEncodedOutput(encodeHtmlAccents(inputText));
  }, [inputText]);

  const handleEntityCopy = (entity: string, char: string) => {
    navigator.clipboard.writeText(entity);
    setCopiedChar(char);
    setTimeout(() => setCopiedChar(null), 1500);
  };

  const handleDecodeInput = (val: string) => {
    try {
      const decoded = decodeHtmlAccents(val);
      setInputText(decoded);
    } catch {
      // Degrade gracefully
    }
  };

  return (
    <ToolLayout
      title="HTML Accents Entity Converter"
      description="Translate accented Unicode characters, special letters, and mathematical symbols into standard HTML/XML named or numeric character entities offline."
      category="Web Design & CSS Playgrounds"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '7fr 5fr',
          gap: 'var(--space-6)',
          width: '100%',
          alignItems: 'start'
        }}
        className="mime-grid-responsive"
      >
        {/* Left Column: Encoder inputs/outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Encoder Input */}
          <GlassCard>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Source Unicode String</h2>
            <ToolInput
              value={inputText}
              onChange={setInputText}
              placeholder="Type or paste text with accented letters (e.g. Niño, Café)..."
              label="Accented Unicode Source"
            />
          </GlassCard>

          {/* Encoder Output */}
          <GlassCard>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Encoded HTML Entities</h2>
            <ToolOutput
              value={encodedOutput}
              label="HTML Character Entities Output"
              fileName="encoded-accents.html"
              sourceTool="HTML Accents Converter"
            />
            {/* Quick Decode Panel */}
            <div className="flex flex-col gap-2 w-full" style={{ marginTop: 'var(--space-4)' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Quick Entity Decoder Box
              </span>
              <textarea
                placeholder="Paste encoded HTML entities here to decode them back to plain Unicode (e.g. &eacute; -> é)..."
                onChange={(e) => handleDecodeInput(e.target.value)}
                className="glass-input font-mono"
                style={{ height: '80px', fontSize: '0.8rem', resize: 'none' }}
              />
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Reference named characters */}
        <div>
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Named Entity reference</h2>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Click any element card below to copy its standard HTML Named Character Entity directly to your clipboard.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: 'var(--space-2)',
                marginTop: 'var(--space-2)'
              }}
            >
              {COMMON_ACCENTS_REFERENCE.map((item) => {
                const isCopied = copiedChar === item.char;
                return (
                  <div
                    key={item.char}
                    onClick={() => handleEntityCopy(item.entity, item.char)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-3)',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                    }}
                    className="hover-card-elevation"
                  >
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: isCopied ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                      {item.char}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {item.entity}
                    </span>
                    <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '2px', textAlign: 'center' }}>
                      {item.name}
                    </span>

                    {/* Copy indicators overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {isCopied ? <Check size={10} color="var(--color-success)" /> : <Copy size={10} style={{ opacity: 0.3 }} />}
                    </div>
                  </div>
                );
              })}
            </div>
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
