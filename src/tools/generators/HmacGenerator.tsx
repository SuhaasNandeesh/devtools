import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { calculateHmac } from '../../utils/engines';

export const HmacGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('Offline DevTools');
  const [secretKey, setSecretKey] = useState('secret-key');
  const [hmacOutput, setHmacOutput] = useState('');

  useEffect(() => {
    const runHmac = async () => {
      if (!inputText || !secretKey) {
        setHmacOutput('');
        return;
      }

      try {
        const sig = await calculateHmac(inputText, secretKey);
        setHmacOutput(sig);
      } catch {
        // fail silently
      }
    };

    runHmac();
  }, [inputText, secretKey]);

  return (
    <ToolLayout
      title="HMAC Generator"
      description="Compute Hash-based Message Authentication Codes (HMAC) offline. Generates standard HMAC-SHA256 signatures using secret keys."
      category="Generators"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {/* Key and Message Input Pane */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-4)' }}>HMAC Details</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 500, display: 'block', marginBottom: 'var(--space-2)' }}>HMAC Secret Key:</label>
              <input
                type="text"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter custom key..."
                className="glass-input w-full"
                style={{ fontSize: '0.85rem' }}
              />
            </div>

            <ToolInput
              value={inputText}
              onChange={setInputText}
              placeholder="Paste your plain text message here..."
              label="Plain Text Message"
            />
          </div>
        </GlassCard>

        {/* Outputs Panel */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>HMAC Signature</h2>
          <ToolOutput
            value={hmacOutput}
            label="HMAC-SHA256 Signature (Hex)"
            fileName="hmac.signature"
            sourceTool="HMAC Generator"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
