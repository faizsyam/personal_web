# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server on port 3000. |
| `npm run build` | Production build. Outputs to `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm run lint` | Type-check the project (`tsc --noEmit`). |

**Environment:** Requires `GEMINI_API_KEY` in `.env.local`. Copy `.env.example` to `.env.local` and fill in your key.

---

## Architecture

### App Layout: Component vs. Data
The project is a single-page React 19 portfolio for `faizuddarain-syam`, built with Vite + TypeScript + Tailwind v4.

*   **Do not modify `src/data.ts` unless the user explicitly asks to update their CV.** This file is the single source of truth for all portfolio content (Hero, About, Work, Education, Projects, Writing). All sections are driven by data arrays exported from here.
*   **Keep `src/App.tsx` as a large, monolithic layout component.** It is the orchestrator for all sections (Hero, About, Work/Education, Projects, Writing, Contact). Future changes should be localized to the relevant section, but the file is intentionally kept as a single top-level component to manage shared state for modals and scroll tracking.
*   **Do not refactor `App.tsx` into smaller sub-components** without explicit user request. The file is long by design to keep all section logic, scroll tracking, and modal state in one place.

### UI & Animation Toolkit
*   **Motion Library:** Uses `motion/react` (the latest version of Framer Motion). All layout animations, hover effects, and scroll-triggered reveals are done via `motion` components and `AnimatePresence`.
*   **Icons:** Lucide-React. Do not install additional icon libraries.
*   **Design System:** Tailwind v4 with `@theme` and `@utility` customizations. Custom colors, fonts, and reusable utility classes (like `glass-panel`, `glass-card`) are defined in `src/index.css`.

### Bilingual Support (EN/ID)
The app is bilingual. Language is toggled via a state in `App.tsx`.
*   Translations are hardcoded in the component where they are used (e.g., inside `App.tsx` or modal components).
*   When adding new text or UI elements, ensure they are wrapped in a conditional block checking the `lang` prop/state. Look for the existing `TRANSLATIONS` object in `App.tsx` for common UI labels.

### Reusable Components
Interact with these following the established API:

1.  **`src/components/ProjectModal.tsx`**: A full-screen modal for displaying project details. It receives a full `Project` object and renders it. Primarily opened from the Projects section.
2.  **`src/components/BackgroundModal.tsx`**: A shared modal for both Work and Education timeline items. It accepts a `BackgroundItem` and dynamically structures the content based on whether the `type` is `'work'` or `'education'`.
3.  **`src/components/VennDiagram.tsx`**: A complex SVG diagram for the About section. It uses its own internal state for hover interactions. Be careful with `HIT_REGIONS` coordinates when modifying the diagram's layout.
4.  **`src/components/InteractiveGridBackground.tsx`**: A full-screen canvas background. **Do not draw React UI elements over this canvas without considering `z-index` and `pointer-events`**. It listens to `document` for mouse/touch events and maps them to its internal Web Audio-like analysis for ripples and grid distortion.

---

## Key Technical Details

### Asset Paths
*   **Images:** All major images (portraits, project banners, writing thumbnails) are stored in `public/images/`. Reference them with absolute paths (e.g., `/images/faiz_profile_1780237519567.png`). Do not use `import` for these; Vite handles them automatically from the `public` folder.
*   **CSS:** Global styles are in `src/index.css`. It imports custom Google/Fontshare fonts and defines the `@theme` for Tailwind v4.

### Scroll & Navigation
*   The navigation links in the header use a `scrollTo` function that calculates the target element's position and uses `window.scrollTo` with a smooth behavior. When adding new sections that need to be jump-linked, ensure they have an `id` matching the nav links and account for the sticky header height (approx. `56px-80px`).
*   The `activeSection` state is tracked via a scroll listener in `App.tsx`. If you add a new major section, include its `id` in the `sections` array inside the `useEffect` for scroll tracking.

### Modal State
Modals are controlled by state variables in `App.tsx`: `selectedProject`, `selectedBackground`, and `isIntroArticleOpen`. They are wrapped in `AnimatePresence` for exit animations.
