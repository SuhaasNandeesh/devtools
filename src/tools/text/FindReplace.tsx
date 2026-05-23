import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { AlertCircle } from 'lucide-react';
import { findAndReplaceText } from '../../utils/engines';

export const FindReplace: React.FC = () => {
  const [text, setText] = useState('DevTools is amazing. DevTools is offline.');
  const [findStr, setFindStr] = useState('DevTools');
  const [replaceStr, setReplaceStr] = useState('Suite');
  
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [global, setGlobal] = useState(true);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  let result = text;
  try {
    if (findStr) {
      result = findAndReplaceText(text, findStr, replaceStr, { useRegex, caseSensitive, global });
      if (errorMsg) setErrorMsg(null);
    }
  } catch (e: any) {
    result = text;
    if (errorMsg !== e.message) {
      setErrorMsg(e.message);
    }
  }

  return (
    <ToolLayout
      title="Find & Replace"
      description="Perform rapid bulk text string replacements offline. Supports literal substring mapping, regex matches, case-insensitivity adjustments, and global replacement triggers."
      category="Text Utilities"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        <GlassCard className="flex flex-col gap-4">
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Configuration</h3>

          <ToolInput
            value={text}
            onChange={setText}
            placeholder="Type source text here..."
            label="Source Text"
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Find Target
              </label>
              <input
                type="text"
                value={findStr}
                onChange={(e) => setFindStr(e.target.value)}
                className="glass-input font-mono"
                placeholder="String to find..."
                style={{ width: '100%', borderColor: errorMsg ? 'var(--color-danger)' : 'var(--border-primary)' }}
              />
              {errorMsg && (
                <div style={{ color: 'var(--color-danger)', fontSize: '0.7rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={12} />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Replace With
              </label>
              <input
                type="text"
                value={replaceStr}
                onChange={(e) => setReplaceStr(e.target.value)}
                className="glass-input font-mono"
                placeholder="String to replace..."
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => setUseRegex(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <span>Regular Expression</span>
            </label>

            <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <span>Case Sensitive</span>
            </label>

            <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={global}
                onChange={(e) => setGlobal(e.target.checked)}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              <span>Replace All (Global)</span>
            </label>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4">
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Outcome</h3>
          <ToolOutput
            value={result}
            label="Resulting Text"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
