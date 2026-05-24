import React from 'react';
import { X, Rocket, Check } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { changelogContent } from '../assets/changelogContent';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
  version: string;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose, version }) => {
  if (!isOpen) return null;

  const notes = changelogContent[version] || `
# Release Notes - v${version}

Enjoy using the offline DevTools suite! We regularly optimize and add new offline features.
  `;

  const handleClose = () => {
    (window as any).playFeedbackSound?.('click');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 17, 20, 0.8)', /* Semi-solid clean overlay */
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3100, /* Above onboarding modal (3000) */
        padding: 'var(--space-6)',
        animation: 'fadeIn var(--transition-fast) forwards'
      }}
    >
      <div
        className="glass-panel animate-scale"
        style={{
          width: '740px',
          maxWidth: '95vw',
          height: '75vh',
          maxHeight: '660px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          background: 'var(--bg-surface)', /* Enforce solid, readable Material background */
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-xl)'
        }}
      >
        {/* Modal Header */}
        <div
          className="flex items-center justify-between w-full"
          style={{
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--border-primary)',
            background: 'var(--bg-surface)'
          }}
        >
          <div className="flex items-center gap-3 animate-fade">
            <Rocket size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              What's New in DevTools
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="glass-button glass-button-secondary"
            style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-full)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Contents Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--space-6)',
            background: 'var(--bg-surface)'
          }}
        >
          <MarkdownRenderer content={notes} />
        </div>

        {/* Modal Footer Dismiss */}
        <div
          className="flex items-center justify-between w-full flex-wrap gap-3"
          style={{
            padding: 'var(--space-4) var(--space-6)',
            borderTop: '1px solid var(--border-primary)',
            background: 'var(--bg-surface)'
          }}
        >
          <div className="flex items-center gap-2" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
            <span>Running offline: v{version}</span>
          </div>

          <button
            onClick={handleClose}
            className="glass-button"
            style={{
              padding: 'var(--space-2) var(--space-6)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              borderColor: 'var(--accent-primary)',
              background: 'var(--accent-glow)'
            }}
          >
            <Check size={14} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ color: 'var(--text-primary)' }}>Got it!</span>
          </button>
        </div>

      </div>
    </div>
  );
};
