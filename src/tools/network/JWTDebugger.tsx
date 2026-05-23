import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { parseJWT } from '../../utils/engines';

export const JWTDebugger: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const [headerOutput, setHeaderOutput] = useState('');
  const [payloadOutput, setPayloadOutput] = useState('');
  const [claimsOutput, setClaimsOutput] = useState('');

  useEffect(() => {
    if (!tokenInput.trim()) {
      setHeaderOutput('');
      setPayloadOutput('');
      setClaimsOutput('');
      setErrorMsg(null);
      return;
    }

    try {
      setErrorMsg(null);
      const decoded = parseJWT(tokenInput);
      
      setHeaderOutput(JSON.stringify(decoded.header, null, 2));
      setPayloadOutput(JSON.stringify(decoded.payload, null, 2));
      
      if (decoded.claimsExplanation.length > 0) {
        const claimsText = decoded.claimsExplanation
          .map((c) => `${c.key.toUpperCase()} (Timestamp: ${c.value})\n-> Date/Time: ${c.dateVal}`)
          .join('\n\n');
        setClaimsOutput(claimsText);
      } else {
        setClaimsOutput('No standard epoch claim variables (like exp, iat, nbf) found in payload.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse JSON Web Token');
      setHeaderOutput('');
      setPayloadOutput('');
      setClaimsOutput('');
    }
  }, [tokenInput]);

  return (
    <ToolLayout
      title="JSON Web Token (JWT) Debugger"
      description="Decode and inspect JSON Web Token (JWT) claims, headers, and signatures securely offline. Features automatic Unix epoch translation for token expiration claims."
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
        {/* Token Input Card */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Raw JWT Token Input</h2>
          <ToolInput
            value={tokenInput}
            onChange={setTokenInput}
            placeholder="Paste your encoded JWT token (header.payload.signature) here..."
            label="Encoded JWT Token"
            allowFileUpload={true}
          />
        </GlassCard>

        {/* Decoded Structure Card */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Parsed Segments</h2>
          
          <ToolOutput
            value={headerOutput}
            label="Decoded Header (algorithm & key type)"
            error={errorMsg}
            fileName="jwt-header.json"
            sourceTool="JWT Debugger"
          />

          <ToolOutput
            value={payloadOutput}
            label="Decoded Payload (subject, claims, metadata)"
            error={errorMsg}
            fileName="jwt-payload.json"
            sourceTool="JWT Debugger"
          />

          <div className="flex flex-col gap-2 w-full">
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Translated Epoch Claims
            </span>
            <textarea
              readOnly
              value={claimsOutput || 'Awaiting input conversion...'}
              className="glass-input font-mono w-full"
              style={{
                height: '140px',
                resize: 'none',
                background: 'rgba(0, 0, 0, 0.08)',
                color: errorMsg ? 'var(--color-danger)' : 'var(--text-secondary)'
              }}
            />
          </div>
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
