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

export interface UpdateCheckResult {
  shouldCheck: boolean;
  cachedLatestVersion?: string;
  cachedReleaseUrl?: string;
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
    
    if (sessionChecked !== 'true') {
      return { shouldCheck: true };
    }
    
    return {
      shouldCheck: false,
      cachedLatestVersion: cachedLatest || undefined,
      cachedReleaseUrl: cachedUrl || undefined
    };
  } catch (err) {
    console.error('Failed to read update check cache from sessionStorage:', err);
    return { shouldCheck: true }; // safe fallback
  }
}

/**
 * Stores the session check indicator and cached results into sessionStorage.
 */
export function saveUpdateCheckCache(latestVersion: string, releaseUrl: string): void {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return;
  
  try {
    sessionStorage.setItem('devtools_session_checked', 'true');
    sessionStorage.setItem('devtools_cached_latest_version', latestVersion);
    sessionStorage.setItem('devtools_cached_release_url', releaseUrl);
  } catch (err) {
    console.error('Failed to save update check cache to sessionStorage:', err);
  }
}

