import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { parseUserAgent } from '../../utils/engines';
import type { UAParsed } from '../../utils/engines';

export const UserAgentInspector: React.FC = () => {
  const [uaInput, setUaInput] = useState('');
  const [parsed, setParsed] = useState<UAParsed | null>(null);

  // Initialize with browser's own UA
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setUaInput(navigator.userAgent);
    }
  }, []);

  useEffect(() => {
    if (!uaInput.trim()) {
      setParsed(null);
      return;
    }
    const res = parseUserAgent(uaInput);
    setParsed(res);
  }, [uaInput]);

  return (
    <ToolLayout
      title="User Agent String Inspector"
      description="Inspect, parse, and break down raw User Agent strings offline. Captures operating system structures, browser cores, rendering engines, and host devices securely."
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
        {/* Input Card */}
        <GlassCard>
          <div className="flex justify-between items-center w-full">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Raw User Agent String</h2>
            <button
              onClick={() => typeof navigator !== 'undefined' && setUaInput(navigator.userAgent)}
              className="glass-button glass-button-secondary"
              style={{ padding: '2px 8px', fontSize: '0.7rem' }}
            >
              Reset to My Browser
            </button>
          </div>
          
          <ToolInput
            value={uaInput}
            onChange={setUaInput}
            placeholder="Paste raw user agent string here..."
            label="User Agent String"
            allowFileUpload={false}
          />
        </GlassCard>

        {/* Breakdown Card */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Parsed Specifications</h2>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              background: 'rgba(0,0,0,0.15)',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)'
            }}
          >
            {parsed ? (
              <>
                {[
                  { label: 'Operating System', val: parsed.os },
                  { label: 'OS Version Profile', val: parsed.osVersion },
                  { label: 'Browser Core Engine', val: parsed.browser },
                  { label: 'Browser Version', val: parsed.browserVersion },
                  { label: 'Rendering Core', val: parsed.engine },
                  { label: 'Hardware Family', val: parsed.device }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center w-full"
                    style={{
                      borderBottom: idx === 5 ? 'none' : '1px solid rgba(255, 255, 255, 0.03)',
                      paddingBottom: idx === 5 ? '0' : 'var(--space-2)'
                    }}
                  >
                    <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {item.label}
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.val}
                    </span>
                  </div>
                ))}
              </>
            ) : (
              <div style={{ padding: 'var(--space-4)', textAlign: 'center', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Awaiting correct User Agent strings...
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
