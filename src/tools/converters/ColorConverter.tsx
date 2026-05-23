import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToCmyk,
  cmykToRgb
} from '../../utils/engines';
import { Copy, Check, Palette } from 'lucide-react';

export const ColorConverter: React.FC = () => {
  // Master color model in RGB
  const [rgb, setRgb] = useState({ r: 124, g: 77, b: 255 });
  
  // Dynamic String representation states
  const [hexStr, setHexStr] = useState('#7c4dff');
  const [rgbStr, setRgbStr] = useState('rgb(124, 77, 255)');
  const [hslStr, setHslStr] = useState('hsl(256, 100%, 65%)');
  const [cmykStr, setCmykStr] = useState('cmyk(51%, 70%, 0%, 0%)');

  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Synchronize representations whenever master RGB changes
  useEffect(() => {
    try {
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

      setHexStr(hex);
      setRgbStr(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
      setHslStr(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
      setCmykStr(`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`);
    } catch {
      // Degrade gracefully
    }
  }, [rgb]);

  const handleHexInput = (val: string) => {
    setHexStr(val);
    if (/^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(val)) {
      try {
        const parsedRgb = hexToRgb(val);
        setRgb(parsedRgb);
      } catch {
        // invalid hex digits
      }
    }
  };

  const handleRgbInput = (channel: 'r' | 'g' | 'b', val: number) => {
    const clampedVal = Math.max(0, Math.min(255, isNaN(val) ? 0 : val));
    setRgb(prev => ({ ...prev, [channel]: clampedVal }));
  };

  const handleHslInput = (h: number, s: number, l: number) => {
    const rh = Math.max(0, Math.min(360, isNaN(h) ? 0 : h));
    const rs = Math.max(0, Math.min(100, isNaN(s) ? 0 : s));
    const rl = Math.max(0, Math.min(100, isNaN(l) ? 0 : l));
    try {
      const parsedRgb = hslToRgb(rh, rs, rl);
      setRgb(parsedRgb);
    } catch {
      // invalid bounds
    }
  };

  const handleCmykInput = (c: number, m: number, y: number, k: number) => {
    const rc = Math.max(0, Math.min(100, isNaN(c) ? 0 : c));
    const rm = Math.max(0, Math.min(100, isNaN(m) ? 0 : m));
    const ry = Math.max(0, Math.min(100, isNaN(y) ? 0 : y));
    const rk = Math.max(0, Math.min(100, isNaN(k) ? 0 : k));
    try {
      const parsedRgb = cmykToRgb(rc, rm, ry, rk);
      setRgb(parsedRgb);
    } catch {
      // invalid bounds
    }
  };

  const handleCopyCode = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Convert HSL values for controls UI
  const currentHsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const currentCmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  return (
    <ToolLayout
      title="Color Space Format Converter"
      description="Translate colors across HEX, RGB, HSL, and CMYK formats instantaneously offline, complete with sliders, visual canvases, and a native palette picker."
      category="Converters"
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
        {/* Left Column: Input sliders & custom text fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Palette wheel color selector */}
          <GlassCard style={{ padding: 'var(--space-4)', gap: 'var(--space-3)' }}>
            <div className="flex justify-between items-center w-full" style={{ flexWrap: 'wrap' }}>
              <div className="flex items-center gap-2">
                <Palette size={16} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Native Palette Color Picker
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={hexStr}
                  onChange={(e) => handleHexInput(e.target.value)}
                  style={{ border: 'none', background: 'transparent', width: '38px', height: '38px', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  value={hexStr}
                  onChange={(e) => handleHexInput(e.target.value)}
                  className="glass-input font-mono"
                  style={{ width: '100px', padding: '4px 10px', fontSize: '0.8rem', textAlign: 'center' }}
                />
              </div>
            </div>
          </GlassCard>

          {/* Color parameters sliders */}
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Color Dimensions Sliders</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {/* RGB Channel Sliders */}
              <div className="flex flex-col gap-2">
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  RGB Channels
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                  {['r', 'g', 'b'].map((channel) => {
                    const c = channel as 'r' | 'g' | 'b';
                    return (
                      <div key={channel} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs" style={{ fontWeight: 600 }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{channel.toUpperCase()}</span>
                          <span className="font-mono">{rgb[c]}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={rgb[c]}
                          onChange={(e) => handleRgbInput(c, parseInt(e.target.value))}
                          style={{ accentColor: channel === 'r' ? '#ef5350' : channel === 'g' ? '#66bb6a' : '#42a5f5' }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ borderBottom: '1px solid var(--border-primary)', margin: '4px 0' }}></div>

              {/* HSL Channels */}
              <div className="flex flex-col gap-2">
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  HSL Channels
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
                  {[
                    { label: 'H (Hue)', val: currentHsl.h, max: 360, chan: 'h' },
                    { label: 'S (Sat)', val: currentHsl.s, max: 100, chan: 's' },
                    { label: 'L (Light)', val: currentHsl.l, max: 100, chan: 'l' }
                  ].map((hslItem) => (
                    <div key={hslItem.label} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs" style={{ fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{hslItem.label}</span>
                        <span className="font-mono">{hslItem.val}{hslItem.chan !== 'h' ? '%' : '°'}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={hslItem.max}
                        value={hslItem.val}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          if (hslItem.chan === 'h') handleHslInput(v, currentHsl.s, currentHsl.l);
                          if (hslItem.chan === 's') handleHslInput(currentHsl.h, v, currentHsl.l);
                          if (hslItem.chan === 'l') handleHslInput(currentHsl.h, currentHsl.s, v);
                        }}
                        style={{ accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderBottom: '1px solid var(--border-primary)', margin: '4px 0' }}></div>

              {/* CMYK Channels */}
              <div className="flex flex-col gap-2">
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  CMYK Channels
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-3)' }}>
                  {[
                    { label: 'Cyan', val: currentCmyk.c, chan: 'c' },
                    { label: 'Magenta', val: currentCmyk.m, chan: 'm' },
                    { label: 'Yellow', val: currentCmyk.y, chan: 'y' },
                    { label: 'Key (Black)', val: currentCmyk.k, chan: 'k' }
                  ].map((cmykItem) => (
                    <div key={cmykItem.label} className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs" style={{ fontWeight: 600 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{cmykItem.label}</span>
                        <span className="font-mono">{cmykItem.val}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={cmykItem.val}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          if (cmykItem.chan === 'c') handleCmykInput(v, currentCmyk.m, currentCmyk.y, currentCmyk.k);
                          if (cmykItem.chan === 'm') handleCmykInput(currentCmyk.c, v, currentCmyk.y, currentCmyk.k);
                          if (cmykItem.chan === 'y') handleCmykInput(currentCmyk.c, currentCmyk.m, v, currentCmyk.k);
                          if (cmykItem.chan === 'k') handleCmykInput(currentCmyk.c, currentCmyk.m, currentCmyk.y, v);
                        }}
                        style={{ accentColor: 'var(--text-muted)' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Visual Canvas & Text Fields outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'sticky', top: 'var(--space-6)' }}>
          {/* Visual color preview card */}
          <GlassCard style={{ padding: '0', height: '140px', overflow: 'hidden', background: hexStr, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span
              style={{
                fontSize: '0.86rem',
                fontWeight: 800,
                color: currentHsl.l > 60 ? '#121212' : '#ffffff',
                background: currentHsl.l > 60 ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            >
              VISUAL TINT CANVAS
            </span>
          </GlassCard>

          {/* Copyable formats database sheet */}
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Color Space Declarations</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {[
                { label: 'HEX Representation', val: hexStr, id: 'hex' },
                { label: 'RGB Representation', val: rgbStr, id: 'rgb' },
                { label: 'HSL Representation', val: hslStr, id: 'hsl' },
                { label: 'CMYK Representation', val: cmykStr, id: 'cmyk' }
              ].map((format) => {
                const isCopied = copiedType === format.id;
                return (
                  <div key={format.id} className="flex flex-col gap-1 w-full">
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{format.label}</span>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'between',
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.15)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-2) var(--space-3)'
                      }}
                      className="w-full flex justify-between"
                    >
                      <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                        {format.val}
                      </span>
                      <button
                        onClick={() => handleCopyCode(format.val, format.id)}
                        className="glass-button glass-button-secondary"
                        style={{ padding: '4px' }}
                        title={`Copy ${format.id.toUpperCase()}`}
                      >
                        {isCopied ? <Check size={10} color="var(--color-success)" /> : <Copy size={10} />}
                      </button>
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
