export const CURRENT_VERSION = '1.2.0';

export const changelogContent: Record<string, string> = {
  '1.2.0': `
## v1.2.0 (Latest Release) — One-Click Downloads & Session Sync 🚀
*   **One-Click Auto-Downloader**: Stream the latest compiled standalone \`devtools.html\` bundle directly to your browser's *Downloads* folder with a single click, bypassing the need to unzip or manually navigate GitHub.
*   **Session-Based Checking**: Bypasses 12-hour throttling. The app now queries GitHub immediately on every fresh startup (on tab load) but safely caches responses in \`sessionStorage\` to avoid API rate limiting during active sessions.
*   **Stateful UI Indicators**: Interactive visual icons (downloading spinner, success green check, failed manual fallbacks) that guide you dynamically.
*   **Auditory Feedback**: Tactile confirmation sounds play on successful download trigger.
  `,
  '1.1.0': `
## v1.1.0 — Background Sync Banner 📢
*   **GitHub Release Sync**: Checks for newer versions on GitHub in the background when connected to the internet.
*   **Visual Update Toast**: A beautiful, non-obtrusive glassmorphic toast notification in the corner notifies you when an update is published.
*   **Offline Release Notes**: On the first start after an upgrade, the app automatically presents offline-first release notes so you immediately know what has changed.
  `,
  '1.0.0': `
## v1.0.0 — First Stable Launch 🎉
*   **Offline-First Mandate**: 25+ essential converters, formatters, generators, and network tools inside a single double-clickable file.
*   **Smart Clipboard Auto-Detector**: Automatically detects and recommends tools based on copied text.
*   **High-Contrast Theme Canvas**: 4 gorgeous, hardware-accelerated layouts (Neon Aurora, Cosmic Nebula, Zenith Mint, and Minimalist Slate) supporting light/dark accessibility.
*   **Integrated Clipboard Scrapbook**: System-wide drawer that caches your last 30 outputs, allowing scrapbook notes and quick inputs injections.
  `
};

/**
 * Compiles the entire version history chronologically into a single markdown string.
 */
export function getFullChangelogText(): string {
  return `
# DevTools Version History & What's New 🚀

Welcome to the offline release notes. Here you can explore recent feature additions, fixes, and updates.

---
${changelogContent['1.2.0']}
---
${changelogContent['1.1.0']}
---
${changelogContent['1.0.0']}
`;
}
