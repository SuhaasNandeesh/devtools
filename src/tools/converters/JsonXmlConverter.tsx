import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { jsonToXml, xmlToJson } from '../../utils/engines';
import { ArrowLeftRight, Check, Copy } from 'lucide-react';

export const JsonXmlConverter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState(`{\n  "bookstore": {\n    "book": {\n      "title": "Clean Code",\n      "author": "Robert C. Martin",\n      "price": 29.99,\n      "year": 2008\n    }\n  }\n}`);
  const [xmlInput, setXmlInput] = useState('');
  const [xmlRoot, setXmlRoot] = useState('root');
  
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [xmlError, setXmlError] = useState<string | null>(null);

  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);

  // Synchronous conversion JSON => XML
  const handleJsonToXml = () => {
    if (!jsonInput.trim()) {
      setXmlInput('');
      setJsonError(null);
      return;
    }
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonInput);
      const xml = jsonToXml(parsed, xmlRoot || 'root');
      setXmlInput(xml);
      setXmlError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Malformed JSON. Check key quotes or brackets.');
    }
  };

  // Synchronous conversion XML => JSON
  const handleXmlToJson = () => {
    if (!xmlInput.trim()) {
      setJsonInput('');
      setXmlError(null);
      return;
    }
    try {
      setXmlError(null);
      const parsed = xmlToJson(xmlInput);
      if (parsed && parsed.error) {
        setXmlError(parsed.error);
        return;
      }
      const json = JSON.stringify(parsed, null, 2);
      setJsonInput(json);
      setJsonError(null);
    } catch (err: any) {
      setXmlError(err.message || 'XML syntax error detected.');
    }
  };

  // Convert on first mount
  useEffect(() => {
    handleJsonToXml();
  }, [xmlRoot]);

  const handleCopyText = (text: string, target: 'json' | 'xml') => {
    navigator.clipboard.writeText(text);
    if (target === 'json') {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } else {
      setCopiedXml(true);
      setTimeout(() => setCopiedXml(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="JSON <=> XML Document Converter"
      description="Bi-directional parsing suite translating structured JSON objects to XML nested element sheets and vice versa offline, supporting custom root container nodes."
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
          <div className="flex justify-between items-center w-full" style={{ flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Structured JSON Object
            </span>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              <div className="flex items-center gap-1">
                <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>Root Tag:</span>
                <input
                  type="text"
                  value={xmlRoot}
                  onChange={(e) => setXmlRoot(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  className="glass-input font-mono"
                  style={{ width: '80px', padding: '2px 6px', fontSize: '0.68rem' }}
                />
              </div>
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
                onClick={handleJsonToXml}
                className="glass-button"
                style={{ padding: '2px 10px', fontSize: '0.65rem', gap: '4px' }}
              >
                <span>Convert to XML</span>
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
            placeholder="Paste your raw JSON code here..."
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

        {/* Right Column: XML Panel */}
        <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
          <div className="flex justify-between items-center w-full">
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              XML Nested Tags Sheet
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopyText(xmlInput, 'xml')}
                className="glass-button glass-button-secondary"
                style={{ padding: '2px 8px', fontSize: '0.65rem', gap: '4px' }}
                disabled={!xmlInput}
              >
                {copiedXml ? <Check size={10} color="var(--color-success)" /> : <Copy size={10} />}
                <span>Copy</span>
              </button>
              <button
                onClick={handleXmlToJson}
                className="glass-button"
                style={{ padding: '2px 10px', fontSize: '0.65rem', gap: '4px' }}
              >
                <span>Convert to JSON</span>
                <ArrowLeftRight size={10} />
              </button>
            </div>
          </div>

          <textarea
            value={xmlInput}
            onChange={(e) => {
              setXmlInput(e.target.value);
              setXmlError(null);
            }}
            placeholder="Paste your nested XML markup here..."
            className="glass-input font-mono w-full"
            style={{
              height: '340px',
              fontSize: '0.8rem',
              lineHeight: 1.4,
              borderColor: xmlError ? 'var(--color-danger)' : 'var(--border-primary)',
              background: 'rgba(0,0,0,0.08)'
            }}
          />

          {xmlError && (
            <span style={{ fontSize: '0.72rem', color: 'var(--color-danger)', background: 'rgba(211,47,47,0.1)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}>
              {xmlError}
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
