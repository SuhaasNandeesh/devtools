export const CURRENT_VERSION = '1.1.0';

export const changelogContent: Record<string, string> = {
  '1.1.0': `
# What's New in v1.1.0 🚀

We have introduced a native-grade **Update & Changelog Notification System** to keep your offline tool up to date!

### Key Additions
- **GitHub Release Sync**: The app now checks for newer versions on GitHub in the background when connected to the internet.
- **Visual Update Toast**: A beautiful, non-obtrusive glassmorphic toast notification in the corner notifies you when an update is published.
- **Offline Release Notes**: On the first start after an upgrade, the app automatically presents offline-first release notes (like this one!) so you immediately know what has changed.
- **Rate-Limit Safe Caching**: Smart 12-hour request caching ensures background updates do not trigger GitHub API rate limit violations.
- **Strict User Privacy**: No tokens, telemetry, or user data are sent. Checks are entirely unauthenticated and read-only.
  `
};
