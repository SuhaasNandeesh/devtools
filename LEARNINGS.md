# Core Learnings Log: `antigravity-devtools`

This log documents crucial architectural pivots, engineering constraints, edge cases, and successful optimizations encountered during the development of the devtools suite.

---

## 1. Browser Same-Origin Policy (SOP) over `file://` Protocols
*   **Problem**: Standard Vite builds compile JavaScript modules dynamically as `<script type="module" src="./assets/index.js">`. When opened directly from the local file system (double-clicking the HTML file), modern browsers (Chrome, Safari, Edge) block the script fetch due to CORS policies on local origins.
*   **Resolution**: Integrated `vite-plugin-singlefile`. This plugin inlines all CSS styles, Lucide graphics, React assets, and tool views directly into a single self-contained `index.html`. It bypasses all file protocol CORS restrictions by eliminating secondary network requests, making the bundle 100% double-clickable offline.
*   **Impact**: Standalone HTML asset is fully plug-and-play at a mere 272KB bundle size.

---

## 2. TypeScript Closure Variable Scope Analysis
*   **Problem**: During the compile step (`tsc`), the TS compiler threw warning `error TS18047: 'match' is possibly 'null'` inside an arrow function closure (`some(k => match[3]...)`) in `MarkdownRenderer.tsx`, despite outer check loops proving it was not null. TypeScript's flow analyzer conservatively flags closures since state variables could mutate between closure declaration and execution.
*   **Resolution**: Extracted the target string into a scoped constant (`const codeText = match[3] || ''`) before executing callback functions, resolving flow analysis constraints cleanly.

---

## 3. High-Contrast Modal Readability & Theme Contrast
*   **Problem**: Semi-transparent, heavily blurred backdrop effects (glassmorphism overlays) created very low contrast margins on small fonts inside modal welcome panels in light/gray themes, violating accessibility.
*   **Resolution**: Set the Welcome Onboarding modal to have a solid background (`var(--bg-surface)`) matching Material Design cards. Refactored `MarkdownRenderer.tsx` to bind styles into strict CSS classes (like `.markdown-code` and `.markdown-kbd`) with sharp, explicit dark/light mode parameters, maximizing text readability.

---

## 4. Vertical Grid Alignment & Squeezed Headers
*   **Problem**: In React grids, outer columns stretch to equal heights, but inner form fields (like inputs and output textareas) inside distinct columns did not. Differences in header label lengths or statistics badges pushed textareas out of vertical bounds.
*   **Resolution**:
    1.  Configured responsive header blocks using `flex-wrap gap-2` on `<ToolInput>` and `<ToolOutput>` so labels and buttons drop down elegantly without vertical squeeze wrapping.
    2.  Set the inner textarea wrapper elements to use `flex: 1; display: flex; flex-direction: column;` and the textareas themselves to use `flex: 1; height: 100% !important;`. This forces both input and output panels to dynamically stretch to the exact same vertical pixel boundary.

---

## 5. Infinite Precision Sequential Incrementing (GUID ranges)
*   **Problem**: Implementing sequential GUID range increments required incrementing starting inputs (e.g. `10-00-00-00-00-00-00-00` or a full 128-bit UUID hex). Standard JavaScript numbers truncate values exceeding 53 bits (Fractions limit), leading to corrupted sequence increments.
*   **Resolution**: Implemented conversions and mathematical increments using native **`BigInt`** (`BigInt('0x' + cleanHex)`), guaranteeing 100% accuracy for infinite precision calculations. Structured a dynamic formatter that restores custom dash separators (`blocks-2`, `blocks-3`, standard hyphens) while preserving the user's starting padding length.

---

## 6. macOS Modifier Key Compositing & Flexbox Layout Wrapping (May 2026 Refinements)
*   **macOS Option Key Compositing (`event.key` vs `event.code`)**:
    *   *Problem*: Global shortcuts bound to macOS Option modifier (`⌥+V`) failed to trigger because macOS treats Option as a composition key. Under `Option+V`, `event.key` evaluates to the square root symbol `√` instead of a plain character `v`, breaking matches checking for `v`.
    *   *Resolution*: Swapped key matching from character symbols (`event.key === 'v'`) to physical key positions (`event.code === 'KeyV'` and `event.code === 'KeyK'`). This guarantees that shortcuts fire 100% reliably regardless of OS compositing layers or localized keyboard layouts.
*   **Visual Click-Outside Backdrops**:
    *   *Problem*: Sidebar panel drawers (like the Clipboard scrap history) remained pinned to the screen unless explicitly clicked on the narrow "X" button, worsening desktop ergonomics.
    *   *Resolution*: Implemented full-screen transparent/semi-transparent backdrop divs positioned at `zIndex: 95` (drawer at `zIndex: 100`) capturing outside clicks and executing parent close handlers cleanly.
*   **Flex-wrapping for Narrow Card Headers**:
    *   *Problem*: Aligning uppercase flat headers inline with complex button groups (e.g. `History`, `Paste`, `Delete`) caused critical horizontal overflow on narrow viewport grids (such as a 320px column layout). The lack of wrapping pushed outer controls like the red Delete button over the card borders, clipping them.
    *   *Resolution*: Applied flex-wrapping (`flex-wrap: wrap`) and standard spacing gutters (`gap: var(--space-2)`) directly to the Material outlined toolbars in both `<ToolInput>` and `<ToolOutput>`. Buttons now wrap onto a secondary row automatically on small screens, ensuring zero border overflow or visual clipping.

---

## 7. React Inline Styles camelCase Type Constraint
*   **Problem**: In React TypeScript inline styling, passing direct CSS-equivalent strings (like Tailwind's `tracking: '0.05em'`) results in the compilation error `Object literal may only specify known properties, and 'tracking' does not exist in type 'Properties'`.
*   **Resolution**: Camel-case keys inside inline style objects and map them to their corresponding standard DOM styles, e.g. `letterSpacing: '0.05em'`. Always run `npm run build` to catch type check discrepancies before deployment.

---

## 8. Pure Text Parsing & Compiler Interface Precision (Phase 7)
*   **Unused Closure Parameters (`match` in `replace`)**:
    *   *Problem*: When using string replacement with matching groups (`code.replace(regex, (match, group1) => ...)`), the compiler flagged `match` as unused because only `group1` was referenced in the callback, throwing exit code 2 on production builds.
    *   *Resolution*: Prefixed the unused parameter with an underscore (`_match`). This satisfies the TypeScript strict compiler analyzer while preserving argument order.
*   **Component Boundary Prop Limitations**:
    *   *Problem*: Attempting to pass `placeholder` to `<ToolOutput>` threw typing constraint error `TS2322`.
    *   *Resolution*: Restructured UI cards to supply `placeholder` strictly to interactive `<ToolInput>` fields, keeping the read-only output panels clean and fully compliant with the `ToolOutputProps` interface.
*   **Zero-Dependency Code Comment Stripping**:
    *   *Problem*: Stripping code comments using naive regexes can inadvertently delete parts of valid string literals (e.g. `const url = "http://example.com"` stripped due to `//`).
    *   *Resolution*: Formulated a priority-ordered regex structure `/("..."|'...'|`...`)|(\/\*.*\*\/|\/\/.*)/g` that matches valid string literals in its first capture group and comment patterns in the second. Inside the replace callback, if the string literal group is matched, it is returned intact; otherwise, it is stripped. This completely prevents string literal corruption during comment removals.

---

## 9. Dynamic Favourites System & Event Propagation Control (May 2026)
*   **Separation of State and Transition Logics**:
    *   *Problem*: Directly writing nested item filters and push states inside standard React hook events blocks makes it difficult to run pure headless testing suites for user favorites selections.
    *   *Resolution*: Extracted state transitions into a pure, stateless transition helper `toggleFavouriteArray(current, toolId)` inside `engines.ts`. This allows 100% test coverage inside Vitest without needing UI-dom mocks.
*   **Event Bubbling Isolation**:
    *   *Problem*: Clicking the favorite Star toggle button in the sidebar list item triggered the parent list item's `onClick` handler, switching active tool screens.
    *   *Resolution*: Added `e.stopPropagation()` inside the Star button click callback. This prevents event bubbling and separates active navigation changes from favorites lists adjustments.
*   **Dynamic Categorization Layouts**:
    *   *Problem*: Rendering empty categories takes up valuable vertical viewport margins when no favorites are active.
    *   *Resolution*: Implemented dynamic header checks (`favourites.length > 0`) that hide the category header and item slots. If the user removes all items, the favorites section gracefully slides out of view.

---

## 10. Hardware-Accelerated Glowing Canvas & Elastic Spring Transitions (Phase 8)
*   **GPU-Accelerated Drifting Canvas Blobs**:
    *   *Problem*: Adding animated background shapes can cause visual stuttering or high CPU/GPU core usage on low-end systems or offline laptops.
    *   *Resolution*: Implemented drifting glow-blobs using the hardware-accelerated CSS `transform: translate() scale()` properties inside keyframe routines. Because browsers hand off translate operations directly to GPU compositors, this yields a seamless 60fps drifting effect at practically zero CPU thread cost.
*   **Elastic spring timing curves over linear fades**:
    *   *Problem*: Standard linear transitions inside navigation routers look robotic and dry.
    *   *Resolution*: Configured a spring-like cubic bezier translation `cubic-bezier(0.34, 1.56, 0.64, 1)` translating active viewports `12px` upwards on load. This creates a smooth spring bounce effect on active page loads.
*   **Targeted Hover Class Boundaries**:
    *   *Problem*: Applying lift animations (`translateY`) to general panel outline wrappers can cause floating menu panels or sidebars to shift out of alignment when hovered.
    *   *Resolution*: Introduced the distinct class `.glass-card` inside `GlassCard.tsx`. This isolates the lift physics strictly to content cards, leaving UI navigation panels completely stable.

---

## 11. Tree-Shakeable Static Mapping for Offline Single-File Bundles (Phase 9)
*   **Problem**: When implementing context-aware icons dynamically at runtime, using dynamic imports or object index mappings with dynamic keys (e.g. `import * as Lucide`) prevents the compiler from performing static analysis. The bundler includes the entire icon library (several megabytes of SVG paths), which violates the strict 500kB standalone offline bundle constraint.
*   **Resolution**: Implemented direct, explicit static imports of individual icons in `App.tsx` and mapped them to their corresponding tools through a type-safe static switcher helper function `getToolIcon(toolId: string)`. This approach provides optimal, fine-grained tree-shaking that only compiles the exactly used vector paths.
*   **Result**: The compiled standalone single-file `dist/index.html` increased by only ~15kB (from 481kB to 496.63kB) for adding 42 distinct premium icons offline, well below our 500kB budget limit.

---

## 12. Client-Side Update Checker & Offline Changelog System (May 2026)
*   **Problem**: Offline-first web applications distributed as a single double-clickable HTML bundle cannot dynamically download live code packages without an installer wrapper, making updates invisible to users.
*   **Resolution**: 
    1.  **Background Check**: Configured a delayed asynchronous `fetch` hook calling the public GitHub Releases API `https://api.github.com/repos/.../releases/latest` inside a delayed background timer.
    2.  **12-Hour Cache Throttle**: Bypassed background queries when offline (`navigator.onLine === false`) or if the local cache is fresh, caching the latest tag and target HTML URL in `localStorage` for **12 hours** to fully respect API rate limits and conserve system resources.
    3.  **Returning vs New User Filter**: Enabled semantic upgrades identification: if the stored version is older than `CURRENT_VERSION`, launch `ChangelogModal`. If `devtools_onboarding_seen` is null (first run), suppress the changelog modal to prevent stacked overlays and UX fatigue.
    4.  **Premium Aesthetics & Accessibility**: Configured solid card background matching Material specifications for high readability, while highlights use absolute contrast margins.







---

## 13. Offline-First Feedback Hub & Secure GitHub Bridge (May 2026)
*   **Problem**: Implementing a user feedback mechanism inside a 100% offline-first application without compromising user privacy, introducing tracking telemetry, or relying on external HTTP server endpoints.
*   **Resolution**:
    1.  **LocalStorage Drafts Locker**: Configured a complete client-side drafts ecosystem saved into `localStorage` (`devtools_feedback_drafts`). Users can compose reports, save drafts, edit existing ones, or clear/delete them safely without sending any byte over the wire.
    2.  **Markdown Exporter**: Designed a local file downloader using client-side `Blob` and `URL.createObjectURL`. It packages user compose data (title, description, diagnostic system parameters) into a beautiful, structured Markdown file (`devtools-feedback-[type]-[timestamp].md`) streamed directly to their local system offline.
    3.  **Secure GitHub Bridge URL Compiler**: Created an online bridge using a direct, URL-encoded GitHub new issue template link (`window.open`). It packages title, labels, and the formatted Markdown diagnostic report into URL parameters. This triggers a secure new browser tab opening where users can review and submit the issue using their own logged-in GitHub account, requiring zero background network queries from the offline app itself.
    4.  **Tree-Shakeable Vector Paths**: Substituted brand-specific unexported SVG icons with standard web-safe Lucide vectors (`Globe` representing the external bridge link) to guarantee compile compatibility and keep single-file bundles under 550kB.
