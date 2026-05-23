import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { minifySVG } from '../../utils/engines';
import { Activity } from 'lucide-react';

export const SvgOptimizer: React.FC = () => {
  const [svgInput, setSvgInput] = useState(`<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <!-- Interactive custom logo overlay vector -->
  <style type="text/css">
    .circle-glow { fill: #7c4dff; opacity: 0.8; }
    .star-inner { fill: #ffffff; }
  </style>
  <circle class="circle-glow" cx="50" cy="50" r="45" />
  <polygon class="star-inner" points="50,15 63,38 90,38 68,54 77,80 50,64 23,80 32,54 10,38 37,38" />
</svg>`);

  const [svgMinified, setSvgMinified] = useState('');
  const [originalBytes, setOriginalBytes] = useState(0);
  const [minifiedBytes, setMinifiedBytes] = useState(0);
  const [savingsPercent, setSavingsPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!svgInput.trim()) {
      setSvgMinified('');
      setOriginalBytes(0);
      setMinifiedBytes(0);
      setSavingsPercent(0);
      setErrorMsg(null);
      return;
    }

    try {
      setErrorMsg(null);
      const min = minifySVG(svgInput);
      setSvgMinified(min);

      // Byte sizes
      const origSize = new TextEncoder().encode(svgInput).length;
      const minSize = new TextEncoder().encode(min).length;
      setOriginalBytes(origSize);
      setMinifiedBytes(minSize);

      if (origSize > 0) {
        const savings = ((origSize - minSize) / origSize) * 100;
        setSavingsPercent(Math.max(0, parseFloat(savings.toFixed(1))));
      } else {
        setSavingsPercent(0);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to minify SVG string.');
      setSvgMinified('');
    }
  }, [svgInput]);

  return (
    <ToolLayout
      title="SVG Vector Graphics Optimizer"
      description="Minify and compress Scalable Vector Graphics (SVG) offline by stripping redundant namespaces, editor metadata attributes, XML declarations, comments, and spacing."
      category="Web Design & CSS Playgrounds"
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
        {/* Left Column: Editor input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <GlassCard>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Source SVG Markup</h2>
            <ToolInput
              value={svgInput}
              onChange={setSvgInput}
              placeholder="Paste raw SVG code tags or drag and drop an .svg file..."
              label="Source SVG Code"
              allowFileUpload={true}
            />
          </GlassCard>

          {/* Compression Metrics */}
          {originalBytes > 0 && (
            <GlassCard style={{ padding: 'var(--space-4)', gap: 'var(--space-4)' }}>
              <div className="flex items-center gap-2">
                <Activity size={14} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Compression Metrics
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 'var(--space-3)',
                  textAlign: 'center'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 600 }}>Original Size</span>
                  <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {originalBytes} B
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 600 }}>Optimized Size</span>
                  <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '2px' }}>
                    {minifiedBytes} B
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 600 }}>Size Savings</span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: savingsPercent > 0 ? 'var(--color-success)' : 'var(--text-muted)',
                      marginTop: '2px'
                    }}
                  >
                    {savingsPercent}%
                  </span>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column: Code outputs & Visual Canvas previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'sticky', top: 'var(--space-6)' }}>
          {/* Vector Preview Canvas */}
          <GlassCard style={{ padding: 'var(--space-4)', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 7, 12, 0.4)', border: '1px dashed var(--border-primary)' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', display: 'block', alignSelf: 'flex-start' }}>
              Optimized Vector Visual Canvas
            </span>

            {/* Injected SVG preview */}
            {svgMinified && !errorMsg ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxHeight: '130px',
                  maxWidth: '100%',
                  background: 'transparent',
                  padding: 'var(--space-2)'
                }}
                dangerouslySetInnerHTML={{ __html: svgMinified }}
              />
            ) : (
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {errorMsg ? 'Invalid SVG structures detected.' : 'Awaiting correct SVG codes for canvas rendering...'}
              </span>
            )}
          </GlassCard>

          {/* Minified Output */}
          <ToolOutput
            value={svgMinified}
            label="Minified SVG Output"
            error={errorMsg}
            fileName="optimized-vector.svg"
            sourceTool="SVG Optimizer"
          />
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
