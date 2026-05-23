import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';
import { Upload, FileText, Check, Copy } from 'lucide-react';

export const Base64FileParser: React.FC = () => {
  const [base64Output, setBase64Output] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSizeKb, setFileSizeKb] = useState(0);
  const [fileType, setFileType] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  const processFile = (file: File) => {
    setFileName(file.name);
    setFileSizeKb(parseFloat((file.size / 1024).toFixed(2)));
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64Output(result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const copyRawBase64Only = () => {
    // Strip "data:image/png;base64," prefix for raw copy option
    const commaIdx = base64Output.indexOf(',');
    const raw = commaIdx !== -1 ? base64Output.substring(commaIdx + 1) : base64Output;
    navigator.clipboard.writeText(raw);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const isImage = fileType.startsWith('image/');

  return (
    <ToolLayout
      title="Base64 File & Image Parser"
      description="Translate offline local binary files (images, PDFs, documents) into standard Base64 Data URL streams securely, 100% locally client-side."
      category="Converters"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-6)',
          width: '100%',
          alignItems: 'start'
        }}
        className="mime-grid-responsive"
      >
        {/* Left Column: Dropzone and stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Drag zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              outline: 'none',
              cursor: 'pointer',
              border: isDragActive ? '1px dashed var(--accent-primary)' : '1px dashed var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              background: isDragActive ? 'rgba(124, 77, 255, 0.04)' : 'rgba(255, 255, 255, 0.01)',
              padding: 'var(--space-10) var(--space-4)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-3)',
              position: 'relative',
              transition: 'all 0.25s ease'
            }}
          >
            <input
              type="file"
              onChange={handleFileChange}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: 0,
                cursor: 'pointer',
                width: '100%',
                height: '100%'
              }}
            />
            
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
              }}
            >
              <Upload size={22} />
            </div>

            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Drag & Drop file here or Click to browse
            </h2>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', maxWidth: '280px', lineHeight: 1.4 }}>
              Supports images, vector SVGs, documents, or compressed archives. Maximum size suggested: 10MB.
            </p>
          </div>

          {/* File Meta specs */}
          {fileName && (
            <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
              <h3 style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>Uploaded File Specifications</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {[
                  { label: 'File Name', val: fileName },
                  { label: 'File Type (MIME)', val: fileType || 'application/octet-stream' },
                  { label: 'File Size', val: `${fileSizeKb} KB` }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center w-full"
                    style={{
                      borderBottom: idx === 2 ? 'none' : '1px solid rgba(255, 255, 255, 0.03)',
                      paddingBottom: idx === 2 ? '0' : 'var(--space-2)',
                      fontSize: '0.76rem'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span className="font-mono" style={{ fontWeight: 700, color: 'var(--text-primary)', wordBreak: 'break-all', textAlign: 'right', maxWidth: '65%' }}>
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column: Visual Preview Canvas & Base64 Outputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', position: 'sticky', top: 'var(--space-6)' }}>
          {/* File preview canvas */}
          <GlassCard style={{ padding: 'var(--space-4)', height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 7, 12, 0.4)', border: '1px dashed var(--border-primary)', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', alignSelf: 'flex-start' }}>
              File visual preview canvas
            </span>

            {base64Output ? (
              isImage ? (
                <img
                  src={base64Output}
                  alt={fileName}
                  style={{
                    maxHeight: '150px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-primary)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
                  }}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                  <FileText size={42} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>Non-image Binary Document</span>
                </div>
              )
            ) : (
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Awaiting file upload for canvas preview...
              </span>
            )}
          </GlassCard>

          {/* Base64 Output tag */}
          <div style={{ position: 'relative' }}>
            <ToolOutput
              value={base64Output}
              label="Base64 Data URI output"
              fileName={fileName ? `${fileName}.txt` : 'base64.txt'}
              sourceTool="Base64 File Parser"
            />
            {base64Output && (
              <button
                onClick={copyRawBase64Only}
                className="glass-button glass-button-secondary"
                style={{
                  position: 'absolute',
                  top: 'var(--space-2)',
                  right: '120px', // next to download/copy buttons
                  padding: '2px 10px',
                  fontSize: '0.64rem',
                  gap: '4px',
                  zIndex: 2
                }}
              >
                {copiedRaw ? <Check size={10} color="var(--color-success)" /> : <Copy size={10} />}
                <span>Copy Raw Base64</span>
              </button>
            )}
          </div>
        </div>
      </div>

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
