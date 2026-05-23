import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolOutput } from '../../components/ToolOutput';
import { describeCron } from '../../utils/engines';

export const CronDescriptor: React.FC = () => {
  const [min, setMin] = useState('*');
  const [hour, setHour] = useState('*');
  const [dom, setDom] = useState('*');
  const [month, setMonth] = useState('*');
  const [dow, setDow] = useState('*');
  const [cronExpression, setCronExpression] = useState('* * * * *');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync sliders to cron string
  useEffect(() => {
    setCronExpression(`${min} ${hour} ${dom} ${month} ${dow}`);
  }, [min, hour, dom, month, dow]);

  // Sync cron string to description
  useEffect(() => {
    if (!cronExpression || !cronExpression.trim()) {
      setDescription('');
      setErrorMsg(null);
      return;
    }

    try {
      const res = describeCron(cronExpression);
      setErrorMsg(null);
      setDescription(res);
      
      // Attempt to sync visual sliders back if standard format
      const parts = cronExpression.trim().split(/\s+/);
      if (parts.length === 5) {
        // Only update if changed to avoid loop
        if (parts[0] !== min) setMin(parts[0]);
        if (parts[1] !== hour) setHour(parts[1]);
        if (parts[2] !== dom) setDom(parts[2]);
        if (parts[3] !== month) setMonth(parts[3]);
        if (parts[4] !== dow) setDow(parts[4]);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Invalid Cron pattern');
      setDescription('');
    }
  }, [cronExpression]);

  return (
    <ToolLayout
      title="Cron Scheduler Descriptor"
      description="Build cron rules visually and read plain-English translations of execution patterns locally offline."
      category="Generators"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)'
        }}
      >
        {/* Visual Builder Panel */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-4)' }}>Visual Rule Builder</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {/* Minutes */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: 'var(--space-1)' }}>Minute:</label>
              <select
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="glass-input w-full"
                style={{ fontSize: '0.75rem', cursor: 'pointer' }}
              >
                <option value="*">Every minute (*)</option>
                <option value="*/5">Every 5 minutes (*/5)</option>
                <option value="*/10">Every 10 minutes (*/10)</option>
                <option value="*/15">Every 15 minutes (*/15)</option>
                <option value="*/30">Every 30 minutes (*/30)</option>
                <option value="0">At the start of the hour (0)</option>
              </select>
            </div>

            {/* Hours */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: 'var(--space-1)' }}>Hour:</label>
              <select
                value={hour}
                onChange={(e) => setHour(e.target.value)}
                className="glass-input w-full"
                style={{ fontSize: '0.75rem', cursor: 'pointer' }}
              >
                <option value="*">Every hour (*)</option>
                <option value="12">At noon (12)</option>
                <option value="0">At midnight (0)</option>
                <option value="*/2">Every 2 hours (*/2)</option>
                <option value="*/4">Every 4 hours (*/4)</option>
              </select>
            </div>

            {/* Day of Month */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: 'var(--space-1)' }}>Day of Month:</label>
              <select
                value={dom}
                onChange={(e) => setDom(e.target.value)}
                className="glass-input w-full"
                style={{ fontSize: '0.75rem', cursor: 'pointer' }}
              >
                <option value="*">Every day (*)</option>
                <option value="1">1st day of the month (1)</option>
                <option value="15">15th day of the month (15)</option>
              </select>
            </div>

            {/* Month */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: 'var(--space-1)' }}>Month:</label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="glass-input w-full"
                style={{ fontSize: '0.75rem', cursor: 'pointer' }}
              >
                <option value="*">Every month (*)</option>
                <option value="1">January (1)</option>
                <option value="6">June (6)</option>
                <option value="12">December (12)</option>
              </select>
            </div>

            {/* Day of Week */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 500, display: 'block', marginBottom: 'var(--space-1)' }}>Day of Week:</label>
              <select
                value={dow}
                onChange={(e) => setDow(e.target.value)}
                className="glass-input w-full"
                style={{ fontSize: '0.75rem', cursor: 'pointer' }}
              >
                <option value="*">Every day of the week (*)</option>
                <option value="1">Monday (1)</option>
                <option value="5">Friday (5)</option>
                <option value="0">Sunday (0)</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Translation and String Output Panel */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Cron Expression</h2>
            <input
              type="text"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              className="glass-input w-full"
              style={{ fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent-primary)', textAlign: 'center' }}
            />
          </div>

          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Plain-English Descriptor</h2>
            <div
              style={{
                padding: 'var(--space-4)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-md)',
                background: 'var(--glass-bg)',
                fontSize: '0.95rem',
                minHeight: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: errorMsg ? 'hsl(0, 80%, 45%)' : 'var(--text-primary)',
                fontWeight: 500
              }}
            >
              {errorMsg ? `Error: ${errorMsg}` : description || 'Type a valid cron expression...'}
            </div>
          </div>

          {/* Download rule text */}
          <ToolOutput
            value={cronExpression}
            label="Rule Expression String"
            fileName="cron_rule.txt"
            sourceTool="Cron Scheduler"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
