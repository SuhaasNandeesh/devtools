import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { generateQrCodeSvg } from '../../utils/engines';

export const QrCodeGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('https://example.com');
  const [size, setSize] = useState(256);
  const [color, setColor] = useState('#000000');
  const [svgOutput, setSvgOutput] = useState('');

  useEffect(() => {
    if (!inputText) {
      setSvgOutput('');
      return;
    }
    const svg = generateQrCodeSvg(inputText, size, color);
    setSvgOutput(svg);
  }, [inputText, size, color]);

  const handleDownload = () => {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create scannable, offline-safe QR Codes locally. Pick custom colors, configure sizes, and export clean SVG vector codes."
      category="Generators"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {/* Configurations Card */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Configuration</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <div className="flex justify-between" style={{ fontSize: '0.85rem', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                <span>Size:</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{size}x{size}px</span>
              </div>
              <input
                type="range"
                min="128"
                max="512"
                step="32"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 'var(--space-2)' }}>Fill Color:</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    background: 'transparent'
                  }}
                />
                <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  {color}
                </span>
              </div>
            </div>

            <ToolInput
              value={inputText}
              onChange={setInputText}
              placeholder="Enter link URL or plain text here..."
              label="QR Code Contents"
            />
          </div>
        </GlassCard>

        {/* QR Rendering Panel */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, alignSelf: 'flex-start', marginBottom: 'var(--space-4)', width: '100%', textAlign: 'left' }}>
            Scannable QR Code
          </h2>
          
          {svgOutput ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', width: '100%' }}>
              <div
                style={{
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-lg)',
                  background: '#ffffff',
                  border: '1px solid var(--border-primary)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                dangerouslySetInnerHTML={{ __html: svgOutput }}
              />
              
              <button
                onClick={handleDownload}
                className="glass-button w-full"
                style={{ fontWeight: 600, fontSize: '0.85rem', padding: 'var(--space-2) 0' }}
              >
                Download SVG File
              </button>
            </div>
          ) : (
            <div style={{ padding: 'var(--space-8)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Enter contents to preview QR code...
            </div>
          )}
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
