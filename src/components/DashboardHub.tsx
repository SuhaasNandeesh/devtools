import React from 'react';
import { Search, X, Star, ArrowRight } from 'lucide-react';
import { getToolIcon } from '../utils/iconHelper';
import { TOOLS_CATALOG } from '../utils/toolsCatalog';
import type { ToolEntry } from '../utils/toolsCatalog';
import { CURRENT_VERSION } from '../assets/changelogContent';

export const DashboardHub: React.FC<{
  onSelectTool: (id: string) => void;
  favourites: string[];
  toggleFavourite: (id: string, e: React.MouseEvent) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  clipboardScrapsCount: number;
}> = ({
  onSelectTool,
  favourites,
  toggleFavourite,
  searchQuery,
  setSearchQuery,
  clipboardScrapsCount
}) => {
  const filteredTools = TOOLS_CATALOG.filter((tool) => {
    const q = searchQuery.toLowerCase();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q)
    );
  });

  const grouped = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, ToolEntry[]>);

  return (
    <div
      style={{
        padding: 'var(--space-6)',
        height: '100%',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        position: 'relative'
      }}
      className="animate-fade"
    >
      <div
        className="glass-panel"
        style={{
          padding: 'var(--space-6)',
          background: 'rgba(255, 255, 255, 0.01)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              background: 'linear-gradient(45deg, var(--text-primary), var(--accent-primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.03em',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span style={{ background: 'linear-gradient(45deg, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Welcome to DevTools
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 700,
                background: 'var(--accent-glow)',
                border: '1px solid var(--accent-primary)',
                color: 'var(--accent-primary)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                letterSpacing: '0.05em',
                boxShadow: '0 0 10px var(--accent-glow)',
                WebkitTextFillColor: 'var(--accent-primary)',
                flexShrink: 0
              }}
            >
              v{CURRENT_VERSION}
            </span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Airtight, local-origin developer utility framework. 100% Secure & Offline.
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-4)'
        }}
      >
        <div className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Active Utilities</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>45 Tools</span>
        </div>
        <div className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Clipboard Scraps</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{clipboardScrapsCount} cached</span>
        </div>
        <div className="glass-panel" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>My Favourites</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{favourites.length} active</span>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type="text"
          placeholder="Search all 45 utilities, converters, formatters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="glass-input"
          style={{
            padding: 'var(--space-4) var(--space-10)',
            fontSize: '1rem',
            borderRadius: 'var(--radius-lg)'
          }}
        />
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: 'var(--space-4)',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            style={{
              position: 'absolute',
              right: 'var(--space-4)',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        {Object.entries(grouped).map(([category, tools]) => {
          if (tools.length === 0) return null;
          return (
            <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {category}
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 'var(--space-4)'
                }}
              >
                {tools.map((tool) => {
                  const ToolIcon = getToolIcon(tool.id);
                  const isFav = favourites.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      className="glass-panel glass-card"
                      onClick={() => {
                        (window as any).playFeedbackSound?.('click');
                        onSelectTool(tool.id);
                      }}
                      style={{
                        padding: 'var(--space-4)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: 'var(--space-3)',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div
                            style={{
                              padding: 'var(--space-2)',
                              borderRadius: 'var(--radius-md)',
                              background: 'var(--accent-glow)',
                              color: 'var(--accent-primary)',
                              display: 'inline-flex'
                            }}
                          >
                            <ToolIcon size={18} />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{tool.name}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            (window as any).playFeedbackSound?.('click');
                            toggleFavourite(tool.id, e);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: isFav ? 'var(--accent-primary)' : 'var(--text-muted)',
                            opacity: isFav ? 1 : 0.25,
                            transition: 'opacity var(--transition-fast)'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                          onMouseLeave={(e) => {
                            if (!isFav) e.currentTarget.style.opacity = '0.25';
                          }}
                        >
                          <Star size={14} style={{ fill: isFav ? 'var(--accent-primary)' : 'none' }} />
                        </button>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, flex: 1 }}>
                        {tool.description}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', borderTop: '1px solid var(--border-primary)', paddingTop: 'var(--space-2)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <span>Click to launch</span>
                        <ArrowRight size={10} style={{ color: 'var(--accent-primary)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
