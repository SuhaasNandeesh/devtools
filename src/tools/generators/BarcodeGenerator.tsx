import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { generateBarcode128Svg } from '../../utils/engines';

export const BarcodeGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('CODE128');
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(80);
  const [svgOutput, setSvgOutput] = useState('');

  useEffect(() => {
    if (!inputText) {
      setSvgOutput('');
      return;
    }
    const svg = generateBarcode128Svg(inputText.toUpperCase(), width, height);
    setSvgOutput(svg);
  }, [inputText, width, height]);

  const handleDownload = () => {
    if (!svgOutput) return;
    const blob = new Blob([svgOutput], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'barcode.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Barcode Generator"
      description="Synthesize standard, scannable Code 128 barcodes offline. Set bar dimensions and download vector SVGs."
      category="Generators"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {/* Configuration Card */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Configuration</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <div className="flex justify-between" style={{ fontSize: '0.85rem', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                <span>Bar Height:</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{height}px</span>
              </div>
              <input
                type="range"
                min="40"
                max="150"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            <div>
              <div className="flex justify-between" style={{ fontSize: '0.85rem', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                <span>Total Width:</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{width}px</span>
              </div>
              <input
                type="range"
                min="200"
                max="500"
                step="20"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            <ToolInput
              value={inputText}
              onChange={setInputText}
              placeholder="Enter alphanumeric text (e.g. BARCODE128)..."
              label="Barcode Contents"
            />
          </div>
        </GlassCard>

        {/* Barcode Render Pane */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, alignSelf: 'flex-start', marginBottom: 'var(--space-4)', width: '100%', textAlign: 'left' }}>
            Scannable Barcode
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
                  justifyContent: 'center',
                  width: '100%',
                  overflowX: 'auto'
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
              Enter barcode contents to preview...
            </div>
          )}
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
