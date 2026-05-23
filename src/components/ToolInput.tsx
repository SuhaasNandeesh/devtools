import React, { useRef, useState } from 'react';
import { useClipboard } from '../context/ClipboardContext';
import { Clipboard, Trash2, Upload, AlertCircle, ChevronDown } from 'lucide-react';

interface ToolInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  allowFileUpload?: boolean;
}

export const ToolInput: React.FC<ToolInputProps> = ({
  value,
  onChange,
  placeholder = 'Paste or type your input here...',
  label = 'Input',
  allowFileUpload = true
}) => {
  const { history, clipboardPermission, requestPermission } = useClipboard();
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute live statistics
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const lineCount = value ? value.split('\n').length : 0;

  const handlePasteClick = async () => {
    try {
      if (clipboardPermission !== 'granted') {
        const allowed = await requestPermission();
        if (!allowed) return;
      }
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
      }
    } catch {
      // Handled silently
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          onChange(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (allowFileUpload) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!allowFileUpload) return;

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          onChange(text);
        }
      };
      reader.readAsText(file);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowHistoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className="flex flex-col gap-2 w-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        flex: 1, /* Grow fully to stretch vertical columns matching output cards */
        display: 'flex',
        flexDirection: 'column',
        border: isDragOver ? '2px dashed var(--accent-primary)' : '2px dashed transparent',
        borderRadius: 'var(--radius-lg)',
        padding: isDragOver ? 'var(--space-2)' : '0',
        transition: 'all var(--transition-fast)'
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
          flexWrap: 'wrap',
          gap: 'var(--space-2)'
        }}
      >
        {/* Left Toolbar actions */}
        <div className="flex items-center gap-2" style={{ position: 'relative' }} ref={dropdownRef}>
          {allowFileUpload && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="glass-button glass-button-secondary"
                title="Upload file"
                style={{ padding: '4px var(--space-2)', minHeight: '28px' }}
              >
                <Upload size={13} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.json,.xml,.yaml,.yml,.csv,.sql,.js,.ts,.html,.css"
                style={{ display: 'none' }}
              />
            </>
          )}

          {/* Clipboard insertion dropdown */}
          <button
            onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
            className="glass-button glass-button-secondary"
            title="Insert from internal Clipboard History"
            style={{ padding: '4px var(--space-2)', minHeight: '28px' }}
          >
            <Clipboard size={13} />
            <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>History</span>
            <ChevronDown size={11} />
          </button>

          {showHistoryDropdown && (
            <div
              className="glass-panel animate-scale"
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 'var(--space-2)',
                width: '280px',
                maxHeight: '260px',
                overflowY: 'auto',
                zIndex: 50,
                padding: 'var(--space-2)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-primary)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}
            >
              <div style={{ padding: 'var(--space-2)', borderBottom: '1px solid var(--border-primary)', fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Clipboard Snippets ({history.length})
              </div>
              {history.length === 0 ? (
                <div style={{ padding: 'var(--space-4)', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No snippets stored in history yet.
                </div>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onChange(item.text);
                      setShowHistoryDropdown(false);
                    }}
                    style={{
                      width: '100%',
                      padding: 'var(--space-2)',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      color: 'var(--text-primary)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {item.text}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Toolbar actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePasteClick}
            className="glass-button glass-button-secondary"
            title="Paste from OS clipboard"
            style={{ padding: '4px var(--space-3)', minHeight: '28px' }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 600 }}>Paste</span>
          </button>
          
          <button
            onClick={() => onChange('')}
            className="glass-button glass-button-danger"
            title="Clear text"
            style={{ padding: '4px var(--space-2)', minHeight: '28px' }}
            disabled={!value}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Main Text Input Area - Stretches Vertically */}
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '250px' }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="glass-input font-mono w-full"
          style={{
            flex: 1, /* Fills out parent container height fully */
            height: '100%',
            resize: 'none'
          }}
        />
        {isDragOver && (
          <div
            className="glass-panel"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(25, 30, 45, 0.85)',
              border: '2px dashed var(--accent-primary)',
              zIndex: 10
            }}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload size={32} className="animate-bounce" style={{ color: 'var(--accent-primary)' }} />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Drop your text file here</p>
            </div>
          </div>
        )}
      </div>

      {/* Live Statistics & Warnings */}
      <div className="flex justify-between items-center w-full" style={{ padding: '2px var(--space-1) 0' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {charCount} chars | {wordCount} words | {lineCount} lines
        </div>
        
        {clipboardPermission === 'denied' && (
          <div className="flex items-center gap-1" style={{ color: 'var(--color-warning)', fontSize: '0.7rem', fontWeight: 500 }}>
            <AlertCircle size={10} />
            <span>Clipboard permission blocked. Paste manually.</span>
          </div>
        )}
      </div>
    </div>
  );
};
