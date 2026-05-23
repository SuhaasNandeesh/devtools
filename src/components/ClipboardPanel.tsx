import React, { useState } from 'react';
import { useClipboard } from '../context/ClipboardContext';
import type { HistoryItem } from '../context/ClipboardContext';
import { X, Trash2, Copy, Check, Search, ClipboardCopy } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ClipboardPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSnippet?: (text: string) => void;
}

export const ClipboardPanel: React.FC<ClipboardPanelProps> = ({
  isOpen,
  onClose,
  onInsertSnippet
}) => {
  const { history, deleteItem, clearHistory } = useClipboard();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter history based on search query
  const filteredHistory = history.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyText = async (item: HistoryItem) => {
    try {
      await navigator.clipboard.writeText(item.text);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // Ignore
    }
  };

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return 'just now';
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <>
      {/* Semi-transparent backdrop overlay to catch clicks outside the panel drawer */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 7, 12, 0.4)',
          backdropFilter: 'blur(1px)',
          zIndex: 95,
          cursor: 'default',
          animation: 'fadeIn var(--transition-normal) forwards'
        }}
      />

      {/* Sliding clipboard drawer */}
      <div
        className="animate-slide-right glass-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 'var(--sidebar-width)',
          maxWidth: '100vw',
          zIndex: 100,
          borderRadius: 0,
          borderLeft: 'var(--glass-border)',
          borderTop: 'none',
          borderBottom: 'none',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px 0 rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Drawer Header */}
        <div
          className="flex items-center justify-between w-full"
          style={{
            padding: 'var(--space-4)',
            borderBottom: '1px solid var(--border-primary)'
          }}
        >
          <div className="flex items-center gap-2">
            <ClipboardCopy size={18} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Clipboard History
            </h2>
          </div>
          <button
            onClick={onClose}
            className="glass-button glass-button-secondary"
            style={{ padding: 'var(--space-1)', borderRadius: 'var(--radius-full)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter search bar */}
        <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--border-primary)' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search saved clips..."
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
        </div>

        {/* Drawer items area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)'
          }}
        >
          {filteredHistory.length === 0 ? (
            <div
              style={{
                padding: 'var(--space-8) var(--space-4)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.85rem'
              }}
            >
              {searchQuery ? 'No matching snippets found.' : 'Clipboard history is empty.'}
            </div>
          ) : (
            filteredHistory.map((item) => (
              <GlassCard
                key={item.id}
                style={{ padding: 'var(--space-3)', gap: 'var(--space-2)' }}
              >
                {/* Badges / Header */}
                <div className="flex justify-between items-center w-full" style={{ fontSize: '0.65rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{formatRelativeTime(item.timestamp)}</span>
                  {item.sourceTool && (
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--accent-primary)',
                        fontWeight: 500
                      }}
                    >
                      {item.sourceTool}
                    </span>
                  )}
                </div>

                {/* Truncated Text display */}
                <div
                  className="font-mono"
                  style={{
                    fontSize: '0.75rem',
                    maxHeight: '75px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'pre-wrap',
                    color: 'var(--text-primary)',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    cursor: onInsertSnippet ? 'pointer' : 'default',
                    background: 'rgba(0, 0, 0, 0.15)',
                    padding: 'var(--space-2)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255, 255, 255, 0.02)'
                  }}
                  onClick={() => onInsertSnippet && onInsertSnippet(item.text)}
                  title={onInsertSnippet ? 'Click to insert into active input' : undefined}
                >
                  {item.text}
                </div>

                {/* Quick Actions buttons */}
                <div className="flex justify-end gap-2 items-center w-full">
                  {onInsertSnippet && (
                    <button
                      onClick={() => onInsertSnippet(item.text)}
                      className="glass-button glass-button-secondary"
                      style={{ padding: '2px var(--space-2)', fontSize: '0.7rem' }}
                    >
                      Insert
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyText(item)}
                    className="glass-button"
                    style={{
                      padding: '2px var(--space-2)',
                      borderColor: copiedId === item.id ? 'var(--color-success)' : 'rgba(255, 255, 255, 0.05)',
                      background: copiedId === item.id ? 'var(--color-success-bg)' : 'transparent'
                    }}
                  >
                    {copiedId === item.id ? <Check size={12} style={{ color: 'var(--color-success)' }} /> : <Copy size={12} />}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="glass-button glass-button-danger"
                    style={{ padding: '2px var(--space-2)', background: 'transparent' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {/* Drawer Footer Actions */}
        {history.length > 0 && (
          <div
            style={{
              padding: 'var(--space-4)',
              borderTop: '1px solid var(--border-primary)',
              background: 'rgba(0,0,0,0.1)'
            }}
          >
            <button
              onClick={() => {
                if (window.confirm('Wipe your complete offline clipboard history? This cannot be undone.')) {
                  clearHistory();
                }
              }}
              className="glass-button glass-button-danger w-full"
              style={{ gap: 'var(--space-2)' }}
            >
              <Trash2 size={14} />
              <span style={{ fontSize: '0.8rem' }}>Purge All Clips</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

