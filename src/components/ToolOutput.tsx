import React, { useState } from 'react';
import { useClipboard } from '../context/ClipboardContext';
import { Copy, Check, Download, AlertTriangle } from 'lucide-react';

interface ToolOutputProps {
  value: string;
  label?: string;
  error?: string | null;
  fileName?: string;
  sourceTool?: string;
}

export const ToolOutput: React.FC<ToolOutputProps> = ({
  value,
  label = 'Output',
  error = null,
  fileName = 'devtool-output.txt',
  sourceTool
}) => {
  const { addToHistory } = useClipboard();
  const [copied, setCopied] = useState(false);

  // Stats
  const charCount = value.length;
  const lineCount = value ? value.split('\n').length : 0;

  const handleCopyClick = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      (window as any).playFeedbackSound?.('success');
      addToHistory(value, sourceTool);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignored
    }
  };

  const handleDownloadClick = () => {
    if (!value) return;
    (window as any).playFeedbackSound?.('success');
    const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="flex flex-col gap-2 w-full"
      style={{
        flex: 1, /* Grow fully to stretch vertical columns matching input cards */
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Row 1: Flat Field Label */}
      <span 
        style={{ 
          fontSize: '0.74rem', 
          fontWeight: 700, 
          color: 'var(--text-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          paddingLeft: '2px',
          display: 'inline-block'
        }}
      >
        {label}
      </span>
      
      {/* Row 2: Google Material Outlined Action Toolbar (100% Squeeze & Overflow Safe) */}
      <div 
        className="flex justify-between items-center w-full"
        style={{ 
          background: 'rgba(0, 0, 0, 0.12)',
          padding: '6px var(--space-3)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-primary)',
          marginBottom: 'var(--space-1)',
          minHeight: '42px',
          flexWrap: 'wrap',
          gap: 'var(--space-2)'
        }}
      >
        {/* Left Toolbar actions placeholder (keeps alignment with input panel) */}
        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 500, paddingLeft: '2px' }}>
          {error ? 'Status: Validation Failed' : value ? 'Status: Succeeded' : 'Awaiting Input...'}
        </div>

        {/* Right Toolbar actions */}
        <div className="flex items-center gap-2">
          {value && !error && (
            <>
              <button
                onClick={handleDownloadClick}
                className="glass-button glass-button-secondary"
                title="Download output as file"
                style={{ padding: '4px var(--space-2)', minHeight: '28px' }}
              >
                <Download size={13} />
                <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Save</span>
              </button>

              <button
                onClick={handleCopyClick}
                className="glass-button"
                style={{
                  padding: '4px var(--space-3)',
                  minHeight: '28px',
                  borderColor: copied ? 'var(--color-success)' : 'transparent',
                  background: copied ? 'var(--color-success-bg)' : 'var(--accent-primary)',
                  color: copied ? 'var(--color-success)' : 'white'
                }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Output Render Core - Stretches Vertically */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '250px' }}>
        {error ? (
          <div
            className="glass-input font-mono w-full"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: 'var(--color-danger)',
              background: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              padding: 'var(--space-4)',
              gap: 'var(--space-2)',
              overflowY: 'auto'
            }}
          >
            <AlertTriangle size={22} />
            <p style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Format Error</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.9, textAlign: 'center', maxWidth: '380px', lineHeight: 1.4 }}>
              {error}
            </p>
          </div>
        ) : (
          <textarea
            readOnly
            value={value}
            placeholder="Awaiting input conversion..."
            className="glass-input font-mono w-full"
            style={{
              flex: 1, /* Fills out parent container height fully */
              height: '100%',
              resize: 'none',
              background: 'rgba(0, 0, 0, 0.08)'
            }}
          />
        )}
      </div>

      {/* Output Badge statistics */}
      <div className="flex justify-between items-center w-full" style={{ padding: '2px var(--space-1) 0' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {value && !error ? `${charCount} chars | ${lineCount} lines` : '0 chars'}
        </div>
      </div>
    </div>
  );
};
