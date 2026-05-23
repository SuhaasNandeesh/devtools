import React, { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';
import { convertRadix } from '../../utils/engines';

export const RadixConverter: React.FC = () => {
  const [decInput, setDecInput] = useState('255');
  const [hexInput, setHexInput] = useState('ff');
  const [binInput, setBinInput] = useState('11111111');
  const [octInput, setOctInput] = useState('377');
  
  const [baseVal, setBaseVal] = useState<bigint | null>(255n);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateBases = (value: string, sourceRadix: number) => {
    if (!value.trim()) {
      setDecInput('');
      setHexInput('');
      setBinInput('');
      setOctInput('');
      setBaseVal(null);
      setErrorMsg(null);
      return;
    }

    try {
      const res = convertRadix(value, sourceRadix);
      setBaseVal(BigInt(res.dec));
      setErrorMsg(null);
      
      if (sourceRadix !== 10) setDecInput(res.dec);
      if (sourceRadix !== 16) setHexInput(res.hex);
      if (sourceRadix !== 2) setBinInput(res.bin);
      if (sourceRadix !== 8) setOctInput(res.oct);
    } catch (e: any) {
      setErrorMsg(e.message);
    }
  };

  const formatBinaryVisual = (binStr: string) => {
    if (!binStr) return '';
    const padded = binStr.padStart(Math.ceil(binStr.length / 8) * 8, '0');
    const chunks = [];
    for (let i = 0; i < padded.length; i += 8) {
      chunks.push(padded.substring(i, i + 8));
    }
    return chunks.join(' ');
  };

  return (
    <ToolLayout
      title="Radix Base Converter"
      description="Instantly convert numeric representations between Decimal (Base-10), Hexadecimal (Base-16), Binary (Base-2), and Octal (Base-8). Built with BigInt infinite precision support."
      category="Converters"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {/* Left pane: Numeric Radix fields */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Radix Inputs</h2>
          
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 'var(--space-1)' }}>
              Decimal (Base 10)
            </label>
            <input
              type="text"
              value={decInput}
              onChange={(e) => { setDecInput(e.target.value); updateBases(e.target.value, 10); }}
              className="glass-input font-mono"
              placeholder="e.g. 255"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 'var(--space-1)' }}>
              Hexadecimal (Base 16)
            </label>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => { setHexInput(e.target.value); updateBases(e.target.value, 16); }}
              className="glass-input font-mono"
              placeholder="e.g. ff"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 'var(--space-1)' }}>
              Binary (Base 2)
            </label>
            <input
              type="text"
              value={binInput}
              onChange={(e) => { setBinInput(e.target.value); updateBases(e.target.value, 2); }}
              className="glass-input font-mono"
              placeholder="e.g. 11111111"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 'var(--space-1)' }}>
              Octal (Base 8)
            </label>
            <input
              type="text"
              value={octInput}
              onChange={(e) => { setOctInput(e.target.value); updateBases(e.target.value, 8); }}
              className="glass-input font-mono"
              placeholder="e.g. 377"
            />
          </div>
        </GlassCard>

        {/* Right pane: Statistical breakdown & formatted outputs */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Visual Byte Representation</h2>
          
          <ToolOutput
            value={
              errorMsg
                ? ''
                : baseVal !== null
                ? `Value (Dec):  ${baseVal.toString(10)}\n` +
                  `Value (Hex):  0x${baseVal.toString(16).toUpperCase()}\n` +
                  `Value (Oct):  0o${baseVal.toString(8)}\n` +
                  `Value (Bin):\n${formatBinaryVisual(baseVal.toString(2))}`
                : 'Awaiting numerical radix input...'
            }
            error={errorMsg}
            label="Visualizations"
            fileName="radix-conversion.txt"
            sourceTool="Radix Converter"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
