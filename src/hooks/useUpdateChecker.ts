import { useState, useEffect } from 'react';
import { CURRENT_VERSION } from '../assets/changelogContent';
import {
  isNewerVersion,
  isHotfixAvailable,
  BUILD_TIME,
  evaluateUpdateCheckSchedule,
  saveUpdateCheckCache
} from '../utils/version';

export interface NewVersionInfo {
  version: string;
  url: string;
  isHotfix?: boolean;
}

export const useUpdateChecker = () => {
  const [newVersionAvailable, setNewVersionAvailable] = useState<NewVersionInfo | null>(null);

  useEffect(() => {
    // Only check if system is online
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return;
    }

    const runUpdateCheck = async () => {
      const schedule = evaluateUpdateCheckSchedule();

      // If cached for 12 hours
      if (!schedule.shouldCheck) {
        if (schedule.cachedLatestVersion && schedule.cachedReleaseUrl) {
          if (isNewerVersion(CURRENT_VERSION, schedule.cachedLatestVersion)) {
            setNewVersionAvailable({
              version: schedule.cachedLatestVersion,
              url: schedule.cachedReleaseUrl,
              isHotfix: false
            });
          } else if (
            schedule.cachedPublishedAt &&
            isHotfixAvailable(CURRENT_VERSION, BUILD_TIME, schedule.cachedLatestVersion, schedule.cachedPublishedAt)
          ) {
            setNewVersionAvailable({
              version: schedule.cachedLatestVersion,
              url: schedule.cachedReleaseUrl,
              isHotfix: true
            });
          }
        }
        return;
      }

      // Check online repository release
      try {
        const response = await fetch('https://api.github.com/repos/SuhaasNandeesh/devtools/releases/latest');
        if (!response.ok) {
          throw new Error(`GitHub API response error: ${response.status}`);
        }
        const data = await response.json();
        const latestTag = data.tag_name;
        const htmlUrl = data.html_url;
        const publishedAt = data.published_at;

        if (latestTag && htmlUrl) {
          saveUpdateCheckCache(latestTag, htmlUrl, publishedAt);

          if (isNewerVersion(CURRENT_VERSION, latestTag)) {
            setNewVersionAvailable({
              version: latestTag,
              url: htmlUrl,
              isHotfix: false
            });
          } else if (
            publishedAt &&
            isHotfixAvailable(CURRENT_VERSION, BUILD_TIME, latestTag, publishedAt)
          ) {
            setNewVersionAvailable({
              version: latestTag,
              url: htmlUrl,
              isHotfix: true
            });
          }
        }
      } catch (err) {
        console.error('Failed to run update check:', err);
      }
    };

    // Delay checking by 3 seconds to ensure instant initial UI mounting
    const timer = setTimeout(runUpdateCheck, 3000);
    return () => clearTimeout(timer);
  }, []);

  return { newVersionAvailable, setNewVersionAvailable };
};
