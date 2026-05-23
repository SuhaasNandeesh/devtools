import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';
import { Sparkles } from 'lucide-react';

export const GlassmorphismStyler: React.FC = () => {
  const [blurRadius, setBlurRadius] = useState(12);
  const [backdropOpacity, setBackdropOpacity] = useState(15);
  const [borderOpacity, setBorderOpacity] = useState(20);
  const [cornerRadius, setCornerRadius] = useState(16);
  const [shadowBlur, setShadowBlur] = useState(32);
  const [shadowOpacity, setShadowOpacity] = useState(25);
  const [cardColor, setCardColor] = useState('#ffffff');

  // Convert Hex to RGBA
  const hexToRgbaStr = (hex: string, opacityPercent: number) => {
    let c = hex.substring(1);
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${parseFloat((opacityPercent / 100).toFixed(2))})`;
  };

  const bgRgba = hexToRgbaStr(cardColor, backdropOpacity);
  const borderRgba = hexToRgbaStr(cardColor, borderOpacity);
  const shadowRgba = `rgba(0, 0, 0, ${parseFloat((shadowOpacity / 100).toFixed(2))})`;

  // CSS Output compilation
  const generatedCss = `background: ${bgRgba};\nbackdrop-filter: blur(${blurRadius}px);\n-webkit-backdrop-filter: blur(${blurRadius}px);\nborder: 1px solid ${borderRgba};\nborder-radius: ${cornerRadius}px;\nbox-shadow: 0 8px 32px 0 ${shadowRgba};`;

  return (
    <ToolLayout
      title="Glassmorphism CSS Styler Dashboard"
      description="Visual style designer to prototype and generate modern frosted-glass CSS backdrops. Includes customizable blur radii, opacities, and high-fidelity mock preview overlays."
      category="Web Design & CSS Playgrounds"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '5fr 7fr',
          gap: 'var(--space-6)',
          width: '100%',
          alignItems: 'start'
        }}
        className="mime-grid-responsive"
      >
        {/* Left Column: Frosted sliders controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Glassmorphism Parameters</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* Blur Radius */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Backdrop Blur</span>
                  <span className="font-mono text-xs">{blurRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={blurRadius}
                  onChange={(e) => setBlurRadius(parseInt(e.target.value))}
                />
              </div>

              {/* Backdrop Opacity */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Backdrop Opacity</span>
                  <span className="font-mono text-xs">{backdropOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={backdropOpacity}
                  onChange={(e) => setBackdropOpacity(parseInt(e.target.value))}
                />
              </div>

              {/* Border Opacity */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Border Opacity</span>
                  <span className="font-mono text-xs">{borderOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={borderOpacity}
                  onChange={(e) => setBorderOpacity(parseInt(e.target.value))}
                />
              </div>

              {/* Corner Radius */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Corner Radius</span>
                  <span className="font-mono text-xs">{cornerRadius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={cornerRadius}
                  onChange={(e) => setCornerRadius(parseInt(e.target.value))}
                />
              </div>

              {/* Shadow Blur */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shadow Blur</span>
                  <span className="font-mono text-xs">{shadowBlur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={shadowBlur}
                  onChange={(e) => setShadowBlur(parseInt(e.target.value))}
                />
              </div>

              {/* Shadow Opacity */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shadow Intensity</span>
                  <span className="font-mono text-xs">{shadowOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={shadowOpacity}
                  onChange={(e) => setShadowOpacity(parseInt(e.target.value))}
                />
              </div>

              {/* Card Color Pickers */}
              <div className="flex items-center gap-2" style={{ marginTop: 'var(--space-2)' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Base Tint Color:</span>
                <input
                  type="color"
                  value={cardColor}
                  onChange={(e) => setCardColor(e.target.value)}
                  style={{ border: 'none', background: 'transparent', width: '36px', height: '36px', cursor: 'pointer' }}
                />
                <span className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{cardColor}</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Visual Mock canvas & CSS codes output */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'sticky', top: 'var(--space-6)' }}>
          {/* Animated colorful backdrop simulation canvas */}
          <GlassCard style={{ padding: '0', height: '360px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Vector colourful floating background shapes */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at 10% 20%, #1e1b4b 0%, #020617 90%)',
                zIndex: 0
              }}
            />
            {/* Animated bubble 1 */}
            <div
              style={{
                position: 'absolute',
                top: '20%',
                left: '15%',
                width: '140px',
                height: '140px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #7c4dff, #ff007f)',
                opacity: 0.7,
                filter: 'blur(30px)',
                zIndex: 1
              }}
            />
            {/* Animated bubble 2 */}
            <div
              style={{
                position: 'absolute',
                bottom: '15%',
                right: '10%',
                width: '180px',
                height: '180px',
                borderRadius: 'var(--radius-full)',
                background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                opacity: 0.6,
                filter: 'blur(40px)',
                zIndex: 1
              }}
            />

            {/* Mock Glassmorphism card dashboard overlay */}
            <div
              style={{
                width: '320px',
                padding: 'var(--space-5)',
                background: bgRgba,
                backdropFilter: `blur(${blurRadius}px)`,
                WebkitBackdropFilter: `blur(${blurRadius}px)`,
                border: `1px solid ${borderRgba}`,
                borderRadius: `${cornerRadius}px`,
                boxShadow: `0 8px 32px 0 ${shadowRgba}`,
                color: 'white',
                zIndex: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                boxSizing: 'border-box',
                transition: 'all 0.1s ease-out'
              }}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={14} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Glass Card</span>
                </div>
                <span style={{ fontSize: '0.58rem', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                  LIVE PREVIEW
                </span>
              </div>
              
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', margin: '4px 0' }}></div>
              
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Frosted overlay effect demo</h3>
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                Watch how the text and colorful background bubbles melt through this frosted material layout as you slide the blur and opacity parameters.
              </p>

              {/* Progress bars simulation */}
              <div className="flex flex-col gap-1 w-full" style={{ marginTop: '4px' }}>
                <div className="flex justify-between text-xs" style={{ opacity: 0.8 }}>
                  <span>Glass opacity: {backdropOpacity}%</span>
                  <span>Blur: {blurRadius}px</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${backdropOpacity}%`, height: '100%', background: 'white', borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Generated Code outputs */}
          <ToolOutput
            value={generatedCss}
            label="Generated Glassmorphism CSS declarations"
            fileName="glassmorphism.css"
            sourceTool="Glass Styler"
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
