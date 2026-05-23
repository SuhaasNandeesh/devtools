import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { AlertCircle } from 'lucide-react';

interface GroupMatch {
  match: string;
  index: number;
  groups: string[];
}

export const RegexTester: React.FC = () => {
  const [regexStr, setRegexStr] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [sampleText, setSampleText] = useState('Hi tester! You can contact support@example.com or send details to test.user-profile@google.com for review.');
  const [flagGlobal, setFlagGlobal] = useState(true);
  const [flagCase, setFlagCase] = useState(false);
  const [flagMultiline, setFlagMultiline] = useState(true);
  
  const [highlightedHTML, setHighlightedHTML] = useState('');
  const [groupMatches, setGroupMatches] = useState<GroupMatch[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Main compilation logic
  useEffect(() => {
    if (!regexStr) {
      setHighlightedHTML(sampleText);
      setGroupMatches([]);
      setErrorMsg(null);
      return;
    }

    try {
      // Reconstruct flags
      let flags = '';
      if (flagGlobal) flags += 'g';
      if (flagCase) flags += 'i';
      if (flagMultiline) flags += 'm';

      const regex = new RegExp(regexStr, flags);
      setErrorMsg(null);

      // Reset matched details
      const matchesList: GroupMatch[] = [];
      
      // Calculate matches
      if (flagGlobal) {
        let match;
        let iterationCap = 0;
        // visual text replacement
        const matchedIndices: { start: number; end: number }[] = [];

        while ((match = regex.exec(sampleText)) !== null) {
          // infinite loop prevention guard
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          
          matchesList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });

          matchedIndices.push({
            start: match.index,
            end: match.index + match[0].length
          });

          if (iterationCap++ > 1000) break; // emergency break
        }

        // Build HTML highlight canvas
        let lastIdx = 0;
        let htmlResult = '';
        
        // Sort indices
        matchedIndices.sort((a, b) => a.start - b.start);
        
        // Merge indices overlaps
        const merged: { start: number; end: number }[] = [];
        for (const idx of matchedIndices) {
          if (merged.length === 0) {
            merged.push(idx);
          } else {
            const last = merged[merged.length - 1];
            if (idx.start < last.end) {
              last.end = Math.max(last.end, idx.end);
            } else {
              merged.push(idx);
            }
          }
        }

        for (const idx of merged) {
          // Escapes HTML tags to prevent cross-site injections during rendering
          const normalText = escapeHTML(sampleText.substring(lastIdx, idx.start));
          const highlightText = escapeHTML(sampleText.substring(idx.start, idx.end));
          
          htmlResult += normalText + `<mark style="background:hsla(250,85%,65%,0.35);color:var(--text-primary);border-bottom:2px solid var(--accent-primary);padding:0 2px;border-radius:2px;">${highlightText}</mark>`;
          lastIdx = idx.end;
        }
        
        htmlResult += escapeHTML(sampleText.substring(lastIdx));
        setHighlightedHTML(htmlResult);
        setGroupMatches(matchesList);

      } else {
        // Single match mode
        const match = regex.exec(sampleText);
        if (match) {
          matchesList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1)
          });
          
          const start = match.index;
          const end = match.index + match[0].length;
          
          const normalTextBefore = escapeHTML(sampleText.substring(0, start));
          const highlightText = escapeHTML(sampleText.substring(start, end));
          const normalTextAfter = escapeHTML(sampleText.substring(end));
          
          setHighlightedHTML(normalTextBefore + `<mark style="background:hsla(250,85%,65%,0.35);color:var(--text-primary);border-bottom:2px solid var(--accent-primary);padding:0 2px;border-radius:2px;">${highlightText}</mark>` + normalTextAfter);
          setGroupMatches(matchesList);
        } else {
          setHighlightedHTML(escapeHTML(sampleText));
          setGroupMatches([]);
        }
      }

    } catch (e: any) {
      setErrorMsg(e.message);
      // Fallback preview
      setHighlightedHTML(escapeHTML(sampleText));
      setGroupMatches([]);
    }
  }, [regexStr, sampleText, flagGlobal, flagCase, flagMultiline]);

  // Helper string escaper
  const escapeHTML = (text: string): string => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return (
    <ToolLayout
      title="Interactive Regex Tester"
      description="Validate and test Regular Expression syntax offline against multiline mock texts. Displays match overlays, offsets, and captured groupings in real time."
      category="Text Utilities"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {/* Input Parameters column */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Regex Configuration</h2>
          
          {/* Regex Input String */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 'var(--space-1)' }}>
              Regular Expression Pattern
            </label>
            <input
              type="text"
              value={regexStr}
              onChange={(e) => setRegexStr(e.target.value)}
              className="glass-input font-mono"
              placeholder="e.g. [a-z]+"
              style={{
                borderColor: errorMsg ? 'var(--color-danger)' : 'var(--border-primary)'
              }}
            />
            {errorMsg && (
              <div className="flex items-center gap-1" style={{ color: 'var(--color-danger)', fontSize: '0.7rem', marginTop: '4px', fontWeight: 500 }}>
                <AlertCircle size={12} />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Configuration switches */}
          <div className="flex items-center gap-4 flex-wrap" style={{ margin: 'var(--space-2) 0' }}>
            <label className="flex items-center gap-2" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={flagGlobal}
                onChange={(e) => setFlagGlobal(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <span title="Global Search (find all matches)">Global (`g`)</span>
            </label>

            <label className="flex items-center gap-2" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={flagCase}
                onChange={(e) => setFlagCase(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <span title="Case Insensitive search">Case-Insensitive (`i`)</span>
            </label>

            <label className="flex items-center gap-2" style={{ fontSize: '0.8rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={flagMultiline}
                onChange={(e) => setFlagMultiline(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <span title="Multiline matching">Multiline (`m`)</span>
            </label>
          </div>

          {/* Sample Input text */}
          <ToolInput
            value={sampleText}
            onChange={setSampleText}
            placeholder="Type sample text to test matches..."
            label="Sample Test Text"
          />
        </GlassCard>

        {/* Visual highlighting display Column */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Interactive Matches Visualizer</h2>

          {/* Interactive Highlight Display */}
          <div className="flex flex-col gap-2" style={{ flex: 1, minHeight: '200px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Matches Overlay
            </label>
            <div
              className="glass-input font-mono"
              style={{
                height: '200px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                background: 'hsla(224, 25%, 3%, 0.2)',
                wordBreak: 'break-all'
              }}
              dangerouslySetInnerHTML={{ __html: highlightedHTML || 'No matches detected.' }}
            />
          </div>

          {/* Capture Groups Breakdown table */}
          <div className="flex flex-col gap-2" style={{ marginTop: 'var(--space-2)' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Capture Groups List ({groupMatches.length})
            </label>
            <div
              style={{
                maxHeight: '150px',
                overflowY: 'auto',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.1)'
              }}
            >
              {groupMatches.length === 0 ? (
                <div style={{ padding: 'var(--space-4)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No match elements mapped.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-primary)' }}>
                      <th style={{ padding: 'var(--space-2)' }}>Index</th>
                      <th style={{ padding: 'var(--space-2)' }}>Full Match</th>
                      <th style={{ padding: 'var(--space-2)' }}>Sub-Groups</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupMatches.map((m, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <td className="font-mono" style={{ padding: 'var(--space-2)', color: 'var(--text-muted)' }}>{m.index}</td>
                        <td className="font-mono" style={{ padding: 'var(--space-2)', color: 'var(--accent-primary)', fontWeight: 600 }}>{m.match}</td>
                        <td className="font-mono" style={{ padding: 'var(--space-2)', color: 'var(--text-secondary)' }}>
                          {m.groups.length > 0 ? m.groups.join(', ') : 'none'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </GlassCard>
      </div>
    </ToolLayout>
  );
};
