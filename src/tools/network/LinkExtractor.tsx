import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { extractHtmlLinks } from '../../utils/engines';
import type { ExtractedLink } from '../../utils/engines';

export const LinkExtractor: React.FC = () => {
  const [htmlInput, setHtmlInput] = useState('');
  const [links, setLinks] = useState<ExtractedLink[]>([]);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (!htmlInput.trim()) {
      setLinks([]);
      return;
    }
    const res = extractHtmlLinks(htmlInput);
    setLinks(res);
  }, [htmlInput]);

  const filteredLinks = links.filter((l) => filterType === 'all' || l.type === filterType);

  const getBadgeStyle = (type: ExtractedLink['type']) => {
    switch (type) {
      case 'anchor':
        return { bg: 'rgba(56, 142, 60, 0.15)', color: '#388e3c', label: 'Anchor <a>' };
      case 'image':
        return { bg: 'rgba(25, 118, 210, 0.15)', color: 'var(--accent-primary)', label: 'Image <img>' };
      case 'script':
        return { bg: 'rgba(245, 124, 0, 0.15)', color: '#f57c00', label: 'Script <script>' };
      case 'stylesheet':
        return { bg: 'rgba(211, 47, 47, 0.15)', color: 'var(--color-danger)', label: 'CSS <link>' };
      default:
        return { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', label: 'Other' };
    }
  };

  return (
    <ToolLayout
      title="HTML Link & Asset Scraper"
      description="Extract resource destinations and anchor links from raw HTML markup code entirely offline. Scrapes script bundles, stylesheets, graphics, and anchor URLs."
      category="Network Utilities"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          width: '100%'
        }}
      >
        {/* HTML Input Card */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Raw HTML Input Markup</h2>
          <ToolInput
            value={htmlInput}
            onChange={setHtmlInput}
            placeholder="Paste your raw HTML markup here to extract asset references..."
            label="HTML Source Markup"
            allowFileUpload={true}
          />
        </GlassCard>

        {/* Results Card */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="flex justify-between items-center w-full" style={{ flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Extracted Scraps ({filteredLinks.length})</h2>
            
            {/* Filter Dropdown */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="glass-input"
              style={{ width: '150px', cursor: 'pointer', paddingRight: 'var(--space-4)', background: 'rgba(0,0,0,0.2)' }}
            >
              <option value="all">All Types</option>
              <option value="anchor">Anchors Only</option>
              <option value="image">Images Only</option>
              <option value="script">Scripts Only</option>
              <option value="stylesheet">Stylesheets Only</option>
            </select>
          </div>

          {/* List display */}
          <div
            style={{
              flex: 1,
              maxHeight: '380px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              paddingRight: 'var(--space-1)'
            }}
          >
            {filteredLinks.map((link, idx) => {
              const badge = getBadgeStyle(link.type);
              return (
                <div
                  key={idx}
                  style={{
                    padding: 'var(--space-3)',
                    background: 'rgba(0,0,0,0.12)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div className="flex justify-between items-center w-full" style={{ flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 700,
                        background: badge.bg,
                        color: badge.color,
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)'
                      }}
                    >
                      {badge.label}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {link.text}
                    </span>
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '0.74rem',
                      color: 'var(--accent-primary)',
                      wordBreak: 'break-all',
                      background: 'rgba(0,0,0,0.2)',
                      padding: 'var(--space-2)',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {link.url}
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: '0.65rem',
                      color: 'var(--text-muted)',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden'
                    }}
                    title={link.tag}
                  >
                    Tag: {link.tag}
                  </div>
                </div>
              );
            })}
            {filteredLinks.length === 0 && (
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {htmlInput ? 'No matching link types found.' : 'Awaiting HTML input to scrape links...'}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
