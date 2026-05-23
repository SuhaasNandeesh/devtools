import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';
import { generateFakeData, jsonToCsv, csvToSqlInsert } from '../../utils/engines';

export const FakeDataGenerator: React.FC = () => {
  const [count, setCount] = useState(25);
  const [seed, setSeed] = useState(12345);
  const [dataList, setDataList] = useState<any[]>([]);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'sql'>('json');
  const [exportText, setExportText] = useState('');

  const triggerGenerate = () => {
    const list = generateFakeData(count, seed);
    setDataList(list);
  };

  useEffect(() => {
    triggerGenerate();
  }, [count, seed]);

  useEffect(() => {
    if (dataList.length === 0) {
      setExportText('');
      return;
    }
    
    if (exportFormat === 'json') {
      setExportText(JSON.stringify(dataList, null, 2));
    } else if (exportFormat === 'csv') {
      setExportText(jsonToCsv(dataList));
    } else {
      const csv = jsonToCsv(dataList);
      setExportText(csvToSqlInsert(csv, 'mock_users'));
    }
  }, [dataList, exportFormat]);

  return (
    <ToolLayout
      title="Fake Test Data Generator"
      description="Synthesize clean, structured, and repeatable mock datasets (names, addresses, credit cards, emails) entirely client-side. Export directly to JSON, CSV, or SQL."
      category="Generators"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-6)'
        }}
      >
        {/* Configuration Toolbar */}
        <GlassCard>
          <div className="flex justify-between items-center w-full flex-wrap gap-4">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Generator Controls</h2>
            
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, marginRight: 'var(--space-2)' }}>Count:</label>
                <select
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value, 10))}
                  className="glass-input"
                  style={{ width: 'auto', padding: '2px var(--space-2)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  <option value="10">10 Rows</option>
                  <option value="25">25 Rows</option>
                  <option value="50">50 Rows</option>
                  <option value="100">100 Rows</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 500, marginRight: 'var(--space-2)' }}>Seed:</label>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value, 10) || 0)}
                  className="glass-input"
                  style={{ width: '80px', padding: '2px var(--space-2)', fontSize: '0.75rem', textAlign: 'center' }}
                />
              </div>

              <button
                onClick={() => setSeed(Math.floor(Math.random() * 99999) + 1)}
                className="glass-button"
                style={{ fontSize: '0.75rem', padding: '2px var(--space-3)' }}
              >
                Random Seed
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Live Grid Data Table */}
        <GlassCard style={{ padding: '0 var(--space-4)', overflowX: 'auto' }}>
          <div style={{ maxHeight: '250px', overflowY: 'auto', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-primary)', position: 'sticky', top: 0, background: 'var(--glass-bg)', zIndex: 1 }}>
                  <th style={{ padding: 'var(--space-2)' }}>ID</th>
                  <th style={{ padding: 'var(--space-2)' }}>Name</th>
                  <th style={{ padding: 'var(--space-2)' }}>Email</th>
                  <th style={{ padding: 'var(--space-2)' }}>Phone</th>
                  <th style={{ padding: 'var(--space-2)' }}>Company</th>
                  <th style={{ padding: 'var(--space-2)' }}>Address</th>
                  <th style={{ padding: 'var(--space-2)' }}>Credit Card</th>
                </tr>
              </thead>
              <tbody>
                {dataList.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                    <td style={{ padding: 'var(--space-2)', fontWeight: 600 }}>{row.id}</td>
                    <td style={{ padding: 'var(--space-2)' }}>{row.name}</td>
                    <td style={{ padding: 'var(--space-2)', fontFamily: 'monospace' }}>{row.email}</td>
                    <td style={{ padding: 'var(--space-2)' }}>{row.phone}</td>
                    <td style={{ padding: 'var(--space-2)' }}>{row.company}</td>
                    <td style={{ padding: 'var(--space-2)' }}>{row.address}</td>
                    <td style={{ padding: 'var(--space-2)', fontFamily: 'monospace' }}>{row.creditCard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Data Exporter Card */}
        <GlassCard>
          <div className="flex justify-between items-center w-full flex-wrap gap-2" style={{ marginBottom: 'var(--space-2)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Export Dataset</h2>
            
            <div className="flex gap-2">
              {(['json', 'csv', 'sql'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className="glass-button"
                  style={{
                    fontSize: '0.7rem',
                    padding: 'var(--space-1) var(--space-3)',
                    textTransform: 'uppercase',
                    borderColor: exportFormat === fmt ? 'var(--accent-primary)' : 'var(--border-primary)',
                    background: exportFormat === fmt ? 'hsla(var(--primary-h), var(--primary-s), 50%, 0.15)' : 'transparent'
                  }}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <ToolOutput
            value={exportText}
            label={`Dataset formatted as ${exportFormat.toUpperCase()}`}
            fileName={exportFormat === 'json' ? 'mock_data.json' : exportFormat === 'csv' ? 'mock_data.csv' : 'mock_data.sql'}
            sourceTool="Fake Data Generator"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
