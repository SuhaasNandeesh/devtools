import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';
import { generateUUIDv4, generateUUIDv1, generateSequentialUUIDs } from '../../utils/engines';
import { RefreshCw, Play } from 'lucide-react';

type GenMode = 'random' | 'sequential';
type UUIDFormat = 'standard' | 'braced' | 'no-hyphens' | 'blocks-2' | 'blocks-3' | 'blocks-4';

export const UUIDGenerator: React.FC = () => {
  const [genMode, setGenMode] = useState<GenMode>('random');
  const [uuidVersion, setUuidVersion] = useState<'4' | '1'>('4');
  const [generateCount, setGenerateCount] = useState(5);
  const [uuidFormat, setUuidFormat] = useState<UUIDFormat>('standard');
  const [uuidLength, setUuidLength] = useState<number>(32);
  const [uuidCase, setUuidCase] = useState<'lower' | 'upper'>('lower');
  
  // Sequential Range states
  const [initialGuid, setInitialGuid] = useState('10-00-00-00-00-00-00-00');
  const [seqError, setSeqError] = useState<string | null>(null);
  
  const [generatedResult, setGeneratedResult] = useState('');

  // Helper for dynamic format labeling
  const getFormatPatternDisplay = (format: UUIDFormat, length: number): string => {
    if (format === 'no-hyphens') {
      return 'Plain Hex (No hyphens)';
    }

    const abbreviatePattern = (pat: string) => {
      if (pat.length > 25) {
        return pat.substring(0, 15) + '...';
      }
      return pat;
    };
    
    if (format === 'blocks-2') {
      const numBlocks = Math.ceil(length / 2);
      const blocks = Array(numBlocks).fill('XX');
      if (length % 2 !== 0) {
        blocks[blocks.length - 1] = 'X';
      }
      const raw = blocks.join('-');
      return `Blocks of 2 (${abbreviatePattern(raw)})`;
    }
    
    if (format === 'blocks-3') {
      const numBlocks = Math.ceil(length / 3);
      const blocks = Array(numBlocks).fill('XXX');
      if (length % 3 !== 0) {
        blocks[blocks.length - 1] = 'X'.repeat(length % 3);
      }
      const raw = blocks.join('-');
      return `Blocks of 3 (${abbreviatePattern(raw)})`;
    }

    if (format === 'blocks-4') {
      const numBlocks = Math.ceil(length / 4);
      const blocks = Array(numBlocks).fill('XXXX');
      if (length % 4 !== 0) {
        blocks[blocks.length - 1] = 'X'.repeat(length % 4);
      }
      const raw = blocks.join('-');
      return `Blocks of 4 (${abbreviatePattern(raw)})`;
    }

    // standard or braced
    let rawPattern = '';
    if (length === 32) {
      rawPattern = '8-4-4-4-12';
    } else {
      const numBlocks = Math.ceil(length / 4);
      const blocks = Array(numBlocks).fill('XXXX');
      if (length % 4 !== 0) {
        blocks[blocks.length - 1] = 'X'.repeat(length % 4);
      }
      rawPattern = blocks.join('-');
    }
    
    if (format === 'braced') {
      return `Braced Hyphenated ({${abbreviatePattern(rawPattern)}})`;
    }
    return `Standard Hyphenated (${abbreviatePattern(rawPattern)})`;
  };

  // Handle auto placeholders when switching formats in sequential mode
  const getFormatPlaceholder = (format: UUIDFormat): string => {
    switch (format) {
      case 'blocks-2': return '10-00-00-00-00-00-00-00';
      case 'blocks-3': return '100-000-000-000-000';
      case 'blocks-4': return '1000-0000-0000-0000';
      case 'no-hyphens': return 'a76bf931b8f24581b7729a411488f793';
      case 'braced': return '{a76bf931-b8f2-4581-b772-9a411488f793}';
      default: return 'a76bf931-b8f2-4581-b772-9a411488f793';
    }
  };

  // Sync initial sequential input when format changes
  useEffect(() => {
    if (genMode === 'sequential') {
      setInitialGuid(getFormatPlaceholder(uuidFormat));
    }
  }, [uuidFormat, genMode]);

  const triggerGeneration = () => {
    const count = Math.min(Math.max(generateCount, 1), 500);

    if (genMode === 'sequential') {
      // Clean hex character validation checks
      const cleanHex = initialGuid.replace(/[^a-fA-F0-9]/g, '');
      if (!cleanHex) {
        setSeqError('Initial GUID must contain valid hexadecimal characters (0-9, a-f).');
        setGeneratedResult('');
        return;
      }
      setSeqError(null);

      const sequentialList = generateSequentialUUIDs(initialGuid, count, uuidFormat);
      const caseAdjusted = uuidCase === 'upper' 
        ? sequentialList.map(s => s.toUpperCase()) 
        : sequentialList.map(s => s.toLowerCase());
      setGeneratedResult(caseAdjusted.join('\n'));
      return;
    }

    // Random Mode Generation
    setSeqError(null);
    const list: string[] = [];

    const generateRandomHex = (len: number): string => {
      const chars = '0123456789abcdef';
      let result = '';
      if (typeof window !== 'undefined' && window.crypto) {
        const array = new Uint8Array(len);
        window.crypto.getRandomValues(array);
        for (let j = 0; j < len; j++) {
          result += chars.charAt(array[j] % 16);
        }
      } else {
        for (let j = 0; j < len; j++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }
      return result;
    };

    for (let i = 0; i < count; i++) {
      let clean = '';
      if (uuidLength === 32) {
        const uuid = uuidVersion === '4' ? generateUUIDv4() : generateUUIDv1();
        clean = uuid.replace(/-/g, '');
      } else {
        clean = generateRandomHex(uuidLength);
      }
      
      let formatted = clean;
      
      if (uuidFormat === 'standard' || uuidFormat === 'braced') {
        if (uuidLength === 32) {
          formatted = `${clean.substring(0, 8)}-${clean.substring(8, 12)}-${clean.substring(12, 16)}-${clean.substring(16, 20)}-${clean.substring(20, 32)}`;
        } else {
          const chunks = clean.match(/.{1,4}/g) || [];
          formatted = chunks.join('-');
        }
        if (uuidFormat === 'braced') {
          formatted = `{${formatted}}`;
        }
      } else if (uuidFormat === 'blocks-2') {
        const chunks = clean.match(/.{1,2}/g) || [];
        formatted = chunks.join('-');
      } else if (uuidFormat === 'blocks-3') {
        const chunks = clean.match(/.{1,3}/g) || [];
        formatted = chunks.join('-');
      } else if (uuidFormat === 'blocks-4') {
        const chunks = clean.match(/.{1,4}/g) || [];
        formatted = chunks.join('-');
      } else if (uuidFormat === 'no-hyphens') {
        formatted = clean;
      }

      if (uuidCase === 'upper') {
        formatted = formatted.toUpperCase();
      } else {
        formatted = formatted.toLowerCase();
      }

      list.push(formatted);
    }

    setGeneratedResult(list.join('\n'));
  };

  useEffect(() => {
    triggerGeneration();
  }, [genMode, uuidVersion, generateCount, uuidFormat, uuidLength, initialGuid, uuidCase]);

  return (
    <ToolLayout
      title="UUID / GUID & Sequential Range Generator"
      description="Generate bulk secure random UUID v4/v1 identifiers or sequential hexadecimal GUID ranges offline with highly customizable spacing block formats."
      category="Generators"
    >
      <div
        className="flex flex-col gap-6"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'stretch'
        }}
      >
        {/* Left Column Controls panel */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex justify-between items-center w-full flex-wrap gap-2" style={{ marginBottom: 'var(--space-2)' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Generator Controls</h2>
            <button
              onClick={triggerGeneration}
              className="glass-button"
              style={{ padding: '4px var(--space-3)', fontSize: '0.72rem', gap: '4px', minHeight: '28px' }}
            >
              {genMode === 'sequential' ? <Play size={11} /> : <RefreshCw size={11} />}
              <span>{genMode === 'sequential' ? 'Run Range' : 'Regenerate'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {/* Mode selection toggle */}
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Generation Mode
              </label>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', width: 'fit-content' }}>
                <button
                  onClick={() => setGenMode('random')}
                  style={{
                    padding: 'var(--space-1) var(--space-3)',
                    background: genMode === 'random' ? 'var(--accent-primary)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Random Bulk
                </button>
                <button
                  onClick={() => setGenMode('sequential')}
                  style={{
                    padding: 'var(--space-1) var(--space-3)',
                    background: genMode === 'sequential' ? 'var(--accent-primary)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Sequential Range
                </button>
              </div>
            </div>

            {/* Random options / Sequential inputs */}
            {genMode === 'random' ? (
              <div className="animate-fade flex flex-col gap-3">
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  UUID Version
                </label>
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', width: 'fit-content' }}>
                  <button
                    onClick={() => setUuidVersion('4')}
                    style={{
                      padding: 'var(--space-1) var(--space-3)',
                      background: uuidVersion === '4' ? 'var(--accent-primary)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      color: 'white',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    v4 (Random)
                  </button>
                  <button
                    onClick={() => setUuidVersion('1')}
                    style={{
                      padding: 'var(--space-1) var(--space-3)',
                      background: uuidVersion === '1' ? 'var(--accent-primary)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      color: 'white',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    v1 (Time)
                  </button>
                </div>
              </div>
            ) : (
              <div className="animate-fade flex flex-col gap-3">
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Initial GUID / Starting Hex
                  </label>
                  <input
                    type="text"
                    value={initialGuid}
                    onChange={(e) => setInitialGuid(e.target.value)}
                    className="glass-input font-mono"
                    placeholder={getFormatPlaceholder(uuidFormat)}
                    style={{
                      borderColor: seqError ? 'var(--color-danger)' : 'var(--border-primary)'
                    }}
                  />
                  {seqError && (
                    <p style={{ color: 'var(--color-danger)', fontSize: '0.72rem', marginTop: '4px', fontWeight: 500 }}>
                      {seqError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Slider count */}
            <div>
              <div className="flex justify-between w-full" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                <span>Generation Count</span>
                <span className="font-mono">{generateCount}</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={generateCount}
                onChange={(e) => setGenerateCount(parseInt(e.target.value, 10))}
                style={{
                  width: '100%',
                  accentColor: 'var(--accent-primary)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* GUID Length Selection Dropdown (Only for Random mode) */}
            {genMode === 'random' && (
              <div className="animate-fade">
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                  GUID Hex Length
                </label>
                <select
                  value={uuidLength}
                  onChange={(e) => setUuidLength(parseInt(e.target.value, 10))}
                  className="glass-input"
                  style={{ cursor: 'pointer', outline: 'none' }}
                >
                  <option value="8">8 hex characters</option>
                  <option value="10">10 hex characters</option>
                  <option value="12">12 hex characters</option>
                  <option value="14">14 hex characters</option>
                  <option value="16">16 hex characters</option>
                  <option value="20">20 hex characters</option>
                  <option value="24">24 hex characters</option>
                  <option value="32">32 hex characters (Standard UUID)</option>
                  <option value="48">48 hex characters</option>
                  <option value="64">64 hex characters</option>
                </select>
              </div>
            )}

            {/* Format Selection Dropdown */}
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                GUID String Format
              </label>
              <select
                value={uuidFormat}
                onChange={(e) => setUuidFormat(e.target.value as any)}
                className="glass-input"
                style={{ cursor: 'pointer', outline: 'none' }}
              >
                <option value="standard">{getFormatPatternDisplay('standard', uuidLength)}</option>
                <option value="braced">{getFormatPatternDisplay('braced', uuidLength)}</option>
                <option value="no-hyphens">{getFormatPatternDisplay('no-hyphens', uuidLength)}</option>
                <option value="blocks-2">{getFormatPatternDisplay('blocks-2', uuidLength)}</option>
                <option value="blocks-3">{getFormatPatternDisplay('blocks-3', uuidLength)}</option>
                <option value="blocks-4">{getFormatPatternDisplay('blocks-4', uuidLength)}</option>
              </select>
            </div>

            {/* GUID Letter Case Toggles */}
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Letter Case
              </label>
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-primary)', width: 'fit-content' }}>
                <button
                  onClick={() => setUuidCase('lower')}
                  style={{
                    padding: 'var(--space-1) var(--space-3)',
                    background: uuidCase === 'lower' ? 'var(--accent-primary)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Lowercase
                </button>
                <button
                  onClick={() => setUuidCase('upper')}
                  style={{
                    padding: 'var(--space-1) var(--space-3)',
                    background: uuidCase === 'upper' ? 'var(--accent-primary)' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    color: 'white',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  Uppercase
                </button>
              </div>
            </div>

          </div>
        </GlassCard>

        {/* Right Column Output Display */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Generated Identifiers</h2>
          <ToolOutput
            value={generatedResult}
            label={genMode === 'sequential' ? 'Sequential GUID Range Output' : 'Generated UUIDs List'}
            fileName={genMode === 'sequential' ? 'sequential-guids.txt' : 'random-uuids.txt'}
            sourceTool="UUID Generator"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
