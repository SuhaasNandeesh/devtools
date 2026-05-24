import { describe, it, expect } from 'vitest';

describe('Time Zone Converter Utilities', () => {
  it('should correctly format dates in different timezones using Intl API', () => {
    // Standard mock date: 2026-05-24T12:00:00Z
    const testInstant = new Date('2026-05-24T12:00:00Z');

    // Convert to IST (UTC+5:30)
    const istFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    
    const formattedIst = istFormatter.format(testInstant);
    // 12:00 UTC + 5:30 = 17:30
    expect(formattedIst).toBe('17:30');
  });

  it('should format times in 12-hour format successfully', () => {
    const testInstant = new Date('2026-05-24T23:45:00Z');

    const istFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });

    const formattedIst = istFormatter.format(testInstant);
    // 23:45 UTC + 5:30 = 05:15 AM next day
    expect(formattedIst).toContain('5:15');
    expect(formattedIst).toContain('AM');
  });

  it('should dynamically shift abbreviations for DST changes in London', () => {
    // London Winter Time: December (should show GMT)
    const winterInstant = new Date('2026-12-01T12:00:00Z');
    const winterParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/London',
      timeZoneName: 'short'
    }).formatToParts(winterInstant);
    const winterAbbr = winterParts.find(p => p.type === 'timeZoneName')?.value || '';

    // London Summer Time: June (should show BST)
    const summerInstant = new Date('2026-06-01T12:00:00Z');
    const summerParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/London',
      timeZoneName: 'short'
    }).formatToParts(summerInstant);
    const summerAbbr = summerParts.find(p => p.type === 'timeZoneName')?.value || '';

    expect(['GMT', 'GMT+0', 'UTC', 'GMT+00:00']).toContain(winterAbbr);
    expect(['BST', 'GMT+1', 'GMT+01:00']).toContain(summerAbbr);
  });
});
