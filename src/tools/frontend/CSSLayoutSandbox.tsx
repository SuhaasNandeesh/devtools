import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';

export const CSSLayoutSandbox: React.FC = () => {
  const [layoutMode, setLayoutMode] = useState<'flex' | 'grid'>('flex');
  const [itemCount, setItemCount] = useState(6);

  // Flexbox Properties
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('center');
  const [alignItems, setAlignItems] = useState('center');
  const [flexWrap, setFlexWrap] = useState('wrap');
  const [flexGap, setFlexGap] = useState(12);

  // Grid Properties
  const [gridColumns, setGridColumns] = useState('repeat(auto-fit, minmax(80px, 1fr))');
  const [justifyItems, setJustifyItems] = useState('stretch');
  const [alignItemsGrid, setAlignItemsGrid] = useState('stretch');
  const [gridGap, setGridGap] = useState(12);

  // Child Items Colors Map
  const COLORS = [
    '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107'
  ];

  // Code generation
  const parentCss = layoutMode === 'flex'
    ? `.container {\n  display: flex;\n  flex-direction: ${flexDirection};\n  justify-content: ${justifyContent};\n  align-items: ${alignItems};\n  flex-wrap: ${flexWrap};\n  gap: ${flexGap}px;\n}`
    : `.container {\n  display: grid;\n  grid-template-columns: ${gridColumns};\n  justify-items: ${justifyItems};\n  align-items: ${alignItemsGrid};\n  gap: ${gridGap}px;\n}`;

  const sampleHtml = `<div class="container">\n${Array.from({ length: itemCount })
    .map((_, i) => `  <div class="item item-${i + 1}">${i + 1}</div>`)
    .join('\n')}\n</div>`;

  const fullCodeOutput = `/* CSS rules */\n${parentCss}\n\n/* HTML Markup */\n${sampleHtml}`;

  return (
    <ToolLayout
      title="CSS Layout Flexbox & Grid Sandbox"
      description="Visual interactive layout designer to prototype and preview CSS Flexbox and CSS Grid layout structures in real-time with responsive sandbox child items."
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
        {/* Left Column: Properties controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Mode Selector */}
          <GlassCard style={{ padding: 'var(--space-4)', gap: 'var(--space-4)' }}>
            <div className="flex gap-2 w-full">
              {['flex', 'grid'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLayoutMode(mode as 'flex' | 'grid')}
                  className="glass-button w-full"
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    background: layoutMode === mode ? 'var(--accent-glow)' : 'transparent',
                    borderColor: layoutMode === mode ? 'var(--accent-primary)' : 'var(--border-primary)',
                    color: layoutMode === mode ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: 700
                  }}
                >
                  CSS {mode.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Item Counter Slider */}
            <div className="flex flex-col gap-1 w-full" style={{ marginTop: 'var(--space-2)' }}>
              <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Number of Items</span>
                <span className="font-mono text-xs">{itemCount} items</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                value={itemCount}
                onChange={(e) => setItemCount(parseInt(e.target.value))}
              />
            </div>
          </GlassCard>

          {/* Dynamic properties card */}
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {layoutMode === 'flex' ? 'Flexbox Alignment Controls' : 'CSS Grid Layout Columns'}
            </h2>

            {layoutMode === 'flex' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* flex-direction */}
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>flex-direction</span>
                  <select
                    value={flexDirection}
                    onChange={(e) => setFlexDirection(e.target.value)}
                    className="glass-input"
                    style={{ fontSize: '0.8rem', padding: 'var(--space-1) var(--space-2)' }}
                  >
                    {['row', 'row-reverse', 'column', 'column-reverse'].map(d => (
                      <option key={d} value={d} style={{ background: '#121212', color: 'white' }}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* justify-content */}
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>justify-content</span>
                  <select
                    value={justifyContent}
                    onChange={(e) => setJustifyContent(e.target.value)}
                    className="glass-input"
                    style={{ fontSize: '0.8rem', padding: 'var(--space-1) var(--space-2)' }}
                  >
                    {['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'].map(j => (
                      <option key={j} value={j} style={{ background: '#121212', color: 'white' }}>{j}</option>
                    ))}
                  </select>
                </div>

                {/* align-items */}
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>align-items</span>
                  <select
                    value={alignItems}
                    onChange={(e) => setAlignItems(e.target.value)}
                    className="glass-input"
                    style={{ fontSize: '0.8rem', padding: 'var(--space-1) var(--space-2)' }}
                  >
                    {['stretch', 'flex-start', 'flex-end', 'center', 'baseline'].map(a => (
                      <option key={a} value={a} style={{ background: '#121212', color: 'white' }}>{a}</option>
                    ))}
                  </select>
                </div>

                {/* flex-wrap */}
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>flex-wrap</span>
                  <select
                    value={flexWrap}
                    onChange={(e) => setFlexWrap(e.target.value)}
                    className="glass-input"
                    style={{ fontSize: '0.8rem', padding: 'var(--space-1) var(--space-2)' }}
                  >
                    {['nowrap', 'wrap', 'wrap-reverse'].map(w => (
                      <option key={w} value={w} style={{ background: '#121212', color: 'white' }}>{w}</option>
                    ))}
                  </select>
                </div>

                {/* gap */}
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Flex Gap (px)</span>
                    <span className="font-mono text-xs">{flexGap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                    value={flexGap}
                    onChange={(e) => setFlexGap(parseInt(e.target.value))}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* grid-template-columns */}
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>grid-template-columns</span>
                  <input
                    type="text"
                    value={gridColumns}
                    onChange={(e) => setGridColumns(e.target.value)}
                    className="glass-input font-mono"
                    style={{ fontSize: '0.78rem', padding: '6px var(--space-3)' }}
                  />
                  {/* Presets */}
                  <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: '4px' }}>
                    {[
                      { label: 'Auto-Fit Grid', val: 'repeat(auto-fit, minmax(80px, 1fr))' },
                      { label: '3 Columns', val: '1fr 1fr 1fr' },
                      { label: 'Sidebar Layout', val: '180px 1fr' },
                      { label: 'Golden Ratio', val: '2fr 1fr' }
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => setGridColumns(p.val)}
                        className="glass-button glass-button-secondary"
                        style={{ padding: '2px 8px', fontSize: '0.64rem' }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* justify-items */}
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>justify-items</span>
                  <select
                    value={justifyItems}
                    onChange={(e) => setJustifyItems(e.target.value)}
                    className="glass-input"
                    style={{ fontSize: '0.8rem', padding: 'var(--space-1) var(--space-2)' }}
                  >
                    {['stretch', 'start', 'end', 'center'].map(j => (
                      <option key={j} value={j} style={{ background: '#121212', color: 'white' }}>{j}</option>
                    ))}
                  </select>
                </div>

                {/* align-items */}
                <div className="flex flex-col gap-1">
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>align-items</span>
                  <select
                    value={alignItemsGrid}
                    onChange={(e) => setAlignItemsGrid(e.target.value)}
                    className="glass-input"
                    style={{ fontSize: '0.8rem', padding: 'var(--space-1) var(--space-2)' }}
                  >
                    {['stretch', 'start', 'end', 'center'].map(a => (
                      <option key={a} value={a} style={{ background: '#121212', color: 'white' }}>{a}</option>
                    ))}
                  </select>
                </div>

                {/* gap */}
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-center w-full" style={{ fontSize: '0.74rem', fontWeight: 600 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Grid Gap (px)</span>
                    <span className="font-mono text-xs">{gridGap}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                    value={gridGap}
                    onChange={(e) => setGridGap(parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Visual Preview & Code outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'sticky', top: 'var(--space-6)' }}>
          {/* Visual Sandbox viewport */}
          <GlassCard style={{ padding: 'var(--space-4)', background: 'rgba(5, 7, 12, 0.5)', border: '1px dashed var(--border-primary)', minHeight: '340px', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
              Live CSS Render Frame
            </span>

            {/* Parent simulated box container */}
            <div
              style={layoutMode === 'flex' ? {
                display: 'flex',
                flexDirection: flexDirection as any,
                justifyContent: justifyContent,
                alignItems: alignItems,
                flexWrap: flexWrap as any,
                gap: `${flexGap}px`,
                width: '100%',
                height: '280px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                boxSizing: 'border-box',
                overflowY: 'auto'
              } : {
                display: 'grid',
                gridTemplateColumns: gridColumns,
                justifyItems: justifyItems,
                alignItems: alignItemsGrid,
                gap: `${gridGap}px`,
                width: '100%',
                height: '280px',
                background: 'rgba(255,255,255,0.01)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                boxSizing: 'border-box',
                overflowY: 'auto'
              }}
            >
              {Array.from({ length: itemCount }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, rgba(255,255,255,0.08))`,
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '1rem',
                    width: layoutMode === 'flex' ? '60px' : 'auto',
                    height: layoutMode === 'flex' ? '60px' : 'auto',
                    minHeight: '40px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxSizing: 'border-box'
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Generated Code outputs */}
          <ToolOutput
            value={fullCodeOutput}
            label="Generated CSS and HTML Markup"
            fileName="layout-styles.css"
            sourceTool="CSS Sandbox"
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
