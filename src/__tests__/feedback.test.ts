import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { parseUserAgent } from '../utils/engines';

describe('Feedback Hub - User Agent Diagnostic Parser', () => {
  it('should correctly parse a macOS Safari user agent', () => {
    const macOS_Safari_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15';
    const metadata = parseUserAgent(macOS_Safari_UA);

    expect(metadata.os).toBe('macOS');
    expect(metadata.osVersion).toBe('10.15.7');
    expect(metadata.browser).toBe('Apple Safari');
    expect(metadata.browserVersion).toBe('17.4');
    expect(metadata.engine).toBe('WebKit');
    expect(metadata.device).toBe('Desktop');
  });

  it('should correctly parse a Windows Chrome user agent', () => {
    const windows_Chrome_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';
    const metadata = parseUserAgent(windows_Chrome_UA);

    expect(metadata.os).toBe('Windows');
    expect(metadata.osVersion).toBe('10 or 11');
    expect(metadata.browser).toBe('Google Chrome');
    expect(metadata.browserVersion).toBe('122.0.0.0');
    expect(metadata.engine).toBe('Blink');
    expect(metadata.device).toBe('Desktop');
  });

  it('should correctly parse an Android Chrome user agent', () => {
    const android_Chrome_UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36';
    const metadata = parseUserAgent(android_Chrome_UA);

    expect(metadata.os).toBe('Android');
    expect(metadata.osVersion).toBe('10');
    expect(metadata.browser).toBe('Google Chrome');
    expect(metadata.browserVersion).toBe('120.0.0.0');
    expect(metadata.device).toBe('Mobile Device');
  });
});

describe('Feedback Hub - LocalStorage Drafts Locker Mocks', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value.toString(); },
      clear: () => { store = {}; }
    };
  })();

  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should store and load feedback drafts successfully in localStorage', () => {
    const sampleDrafts = [
      {
        id: 'draft_1',
        title: 'Found a visual lag in radix converter',
        type: 'bug',
        description: 'Typing too quickly causes brief input delay on safari.',
        timestamp: Date.now()
      }
    ];

    localStorage.setItem('devtools_feedback_drafts', JSON.stringify(sampleDrafts));

    const loaded = localStorage.getItem('devtools_feedback_drafts');
    expect(loaded).toBeDefined();
    const parsed = JSON.parse(loaded!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].title).toBe('Found a visual lag in radix converter');
    expect(parsed[0].type).toBe('bug');
  });
});
