import React from 'react';

interface ToolLayoutProps {
  title: string;
  description: string;
  category: string;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  title,
  description,
  category,
  children
}) => {
  return (
    <div
      className="animate-fade"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        padding: 'var(--space-6)'
      }}
    >
      {/* Title & Description Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              background: 'hsla(250, 85%, 65%, 0.15)',
              color: 'var(--accent-primary)',
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid hsla(250, 85%, 65%, 0.2)'
            }}
          >
            {category}
          </span>
        </div>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em'
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: '0.95rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            maxWidth: '800px'
          }}
        >
          {description}
        </p>
      </div>

      {/* Tool Workspace Panel */}
      <div style={{ flex: 1, minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
};
