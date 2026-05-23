import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { calculateSubnet } from '../../utils/engines';
import type { SubnetDetails } from '../../utils/engines';

export const SubnetCalculator: React.FC = () => {
  const [ipInput, setIpInput] = useState('192.168.1.100');
  const [cidr, setCidr] = useState(24);
  const [details, setDetails] = useState<SubnetDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      setErrorMsg(null);
      const computed = calculateSubnet(ipInput, cidr);
      setDetails(computed);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid calculation constraints');
      setDetails(null);
    }
  }, [ipInput, cidr]);

  return (
    <ToolLayout
      title="IPv4 Subnet & CIDR Mask Calculator"
      description="Calculate network boundaries, broadcast endpoints, CIDR wildcard masks, usable IP scopes, and overall host capacities entirely offline using a dynamic slider."
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
        {/* Subnet Form Builder */}
        <GlassCard style={{ gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>IP & Mask Configuration</h2>

          {/* IP Input */}
          <div className="flex flex-col gap-2 w-full">
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Base IP Address
            </span>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="e.g. 192.168.1.1"
              className="glass-input"
              style={{
                borderColor: errorMsg ? 'var(--color-danger)' : 'var(--border-primary)',
                background: errorMsg ? 'var(--color-danger-bg)' : 'rgba(0,0,0,0.15)'
              }}
            />
            {errorMsg && (
              <span style={{ fontSize: '0.7rem', color: 'var(--color-danger)', fontWeight: 500 }}>
                {errorMsg}
              </span>
            )}
          </div>

          {/* CIDR Mask Slider */}
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center w-full">
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                CIDR Prefix Mask
              </span>
              <span className="font-mono" style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                /{cidr}
              </span>
            </div>
            <div className="flex gap-4 items-center w-full">
              <input
                type="range"
                min="0"
                max="32"
                value={cidr}
                onChange={(e) => setCidr(parseInt(e.target.value, 10))}
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  accentColor: 'var(--accent-primary)'
                }}
              />
            </div>
          </div>
        </GlassCard>

        {/* Calculation Table */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Network Calculations</h2>
          
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
            {details ? (
              <>
                {[
                  { label: 'Subnet Mask', val: details.mask },
                  { label: 'Network IP Address', val: details.network },
                  { label: 'Broadcast IP Address', val: details.broadcast },
                  { label: 'Wildcard Mask', val: details.wildcard },
                  { label: 'Usable Range Start', val: details.rangeStart },
                  { label: 'Usable Range End', val: details.rangeEnd },
                  { label: 'Max Usable Hosts', val: details.totalHosts.toLocaleString() }
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center w-full"
                    style={{
                      borderBottom: idx === 6 ? 'none' : '1px solid rgba(255, 255, 255, 0.03)',
                      paddingBottom: idx === 6 ? '0' : 'var(--space-2)'
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
              <div style={{ padding: 'var(--space-4)', textTransform: 'uppercase', textAlign: 'center', fontSize: '0.74rem', color: 'var(--color-danger)', fontWeight: 600 }}>
                Awaiting correct IP parameters...
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
