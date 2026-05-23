import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { calculateHash } from '../../utils/engines';

export const HashGenerator: React.FC = () => {
  const [inputText, setInputText] = useState('Offline DevTools');
  const [hashes, setHasHashes] = useState({ md5: '', sha256: '', sha512: '' });

  useEffect(() => {
    const runHashes = async () => {
      if (!inputText) {
        setHasHashes({ md5: '', sha256: '', sha512: '' });
        return;
      }

      try {
        const md5Val = await calculateHash(inputText, 'MD5');
        const sha256Val = await calculateHash(inputText, 'SHA-256');
        const sha512Val = await calculateHash(inputText, 'SHA-512');
        setHasHashes({ md5: md5Val, sha256: sha256Val, sha512: sha512Val });
      } catch {
        // fail silently
      }
    };

    runHashes();
  }, [inputText]);

  return (
    <ToolLayout
      title="Hash Digest Generator"
      description="Compute cryptographic hash digests offline. Calculate MD5, SHA-256, and SHA-512 checksums in real-time."
      category="Generators"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: 'var(--space-6)'
        }}
      >
        {/* Input Card */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Text / File Checksum Input</h2>
          <ToolInput
            value={inputText}
            onChange={setInputText}
            placeholder="Type your plain text here to compute cryptographic hash digests..."
            label="Raw Plain Text"
          />
        </GlassCard>

        {/* Hashes Output Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-6)'
          }}
        >
          {/* MD5 Digest */}
          <GlassCard>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>MD5 Digest</h2>
            <ToolOutput
              value={hashes.md5}
              label="MD5 Hexadecimal"
              fileName="checksum.md5"
              sourceTool="Hash Generator"
            />
          </GlassCard>

          {/* SHA-256 Digest */}
          <GlassCard>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>SHA-256 Digest</h2>
            <ToolOutput
              value={hashes.sha256}
              label="SHA-256 Hexadecimal"
              fileName="checksum.sha256"
              sourceTool="Hash Generator"
            />
          </GlassCard>

          {/* SHA-512 Digest */}
          <GlassCard style={{ gridColumn: 'span 1' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>SHA-512 Digest</h2>
            <ToolOutput
              value={hashes.sha512}
              label="SHA-512 Hexadecimal"
              fileName="checksum.sha512"
              sourceTool="Hash Generator"
            />
          </GlassCard>
        </div>
      </div>
    </ToolLayout>
  );
};
