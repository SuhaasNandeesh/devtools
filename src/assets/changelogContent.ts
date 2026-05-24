export const CURRENT_VERSION = '1.2.0';

export const changelogContent: Record<string, string> = {
  '1.2.0': `
# What's New in v1.2.0 🚀

We have upgraded the update manager to support **One-Click Auto-Downloads** and **Session-Based Checking**!

### Key Additions
- **One-Click Auto-Downloader**: Stream the latest compiled standalone \`devtools.html\` bundle directly to your browser's *Downloads* folder with a single click, bypassing the need to unzip or manually navigate GitHub.
- **Session-Based checking**: Bypasses 12-hour throttling. The app now queries GitHub immediately on every fresh startup (on tab load) but safely caches responses in \`sessionStorage\` to avoid API rate limiting during active sessions.
- **Stateful UI Indicators**: Interactive visual icons (downloading spinner, success green check, failed manual fallbacks) that guide you dynamically.
- **Auditory Feedback**: Tactile confirmation sounds play on successful download trigger.
  `,
  '1.1.0': `
# What's New in v1.1.0 🚀

We have introduced a background update checking system!

### Key Additions
- **GitHub Release Sync**: Checks for newer versions on GitHub in the background when connected to the internet.
- **Visual Update Toast**: A beautiful, non-obtrusive toast notification in the corner notifies you when an update is published.
- **Offline Release Notes**: On the first start after an upgrade, the app automatically presents offline-first release notes (like this one!) so you immediately know what has changed.
  `
};
