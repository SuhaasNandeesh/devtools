import React, { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { GlassCard } from '../../components/GlassCard';
import { Copy, Clock, RefreshCw, ArrowRightLeft } from 'lucide-react';

interface TimeZoneOption {
  value: string;
  label: string;
  offset: string;
}

// Curated list of major/popular timezones with geographic context and standard labels
const POPULAR_TIMEZONES: TimeZoneOption[] = [
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)', offset: 'UTC+00:00' },
  { value: 'Asia/Kolkata', label: 'Indian Standard Time (IST) - Mumbai, Delhi', offset: 'UTC+05:30' },
  { value: 'Europe/London', label: 'British Time (GMT/BST) - London', offset: 'UTC+00:00 / UTC+01:00' },
  { value: 'America/New_York', label: 'Eastern Time (EST/EDT) - New York', offset: 'UTC-05:00 / UTC-04:00' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PST/PDT) - Los Angeles', offset: 'UTC-08:00 / UTC-07:00' },
  { value: 'America/Chicago', label: 'Central Time (CST/CDT) - Chicago', offset: 'UTC-06:00 / UTC-05:00' },
  { value: 'America/Denver', label: 'Mountain Time (MST/MDT) - Denver', offset: 'UTC-07:00 / UTC-06:00' },
  { value: 'Europe/Paris', label: 'Central European Time (CET/CEST) - Paris, Berlin', offset: 'UTC+01:00 / UTC+02:00' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST) - Tokyo', offset: 'UTC+09:00' },
  { value: 'Asia/Singapore', label: 'Singapore Standard Time (SGT)', offset: 'UTC+08:00' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST/AEDT) - Sydney', offset: 'UTC+10:00 / UTC+11:00' },
  { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST) - Dubai', offset: 'UTC+04:00' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong Time (HKT)', offset: 'UTC+08:00' },
  { value: 'Asia/Seoul', label: 'Korea Standard Time (KST)', offset: 'UTC+09:00' },
  { value: 'Europe/Moscow', label: 'Moscow Time (MSK)', offset: 'UTC+03:00' },
  { value: 'Pacific/Auckland', label: 'New Zealand Time (NZST/NZDT)', offset: 'UTC+12:00 / UTC+13:00' }
];

export const TimeZoneConverter: React.FC = () => {
  // Live ticking clocks state
  const [currentUtc, setCurrentUtc] = useState('');
  const [currentIst, setCurrentIst] = useState('');
  const [currentBst, setCurrentBst] = useState('');
  const [currentEst, setCurrentEst] = useState('');
  
  // Custom conversion state
  const [sourceTime, setSourceTime] = useState('');
  const [sourceZone, setSourceZone] = useState('UTC');
  const [targetZone, setTargetZone] = useState('Asia/Kolkata');
  const [hour12, setHour12] = useState<boolean>(true); // 12-hour default
  const [customConvertedResult, setCustomConvertedResult] = useState('');
  const [customTargetAbbr, setCustomTargetAbbr] = useState('');
  const [customOffsetInfo, setCustomOffsetInfo] = useState('');
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

  // Set initial datetime-local in user's browser timezone
  useEffect(() => {
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(now.getTime() - tzOffset)).toISOString().slice(0, 16);
    setSourceTime(localISOTime);
  }, []);

  // Update ticking HUD clocks every second
  useEffect(() => {
    const updateTickingClocks = () => {
      const now = new Date();
      
      const formatClock = (tz: string) => {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone: tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: hour12,
          timeZoneName: 'short'
        }).formatToParts(now);
        
        const timeStr = parts.filter(p => p.type !== 'timeZoneName').map(p => p.value).join('').trim();
        const tzAbbr = parts.find(p => p.type === 'timeZoneName')?.value || '';
        return { timeStr, tzAbbr };
      };

      try {
        const utc = formatClock('UTC');
        setCurrentUtc(`${utc.timeStr} ${utc.tzAbbr}`);
        
        const ist = formatClock('Asia/Kolkata');
        setCurrentIst(`${ist.timeStr} ${ist.tzAbbr}`);
        
        const bst = formatClock('Europe/London');
        setCurrentBst(`${bst.timeStr} ${bst.tzAbbr}`);
        
        const est = formatClock('America/New_York');
        setCurrentEst(`${est.timeStr} ${est.tzAbbr}`);
      } catch (err) {
        console.error('Clock format failed:', err);
      }
    };

    updateTickingClocks();
    const interval = setInterval(updateTickingClocks, 1000);
    return () => clearInterval(interval);
  }, [hour12]);

  // Execute timezone conversion dynamically
  useEffect(() => {
    if (!sourceTime) {
      setCustomConvertedResult('');
      setCustomTargetAbbr('');
      setCustomOffsetInfo('');
      return;
    }

    try {
      // 1. Parse custom input time in context of source timezone
      // Since datetime-local inputs are timezone-naive, we parse it manually
      const [datePart, timePart] = sourceTime.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes] = timePart.split(':').map(Number);

      // Create timezone-specific date string for construction
      const sourceDateString = `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
      
      // We parse the exact instant by resolving source timezone offset
      // A clean way is to format a dummy UTC date and measure the shift
      const localDate = new Date(sourceDateString);
      
      // Get target absolute formatted date string
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: targetZone,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: hour12,
        timeZoneName: 'short'
      });



      // We align timezone-naive input to source zone epoch milliseconds
      const dateInSourceZone = new Date(localDate.toLocaleString('en-US', { timeZone: sourceZone }));
      const localShift = localDate.getTime() - dateInSourceZone.getTime();
      const parsedInstant = new Date(localDate.getTime() + localShift);

      // Format custom converted date
      const parts = formatter.formatToParts(parsedInstant);
      const formattedResult = parts.filter(p => p.type !== 'timeZoneName').map(p => p.value).join('').trim().replace(/\s+/g, ' ');
      const targetAbbr = parts.find(p => p.type === 'timeZoneName')?.value || '';

      // Calculate source zone abbreviation for info
      const srcParts = new Intl.DateTimeFormat('en-US', {
        timeZone: sourceZone,
        timeZoneName: 'short'
      }).formatToParts(parsedInstant);
      const sourceAbbr = srcParts.find(p => p.type === 'timeZoneName')?.value || '';

      // Calculate numeric offset difference dynamically
      const targetOffsetString = parsedInstant.toLocaleString('en-US', { timeZone: targetZone, timeZoneName: 'longOffset' }).split('GMT')[1] || '+00:00';
      const sourceOffsetString = parsedInstant.toLocaleString('en-US', { timeZone: sourceZone, timeZoneName: 'longOffset' }).split('GMT')[1] || '+00:00';

      const parseOffsetToMinutes = (offsetStr: string) => {
        const sign = offsetStr.startsWith('-') ? -1 : 1;
        const [h, m] = offsetStr.replace(/[+-]/, '').split(':').map(Number);
        return sign * (h * 60 + m);
      };

      const diffMinutes = parseOffsetToMinutes(targetOffsetString) - parseOffsetToMinutes(sourceOffsetString);
      const diffHrs = Math.floor(Math.abs(diffMinutes) / 60);
      const diffMins = Math.abs(diffMinutes) % 60;
      
      let relativeStatement = 'in phase';
      if (diffMinutes > 0) {
        relativeStatement = `${diffHrs}h ${diffMins}m ahead of`;
      } else if (diffMinutes < 0) {
        relativeStatement = `${diffHrs}h ${diffMins}m behind`;
      }

      setCustomConvertedResult(formattedResult);
      setCustomTargetAbbr(targetAbbr);
      setCustomOffsetInfo(
        `Target time zone (${targetAbbr}) is currently ${relativeStatement} source time zone (${sourceAbbr}). Offset diff: ${targetOffsetString} vs ${sourceOffsetString}.`
      );
    } catch (e) {
      setCustomConvertedResult('Failed to convert time zone.');
      setCustomTargetAbbr('');
      setCustomOffsetInfo('');
    }
  }, [sourceTime, sourceZone, targetZone, hour12]);

  // Copy helper
  const handleCopyToClipboard = (text: string, id: string) => {
    (window as any).playFeedbackSound?.('success');
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTextId(id);
      setTimeout(() => setCopiedTextId(null), 2000);
    });
  };

  const handleSetTimeToCurrent = () => {
    (window as any).playFeedbackSound?.('click');
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(now.getTime() - tzOffset)).toISOString().slice(0, 16);
    setSourceTime(localISOTime);
  };

  return (
    <ToolLayout
      title="Dynamic Time Zone Converter"
      description="Convert UTC, IST, and popular global timezones instantly. Supports 12/24-hour configurations, daylight saving adjustments (like BST/GMT shifts), real-time ticking dashboards, and robust datetime picker inputs."
      category="Converters"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 'var(--space-6)',
          alignItems: 'stretch',
          width: '100%'
        }}
      >
        {/* Left Side: Custom Converter Panel */}
        <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="flex justify-between items-center w-full flex-wrap gap-2">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Conversion Setup
            </h2>
            
            {/* Format Toggle */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(0, 0, 0, 0.25)',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-primary)'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  (window as any).playFeedbackSound?.('click');
                  setHour12(true);
                }}
                className="glass-button"
                style={{
                  padding: '2px 8px',
                  border: 'none',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  background: hour12 ? 'var(--accent-primary)' : 'transparent',
                  color: hour12 ? 'white' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                12 HR
              </button>
              <button
                type="button"
                onClick={() => {
                  (window as any).playFeedbackSound?.('click');
                  setHour12(false);
                }}
                className="glass-button"
                style={{
                  padding: '2px 8px',
                  border: 'none',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  background: !hour12 ? 'var(--accent-primary)' : 'transparent',
                  color: !hour12 ? 'white' : 'var(--text-secondary)',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                24 HR
              </button>
            </div>
          </div>

          {/* Time Selector Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1.5)' }}>
            <div className="flex justify-between items-center">
              <label
                htmlFor="source-time-picker"
                style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}
              >
                Custom Time Source
              </label>
              <button
                type="button"
                onClick={handleSetTimeToCurrent}
                className="glass-button flex items-center gap-1"
                style={{
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-primary)'
                }}
              >
                <RefreshCw size={10} /> Use Current Time
              </button>
            </div>
            <input
              id="source-time-picker"
              type="datetime-local"
              value={sourceTime}
              onChange={(e) => setSourceTime(e.target.value)}
              style={{
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                outline: 'none',
                width: '100%',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Source Zone Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1.5)' }}>
            <label
              htmlFor="source-zone-select"
              style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}
            >
              Source Time Zone
            </label>
            <select
              id="source-zone-select"
              value={sourceZone}
              onChange={(e) => {
                (window as any).playFeedbackSound?.('click');
                setSourceZone(e.target.value);
              }}
              style={{
                background: 'rgba(20, 20, 25, 0.9)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                outline: 'none',
                width: '100%',
                cursor: 'pointer'
              }}
            >
              {POPULAR_TIMEZONES.map((tz) => (
                <option key={`src_${tz.value}`} value={tz.value}>
                  {tz.label} ({tz.offset})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Indicator Divider */}
          <div className="flex justify-center my-1">
            <div
              onClick={() => {
                (window as any).playFeedbackSound?.('click');
                const temp = sourceZone;
                setSourceZone(targetZone);
                setTargetZone(temp);
              }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-primary)',
                padding: '8px',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              className="hover:bg-white/10 hover:scale-105"
              title="Swap Zones"
            >
              <ArrowRightLeft size={14} style={{ transform: 'rotate(90deg)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          {/* Target Zone Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1.5)' }}>
            <label
              htmlFor="target-zone-select"
              style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}
            >
              Target Time Zone
            </label>
            <select
              id="target-zone-select"
              value={targetZone}
              onChange={(e) => {
                (window as any).playFeedbackSound?.('click');
                setTargetZone(e.target.value);
              }}
              style={{
                background: 'rgba(20, 20, 25, 0.9)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                outline: 'none',
                width: '100%',
                cursor: 'pointer'
              }}
            >
              {POPULAR_TIMEZONES.map((tz) => (
                <option key={`tgt_${tz.value}`} value={tz.value}>
                  {tz.label} ({tz.offset})
                </option>
              ))}
            </select>
          </div>
        </GlassCard>

        {/* Right Side: Results & Real-time ticking HUD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Result Output Card */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Converted Result
            </h2>
            
            <div
              style={{
                background: 'linear-gradient(135deg, hsla(250, 85%, 65%, 0.1) 0%, rgba(255, 255, 255, 0.01) 100%)',
                border: '1px solid hsla(250, 85%, 65%, 0.25)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {POPULAR_TIMEZONES.find(t => t.value === targetZone)?.label.split(' - ')[0] || targetZone}
              </div>
              
              <div className="flex justify-between items-center gap-4">
                <div
                  style={{
                    fontSize: '1.65rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                  }}
                >
                  {customConvertedResult || '00:00:00'}
                  {customTargetAbbr && (
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-primary)', marginLeft: '8px' }}>
                      {customTargetAbbr}
                    </span>
                  )}
                </div>
                
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(customConvertedResult, 'custom_conv')}
                  className="glass-button"
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    background: copiedTextId === 'custom_conv' ? 'var(--accent-glow)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-primary)',
                    flexShrink: 0
                  }}
                  title="Copy Result"
                >
                  <Copy size={16} style={{ color: copiedTextId === 'custom_conv' ? 'var(--accent-primary)' : 'var(--text-secondary)' }} />
                </button>
              </div>
            </div>

            {/* Diagnostic difference info description */}
            {customOffsetInfo && (
              <div
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-3) var(--space-4)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4
                }}
              >
                {customOffsetInfo}
              </div>
            )}
          </GlassCard>

          {/* Real-time ticking Clocks HUD */}
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
              Live Global Clocks
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
              Ticking in real-time. Click copy to grab any current instant values directly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {/* Row A: IST Time (Highlighted as requested!) */}
              <div
                className="glass-panel"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid hsla(250, 85%, 65%, 0.3)',
                  background: 'linear-gradient(90deg, hsla(250, 85%, 65%, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                    🇮🇳 Indian Standard Time (IST) - CURRENT TIME
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {currentIst || '00:00:00 AM IST'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(currentIst.split(' ').slice(0, -1).join(' '), 'ist_clk')}
                  className="glass-button flex items-center gap-1.5"
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    background: copiedTextId === 'ist_clk' ? 'var(--accent-glow)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid hsla(250, 85%, 65%, 0.3)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <Copy size={12} /> {copiedTextId === 'ist_clk' ? 'Copied' : 'Copy IST'}
                </button>
              </div>

              {/* Row B: UTC Clock */}
              <div
                className="glass-panel"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  background: 'rgba(255, 255, 255, 0.01)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                    🌐 Coordinated Universal Time (UTC)
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {currentUtc || '00:00:00 UTC'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(currentUtc.split(' ').slice(0, -1).join(' '), 'utc_clk')}
                  className="glass-button"
                  style={{
                    padding: '6px',
                    borderRadius: 'var(--radius-md)',
                    background: 'transparent',
                    border: '1px solid var(--border-primary)'
                  }}
                  title="Copy UTC"
                >
                  <Copy size={12} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              {/* Row C: British GMT/BST Time */}
              <div
                className="glass-panel"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  background: 'rgba(255, 255, 255, 0.01)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                    🇬🇧 London Time (BST/GMT - UTC+1 / UTC+0 shifts)
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {currentBst || '00:00:00 BST'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(currentBst.split(' ').slice(0, -1).join(' '), 'bst_clk')}
                  className="glass-button"
                  style={{
                    padding: '6px',
                    borderRadius: 'var(--radius-md)',
                    background: 'transparent',
                    border: '1px solid var(--border-primary)'
                  }}
                  title="Copy London Time"
                >
                  <Copy size={12} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>

              {/* Row D: Eastern US EST/EDT Time */}
              <div
                className="glass-panel"
                style={{
                  padding: 'var(--space-3) var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-primary)',
                  background: 'rgba(255, 255, 255, 0.01)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                    🇺🇸 New York Time (EST/EDT - UTC-5 / UTC-4 shifts)
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {currentEst || '00:00:00 EDT'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(currentEst.split(' ').slice(0, -1).join(' '), 'est_clk')}
                  className="glass-button"
                  style={{
                    padding: '6px',
                    borderRadius: 'var(--radius-md)',
                    background: 'transparent',
                    border: '1px solid var(--border-primary)'
                  }}
                  title="Copy New York Time"
                >
                  <Copy size={12} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </ToolLayout>
  );
};
