/**
 * Static compile timestamp representing when this bundle was built.
 * This is compared against the GitHub release publish time for hotfixes.
 */
export const BUILD_TIME = '2026-05-24T16:40:00Z';

/**
 * Compares two semantic version strings (e.g. '1.10.0' and '1.2.0').
 * Returns true if latest version is strictly newer than current version.
 */
export function isNewerVersion(current: string, latest: string): boolean {
  const clean = (v: string) => {
    // Remove starting 'v' and strip any pre-release tags for parsing (e.g., '1.0.0-beta' -> '1.0.0')
    const cleanV = v.trim().replace(/^v/i, '').split('-')[0];
    return cleanV.split('.').map(Number);
  };
  
  const currParts = clean(current);
  const lateParts = clean(latest);
  
  for (let i = 0; i < Math.max(currParts.length, lateParts.length); i++) {
    const curr = currParts[i] || 0;
    const late = lateParts[i] || 0;
    
    if (isNaN(curr) || isNaN(late)) {
      // Fallback safe string compare if NaN issues occur
      return latest.localeCompare(current) > 0;
    }
    
    if (late > curr) return true;
    if (curr > late) return false;
  }
  
  return false;
}

/**
 * Determines if a hotfix is available on GitHub for the exact same version name.
 * Returns true if both versions are identical and the online publish time is newer than our local build time.
 */
export function isHotfixAvailable(
  currentVersion: string,
  currentBuildTime: string,
  latestVersion: string,
  latestPublishedAt: string
): boolean {
  // Clean versions (remove 'v' prefix if any)
  const cleanV = (v: string) => v.trim().replace(/^v/i, '');
  if (cleanV(currentVersion) !== cleanV(latestVersion)) return false;
  
  try {
    const curTime = Date.parse(currentBuildTime);
    const latTime = Date.parse(latestPublishedAt);
    
    // A hotfix represents a patch release published significantly later than the local build.
    // A 30-minute grace period buffer prevents false positive hotfix notifications triggered
    // during the active compilation/release publication latency window.
    const HOTFIX_BUFFER_MS = 30 * 60 * 1000; // 30 minutes
    
    return !isNaN(curTime) && !isNaN(latTime) && latTime > (curTime + HOTFIX_BUFFER_MS);
  } catch {
    return false;
  }
}

export interface UpdateCheckResult {
  shouldCheck: boolean;
  cachedLatestVersion?: string;
  cachedReleaseUrl?: string;
  cachedPublishedAt?: string;
}

/**
 * Checks if the session cache exists and reads cached details.
 * Bypasses network calls if checked in the current browser session.
 */
export function evaluateUpdateCheckSchedule(): UpdateCheckResult {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') {
    return { shouldCheck: false };
  }
  
  try {
    const sessionChecked = sessionStorage.getItem('devtools_session_checked');
    const cachedLatest = sessionStorage.getItem('devtools_cached_latest_version');
    const cachedUrl = sessionStorage.getItem('devtools_cached_release_url');
    const cachedPublished = sessionStorage.getItem('devtools_cached_published_at');
    
    if (sessionChecked !== 'true') {
      return { shouldCheck: true };
    }
    
    return {
      shouldCheck: false,
      cachedLatestVersion: cachedLatest || undefined,
      cachedReleaseUrl: cachedUrl || undefined,
      cachedPublishedAt: cachedPublished || undefined
    };
  } catch (err) {
    console.error('Failed to read update check cache from sessionStorage:', err);
    return { shouldCheck: true }; // safe fallback
  }
}

/**
 * Stores the session check indicator and cached results into sessionStorage.
 */
export function saveUpdateCheckCache(latestVersion: string, releaseUrl: string, publishedAt?: string): void {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;
  
  try {
    sessionStorage.setItem('devtools_session_checked', 'true');
    sessionStorage.setItem('devtools_cached_latest_version', latestVersion);
    sessionStorage.setItem('devtools_cached_release_url', releaseUrl);
    if (publishedAt) {
      sessionStorage.setItem('devtools_cached_published_at', publishedAt);
    }
  } catch (err) {
    console.error('Failed to save update check cache to sessionStorage:', err);
  }
}

