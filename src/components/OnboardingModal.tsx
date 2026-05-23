import React from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { readmeContent } from '../assets/readmeContent';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 17, 20, 0.75)', /* Clean, semi-solid neutral overlay darkener */
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        padding: 'var(--space-6)',
        animation: 'fadeIn var(--transition-fast) forwards'
      }}
    >
      <div
        className="glass-panel animate-scale"
        style={{
          width: '780px',
          maxWidth: '95vw',
          height: '80vh',
          maxHeight: '720px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          background: 'var(--bg-surface)', /* Enforces solid Material background */
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
          <div className="flex items-center gap-3">
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Offline DevTools Welcome Guide
            </h2>
          </div>
          <button
            onClick={onClose}
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
          <MarkdownRenderer content={readmeContent} />
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
            <BookOpen size={14} style={{ color: 'var(--accent-primary)' }} />
            <span>Click the Help icon in the top header bar to read this guide at any time.</span>
          </div>

          <button
            onClick={onClose}
            className="glass-button"
            style={{
              padding: 'var(--space-2) var(--space-6)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.85rem'
            }}
          >
            <span>Explore DevTools</span>
          </button>
        </div>

      </div>
    </div>
  );
};
