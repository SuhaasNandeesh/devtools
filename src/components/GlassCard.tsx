import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  style = {}
}) => {
  return (
    <div
      onClick={onClick}
      className={`glass-panel glass-card ${className} ${onClick ? 'cursor-pointer' : ''} ${
        hoverable ? 'hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200' : ''
      }`}
      style={{
        padding: 'var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        ...style
      }}
    >
      {children}
    </div>
  );
};
