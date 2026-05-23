import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { jsonToCsv, csvToJson } from '../../utils/engines';
import { ArrowLeftRight, Check, Copy } from 'lucide-react';

export const JsonCsvConverter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState(`[\n  { "name": "John Doe", "role": "Architect", "active": true },\n  { "name": "Alice Smith", "role": "Engineer", "active": false },\n  { "name": "Bob Jones", "role": "Designer", "active": true }\n]`);
  const [csvInput, setCsvInput] = useState('');
  
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);

  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);

  // Synchronous conversion JSON => CSV
  const handleJsonToCsv = () => {
    if (!jsonInput.trim()) {
      setCsvInput('');
      setJsonError(null);
      return;
    }
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error('CSV requires a top-level JSON array of flat objects.');
      }
      const csv = jsonToCsv(parsed);
      setCsvInput(csv);
      setCsvError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Malformed JSON array. Verify brackets and quotes.');
    }
  };

  // Synchronous conversion CSV => JSON
  const handleCsvToJson = () => {
    if (!csvInput.trim()) {
      setJsonInput('');
      setCsvError(null);
      return;
    }
    try {
      setCsvError(null);
      const parsed = csvToJson(csvInput);
      if (parsed.length === 0) {
        throw new Error('Failed to parse columns. Make sure CSV has a header row.');
      }
      const json = JSON.stringify(parsed, null, 2);
      setJsonInput(json);
      setJsonError(null);
    } catch (err: any) {
      setCsvError(err.message || 'CSV syntax parser error.');
    }
  };

  // Convert on first mount
  useEffect(() => {
    handleJsonToCsv();
  }, []);

  const handleCopyText = (text: string, target: 'json' | 'csv') => {
    navigator.clipboard.writeText(text);
    if (target === 'json') {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } else {
      setCopiedCsv(true);
      setTimeout(() => setCopiedCsv(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="JSON <=> CSV Tabular Converter"
      description="Bi-directional conversion workspace translating structured JSON arrays into flat comma-delimited CSV spreadsheets and vice versa offline."
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
        {/* Left Column: JSON Panel */}
        <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
          <div className="flex justify-between items-center w-full">
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Structured JSON Array
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopyText(jsonInput, 'json')}
                className="glass-button glass-button-secondary"
                style={{ padding: '2px 8px', fontSize: '0.65rem', gap: '4px' }}
                disabled={!jsonInput}
              >
                {copiedJson ? <Check size={10} color="var(--color-success)" /> : <Copy size={10} />}
                <span>Copy</span>
              </button>
              <button
                onClick={handleJsonToCsv}
                className="glass-button"
                style={{ padding: '2px 10px', fontSize: '0.65rem', gap: '4px' }}
              >
                <span>Convert to CSV</span>
                <ArrowLeftRight size={10} />
              </button>
            </div>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setJsonError(null);
            }}
            placeholder="Paste your raw JSON array here..."
            className="glass-input font-mono w-full"
            style={{
              height: '340px',
              fontSize: '0.8rem',
              lineHeight: 1.4,
              borderColor: jsonError ? 'var(--color-danger)' : 'var(--border-primary)',
              background: 'rgba(0,0,0,0.08)'
            }}
          />

          {jsonError && (
            <span style={{ fontSize: '0.72rem', color: 'var(--color-danger)', background: 'rgba(211,47,47,0.1)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}>
              {jsonError}
            </span>
          )}
        </GlassCard>

        {/* Right Column: CSV Panel */}
        <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
          <div className="flex justify-between items-center w-full">
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Comma-Delimited CSV Sheet
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopyText(csvInput, 'csv')}
                className="glass-button glass-button-secondary"
                style={{ padding: '2px 8px', fontSize: '0.65rem', gap: '4px' }}
                disabled={!csvInput}
              >
                {copiedCsv ? <Check size={10} color="var(--color-success)" /> : <Copy size={10} />}
                <span>Copy</span>
              </button>
              <button
                onClick={handleCsvToJson}
                className="glass-button"
                style={{ padding: '2px 10px', fontSize: '0.65rem', gap: '4px' }}
              >
                <span>Convert to JSON</span>
                <ArrowLeftRight size={10} />
              </button>
            </div>
          </div>

          <textarea
            value={csvInput}
            onChange={(e) => {
              setCsvInput(e.target.value);
              setCsvError(null);
            }}
            placeholder="Paste your comma-delimited columns here..."
            className="glass-input font-mono w-full"
            style={{
              height: '340px',
              fontSize: '0.8rem',
              lineHeight: 1.4,
              borderColor: csvError ? 'var(--color-danger)' : 'var(--border-primary)',
              background: 'rgba(0,0,0,0.08)'
            }}
          />

          {csvError && (
            <span style={{ fontSize: '0.72rem', color: 'var(--color-danger)', background: 'rgba(211,47,47,0.1)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}>
              {csvError}
            </span>
          )}
        </GlassCard>
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
