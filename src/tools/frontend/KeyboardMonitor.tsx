import React, { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { Keyboard, Sparkles, Trash } from 'lucide-react';

interface StrokeRecord {
  time: string;
  key: string;
  code: string;
  keyCode: number;
  modifiers: string[];
  location: string;
}

export const KeyboardMonitor: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [activeKeyCode, setActiveKeyCode] = useState<number | null>(null);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  
  // Modifiers
  const [modShift, setModShift] = useState(false);
  const [modCtrl, setModCtrl] = useState(false);
  const [modAlt, setModAlt] = useState(false);
  const [modMeta, setModMeta] = useState(false);

  const [historyLog, setHistoryLog] = useState<StrokeRecord[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const captureZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Focus capture zone automatically on mount
    captureZoneRef.current?.focus();
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    // Intercept standard hotkeys like Cmd+K or Cmd+R only when inside focus zone, but let them pass if they are global triggers.
    // However, to capture keys reliably we want to prevent default for inputs but let normal OS commands work unless focused.
    if (!isFocused) return;
    
    e.preventDefault();
    e.stopPropagation();

    // Map Location
    const locations = ['Standard Key', 'Left Modifier', 'Right Modifier', 'Numpad'];
    const locStr = locations[e.location] || `Unknown (${e.location})`;

    setActiveKey(e.key === ' ' ? 'Spacebar' : e.key);
    setActiveCode(e.code);
    setActiveKeyCode(e.keyCode);
    setActiveLocation(locStr);

    // Set Modifiers
    setModShift(e.shiftKey);
    setModCtrl(e.ctrlKey);
    setModAlt(e.altKey);
    setModMeta(e.metaKey);

    // Build Modifier Array
    const activeMods: string[] = [];
    if (e.ctrlKey) activeMods.push('Ctrl');
    if (e.shiftKey) activeMods.push('Shift');
    if (e.altKey) activeMods.push('Alt');
    if (e.metaKey) activeMods.push('Meta/Cmd');

    // Add to history
    const date = new Date();
    const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
    
    const newRecord: StrokeRecord = {
      time: timeStr,
      key: e.key === ' ' ? 'Spacebar' : e.key,
      code: e.code,
      keyCode: e.keyCode,
      modifiers: activeMods,
      location: locStr
    };

    setHistoryLog((prev) => [newRecord, ...prev].slice(0, 10));
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (!isFocused) return;
    setModShift(e.shiftKey);
    setModCtrl(e.ctrlKey);
    setModAlt(e.altKey);
    setModMeta(e.metaKey);
  };

  // Wire event listeners on focus
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => handleKeyDown(e);
    const handleGlobalKeyUp = (e: KeyboardEvent) => handleKeyUp(e);

    if (isFocused) {
      window.addEventListener('keydown', handleGlobalKeyDown);
      window.addEventListener('keyup', handleGlobalKeyUp);
    }

    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [isFocused]);

  return (
    <ToolLayout
      title="Keyboard Event Monitor Tracker"
      description="Inspect browser keyboard event bindings in real-time. Captures physical keys, code properties, key codes, and modifier statuses instantaneously."
      category="Web Design & CSS Playgrounds"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '8fr 6fr',
          gap: 'var(--space-6)',
          width: '100%',
          alignItems: 'start'
        }}
        className="mime-grid-responsive"
      >
        {/* Left Column: Keystroke capturing and live badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Interactive Capture Zone */}
          <div
            ref={captureZoneRef}
            tabIndex={0}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              outline: 'none',
              cursor: 'pointer',
              border: isFocused ? '1px solid var(--accent-primary)' : '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-lg)',
              background: isFocused ? 'rgba(124, 77, 255, 0.05)' : 'rgba(255, 255, 255, 0.01)',
              boxShadow: isFocused ? '0 8px 32px 0 rgba(124, 77, 255, 0.1)' : 'none',
              padding: 'var(--space-8) var(--space-4)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-3)',
              transition: 'all 0.3s ease-out'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: isFocused ? 'var(--accent-glow)' : 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isFocused ? 'var(--accent-primary)' : 'var(--text-muted)'
              }}
              className={isFocused ? 'animate-pulse' : ''}
            >
              <Keyboard size={28} />
            </div>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isFocused ? 'Capturing Keystrokes Live...' : 'Click Here to Start Monitoring'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '380px', lineHeight: 1.4 }}>
              {isFocused
                ? 'Press any keyboard button. Standard default browser events (such as tabs or scrolls) are sandboxed.'
                : 'Focus this box container to capture and monitor raw browser event properties immediately.'}
            </p>
          </div>

          {/* Active Event Indicators Grid */}
          <GlassCard style={{ padding: 'var(--space-5)', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Active Keyboard Event details</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 'var(--space-3)' }}>
              {[
                { label: 'event.key', val: activeKey || '--' },
                { label: 'event.code', val: activeCode || '--' },
                { label: 'event.keyCode', val: activeKeyCode !== null ? activeKeyCode.toString() : '--' },
                { label: 'event.location', val: activeLocation || '--' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(0,0,0,0.15)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    {item.label}
                  </span>
                  <span className="font-mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', textAlign: 'center', wordBreak: 'break-all' }}>
                    {item.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Active Modifier Indicators */}
            <div style={{ borderBottom: '1px solid var(--border-primary)', margin: 'var(--space-1) 0' }}></div>
            
            <div className="flex flex-col gap-2">
              <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Modifiers</span>
              <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
                {[
                  { label: 'Control', active: modCtrl },
                  { label: 'Shift', active: modShift },
                  { label: 'Alt / Option', active: modAlt },
                  { label: 'Meta / Cmd', active: modMeta }
                ].map((mod) => (
                  <div
                    key={mod.label}
                    style={{
                      padding: 'var(--space-2) var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid',
                      borderColor: mod.active ? 'var(--accent-primary)' : 'var(--border-primary)',
                      background: mod.active ? 'var(--accent-glow)' : 'rgba(255,255,255,0.01)',
                      color: mod.active ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {mod.label}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Key event history log */}
        <div>
          <GlassCard style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header toolbar */}
            <div className="flex justify-between items-center w-full" style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.01)' }}>
              <div className="flex items-center gap-2">
                <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '0.86rem', fontWeight: 700 }}>Keyboard Strokes Log</h3>
              </div>
              <button
                onClick={() => setHistoryLog([])}
                className="glass-button glass-button-secondary"
                style={{ padding: '4px 10px', fontSize: '0.64rem', gap: '4px' }}
                title="Clear logs history"
              >
                <Trash size={10} />
                <span>Clear</span>
              </button>
            </div>

            {/* History Table list */}
            <div
              style={{
                maxHeight: '440px',
                overflowY: 'auto',
                width: '100%'
              }}
              className="custom-scrollbar"
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.74rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-primary)', background: 'rgba(255,255,255,0.01)' }}>
                    <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Timestamp</th>
                    <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Key</th>
                    <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Code</th>
                    <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>Modifiers</th>
                  </tr>
                </thead>
                <tbody>
                  {historyLog.map((record, idx) => (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid rgba(255,255,255,0.02)',
                        background: idx === 0 ? 'rgba(124, 77, 255, 0.05)' : 'transparent'
                      }}
                    >
                      <td className="font-mono" style={{ padding: '8px 12px', color: 'var(--text-muted)' }}>{record.time}</td>
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: 'var(--text-primary)' }}>{record.key}</td>
                      <td className="font-mono" style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}>{record.code} (code: {record.keyCode})</td>
                      <td style={{ padding: '8px 12px' }}>
                        {record.modifiers.length > 0 ? (
                          <div className="flex gap-1">
                            {record.modifiers.map(m => (
                              <span key={m} style={{ fontSize: '0.58rem', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '1px 5px', borderRadius: 'var(--radius-sm)' }}>
                                {m}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {historyLog.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No keyboard strokes captured yet. Select the monitor zone and press any key.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mime-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </ToolLayout>
  );
};
