import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { ToolInput } from '../../components/ToolInput';
import { ToolOutput } from '../../components/ToolOutput';
import { Clock } from 'lucide-react';

export const EpochConverter: React.FC = () => {
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [epochInput, setEpochInput] = useState(Math.floor(Date.now() / 1000).toString());
  const [dateOutput, setDateOutput] = useState('');
  const [dateInput, setDateInput] = useState(new Date().toISOString());
  const [epochOutput, setEpochOutput] = useState('');

  // Keep live epoch ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Epoch to Date conversion logic
  useEffect(() => {
    if (!epochInput) {
      setDateOutput('');
      return;
    }

    try {
      const num = parseInt(epochInput, 10);
      if (isNaN(num)) {
        setDateOutput('Invalid numeric input');
        return;
      }

      // Detect seconds vs milliseconds
      const isMs = num > 9999999999;
      const date = new Date(isMs ? num : num * 1000);

      if (isNaN(date.getTime())) {
        setDateOutput('Invalid date range');
        return;
      }

      setDateOutput(
        `Local:  ${date.toString()}\n` +
        `UTC:    ${date.toUTCString()}\n` +
        `ISO:    ${date.toISOString()}\n` +
        `Day:    ${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]}\n` +
        `Timezone Offset: ${date.getTimezoneOffset()} minutes`
      );
    } catch {
      setDateOutput('Parsing exception occurred');
    }
  }, [epochInput]);

  // Date to Epoch conversion logic
  useEffect(() => {
    if (!dateInput) {
      setEpochOutput('');
      return;
    }

    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        setEpochOutput('Invalid Date Format');
        return;
      }

      const ms = date.getTime();
      const secs = Math.floor(ms / 1000);

      setEpochOutput(
        `Epoch (seconds):       ${secs}\n` +
        `Epoch (milliseconds):  ${ms}`
      );
    } catch {
      setEpochOutput('Parsing exception occurred');
    }
  }, [dateInput]);

  return (
    <ToolLayout
      title="Unix Epoch Timestamp Converter"
      description="Convert Unix timestamp epochs (seconds or milliseconds) to human-readable datetime formats and vice versa. Includes a dynamic local timer."
      category="Converters"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-6)',
          width: '100%'
        }}
      >
        {/* Dynamic ticking block */}
        <GlassCard style={{ gridColumn: '1 / -1', padding: 'var(--space-4)' }}>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Clock size={20} className="animate-spin" style={{ animationDuration: '8s', color: 'var(--accent-primary)' }} />
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Current Unix Epoch Time:
              </span>
              <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentEpoch}
              </span>
            </div>
            <button
              onClick={() => {
                setEpochInput(currentEpoch.toString());
                setDateInput(new Date().toISOString());
              }}
              className="glass-button"
              style={{ padding: 'var(--space-1) var(--space-3)', fontSize: '0.75rem' }}
            >
              Sync inputs
            </button>
          </div>
        </GlassCard>

        {/* Section 1: Epoch to Human Readable */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Epoch to Date Date-Time</h2>
          <ToolInput
            value={epochInput}
            onChange={setEpochInput}
            placeholder="Enter Epoch timestamp e.g. 1779532800"
            label="Epoch input (seconds or milliseconds)"
            allowFileUpload={false}
          />
          <ToolOutput
            value={dateOutput}
            label="Human readable date formats"
            fileName="epoch-date-conversion.txt"
            sourceTool="Epoch Timestamp Converter"
          />
        </GlassCard>

        {/* Section 2: Human Readable to Epoch */}
        <GlassCard>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Date to Epoch Timestamp</h2>
          <ToolInput
            value={dateInput}
            onChange={setDateInput}
            placeholder="ISO Date string or local format"
            label="Date String Input (e.g. ISO 8601, UTC, or Local)"
            allowFileUpload={false}
          />
          <ToolOutput
            value={epochOutput}
            label="Unix Epoch values"
            fileName="date-epoch-conversion.txt"
            sourceTool="Epoch Timestamp Converter"
          />
        </GlassCard>
      </div>
    </ToolLayout>
  );
};
