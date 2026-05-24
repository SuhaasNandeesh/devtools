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


/**
 * Downloads the latest compiled single-file index.html directly from the GitHub repository.
 * Uses the GitHub Contents API to completely bypass browser file:// CORS restrictions.
 * Triggers a browser-native file blob download.
 */
export async function downloadLatestReleaseText(): Promise<void> {
  const url = 'https://api.github.com/repos/SuhaasNandeesh/devtools/contents/dist/index.html?ref=main';
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch latest release contents: ${response.status}`);
  }
  
  const data = await response.json();
  if (!data.content || data.encoding !== 'base64') {
    throw new Error('Retrieved GitHub content is missing or is not base64 encoded');
  }
  
  // Clean up any whitespaces/newlines from base64 content
  const cleanBase64 = data.content.replace(/\s/g, '');
  
  // Safe decoding of large base64 streams
  const binaryString = atob(cleanBase64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const htmlText = new TextDecoder('utf-8').decode(bytes);
  
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


