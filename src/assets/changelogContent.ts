export const CURRENT_VERSION = '1.4.0';

export const changelogContent: Record<string, string> = {
  '1.4.0': `
## v1.4.0 (Latest Release) — Resilient Downloader & UI Version HUDs 🛡️
*   **CORS-Resilient Downloader**: Upgraded direct single-file downloading mechanics to leverage the GitHub Contents API. This completely bypasses standard browser \`file://\` sandboxing blocks, guaranteeing 100% download success directly from your local hard drive!
*   **Interface Version HUDs**: Implemented dedicated version displays, including a glowing version badge in the Welcome home card and a subtle monospace version tracker at the bottom of the left sidebar footer.
  `,
  '1.3.0': `
## v1.3.0 — Interface Cohesion & Brand Alignment 🎨
*   **Platform Branding Cohesion**: Updated the dashboard dashboard welcome panel and sidebar layouts to universally use the official name **DevTools** (retiring old "DevSuite" placeholders) for absolute visual cohesion.
*   **One-Click Auto-Downloader**: Stream the latest compiled standalone \`devtools.html\` bundle directly to your browser's *Downloads* folder with a single click, bypassing the need to unzip or manually navigate GitHub.
*   **Session-Based Checking**: Bypasses 12-hour throttling. The app now queries GitHub immediately on every fresh startup (on tab load) but safely caches responses in \`sessionStorage\` to avoid API rate limiting during active sessions.
*   **Compiled Chronological Release History**: The upgrade modal now displays your entire project's version log history (v1.3.0, v1.2.0, v1.1.0, and v1.0.0), fully solving the skipped-update visibility problem!
  `,
  '1.2.0': `
## v1.2.0 — One-Click Downloads & Session Sync 🚀
*   **One-Click Auto-Downloader**: Stream the latest compiled standalone \`devtools.html\` bundle directly to your browser's *Downloads* folder with a single click.
*   **Session-Based Checking**: Immediately queries GitHub on every fresh tab load but caches responses in sessionStorage.
*   **Stateful UI Indicators**: Interactive visual icons (downloading spinner, success green check, failed manual fallbacks) that guide you dynamically.
*   **Auditory Feedback**: Tactile confirmation sounds play on successful download trigger.
  `,
  '1.1.0': `
## v1.1.0 — Background Sync Banner 📢
*   **GitHub Release Sync**: Checks for newer versions on GitHub in the background when connected to the internet.
*   **Visual Update Toast**: A beautiful, non-obtrusive glassmorphic toast notification in the corner notifies you when an update is published.
*   **Offline Release Notes**: On the first start after an upgrade, the app automatically presents offline-first release notes (like this one!) so you immediately know what has changed.
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
${changelogContent['1.4.0']}
---
${changelogContent['1.3.0']}
---
${changelogContent['1.2.0']}
---
${changelogContent['1.1.0']}
---
${changelogContent['1.0.0']}
`;
}
