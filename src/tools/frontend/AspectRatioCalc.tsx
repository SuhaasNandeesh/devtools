import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { calculateAspectRatioFraction } from '../../utils/engines';
import { Sparkles, Sliders } from 'lucide-react';

export const AspectRatioCalc: React.FC = () => {
  // Dimension Simplifier States
  const [srcWidth, setSrcWidth] = useState('1920');
  const [srcHeight, setSrcHeight] = useState('1080');
  const [simplifiedRatio, setSimplifiedRatio] = useState('16:9');
  const [decimalVal, setDecimalVal] = useState(1.7778);
  const [errorSimplifier, setErrorSimplifier] = useState<string | null>(null);

  // Scaler States
  const [ratioW, setRatioW] = useState('16');
  const [ratioH, setRatioH] = useState('9');
  const [targetWidth, setTargetWidth] = useState('1280');
  const [targetHeight, setTargetHeight] = useState('720');

  // Trigger simplifications on inputs change
  useEffect(() => {
    const w = parseFloat(srcWidth);
    const h = parseFloat(srcHeight);
    if (!w || !h || isNaN(w) || isNaN(h)) {
      setErrorSimplifier('Please enter valid width and height numbers.');
      setSimplifiedRatio('--');
      setDecimalVal(0);
      return;
    }
    setErrorSimplifier(null);
    try {
      const details = calculateAspectRatioFraction(w, h);
      setSimplifiedRatio(details.ratio);
      setDecimalVal(details.decimal);
    } catch (err: any) {
      setErrorSimplifier(err.message || 'Error occurred during calculation.');
    }
  }, [srcWidth, srcHeight]);

  const loadPreset = (w: number, h: number) => {
    setSrcWidth(w.toString());
    setSrcHeight(h.toString());
    setRatioW(w.toString());
    setRatioH(h.toString());
    
    // Auto scale target
    const currentTWidth = parseFloat(targetWidth) || 1280;
    const computedTHeight = Math.round(currentTWidth / (w / h));
    setTargetHeight(computedTHeight.toString());
  };

  const handleTargetWidthChange = (val: string) => {
    setTargetWidth(val);
    const w = parseFloat(ratioW);
    const h = parseFloat(ratioH);
    const targetWNum = parseFloat(val);
    if (!w || !h || isNaN(w) || isNaN(h) || !targetWNum || isNaN(targetWNum)) {
      return;
    }
    const computedH = (targetWNum * h) / w;
    setTargetHeight(computedH.toFixed(1).replace('.0', ''));
  };

  const handleTargetHeightChange = (val: string) => {
    setTargetHeight(val);
    const w = parseFloat(ratioW);
    const h = parseFloat(ratioH);
    const targetHNum = parseFloat(val);
    if (!w || !h || isNaN(w) || isNaN(h) || !targetHNum || isNaN(targetHNum)) {
      return;
    }
    const computedW = (targetHNum * w) / h;
    setTargetWidth(computedW.toFixed(1).replace('.0', ''));
  };

  return (
    <ToolLayout
      title="Aspect Ratio Dimension Calculator"
      description="Simplify display resolutions into fractional aspect ratios (e.g. 16:9) or lock specific ratios to scale width and height coordinates instantaneously."
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
        {/* Left Column: Simplifier */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
            <div className="flex items-center gap-2">
              <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Dimension Ratio Simplifier</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Source Width (px)</span>
                  <input
                    type="number"
                    value={srcWidth}
                    onChange={(e) => setSrcWidth(e.target.value)}
                    placeholder="e.g. 1920"
                    className="glass-input font-mono"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Source Height (px)</span>
                  <input
                    type="number"
                    value={srcHeight}
                    onChange={(e) => setSrcHeight(e.target.value)}
                    placeholder="e.g. 1080"
                    className="glass-input font-mono"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  />
                </div>
              </div>

              {/* Presets Row */}
              <div className="flex flex-col gap-1" style={{ marginTop: 'var(--space-1)' }}>
                <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Standard Display Presets
                </span>
                <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: '2px' }}>
                  {[
                    { label: '16:9 (HD)', w: 1920, h: 1080 },
                    { label: '4:3 (SD)', w: 800, h: 600 },
                    { label: '1:1 (Square)', w: 1000, h: 1000 },
                    { label: '21:9 (Wide)', w: 2560, h: 1080 },
                    { label: '9:16 (Phone)', w: 1080, h: 1920 }
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadPreset(preset.w, preset.h)}
                      className="glass-button glass-button-secondary"
                      style={{ padding: '2px 8px', fontSize: '0.64rem' }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simplification Results */}
              <div style={{ borderBottom: '1px solid var(--border-primary)', margin: 'var(--space-2) 0' }}></div>
              
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 'var(--space-3)',
                  background: 'rgba(0,0,0,0.15)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)'
                }}
              >
                <div className="flex flex-col items-center">
                  <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Simplified Ratio
                  </span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: errorSimplifier ? 'var(--color-danger)' : 'var(--accent-primary)', marginTop: '4px' }}>
                    {errorSimplifier ? '--' : simplifiedRatio}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Decimal multiplier
                  </span>
                  <span className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {errorSimplifier ? '--' : decimalVal.toFixed(4)}
                  </span>
                </div>
              </div>
              {errorSimplifier && (
                <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)', textAlign: 'center', display: 'block' }}>
                  {errorSimplifier}
                </span>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Scaler */}
        <div>
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
            <div className="flex items-center gap-2">
              <Sliders size={16} style={{ color: 'var(--accent-primary)' }} />
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Interactive Aspect Ratio Scaler</h2>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Lock in your desired Aspect Ratio proportions. Editing either target dimension will automatically compute and update the other instantly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              {/* Ratio lock settings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Locked Width Factor</span>
                  <input
                    type="number"
                    value={ratioW}
                    onChange={(e) => {
                      setRatioW(e.target.value);
                      // Recalculate target height based on new width factor
                      const w = parseFloat(e.target.value);
                      const h = parseFloat(ratioH);
                      const tw = parseFloat(targetWidth);
                      if (w && h && tw) setTargetHeight(Math.round((tw * h) / w).toString());
                    }}
                    placeholder="e.g. 16"
                    className="glass-input font-mono"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Locked Height Factor</span>
                  <input
                    type="number"
                    value={ratioH}
                    onChange={(e) => {
                      setRatioH(e.target.value);
                      // Recalculate target height based on new height factor
                      const w = parseFloat(ratioW);
                      const h = parseFloat(e.target.value);
                      const tw = parseFloat(targetWidth);
                      if (w && h && tw) setTargetHeight(Math.round((tw * h) / w).toString());
                    }}
                    placeholder="e.g. 9"
                    className="glass-input font-mono"
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  />
                </div>
              </div>

              <div style={{ borderBottom: '1px solid var(--border-primary)', margin: 'var(--space-1) 0' }}></div>

              {/* Scaling target inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700 }}>Target Width (px)</span>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => handleTargetWidthChange(e.target.value)}
                    placeholder="e.g. 1280"
                    className="glass-input font-mono"
                    style={{ fontSize: '0.86rem', padding: '8px 12px', borderColor: 'var(--accent-primary)', borderWidth: '1px' }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontWeight: 700 }}>Target Height (px)</span>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => handleTargetHeightChange(e.target.value)}
                    placeholder="e.g. 720"
                    className="glass-input font-mono"
                    style={{ fontSize: '0.86rem', padding: '8px 12px', borderColor: 'var(--accent-primary)', borderWidth: '1px' }}
                  />
                </div>
              </div>
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
