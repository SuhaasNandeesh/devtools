import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';
import { generatePassword } from '../../utils/engines';

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false
  });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<{ label: string; color: string; percent: number }>({ label: 'Weak', color: 'red', percent: 20 });

  const triggerGenerate = () => {
    const res = generatePassword(length, options);
    setPassword(res);
  };

  useEffect(() => {
    triggerGenerate();
  }, [length, options]);

  // Calculate password strength based on entropy
  useEffect(() => {
    if (!password) {
      setStrength({ label: 'None', color: 'transparent', percent: 0 });
      return;
    }
    
    let poolSize = 0;
    if (options.lowercase) poolSize += 26;
    if (options.uppercase) poolSize += 26;
    if (options.numbers) poolSize += 10;
    if (options.symbols) poolSize += 26;
    if (options.excludeSimilar) poolSize -= 9; // approximate exclusions
    
    const entropy = length * Math.log2(Math.max(1, poolSize));
    
    if (entropy < 40) {
      setStrength({ label: 'Weak', color: 'hsl(0, 80%, 45%)', percent: 25 });
    } else if (entropy < 65) {
      setStrength({ label: 'Medium', color: 'hsl(40, 85%, 45%)', percent: 55 });
    } else if (entropy < 85) {
      setStrength({ label: 'Strong', color: 'hsl(140, 75%, 40%)', percent: 80 });
    } else {
      setStrength({ label: 'Very Strong', color: 'hsl(180, 80%, 40%)', percent: 100 });
    }
  }, [password]);

  return (
    <ToolLayout
      title="Strong Password Generator"
      description="Generate cryptographically secure, high-entropy random passwords offline. Custom filters to exclude similar characters."
      category="Generators"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {/* Configurations GlassCard */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Configuration</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <div className="flex justify-between" style={{ fontSize: '0.85rem', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                <span>Length:</span>
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{length} characters</span>
              </div>
              <input
                type="range"
                min="8"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value, 10))}
                style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label className="flex items-center gap-3" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={(e) => setOptions(prev => ({ ...prev, lowercase: e.target.checked }))}
                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span>Include Lowercase (a-z)</span>
              </label>

              <label className="flex items-center gap-3" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={(e) => setOptions(prev => ({ ...prev, uppercase: e.target.checked }))}
                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span>Include Uppercase (A-Z)</span>
              </label>

              <label className="flex items-center gap-3" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={(e) => setOptions(prev => ({ ...prev, numbers: e.target.checked }))}
                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span>Include Numbers (0-9)</span>
              </label>

              <label className="flex items-center gap-3" style={{ fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={(e) => setOptions(prev => ({ ...prev, symbols: e.target.checked }))}
                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span>Include Symbols (!@#$%^&amp;*)</span>
              </label>

              <label className="flex items-center gap-3" style={{ fontSize: '0.85rem', cursor: 'pointer', marginTop: 'var(--space-2)' }}>
                <input
                  type="checkbox"
                  checked={options.excludeSimilar}
                  onChange={(e) => setOptions(prev => ({ ...prev, excludeSimilar: e.target.checked }))}
                  style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Exclude Similar Characters (i, l, 1, L, o, 0)</span>
              </label>
            </div>

            <button
              onClick={triggerGenerate}
              className="glass-button w-full"
              style={{ padding: 'var(--space-3) 0', fontWeight: 600, fontSize: '0.85rem', marginTop: 'var(--space-2)' }}
            >
              Regenerate Password
            </button>
          </div>
        </GlassCard>

        {/* Results Card */}
        <GlassCard>
          <div className="flex justify-between items-center w-full flex-wrap gap-2" style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Generated Password</h2>
            
            {strength.percent > 0 && (
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: strength.color }}>{strength.label}</span>
                <div style={{ width: '60px', height: '6px', background: 'var(--border-primary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${strength.percent}%`, height: '100%', background: strength.color, transition: 'width 0.3s ease' }} />
                </div>
              </div>
            )}
          </div>

          <ToolOutput
            value={password}
            label="Secure Password Output"
            fileName="password.txt"
            sourceTool="Password Generator"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
