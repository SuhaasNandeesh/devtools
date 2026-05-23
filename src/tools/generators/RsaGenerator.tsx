import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';
import { generateRsaKeyPair } from '../../utils/engines';

export const RsaGenerator: React.FC = () => {
  const [keys, setKeys] = useState<{ publicPem: string; privatePem: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateRsaKeyPair();
      setKeys(res);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="RSA Key Pair Generator"
      description="Generate standard, secure 2048-bit RSASSA-PKCS1-v1_5 public and private key pairs locally client-side in standard PEM layouts."
      category="Generators"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)'
        }}
      >
        {/* Trigger Panel */}
        <GlassCard style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Generate Key Pair</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
            All operations are executed 100% locally in your browser memory. Generated keys never touch the network.
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="glass-button"
            style={{
              padding: 'var(--space-3) var(--space-8)',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: 'var(--accent-primary)',
              borderColor: 'var(--accent-primary)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Generating RSA Keys (2048-bit)...' : 'Generate New RSA Key Pair'}
          </button>
        </GlassCard>

        {/* PEM Output Panels */}
        {keys && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-6)'
            }}
          >
            {/* Public Key PEM */}
            <GlassCard>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Public Key (PEM)</h2>
              <ToolOutput
                value={keys.publicPem}
                label="Public Key PEM Block"
                fileName="id_rsa.pub"
                sourceTool="RSA Key Generator"
              />
            </GlassCard>

            {/* Private Key PEM */}
            <GlassCard>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Private Key (PEM)</h2>
              <ToolOutput
                value={keys.privatePem}
                label="Private Key PEM Block (PKCS#8)"
                fileName="id_rsa"
                sourceTool="RSA Key Generator"
              />
            </GlassCard>
          </div>
        )}
      </div>
    </ToolLayout>
  );
};
