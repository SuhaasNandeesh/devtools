import React from 'react';
import { X, Sparkles, ArrowUpRight } from 'lucide-react';

interface UpdateNotificationProps {
  version: string;
  releaseUrl: string;
  onDismiss: () => void;
  isHotfix?: boolean;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({ version, releaseUrl, onDismiss, isHotfix }) => {
  const handleGetUpdate = () => {
    (window as any).playFeedbackSound?.('click');
    window.open(releaseUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDismiss = () => {
    (window as any).playFeedbackSound?.('click');
    onDismiss();
  };

  return (
    <div
      className="glass-panel animate-scale"
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        right: 'var(--space-6)',
        zIndex: 2500, /* Below modals, above standard panels */
        width: '360px',
        maxWidth: 'calc(100vw - var(--space-8))',
        background: 'var(--bg-surface)', /* Enforce solid Material-backed surface for high contrast */
        border: '1px solid var(--accent-primary)', /* Highlights the notification */
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        animation: 'slideInUp var(--transition-normal) cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      }}
    >
      {/* Title block */}
      <div className="flex items-start justify-between gap-2 w-full">
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {isHotfix ? 'New DevTools Hotfix Available!' : 'New DevTools Update Available!'}
          </span>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color var(--transition-fast)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          title="Dismiss notification"
        >
          <X size={14} />
        </button>
      </div>

      {/* Description */}
      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
        {isHotfix ? (
          <>A newer hotfix update for <strong>{version}</strong> has been published on GitHub. Get it to access the latest bugfixes and improvements!</>
        ) : (
          <>A newer release (<strong>{version}</strong>) has been published on GitHub. Get it to access the latest offline tools, improvements, and optimizations!</>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 w-full">
        <button
          onClick={handleDismiss}
          className="glass-button glass-button-secondary"
          style={{
            padding: 'var(--space-1) var(--space-4)',
            fontSize: '0.75rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          <span>Later</span>
        </button>
        <button
          onClick={handleGetUpdate}
          className="glass-button"
          style={{
            padding: 'var(--space-1) var(--space-4)',
            fontSize: '0.75rem',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)',
            borderColor: 'var(--accent-primary)',
            background: 'var(--accent-glow)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)'
          }}
        >
          <span>Get Update</span>
          <ArrowUpRight size={12} style={{ color: 'var(--accent-primary)' }} />
        </button>
      </div>
    </div>
  );
};
