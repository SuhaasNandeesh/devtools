import React, { useState } from 'react';
import { X, Sparkles, ArrowUpRight, Download, Check, AlertTriangle } from 'lucide-react';
import { downloadLatestReleaseText } from '../utils/version';

interface UpdateNotificationProps {
  version: string;
  releaseUrl: string;
  onDismiss: () => void;
}

export const UpdateNotification: React.FC<UpdateNotificationProps> = ({ version, releaseUrl, onDismiss }) => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'completed' | 'failed'>('idle');

  const handleGetUpdate = () => {
    (window as any).playFeedbackSound?.('click');
    window.open(releaseUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadUpdate = async () => {
    if (downloadStatus === 'downloading' || downloadStatus === 'completed') return;
    
    (window as any).playFeedbackSound?.('click');
    setDownloadStatus('downloading');
    
    try {
      await downloadLatestReleaseText();
      setDownloadStatus('completed');
      // Play satisfying success feedback sound!
      (window as any).playFeedbackSound?.('success');
    } catch (err) {
      console.error('Failed to auto-download update:', err);
      setDownloadStatus('failed');
      // Play error sound
      (window as any).playFeedbackSound?.('error');
    }
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
        width: '380px',
        maxWidth: 'calc(100vw - var(--space-8))',
        background: 'var(--bg-surface)', /* Enforce solid Material-backed surface for high contrast */
        border: `1px solid ${downloadStatus === 'completed' ? '#10b981' : downloadStatus === 'failed' ? 'rgba(239, 68, 68, 0.8)' : 'var(--accent-primary)'}`, /* Dynamic highlight colors */
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
          {downloadStatus === 'completed' ? (
            <Check size={16} style={{ color: '#10b981', flexShrink: 0 }} />
          ) : downloadStatus === 'failed' ? (
            <AlertTriangle size={16} style={{ color: 'rgba(239, 68, 68, 1)', flexShrink: 0 }} />
          ) : (
            <Sparkles size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          )}
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
            {downloadStatus === 'completed' 
              ? 'DevTools Download Complete!' 
              : downloadStatus === 'failed' 
                ? 'Update Download Failed' 
                : 'New DevTools Update Available!'}
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
        {downloadStatus === 'completed' ? (
          <span>
            The compiled standalone bundle <strong>v{version}</strong> has been saved directly to your browser's default <strong>Downloads folder</strong>! Simply open that file to run the new version.
          </span>
        ) : downloadStatus === 'failed' ? (
          <span>
            Direct download failed (possibly due to network blocks). Click <strong>Manual Update</strong> to download the file directly from our GitHub Releases page.
          </span>
        ) : (
          <span>
            A newer release (<strong>{version}</strong>) has been published on GitHub. Get it to access the latest offline tools, improvements, and optimizations!
          </span>
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
          <span>{downloadStatus === 'completed' ? 'Close' : 'Later'}</span>
        </button>

        {downloadStatus === 'idle' && (
          <button
            onClick={handleDownloadUpdate}
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
            <span>Download Update</span>
            <Download size={12} style={{ color: 'var(--accent-primary)' }} />
          </button>
        )}

        {downloadStatus === 'downloading' && (
          <button
            disabled
            className="glass-button"
            style={{
              padding: 'var(--space-1) var(--space-4)',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              borderColor: 'var(--accent-primary)',
              background: 'transparent',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              cursor: 'not-allowed',
              opacity: 0.8
            }}
          >
            <span>Downloading...</span>
            <div 
              style={{ 
                width: '12px', 
                height: '12px', 
                border: '2px solid var(--accent-primary)', 
                borderTopColor: 'transparent', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }} 
            />
          </button>
        )}

        {downloadStatus === 'completed' && (
          <button
            disabled
            className="glass-button"
            style={{
              padding: 'var(--space-1) var(--space-4)',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              borderColor: '#10b981',
              background: 'rgba(16, 185, 129, 0.1)',
              color: '#10b981',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              cursor: 'default'
            }}
          >
            <span>Downloaded!</span>
            <Check size={12} style={{ color: '#10b981' }} />
          </button>
        )}

        {downloadStatus === 'failed' && (
          <button
            onClick={handleGetUpdate}
            className="glass-button"
            style={{
              padding: 'var(--space-1) var(--space-4)',
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-md)',
              borderColor: 'rgba(239, 68, 68, 0.8)',
              background: 'rgba(239, 68, 68, 0.05)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)'
            }}
          >
            <span>Manual Update</span>
            <ArrowUpRight size={12} style={{ color: 'rgba(239, 68, 68, 1)' }} />
          </button>
        )}
      </div>
    </div>
  );
};
