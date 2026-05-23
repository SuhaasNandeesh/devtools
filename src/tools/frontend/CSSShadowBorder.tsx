import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';

export const CSSShadowBorder: React.FC = () => {
  // Shadow States
  const [shadowX, setShadowX] = useState(4);
  const [shadowY, setShadowY] = useState(4);
  const [shadowBlur, setShadowBlur] = useState(15);
  const [shadowSpread, setShadowSpread] = useState(0);
  const [shadowColor, setShadowColor] = useState('#25005b');
  const [shadowOpacity, setShadowOpacity] = useState(0.3);
  const [shadowInset, setShadowInset] = useState(false);

  // Border States
  const [borderWidth, setBorderWidth] = useState(1);
  const [borderStyle, setBorderStyle] = useState('solid');
  const [borderColor, setBorderColor] = useState('rgba(255,255,255,0.15)');
  
  // Radius States
  const [radiusTL, setRadiusTL] = useState(16);
  const [radiusTR, setRadiusTR] = useState(16);
  const [radiusBR, setRadiusBR] = useState(16);
  const [radiusBL, setRadiusBL] = useState(16);
  const [radiusLinked, setRadiusLinked] = useState(true);

  // Preview Box States
  const [boxColor, setBoxColor] = useState('rgba(255, 255, 255, 0.1)');
  const [bgColor, setBgColor] = useState('rgba(15, 23, 42, 0.9)');

  const handleRadiusChange = (val: number, corner: 'all' | 'tl' | 'tr' | 'br' | 'bl') => {
    if (radiusLinked || corner === 'all') {
      setRadiusTL(val);
      setRadiusTR(val);
      setRadiusBR(val);
      setRadiusBL(val);
    } else {
      if (corner === 'tl') setRadiusTL(val);
      if (corner === 'tr') setRadiusTR(val);
      if (corner === 'br') setRadiusBR(val);
      if (corner === 'bl') setRadiusBL(val);
    }
  };

  // Convert Hex to RGBA for Shadow
  const hexToRgba = (hex: string, opacity: number) => {
    let c = hex.substring(1);
    if (c.length === 3) {
      c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    }
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const shadowColorRgba = hexToRgba(shadowColor, shadowOpacity);
  const shadowCss = `${shadowInset ? 'inset ' : ''}${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowSpread}px ${shadowColorRgba}`;
  const borderRadiusCss = `${radiusTL}px ${radiusTR}px ${radiusBR}px ${radiusBL}px`;
  const realBorderCss = `${borderWidth}px ${borderStyle} ${borderColor}`;

  const generatedCss = `box-shadow: ${shadowCss};\nborder-radius: ${borderRadiusCss};\nborder: ${realBorderCss};`;

  return (
    <ToolLayout
      title="CSS Shadows & Border Radius Designer"
      description="Visual real-time CSS generator to design box shadows, multi-corner border radii, and boundary stroke styling, outputting clean standard CSS declarations."
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
        {/* Left Column: Sliders deck */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Box Shadow Controls */}
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Box Shadow Parameters</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* X Offset */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>X Offset</span>
                  <span className="font-mono text-xs">{shadowX}px</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={shadowX}
                  onChange={(e) => setShadowX(parseInt(e.target.value))}
                />
              </div>

              {/* Y Offset */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Y Offset</span>
                  <span className="font-mono text-xs">{shadowY}px</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={shadowY}
                  onChange={(e) => setShadowY(parseInt(e.target.value))}
                />
              </div>

              {/* Blur Radius */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Blur Radius</span>
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

              {/* Spread Radius */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Spread Radius</span>
                  <span className="font-mono text-xs">{shadowSpread}px</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={shadowSpread}
                  onChange={(e) => setShadowSpread(parseInt(e.target.value))}
                />
              </div>

              {/* Opacity */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shadow Opacity</span>
                  <span className="font-mono text-xs">{Math.round(shadowOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={shadowOpacity}
                  onChange={(e) => setShadowOpacity(parseFloat(e.target.value))}
                />
              </div>

              {/* Shadow Color & Inset */}
              <div className="flex gap-4 items-center w-full" style={{ flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Shadow Color:</span>
                  <input
                    type="color"
                    value={shadowColor}
                    onChange={(e) => setShadowColor(e.target.value)}
                    style={{ border: 'none', background: 'transparent', width: '32px', height: '32px', cursor: 'pointer' }}
                  />
                </div>
                <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.74rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={shadowInset}
                    onChange={(e) => setShadowInset(e.target.checked)}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>Inset Shadow</span>
                </label>
              </div>
            </div>
          </GlassCard>

          {/* Border & Corner Radius Controls */}
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
            <div className="flex justify-between items-center w-full">
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Border & Radius</h2>
              <label className="flex items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.74rem', fontWeight: 600 }}>
                <input
                  type="checkbox"
                  checked={radiusLinked}
                  onChange={(e) => {
                    setRadiusLinked(e.target.checked);
                    if (e.target.checked) {
                      handleRadiusChange(radiusTL, 'all');
                    }
                  }}
                  style={{ accentColor: 'var(--accent-primary)' }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Link All Corners</span>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* Radii Sliders */}
              {radiusLinked ? (
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Border Radius (All)</span>
                    <span className="font-mono text-xs">{radiusTL}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                    value={radiusTL}
                    onChange={(e) => handleRadiusChange(parseInt(e.target.value), 'all')}
                  />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <div className="flex flex-col gap-1">
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Top-Left: {radiusTL}px</span>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={radiusTL}
                      onChange={(e) => handleRadiusChange(parseInt(e.target.value), 'tl')}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Top-Right: {radiusTR}px</span>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={radiusTR}
                      onChange={(e) => handleRadiusChange(parseInt(e.target.value), 'tr')}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bottom-Right: {radiusBR}px</span>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={radiusBR}
                      onChange={(e) => handleRadiusChange(parseInt(e.target.value), 'br')}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bottom-Left: {radiusBL}px</span>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={radiusBL}
                      onChange={(e) => handleRadiusChange(parseInt(e.target.value), 'bl')}
                      style={{ accentColor: 'var(--accent-primary)' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ borderBottom: '1px solid var(--border-primary)', margin: 'var(--space-2) 0' }}></div>

              {/* Stroke controls */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Stroke Width: {borderWidth}px</span>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={borderWidth}
                    onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Stroke Style</span>
                  <select
                    value={borderStyle}
                    onChange={(e) => setBorderStyle(e.target.value)}
                    className="glass-input"
                    style={{ padding: '4px var(--space-2)', fontSize: '0.78rem' }}
                  >
                    {['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'none'].map(s => (
                      <option key={s} value={s} style={{ background: '#121212', color: 'white' }}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color Selectors */}
              <div className="flex gap-4 items-center w-full" style={{ flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Stroke Color:</span>
                  <input
                    type="text"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="glass-input font-mono"
                    style={{ width: '130px', padding: '2px 8px', fontSize: '0.74rem' }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Box Color:</span>
                  <input
                    type="text"
                    value={boxColor}
                    onChange={(e) => setBoxColor(e.target.value)}
                    className="glass-input font-mono"
                    style={{ width: '130px', padding: '2px 8px', fontSize: '0.74rem' }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Visual Preview Deck */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'sticky', top: 'var(--space-6)' }}>
          {/* Visual Canvas */}
          <GlassCard style={{ padding: '0', overflow: 'hidden', height: '320px', background: bgColor, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Background Control Swapper */}
            <div
              style={{
                position: 'absolute',
                top: 'var(--space-2)',
                right: 'var(--space-2)',
                display: 'flex',
                gap: '4px',
                zIndex: 5
              }}
            >
              {['#0f172a', '#1e293b', '#ffffff', 'linear-gradient(45deg, #0f172a, #25005b)'].map((bg, idx) => (
                <button
                  key={idx}
                  onClick={() => setBgColor(bg)}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: 'var(--radius-full)',
                    background: bg,
                    border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer'
                  }}
                  title={`Background: ${bg}`}
                />
              ))}
            </div>

            {/* Simulated Live preview Box */}
            <div
              style={{
                width: '160px',
                height: '160px',
                background: boxColor,
                boxShadow: shadowCss,
                borderRadius: borderRadiusCss,
                border: realBorderCss,
                transition: 'all 0.1s ease-out'
              }}
            />
          </GlassCard>

          {/* Generated Code Output */}
          <ToolOutput
            value={generatedCss}
            label="Generated CSS ruleset"
            fileName="custom-shadow.css"
            sourceTool="CSS Designer"
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
