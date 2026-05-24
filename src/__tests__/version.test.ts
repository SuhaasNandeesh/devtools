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

describe('Update Session Cache Manager', () => {
  const sessionStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value.toString(); },
      clear: () => { store = {}; }
    };
  })();

  beforeEach(() => {
    vi.stubGlobal('sessionStorage', sessionStorageMock);
    sessionStorageMock.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should trigger update check if no session cache exists', () => {
    const result = evaluateUpdateCheckSchedule();
    expect(result.shouldCheck).toBe(true);
  });

  it('should read from session cache if checks are cached in the same session', () => {
    saveUpdateCheckCache('1.2.0', 'https://github.com/releases/1.2.0');

    const check = evaluateUpdateCheckSchedule();
    expect(check.shouldCheck).toBe(false);
    expect(check.cachedLatestVersion).toBe('1.2.0');
    expect(check.cachedReleaseUrl).toBe('https://github.com/releases/1.2.0');
  });
});
