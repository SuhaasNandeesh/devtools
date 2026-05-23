import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { sortAndDeduplicateLines } from '../../utils/engines';

export const LineSorter: React.FC = () => {
  const [text, setText] = useState('Banana\nApple\nbanana\n\nCherry\nApple');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('asc');
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [removeBlanks, setRemoveBlanks] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const result = sortAndDeduplicateLines(text, {
    sortOrder,
    removeDuplicates,
    removeBlanks,
    caseSensitive
  });

  return (
    <ToolLayout
      title="Line Sorter & Deduplicator"
      description="Sort lists alphabetically or numerically, remove duplicate lines, filter out empty rows, and clean up text lists offline."
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
            placeholder="Enter lines to sort/deduplicate..."
            label="Raw Text List (newline-separated)"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 'var(--space-2)' }}>
                Alphabetical Sort Order
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {(['none', 'asc', 'desc'] as const).map((order) => (
                  <button
                    key={order}
                    onClick={() => setSortOrder(order)}
                    className={`glass-button ${sortOrder === order ? 'active' : ''}`}
                    style={{ flex: 1, padding: 'var(--space-2)', fontSize: '0.8rem' }}
                  >
                    {order === 'none' ? 'No Sorting' : order === 'asc' ? 'Ascending A-Z' : 'Descending Z-A'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={removeDuplicates}
                  onChange={(e) => setRemoveDuplicates(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span>Remove Duplicate Lines</span>
              </label>

              <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={removeBlanks}
                  onChange={(e) => setRemoveBlanks(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span>Filter Out Blank Rows</span>
              </label>

              <label className="flex items-center gap-2" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={caseSensitive}
                  onChange={(e) => setCaseSensitive(e.target.checked)}
                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span>Case-Sensitive Mode</span>
              </label>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-4">
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Processed Result</h3>
          <ToolOutput
            value={result}
            label="Cleaned List"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
