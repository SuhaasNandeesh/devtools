import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { jsonToYaml, yamlToJson } from '../../utils/engines';
import { ArrowLeftRight, Check, Copy } from 'lucide-react';

export const JsonYamlConverter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState(`{\n  "name": "John Doe",\n  "active": true,\n  "role": "Lead Architect",\n  "details": {\n    "skills": ["TypeScript", "React", "Go"],\n    "experienceYears": 8\n  }\n}`);
  const [yamlInput, setYamlInput] = useState('');
  
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [yamlError, setYamlError] = useState<string | null>(null);

  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedYaml, setCopiedYaml] = useState(false);

  // Synchronous conversion JSON => YAML
  const handleJsonToYaml = () => {
    if (!jsonInput.trim()) {
      setYamlInput('');
      setJsonError(null);
      return;
    }
    try {
      setJsonError(null);
      const parsed = JSON.parse(jsonInput);
      const yaml = jsonToYaml(parsed);
      setYamlInput(yaml);
      setYamlError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Malformed JSON. Check key quotes or brackets.');
    }
  };

  // Synchronous conversion YAML => JSON
  const handleYamlToJson = () => {
    if (!yamlInput.trim()) {
      setJsonInput('');
      setYamlError(null);
      return;
    }
    try {
      setYamlError(null);
      const parsed = yamlToJson(yamlInput);
      const json = JSON.stringify(parsed, null, 2);
      setJsonInput(json);
      setJsonError(null);
    } catch (err: any) {
      setYamlError(err.message || 'YAML syntax error detected.');
    }
  };

  // Convert on first mount
  useEffect(() => {
    handleJsonToYaml();
  }, []);

  const handleCopyText = (text: string, target: 'json' | 'yaml') => {
    navigator.clipboard.writeText(text);
    if (target === 'json') {
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } else {
      setCopiedYaml(true);
      setTimeout(() => setCopiedYaml(false), 2000);
    }
  };

  return (
    <ToolLayout
      title="JSON <=> YAML Syntax Converter"
      description="Bi-directional converter between JSON data and YAML configuration formats offline, featuring real-time syntax checking and error feedback overlays."
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
              Structured JSON Object
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
                onClick={handleJsonToYaml}
                className="glass-button"
                style={{ padding: '2px 10px', fontSize: '0.65rem', gap: '4px' }}
              >
                <span>Convert to YAML</span>
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

        {/* Right Column: YAML Panel */}
        <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
          <div className="flex justify-between items-center w-full">
            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Indented YAML Markup
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleCopyText(yamlInput, 'yaml')}
                className="glass-button glass-button-secondary"
                style={{ padding: '2px 8px', fontSize: '0.65rem', gap: '4px' }}
                disabled={!yamlInput}
              >
                {copiedYaml ? <Check size={10} color="var(--color-success)" /> : <Copy size={10} />}
                <span>Copy</span>
              </button>
              <button
                onClick={handleYamlToJson}
                className="glass-button"
                style={{ padding: '2px 10px', fontSize: '0.65rem', gap: '4px' }}
              >
                <span>Convert to JSON</span>
                <ArrowLeftRight size={10} />
              </button>
            </div>
          </div>

          <textarea
            value={yamlInput}
            onChange={(e) => {
              setYamlInput(e.target.value);
              setYamlError(null);
            }}
            placeholder="Paste your formatted YAML syntax here..."
            className="glass-input font-mono w-full"
            style={{
              height: '340px',
              fontSize: '0.8rem',
              lineHeight: 1.4,
              borderColor: yamlError ? 'var(--color-danger)' : 'var(--border-primary)',
              background: 'rgba(0,0,0,0.08)'
            }}
          />

          {yamlError && (
            <span style={{ fontSize: '0.72rem', color: 'var(--color-danger)', background: 'rgba(211,47,47,0.1)', padding: '6px 12px', borderRadius: 'var(--radius-md)' }}>
              {yamlError}
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
