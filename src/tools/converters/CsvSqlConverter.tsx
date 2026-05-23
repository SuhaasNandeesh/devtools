import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { csvToSqlInsert } from '../../utils/engines';

export const CsvSqlConverter: React.FC = () => {
  const [csvInput, setCsvInput] = useState(`name, role, active, years\nJohn Doe, Architect, true, 8\nAlice O'Connor, Engineer, false, 5\nBob Jones, Designer, true, 2`);
  const [tableName, setTableName] = useState('users');
  const [sqlOutput, setSqlOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!csvInput.trim()) {
      setSqlOutput('');
      setErrorMsg(null);
      return;
    }

    try {
      setErrorMsg(null);
      const sql = csvToSqlInsert(csvInput, tableName || 'my_table');
      if (!sql) {
        throw new Error('No valid columns or rows parsed. Verify CSV has a header row.');
      }
      setSqlOutput(sql);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse CSV string into SQL inserts.');
      setSqlOutput('');
    }
  }, [csvInput, tableName]);

  return (
    <ToolLayout
      title="CSV to SQL Insert Script Generator"
      description="Parse standard or tab-delimited CSV spreadsheets offline and synthesize copyable relational SQL INSERT scripts with safe character escaping."
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
        {/* Left Column: CSV Editor and Table settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Table configuration */}
          <GlassCard style={{ padding: 'var(--space-4)', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Relational Database Target Table
            </span>
            <div className="flex gap-4 items-center">
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Table Name:</span>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                placeholder="e.g. users"
                className="glass-input font-mono"
                style={{ flex: 1, padding: '4px 10px', fontSize: '0.8rem' }}
              />
            </div>
          </GlassCard>

          {/* CSV Input block */}
          <GlassCard>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Source CSV Spreadsheet</h2>
            <ToolInput
              value={csvInput}
              onChange={setCsvInput}
              placeholder="Paste comma-delimited CSV columns here..."
              label="Source CSV Data"
              allowFileUpload={true}
            />
          </GlassCard>
        </div>

        {/* Right Column: SQL insert script Output */}
        <div style={{ position: 'sticky', top: 'var(--space-6)' }}>
          <ToolOutput
            value={sqlOutput}
            label="Generated SQL Script Output"
            error={errorMsg}
            fileName={`${tableName || 'inserts'}.sql`}
            sourceTool="CSV to SQL Converter"
          />
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
