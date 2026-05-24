import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { isNewerVersion, isHotfixAvailable, evaluateUpdateCheckSchedule, saveUpdateCheckCache } from '../utils/version';

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

describe('Same-Version Hotfix Comparator', () => {
  it('should identify a hotfix if version tags are identical and release publish time is strictly newer', () => {
    const currentBuild = '2026-05-24T12:00:00Z';
    const latestPublished = '2026-05-24T14:30:00Z';
    expect(isHotfixAvailable('1.5.4', currentBuild, '1.5.4', latestPublished)).toBe(true);
    expect(isHotfixAvailable('v1.5.4', currentBuild, '1.5.4', latestPublished)).toBe(true);
    expect(isHotfixAvailable('1.5.4', currentBuild, 'v1.5.4', latestPublished)).toBe(true);
  });

  it('should return false if versions are identical but online release publish time is older or equal', () => {
    const currentBuild = '2026-05-24T12:00:00Z';
    const olderPublished = '2026-05-24T10:00:00Z';
    const equalPublished = '2026-05-24T12:00:00Z';
    expect(isHotfixAvailable('1.5.4', currentBuild, '1.5.4', olderPublished)).toBe(false);
    expect(isHotfixAvailable('1.5.4', currentBuild, '1.5.4', equalPublished)).toBe(false);
  });

  it('should return false if publish time is within the 30-minute grace period buffer to avoid false build-cycle triggers', () => {
    const currentBuild = '2026-05-24T12:00:00Z';
    const postBuildBuffer = '2026-05-24T12:15:00Z'; // 15 minutes later (within buffer)
    const postBuildBufferEdge = '2026-05-24T12:30:00Z'; // exactly 30 minutes later (on boundary)
    const postBuildBufferPass = '2026-05-24T12:31:00Z'; // 31 minutes later (outside buffer)
    expect(isHotfixAvailable('1.5.4', currentBuild, '1.5.4', postBuildBuffer)).toBe(false);
    expect(isHotfixAvailable('1.5.4', currentBuild, '1.5.4', postBuildBufferEdge)).toBe(false);
    expect(isHotfixAvailable('1.5.4', currentBuild, '1.5.4', postBuildBufferPass)).toBe(true);
  });

  it('should return false if versions are different', () => {
    const currentBuild = '2026-05-24T12:00:00Z';
    const latestPublished = '2026-05-24T14:30:00Z';
    expect(isHotfixAvailable('1.5.4', currentBuild, '1.5.5', latestPublished)).toBe(false);
  });

  it('should return false if build timestamps are unparseable or malformed', () => {
    expect(isHotfixAvailable('1.5.4', 'invalid-time', '1.5.4', '2026-05-24T14:30:00Z')).toBe(false);
    expect(isHotfixAvailable('1.5.4', '2026-05-24T12:00:00Z', '1.5.4', 'invalid-time')).toBe(false);
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
    saveUpdateCheckCache('1.2.0', 'https://github.com/releases/1.2.0', '2026-05-24T14:30:00Z');

    const check = evaluateUpdateCheckSchedule();
    expect(check.shouldCheck).toBe(false);
    expect(check.cachedLatestVersion).toBe('1.2.0');
    expect(check.cachedReleaseUrl).toBe('https://github.com/releases/1.2.0');
    expect(check.cachedPublishedAt).toBe('2026-05-24T14:30:00Z');
  });
});
