import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const lines = content.split('\n');

  // Custom inline style renderer (handles **bold** and `code` highlights)
  const renderInlineStyles = (text: string) => {
    let processed = text.replace(/\\`/g, '`');

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    const pattern = /(\*\*([^*]+)\*\*|`([^`]+)`)/g;
    let match: RegExpExecArray | null;
    let keyIdx = 0;

    while ((match = pattern.exec(processed)) !== null) {
      if (match.index > lastIndex) {
        parts.push(processed.substring(lastIndex, match.index));
      }

      const fullMatch = match[0];
      if (fullMatch.startsWith('**')) {
        parts.push(
          <strong key={keyIdx++} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
            {match[2]}
          </strong>
        );
      } else {
        const codeText = match[3] || '';
        const isKbd = codeText.includes('+') || ['esc', 'alt', 'cmd', 'ctrl', 'opt'].some(k => codeText.toLowerCase().includes(k));
        if (isKbd) {
          parts.push(
            <kbd key={keyIdx++} className="markdown-kbd">
              {codeText}
            </kbd>
          );
        } else {
          parts.push(
            <code key={keyIdx++} className="markdown-code">
              {codeText}
            </code>
          );
        }
      }

      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < processed.length) {
      parts.push(processed.substring(lastIndex));
    }

    return parts.length > 0 ? parts : processed;
  };

  // Line parser
  const parsedNodes: React.ReactNode[] = [];
  let keyIdx = 0;
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      parsedNodes.push(
        <ul
          key={`list-${keyIdx++}`}
          style={{
            paddingLeft: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            margin: 'var(--space-3) 0',
            listStyleType: 'square'
          }}
        >
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('# ')) {
      flushList();
      parsedNodes.push(
        <h1
          key={keyIdx++}
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.03em',
            marginTop: 'var(--space-6)',
            marginBottom: 'var(--space-4)',
            borderBottom: '1px solid var(--border-primary)',
            paddingBottom: 'var(--space-2)'
          }}
        >
          {renderInlineStyles(line.substring(2))}
        </h1>
      );
    }
    else if (line.startsWith('## ')) {
      flushList();
      parsedNodes.push(
        <h2
          key={keyIdx++}
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--accent-primary)',
            letterSpacing: '-0.02em',
            marginTop: 'var(--space-6)',
            marginBottom: 'var(--space-3)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)'
          }}
        >
          {renderInlineStyles(line.substring(3))}
        </h2>
      );
    }
    else if (line.startsWith('### ')) {
      flushList();
      parsedNodes.push(
        <h3
          key={keyIdx++}
          style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginTop: 'var(--space-4)',
            marginBottom: 'var(--space-2)'
          }}
        >
          {renderInlineStyles(line.substring(4))}
        </h3>
      );
    }
    else if (line === '---') {
      flushList();
      parsedNodes.push(
        <hr
          key={keyIdx++}
          style={{
            border: 'none',
            borderTop: '1px solid var(--border-primary)',
            margin: 'var(--space-6) 0'
          }}
        />
      );
    }
    else if (line.startsWith('* ') || line.startsWith('- ')) {
      inList = true;
      const content = line.startsWith('* ') ? line.substring(2) : line.substring(2);
      listItems.push(
        <li key={`li-${keyIdx++}`} className="markdown-list-item">
          {renderInlineStyles(content)}
        </li>
      );
    }
    else if (line.startsWith('> ')) {
      flushList();
      parsedNodes.push(
        <div
          key={keyIdx++}
          className="glass-panel"
          style={{
            padding: 'var(--space-4)',
            margin: 'var(--space-4) 0',
            borderLeft: '4px solid var(--accent-primary)',
            background: 'rgba(255, 255, 255, 0.02)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}
        >
          {renderInlineStyles(line.substring(2))}
        </div>
      );
    }
    else {
      if (line === '') {
        flushList();
      } else {
        if (inList) {
          flushList();
        }
        parsedNodes.push(
          <p
            key={keyIdx++}
            style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 'var(--space-3)'
            }}
          >
            {renderInlineStyles(line)}
          </p>
        );
      }
    }
  }

  flushList();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        width: '100%',
        paddingBottom: 'var(--space-10)'
      }}
    >
      {parsedNodes}
    </div>
  );
};
