import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';
import { Trash2, Plus } from 'lucide-react';

interface KeyValuePair {
  key: string;
  value: string;
}

export const CurlBuilder: React.FC = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/v1/users');
  const [headers, setHeaders] = useState<KeyValuePair[]>([
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer token_here' }
  ]);
  const [queryParams, setQueryParams] = useState<KeyValuePair[]>([
    { key: 'limit', value: '10' }
  ]);
  const [body, setBody] = useState('{\n  "name": "Jane Doe",\n  "role": "admin"\n}');
  const [curlOutput, setCurlOutput] = useState('');

  // Auto compile curl output
  useEffect(() => {
    let cleanUrl = url.trim() || 'http://localhost';
    
    // Add Query Params
    const activeParams = queryParams.filter((p) => p.key.trim());
    if (activeParams.length > 0) {
      const qString = activeParams
        .map((p) => `${encodeURIComponent(p.key.trim())}=${encodeURIComponent(p.value.trim())}`)
        .join('&');
      if (qString) {
        cleanUrl += (cleanUrl.includes('?') ? '&' : '?') + qString;
      }
    }

    let cmd = `curl -X ${method} "${cleanUrl}"`;

    // Add Headers
    headers.forEach((h) => {
      if (h.key.trim()) {
        cmd += ` \\\n  -H "${h.key.trim()}: ${h.value.trim()}"`;
      }
    });

    // Add Body if not GET/HEAD and has text
    if (method !== 'GET' && method !== 'HEAD' && body.trim()) {
      // Escape inner quotes inside the JSON body
      const escapedBody = body.trim().replace(/"/g, '\\"').replace(/\n/g, '');
      cmd += ` \\\n  -d "${escapedBody}"`;
    }

    setCurlOutput(cmd);
  }, [method, url, headers, queryParams, body]);

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (idx: number) => setHeaders(headers.filter((_, i) => i !== idx));
  const updateHeader = (idx: number, field: 'key' | 'value', val: string) => {
    const next = [...headers];
    next[idx][field] = val;
    setHeaders(next);
  };

  const addParam = () => setQueryParams([...queryParams, { key: '', value: '' }]);
  const removeParam = (idx: number) => setQueryParams(queryParams.filter((_, i) => i !== idx));
  const updateParam = (idx: number, field: 'key' | 'value', val: string) => {
    const next = [...queryParams];
    next[idx][field] = val;
    setQueryParams(next);
  };

  return (
    <ToolLayout
      title="Interactive cURL Command Builder"
      description="Construct HTTP requests visually using intuitive dropdowns, dynamic headers table, query variables, and request body parameters. Outputs a fully formatted, copyable cURL console command."
      category="Network Utilities"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          width: '100%'
        }}
      >
        {/* Visual Builder Form Card */}
        <GlassCard style={{ gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Request Builder</h2>
          
          {/* Method & URL Row */}
          <div className="flex flex-col gap-2 w-full">
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              HTTP Method & Base URL
            </span>
            <div className="flex gap-2 w-full" style={{ flexWrap: 'wrap' }}>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="glass-input"
                style={{ width: '120px', cursor: 'pointer', paddingRight: 'var(--space-4)', background: 'rgba(0,0,0,0.2)' }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
                <option value="HEAD">HEAD</option>
                <option value="OPTIONS">OPTIONS</option>
              </select>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter Base URL e.g. https://api.site.com"
                className="glass-input"
                style={{ flex: 1, minWidth: '180px' }}
              />
            </div>
          </div>

          {/* Headers list */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center w-full">
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                HTTP Headers
              </span>
              <button
                onClick={addHeader}
                className="glass-button glass-button-secondary"
                style={{ padding: '2px 8px', fontSize: '0.7rem', display: 'flex', gap: '2px', alignItems: 'center' }}
              >
                <Plus size={10} /> Add Header
              </button>
            </div>

            <div className="flex flex-col gap-2 w-full">
              {headers.map((h, idx) => (
                <div key={idx} className="flex gap-2 items-center w-full">
                  <input
                    type="text"
                    value={h.key}
                    onChange={(e) => updateHeader(idx, 'key', e.target.value)}
                    placeholder="Header Key (e.g. Content-Type)"
                    className="glass-input"
                    style={{ flex: 1, fontSize: '0.75rem', padding: 'var(--space-2)' }}
                  />
                  <input
                    type="text"
                    value={h.value}
                    onChange={(e) => updateHeader(idx, 'value', e.target.value)}
                    placeholder="Header Value"
                    className="glass-input"
                    style={{ flex: 1, fontSize: '0.75rem', padding: 'var(--space-2)' }}
                  />
                  <button
                    onClick={() => removeHeader(idx)}
                    className="glass-button glass-button-danger"
                    style={{ padding: 'var(--space-2)', minHeight: '28px', background: 'transparent' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {headers.length === 0 && (
                <div style={{ padding: 'var(--space-2)', fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No headers added.
                </div>
              )}
            </div>
          </div>

          {/* Query Params list */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center w-full">
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Query Parameters
              </span>
              <button
                onClick={addParam}
                className="glass-button glass-button-secondary"
                style={{ padding: '2px 8px', fontSize: '0.7rem', display: 'flex', gap: '2px', alignItems: 'center' }}
              >
                <Plus size={10} /> Add Parameter
              </button>
            </div>

            <div className="flex flex-col gap-2 w-full">
              {queryParams.map((p, idx) => (
                <div key={idx} className="flex gap-2 items-center w-full">
                  <input
                    type="text"
                    value={p.key}
                    onChange={(e) => updateParam(idx, 'key', e.target.value)}
                    placeholder="Query Key"
                    className="glass-input"
                    style={{ flex: 1, fontSize: '0.75rem', padding: 'var(--space-2)' }}
                  />
                  <input
                    type="text"
                    value={p.value}
                    onChange={(e) => updateParam(idx, 'value', e.target.value)}
                    placeholder="Query Value"
                    className="glass-input"
                    style={{ flex: 1, fontSize: '0.75rem', padding: 'var(--space-2)' }}
                  />
                  <button
                    onClick={() => removeParam(idx)}
                    className="glass-button glass-button-danger"
                    style={{ padding: 'var(--space-2)', minHeight: '28px', background: 'transparent' }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {queryParams.length === 0 && (
                <div style={{ padding: 'var(--space-2)', fontSize: '0.74rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                  No query parameters added.
                </div>
              )}
            </div>
          </div>

          {/* Request Body */}
          {method !== 'GET' && method !== 'HEAD' && (
            <div className="flex flex-col gap-2 w-full">
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Request Body Raw Parameters
              </span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter raw request body..."
                className="glass-input font-mono w-full"
                style={{ height: '100px', resize: 'none' }}
              />
            </div>
          )}
        </GlassCard>

        {/* Live Command Output Card */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Generated cURL Command Output</h2>
          <ToolOutput
            value={curlOutput}
            label="cURL Shell Command"
            fileName="curl-command.sh"
            sourceTool="cURL Command Builder"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
