import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';
import { Type, Sparkles } from 'lucide-react';

interface FontStackInfo {
  name: string;
  category: 'sans-serif' | 'serif' | 'monospace' | 'display';
  stack: string;
  description: string;
}

const WEB_SAFE_FONT_DATABASE: FontStackInfo[] = [
  {
    name: 'System Default UI Stack',
    category: 'sans-serif',
    stack: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    description: 'Natively adapts to the active operating system default font stack (San Francisco on macOS, Segoe UI on Windows).'
  },
  {
    name: 'Transitional Serif (Georgia)',
    category: 'serif',
    stack: 'Georgia, yingmar, serif',
    description: 'Elegant, modern serif with high readability for body text across digital displays.'
  },
  {
    name: 'Neo-Grotesque (Helvetica / Arial)',
    category: 'sans-serif',
    stack: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    description: 'Highly neutral, clean, neo-grotesque font stack designed for broad cross-platform consistency.'
  },
  {
    name: 'Classical Serif (Times)',
    category: 'serif',
    stack: '"Times New Roman", Times, Baskerville, Georgia, serif',
    description: 'Traditional academic serif layout with compact spacing structures.'
  },
  {
    name: 'Geometric Sans-Serif (Trebuchet)',
    category: 'sans-serif',
    stack: '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Tahoma, sans-serif',
    description: 'Excellent digital display characteristics with large x-height shapes.'
  },
  {
    name: 'Humanist Sans-Serif (Optima)',
    category: 'sans-serif',
    stack: 'Optima, Segoe, "Segoe UI", Candara, Calibri, Arial, sans-serif',
    description: 'Warm humanist proportions featuring subtle stroke weight modulations.'
  },
  {
    name: 'Standard Monospace (Courier)',
    category: 'monospace',
    stack: '"Courier New", Courier, Monaco, "Lucida Console", monospace',
    description: 'Classical typewriter block spacing standard for basic text documents.'
  },
  {
    name: 'Developer Code Editor Stack',
    category: 'monospace',
    stack: 'Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier, monospace',
    description: 'High readability dev terminal stack, prioritizing programming characters differentiation.'
  }
];

export const WebFontStacks: React.FC = () => {
  const [selectedFont, setSelectedFont] = useState<FontStackInfo>(WEB_SAFE_FONT_DATABASE[0]);
  const [customText, setCustomText] = useState('Offline DevTools visual typography sandbox.');
  
  // Font modifiers states
  const [fontSize, setFontSize] = useState(24);
  const [lineHeight, setLineHeight] = useState(1.4);
  const [fontWeight, setFontWeight] = useState(500);
  const [letterSpacing, setLetterSpacing] = useState(0);

  const generatedCss = `font-family: ${selectedFont.stack};\nfont-size: ${fontSize}px;\nline-height: ${lineHeight};\nfont-weight: ${fontWeight};\nletter-spacing: ${letterSpacing}em;`;

  return (
    <ToolLayout
      title="Web Safe CSS Font Stacks Reference"
      description="Offline catalog reference sheet of cross-platform safe font stacks, complete with an interactive typography sandbox to preview custom sizes, weights, and rendering structures."
      category="Web Design & CSS Playgrounds"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '6fr 6fr',
          gap: 'var(--space-6)',
          width: '100%',
          alignItems: 'start'
        }}
        className="mime-grid-responsive"
      >
        {/* Left Column: Fonts catalog list & preview controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Catalog list */}
          <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
            <div className="flex items-center gap-2" style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.01)' }}>
              <Type size={14} style={{ color: 'var(--accent-primary)' }} />
              <h3 style={{ fontSize: '0.86rem', fontWeight: 700 }}>System Font Stacks Directory</h3>
            </div>
            
            <div
              style={{
                maxHeight: '320px',
                overflowY: 'auto',
                width: '100%'
              }}
              className="custom-scrollbar"
            >
              {WEB_SAFE_FONT_DATABASE.map((item) => {
                const isSelected = selectedFont.name === item.name;
                return (
                  <div
                    key={item.name}
                    onClick={() => setSelectedFont(item)}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                      background: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                    className="hover-row-highlight"
                  >
                    <div className="flex justify-between items-center w-full">
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {item.name}
                      </span>
                      <span
                        style={{
                          fontSize: '0.58rem',
                          fontWeight: 700,
                          background: 'rgba(255,255,255,0.05)',
                          color: 'var(--text-secondary)',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)'
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Typography sliders */}
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Interactive Modifier Sliders</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {/* Font Size */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Font Size</span>
                  <span className="font-mono text-xs">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="72"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                />
              </div>

              {/* Line Height */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Line Height</span>
                  <span className="font-mono text-xs">{lineHeight}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.1"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={lineHeight}
                  onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                />
              </div>

              {/* Font Weight */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Font Weight</span>
                  <span className="font-mono text-xs">{fontWeight}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="900"
                  step="100"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={fontWeight}
                  onChange={(e) => setFontWeight(parseInt(e.target.value))}
                />
              </div>

              {/* Letter Spacing */}
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Letter Spacing</span>
                  <span className="font-mono text-xs">{letterSpacing}em</span>
                </div>
                <input
                  type="range"
                  min="-0.05"
                  max="0.4"
                  step="0.01"
                  style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Visual Sandbox Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'sticky', top: 'var(--space-6)' }}>
          {/* Custom string input */}
          <GlassCard style={{ padding: 'var(--space-4)', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Custom Preview text
            </span>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type anything here to test typography stacks..."
              className="glass-input"
              style={{ height: '60px', fontSize: '0.8rem', resize: 'none' }}
            />
          </GlassCard>

          {/* Visual preview block */}
          <GlassCard style={{ padding: 'var(--space-5)', minHeight: '180px', display: 'flex', flexDirection: 'column', background: 'rgba(5, 7, 12, 0.4)', border: '1px dashed var(--border-primary)' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
              <Sparkles size={12} style={{ color: 'var(--accent-primary)' }} />
              <span style={{ fontSize: '0.64rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Interactive Typography Sandbox
              </span>
            </div>

            {/* Simulated Live preview Box */}
            <div
              style={{
                fontFamily: selectedFont.stack,
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
                fontWeight: fontWeight,
                letterSpacing: `${letterSpacing}em`,
                color: 'var(--text-primary)',
                wordBreak: 'break-word',
                transition: 'all 0.15s ease-out',
                flex: 1
              }}
            >
              {customText || 'Type preview strings inside the card above...'}
            </div>
          </GlassCard>

          {/* Code outputs */}
          <ToolOutput
            value={generatedCss}
            label="Generated CSS font properties"
            fileName="web-fonts.css"
            sourceTool="Font Stack Reference"
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
