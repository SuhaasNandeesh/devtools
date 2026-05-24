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

const H12_IN_MS = 12 * 60 * 60 * 1000;

export interface UpdateCheckResult {
  shouldCheck: boolean;
  cachedLatestVersion?: string;
  cachedReleaseUrl?: string;
}

/**
 * Checks if the 12-hour throttling cache has expired and reads cached details.
 */
export function evaluateUpdateCheckSchedule(): UpdateCheckResult {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { shouldCheck: false };
  }
  
  try {
    const lastCheckStr = localStorage.getItem('devtools_last_update_check');
    const cachedLatest = localStorage.getItem('devtools_cached_latest_version');
    const cachedUrl = localStorage.getItem('devtools_cached_release_url');
    
    if (!lastCheckStr) {
      return { shouldCheck: true };
    }
    
    const lastCheck = parseInt(lastCheckStr, 10);
    if (isNaN(lastCheck) || Date.now() - lastCheck > H12_IN_MS) {
      return { shouldCheck: true };
    }
    
    return {
      shouldCheck: false,
      cachedLatestVersion: cachedLatest || undefined,
      cachedReleaseUrl: cachedUrl || undefined
    };
  } catch (err) {
    console.error('Failed to read update check cache from localStorage:', err);
    return { shouldCheck: true }; // safe fallback
  }
}

/**
 * Stores the last update check timestamp and cached results into localStorage.
 */
export function saveUpdateCheckCache(latestVersion: string, releaseUrl: string): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  
  try {
    localStorage.setItem('devtools_last_update_check', Date.now().toString());
    localStorage.setItem('devtools_cached_latest_version', latestVersion);
    localStorage.setItem('devtools_cached_release_url', releaseUrl);
  } catch (err) {
    console.error('Failed to save update check cache to localStorage:', err);
  }
}

/**
 * Downloads the latest compiled single-file index.html directly from the GitHub repository.
 * Triggers a browser-native file blob download.
 */
export async function downloadLatestReleaseText(): Promise<void> {
  const url = 'https://raw.githubusercontent.com/SuhaasNandeesh/devtools/main/dist/index.html';
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch latest release asset: ${response.status}`);
  }
  
  const htmlText = await response.text();
  if (!htmlText || htmlText.length < 1000 || !htmlText.includes('<!DOCTYPE html>')) {
    throw new Error('Downloaded asset does not appear to be a valid HTML bundle');
  }
  
  const blob = new Blob([htmlText], { type: 'text/html' });
  const blobUrl = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = 'devtools.html';
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

