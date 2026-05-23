import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { Search, Copy, Check, FileText, Code, Image as ImageIcon, Music, Video as VideoIcon, Type } from 'lucide-react';

interface MimeInfo {
  extension: string;
  type: string;
  category: 'text' | 'application' | 'image' | 'audio' | 'video' | 'font';
  description: string;
  headerExample: string;
}

const MIME_DATABASE: MimeInfo[] = [
  // Text
  { extension: '.html', type: 'text/html', category: 'text', description: 'HTML document format, defines web page structure.', headerExample: 'Content-Type: text/html; charset=utf-8' },
  { extension: '.css', type: 'text/css', category: 'text', description: 'Cascading Style Sheets, used to style HTML layouts.', headerExample: 'Content-Type: text/css; charset=utf-8' },
  { extension: '.csv', type: 'text/csv', category: 'text', description: 'Comma-Separated Values format for tabular data.', headerExample: 'Content-Type: text/csv; charset=utf-8' },
  { extension: '.txt', type: 'text/plain', category: 'text', description: 'Plain text files containing unformatted readable text.', headerExample: 'Content-Type: text/plain; charset=utf-8' },
  { extension: '.md', type: 'text/markdown', category: 'text', description: 'Markdown formatting files for documentation.', headerExample: 'Content-Type: text/markdown; charset=utf-8' },
  { extension: '.ics', type: 'text/calendar', category: 'text', description: 'iCalendar files, scheduling and calendar events format.', headerExample: 'Content-Type: text/calendar; charset=utf-8' },
  
  // Application
  { extension: '.json', type: 'application/json', category: 'application', description: 'JavaScript Object Notation, standard serialization format.', headerExample: 'Content-Type: application/json; charset=utf-8' },
  { extension: '.js', type: 'application/javascript', category: 'application', description: 'JavaScript source code files for script execution.', headerExample: 'Content-Type: application/javascript; charset=utf-8' },
  { extension: '.mjs', type: 'application/javascript', category: 'application', description: 'ES Module Javascript source code file.', headerExample: 'Content-Type: application/javascript; charset=utf-8' },
  { extension: '.xml', type: 'application/xml', category: 'application', description: 'Extensible Markup Language data structural format.', headerExample: 'Content-Type: application/xml; charset=utf-8' },
  { extension: '.pdf', type: 'application/pdf', category: 'application', description: 'Portable Document Format, electronic document distribution.', headerExample: 'Content-Type: application/pdf' },
  { extension: '.zip', type: 'application/zip', category: 'application', description: 'ZIP compressed archive package container.', headerExample: 'Content-Type: application/zip' },
  { extension: '.tar', type: 'application/x-tar', category: 'application', description: 'Tape Archive folder package without compression.', headerExample: 'Content-Type: application/x-tar' },
  { extension: '.gz', type: 'application/gzip', category: 'application', description: 'Gzip compressed single file format.', headerExample: 'Content-Type: application/gzip' },
  { extension: '.wasm', type: 'application/wasm', category: 'application', description: 'WebAssembly binary bytecode module format.', headerExample: 'Content-Type: application/wasm' },
  { extension: '.xhtml', type: 'application/xhtml+xml', category: 'application', description: 'XHTML standard XML-conforming web page markup.', headerExample: 'Content-Type: application/xhtml+xml; charset=utf-8' },
  { extension: '.jsonld', type: 'application/ld+json', category: 'application', description: 'JSON-LD structured database linked data format.', headerExample: 'Content-Type: application/ld+json; charset=utf-8' },
  { extension: '.rtf', type: 'application/rtf', category: 'application', description: 'Rich Text Format document layout.', headerExample: 'Content-Type: application/rtf' },
  { extension: '.sh', type: 'application/x-sh', category: 'application', description: 'Unix Shell script configuration syntax.', headerExample: 'Content-Type: application/x-sh' },
  { extension: '.bin', type: 'application/octet-stream', category: 'application', description: 'Binary generic streams or system executable packages.', headerExample: 'Content-Type: application/octet-stream' },
  { extension: '.exe', type: 'application/octet-stream', category: 'application', description: 'Windows Portable Executable binary file.', headerExample: 'Content-Type: application/octet-stream' },
  { extension: '.dmg', type: 'application/octet-stream', category: 'application', description: 'macOS Disk Image file.', headerExample: 'Content-Type: application/octet-stream' },
  
  // Image
  { extension: '.png', type: 'image/png', category: 'image', description: 'Portable Network Graphics, lossless raster graphics format.', headerExample: 'Content-Type: image/png' },
  { extension: '.jpeg', type: 'image/jpeg', category: 'image', description: 'Joint Photographic Experts Group, lossy photo compression.', headerExample: 'Content-Type: image/jpeg' },
  { extension: '.jpg', type: 'image/jpeg', category: 'image', description: 'Joint Photographic Experts Group, alternative extension.', headerExample: 'Content-Type: image/jpeg' },
  { extension: '.gif', type: 'image/gif', category: 'image', description: 'Graphics Interchange Format, standard lossless animations.', headerExample: 'Content-Type: image/gif' },
  { extension: '.webp', type: 'image/webp', category: 'image', description: 'WebP modern lightweight image compression standard.', headerExample: 'Content-Type: image/webp' },
  { extension: '.svg', type: 'image/svg+xml', category: 'image', description: 'Scalable Vector Graphics, XML vector geometry formats.', headerExample: 'Content-Type: image/svg+xml' },
  { extension: '.ico', type: 'image/x-icon', category: 'image', description: 'Windows Icon, legacy browser favicon format.', headerExample: 'Content-Type: image/x-icon' },
  { extension: '.avif', type: 'image/avif', category: 'image', description: 'AV1 Image File Format, high efficiency raster format.', headerExample: 'Content-Type: image/avif' },
  { extension: '.bmp', type: 'image/bmp', category: 'image', description: 'Bitmap Image File format.', headerExample: 'Content-Type: image/bmp' },
  { extension: '.tiff', type: 'image/tiff', category: 'image', description: 'Tagged Image File Format for high-quality printing.', headerExample: 'Content-Type: image/tiff' },

  // Audio
  { extension: '.mp3', type: 'audio/mpeg', category: 'audio', description: 'MPEG Layer 3 audio compressed streaming track format.', headerExample: 'Content-Type: audio/mpeg' },
  { extension: '.wav', type: 'audio/wav', category: 'audio', description: 'Waveform Audio, standard uncompressed raw format.', headerExample: 'Content-Type: audio/wav' },
  { extension: '.ogg', type: 'audio/ogg', category: 'audio', description: 'Ogg Vorbis container audio streaming tracks.', headerExample: 'Content-Type: audio/ogg' },
  { extension: '.aac', type: 'audio/aac', category: 'audio', description: 'Advanced Audio Coding standard format.', headerExample: 'Content-Type: audio/aac' },
  { extension: '.flac', type: 'audio/flac', category: 'audio', description: 'Free Lossless Audio Codec format.', headerExample: 'Content-Type: audio/flac' },
  { extension: '.weba', type: 'audio/webm', category: 'audio', description: 'WebM audio formats.', headerExample: 'Content-Type: audio/webm' },
  { extension: '.mid', type: 'audio/midi', category: 'audio', description: 'Musical Instrument Digital Interface composition sheet.', headerExample: 'Content-Type: audio/midi' },

  // Video
  { extension: '.mp4', type: 'video/mp4', category: 'video', description: 'MPEG4 Part 14, standard video container file.', headerExample: 'Content-Type: video/mp4' },
  { extension: '.webm', type: 'video/webm', category: 'video', description: 'WebM open source web stream video formats.', headerExample: 'Content-Type: video/webm' },
  { extension: '.mpeg', type: 'video/mpeg', category: 'video', description: 'MPEG-1 or MPEG-2 standard video elements.', headerExample: 'Content-Type: video/mpeg' },
  { extension: '.ogv', type: 'video/ogg', category: 'video', description: 'Ogg video streaming track.', headerExample: 'Content-Type: video/ogg' },
  { extension: '.avi', type: 'video/x-msvideo', category: 'video', description: 'Audio Video Interleave container format.', headerExample: 'Content-Type: video/x-msvideo' },
  { extension: '.mov', type: 'video/quicktime', category: 'video', description: 'Apple QuickTime video file.', headerExample: 'Content-Type: video/quicktime' },

  // Font
  { extension: '.woff2', type: 'font/woff2', category: 'font', description: 'Web Open Font Format 2.0, standard compressed font format.', headerExample: 'Content-Type: font/woff2' },
  { extension: '.woff', type: 'font/woff', category: 'font', description: 'Web Open Font Format 1.0, legacy compressed font format.', headerExample: 'Content-Type: font/woff' },
  { extension: '.ttf', type: 'font/ttf', category: 'font', description: 'TrueType Font format vector glyphs file.', headerExample: 'Content-Type: font/ttf' },
  { extension: '.otf', type: 'font/otf', category: 'font', description: 'OpenType Font format layout files.', headerExample: 'Content-Type: font/otf' }
];

export const MimeLookup: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMime, setSelectedMime] = useState<MimeInfo | null>(MIME_DATABASE[0]);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const filteredMimes = MIME_DATABASE.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      item.extension.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);
      
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (cat: MimeInfo['category']) => {
    switch (cat) {
      case 'text': return <FileText size={14} />;
      case 'application': return <Code size={14} />;
      case 'image': return <ImageIcon size={14} />;
      case 'audio': return <Music size={14} />;
      case 'video': return <VideoIcon size={14} />;
      case 'font': return <Type size={14} />;
    }
  };

  const getCategoryBadgeStyles = (cat: MimeInfo['category']) => {
    switch (cat) {
      case 'text':
        return { bg: 'rgba(33, 150, 243, 0.1)', color: '#2196f3' };
      case 'application':
        return { bg: 'rgba(156, 39, 176, 0.1)', color: '#9c27b0' };
      case 'image':
        return { bg: 'rgba(76, 175, 80, 0.1)', color: '#4caf50' };
      case 'audio':
        return { bg: 'rgba(233, 30, 99, 0.1)', color: '#e91e63' };
      case 'video':
        return { bg: 'rgba(255, 152, 0, 0.1)', color: '#ff9800' };
      case 'font':
        return { bg: 'rgba(0, 150, 136, 0.1)', color: '#009688' };
    }
  };

  const handleCopy = (text: string, type: 'type' | 'header') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <ToolLayout
      title="MIME Types Reference Lookup"
      description="Offline searchable database of Multipurpose Internet Mail Extensions (MIME) content types, mapped to common file extensions, server header directives, and technical specifications."
      category="Network Utilities"
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
        {/* Left column: Search and list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <GlassCard style={{ padding: 'var(--space-4)', gap: 'var(--space-4)' }}>
            {/* Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                placeholder="Search by extension (e.g. .json) or MIME type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input"
                style={{ paddingLeft: 'var(--space-8)' }}
              />
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              {['all', 'text', 'application', 'image', 'audio', 'video', 'font'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="glass-button glass-button-secondary"
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: activeCategory === cat ? 'var(--accent-glow)' : 'transparent',
                    borderColor: activeCategory === cat ? 'var(--accent-primary)' : 'var(--border-primary)',
                    color: activeCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)'
                  }}
                >
                  {cat !== 'all' && getCategoryIcon(cat as MimeInfo['category'])}
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </GlassCard>

          {/* List Card */}
          <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
            <div
              style={{
                maxHeight: '480px',
                overflowY: 'auto',
                width: '100%'
              }}
              className="custom-scrollbar"
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.02)' }}>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--text-secondary)' }}>Extension</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--text-secondary)' }}>Content Type</th>
                    <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMimes.map((item, idx) => {
                    const isSelected = selectedMime?.extension === item.extension;
                    const badge = getCategoryBadgeStyles(item.category);
                    return (
                      <tr
                        key={item.extension}
                        onClick={() => setSelectedMime(item)}
                        style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.02)',
                          cursor: 'pointer',
                          background: isSelected ? 'rgba(255, 255, 255, 0.05)' : idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.01)',
                          transition: 'background 0.2s ease'
                        }}
                        className="hover-row-highlight"
                      >
                        <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 700, color: isSelected ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                          {item.extension}
                        </td>
                        <td className="font-mono" style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-primary)' }}>
                          {item.type}
                        </td>
                        <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                          <span
                            style={{
                              fontSize: '0.64rem',
                              fontWeight: 700,
                              background: badge.bg,
                              color: badge.color,
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-full)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {getCategoryIcon(item.category)}
                            {item.category}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredMimes.length === 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No MIME types found matching your query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Right column: Selected MIME type Details */}
        <div>
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-5)', position: 'sticky', top: 'var(--space-6)' }}>
            {selectedMime ? (
              <>
                <div>
                  <h3 style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Extension</h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{selectedMime.extension}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>MIME specification</span>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid var(--border-primary)', width: '100%' }}></div>

                {/* Details list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%' }}>
                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>MIME Content Type</span>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'between',
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.15)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-3) var(--space-4)',
                        marginTop: '4px'
                      }}
                      className="w-full flex justify-between"
                    >
                      <span className="font-mono" style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                        {selectedMime.type}
                      </span>
                      <button
                        onClick={() => handleCopy(selectedMime.type, 'type')}
                        className="glass-button glass-button-secondary"
                        style={{ padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Copy MIME Content-Type"
                      >
                        {copiedType === 'type' ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>HTTP Directives Content-Type Header Example</span>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'between',
                        alignItems: 'center',
                        background: 'rgba(0,0,0,0.15)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-3) var(--space-4)',
                        marginTop: '4px'
                      }}
                      className="w-full flex justify-between"
                    >
                      <span className="font-mono" style={{ fontSize: '0.76rem', color: 'var(--text-primary)' }}>
                        {selectedMime.headerExample}
                      </span>
                      <button
                        onClick={() => handleCopy(selectedMime.headerExample, 'header')}
                        className="glass-button glass-button-secondary"
                        style={{ padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Copy Header String"
                      >
                        {copiedType === 'header' ? <Check size={12} color="var(--color-success)" /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>MIME Description</span>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
                      {selectedMime.description}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-8)' }}>
                Select an extension from the list to view its complete MIME specification details.
              </div>
            )}
          </GlassCard>
        </div>
      </div>
      
      {/* Responsive layout overrides */}
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
