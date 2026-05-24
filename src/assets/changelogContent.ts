export const CURRENT_VERSION = '1.5.3';

export const changelogContent: Record<string, string> = {
  '1.5.3': `
## v1.5.3 (Latest Release) — Dynamic Time Zone Converter 🌐
*   **Dynamic Time Zone Converter**: Added a premium converters category tool for advanced offline timezone calculations and shifts.
*   **Direct UTC to IST Pathway**: Easily convert UTC date-times straight to IST, complete with dynamic offset descriptions.
*   **Live Ticking Global Clocks HUD**: Features real-time live ticking clocks for UTC, IST (highlighted), London Time (GMT/BST), and New York Time (EST/EDT) with one-click direct copy buttons.
*   **DST-Aware Engine**: Employs native Intl API formats that handle daylight saving time shifts (such as GMT/BST shifts in London or EST/EDT shifts in New York) dynamically based on the exact parsed datetime.
*   **Custom Datetime Picker**: Input custom date-times via standard picker calendar controls and toggle outputs between 12-hour and 24-hour configurations instantly.
  `,
  '1.5.2': `
## v1.5.2 — Support Category Consolidation 📦
*   **Feedback Categories Consolidation**: Consolidated the "Feature" and "Enhancement" categories into a single, unified "Enhancement" category. Because GitHub's default issues labeling maps both features and incremental refinements directly to the standard \`enhancement\` label, this eliminates visual redundancy in support pathways and prevents "No labels" query selection errors on GitHub.
  `,
  '1.5.1': `
## v1.5.1 — GitHub Issue Label Mapping Fix 🏷️
*   **GitHub Issue Label Sync**: Fixed a label mapping bug in the Feedback Hub where composing a "Feature" request auto-populated with an "enhancement" label on GitHub. Composing a "Feature" now correctly maps to the dedicated "feature" GitHub label, ensuring perfect category alignment.
  `,
  '1.5.0': `
## v1.5.0 — Offline Feedback & Issue Hub 💬
*   **Offline Feedback Hub**: Added a premium Support category tool allowing you to draft bug reports, enhancement requests, or feature proposals.
*   **Secure Drafts Locker**: Safely draft and store reports inside browser-level \`localStorage\` to ensure total client-side privacy.
*   **Markdown Exporter**: Instantly package your feedback as structured, diagnostic-enriched Markdown (\`.md\`) files downloaded directly.
*   **Secure GitHub Bridge**: Compile your reports into URL-encoded parameters and bridge directly to the GitHub Issue page with a single click.
  `,
  '1.4.2': `
## v1.4.2 — Streamlined Direct Update Navigation 🚀
*   **Streamlined Direct Navigation**: Upgraded the update notification banner to open the GitHub Releases page instantly on clicking the main button. This completely bypasses browser-level \`file://\` sandboxing blocks (which restrict external HTTPS fetches from local file directories in highly secure desktop environments) with 100% reliability!
  `,
  '1.4.1': `
## v1.4.1 — Audio Sync & Persistence Patch 🔊
*   **Audio Synchronization Layer Fix**: Resolved a critical bug where toggling the audio state in the UI did not update the Web Audio synthesizer's active state or save the preference to \`localStorage\`. Audio feedback now operates perfectly across all clicks, copy successes, and updates!
  `,
  '1.4.0': `
## v1.4.0 — Resilient Downloader & UI Version HUDs 🛡️
*   **CORS-Resilient Downloader**: Upgraded direct single-file downloading mechanics to leverage the GitHub Contents API.
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
${changelogContent['1.5.3']}
---
${changelogContent['1.5.2']}
---
${changelogContent['1.5.1']}
---
${changelogContent['1.5.0']}
---
${changelogContent['1.4.2']}
---
${changelogContent['1.4.1']}
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
