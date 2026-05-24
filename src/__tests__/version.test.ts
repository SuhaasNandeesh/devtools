import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isNewerVersion, evaluateUpdateCheckSchedule, saveUpdateCheckCache } from '../utils/version';

describe('Version Semver Comparator', () => {
  it('should identify newer patch versions', () => {
    expect(isNewerVersion('1.0.0', '1.0.1')).toBe(true);
    expect(isNewerVersion('1.0.1', '1.0.0')).toBe(false);
  });

  it('should identify newer minor versions', () => {
    expect(isNewerVersion('1.0.9', '1.1.0')).toBe(true);
    expect(isNewerVersion('1.1.0', '1.0.9')).toBe(false);
  });

  it('should identify newer major versions', () => {
    expect(isNewerVersion('1.9.9', '2.0.0')).toBe(true);
    expect(isNewerVersion('2.0.0', '1.9.9')).toBe(false);
  });

  it('should ignore leading v prefixes case-insensitively', () => {
    expect(isNewerVersion('v1.0.0', 'v1.0.1')).toBe(true);
    expect(isNewerVersion('V1.0.0', 'v1.0.1')).toBe(true);
    expect(isNewerVersion('1.0.0', 'v1.0.1')).toBe(true);
  });

  it('should correctly handle multi-digit versions (not lexical sorting)', () => {
    expect(isNewerVersion('1.2.0', '1.10.0')).toBe(true);
    expect(isNewerVersion('1.10.0', '1.2.0')).toBe(false);
  });

  it('should return false for identical versions', () => {
    expect(isNewerVersion('1.0.0', '1.0.0')).toBe(false);
    expect(isNewerVersion('v1.0.0', '1.0.0')).toBe(false);
  });

  it('should safely parse pre-release identifiers', () => {
    expect(isNewerVersion('1.0.0-beta', '1.0.1')).toBe(true);
    expect(isNewerVersion('1.0.0', '1.0.0-alpha')).toBe(false);
  });
});

describe('Update Cache Schedule manager', () => {
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
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('should trigger update check if no cache exists', () => {
    const result = evaluateUpdateCheckSchedule();
    expect(result.shouldCheck).toBe(true);
  });

  it('should cache and throttles subsequent check requests within 12 hours', () => {
    const now = Date.now();
    vi.setSystemTime(now);

    saveUpdateCheckCache('1.2.0', 'https://github.com/releases/1.2.0');

    // Attempt checking immediately
    const check1 = evaluateUpdateCheckSchedule();
    expect(check1.shouldCheck).toBe(false);
    expect(check1.cachedLatestVersion).toBe('1.2.0');
    expect(check1.cachedReleaseUrl).toBe('https://github.com/releases/1.2.0');

    // Advance time by 6 hours
    vi.setSystemTime(now + 6 * 60 * 60 * 1000);
    const check2 = evaluateUpdateCheckSchedule();
    expect(check2.shouldCheck).toBe(false);

    // Advance time by 13 hours (past 12 hours)
    vi.setSystemTime(now + 13 * 60 * 60 * 1000);
    const check3 = evaluateUpdateCheckSchedule();
    expect(check3.shouldCheck).toBe(true);
  });
});
