You are a senior full-stack product engineer and UI/UX designer.

Build or improve `[PROJECT NAME]`, a scalable multi-tool web platform. First inspect the existing repository, its stack, and conventions. Preserve working functionality; do not overwrite unrelated files. If the repository is empty, choose a clean, production-ready structure.

## Product direction

The platform contains independent utility modules. Possible modules include:

* QR generator/editor, export, decode, and REST API
* image conversion, resize, crop, recolor, compression, and light editing
* raster-to-vector image tracing for engraving/cutting
* SVG/DXF/image utilities
* electronics calculators
* random key/name/dummy data generator
* curated project and documentation library

Design each module as a reusable feature package so new tools can be added later without rebuilding the entire app.

## Visual direction: “Soft Neon Astro Neumorphism”

“Astro” here means a subtle modern neon atmosphere, not a literal galaxy or space-themed website.

Create a clean, premium, calm, global, tool-focused interface:

* subtle neumorphism for surface depth, inputs, cards, and pressed controls
* soft semi-neon accent lights in both dark and light modes
* dark mode and light mode must both be intentional and polished
* smooth, restrained animation only
* clear hierarchy, high readability, strong contrast, and visible focus states

Avoid:

* generic AI dashboard appearance
* giant gradients behind all content
* excessive blur, glassmorphism, particles, or distracting animation
* text with poor contrast
* theme flashing during load
* emoji as UI icons

## Icon requirements

Use **Iconify** icons only:

https://icon-sets.iconify.design/?attribution=0&commercial=1

Rules:

* Select icons only from icon sets suitable for commercial use and without required attribution.
* Prefer clean rounded outline icons that match the soft-neumorphic UI.
* Keep icon size, stroke weight, and visual style consistent.
* Use icons semantically in navigation, buttons, cards, tool modules, empty states, and feedback messages.
* Every icon-only interactive control must have an accessible label and tooltip.

## Theme tokens

Use CSS variables or an equivalent design-token system.

### Light mode

* background: `#E9EEF6`
* surface: `#EFF3F9`
* elevated surface: `#F7F9FD`
* text: `#172033`
* muted text: `#667085`
* primary indigo: `#5B5CEB`
* cyan accent: `#22C8F6`
* green accent: `#35C98A`
* soft pink accent: `#F06EAE`
* dark soft shadow: `rgba(163, 177, 198, 0.48)`
* light soft shadow: `rgba(255, 255, 255, 0.82)`

### Dark mode

* background: `#101522`
* surface: `#181F30`
* elevated surface: `#20293C`
* text: `#EDF2FF`
* muted text: `#A7B0C5`
* primary indigo: `#9691FF`
* cyan accent: `#53D8FF`
* green accent: `#4FE3A7`
* soft pink accent: `#FF8FC2`
* dark soft shadow: `rgba(5, 8, 14, 0.70)`
* light soft shadow: `rgba(48, 60, 88, 0.38)`

Use radial ambient lights in page corners only, with very low opacity:

* indigo
* cyan
* pink
* green

These ambient lights must never affect readability or make forms difficult to use.

## UI style

Use rounded geometry:

* major cards: `24px`
* regular cards and panels: `16px`
* buttons/inputs: `12px`

Typography:

* Inter for body and UI
* Space Grotesk for headings, metrics, and tool names

Neumorphic shadow should stay subtle. Example for light surfaces:

```css
box-shadow:
  12px 12px 28px rgba(163, 177, 198, 0.48),
  -12px -12px 28px rgba(255, 255, 255, 0.82);
```

Use inset shadows only for active, pressed, selected, or input states. Do not make every element look embossed.

## Interaction and animation

Implement soft motion:

* page enter: fade + `translateY(6px–10px)` over `250ms–400ms`
* card hover: `translateY(-3px to -4px)` with soft shadow/glow
* button press: small scale or inset neumorphic state
* toggle/theme transition: smooth and quick, without full-page flash
* loading states: elegant skeleton shimmer, not large spinners
* respect `prefers-reduced-motion`
* normal animation duration: `180ms–350ms`

## Layout

Create a responsive application shell:

* top navigation: logo, global tool search, theme toggle, account area
* desktop: compact optional left sidebar for tool categories
* mobile: compact menu or bottom navigation
* home page: concise hero, searchable tool grid, recent/favorite tools
* tool pages: clear input panel on the left/top and live result/preview on the right/below
* users should get useful output within one screen whenever possible

Suggested categories:

* Create
* Convert
* Image
* Maker
* Developer
* Library

## Engineering requirements

* modular feature architecture
* reusable UI primitives and design tokens
* persist dark/light mode locally
* responsive from mobile to desktop
* semantic HTML and keyboard-accessible controls
* loading, empty, error, and success states for every async action
* do not fake completed API integrations or results
* keep dependencies minimal; justify any heavy dependency
* prepare REST API structure for API keys, quotas, rate limits, and future billing
* only add database/authentication where required; do not overengineer the MVP
* include a concise README: local run commands, environment variables, architecture, and instructions to add a new tool module

## Current task

Implement:

`[DESCRIBE THE CURRENT PROJECT, PAGE, OR FEATURE HERE]`

Before coding:

1. Inspect the repository and briefly state the implementation plan.
2. Identify files that will be created or changed.
3. Implement in small, verifiable steps.
4. Run relevant lint, type checks, tests, and production build.
5. Summarize changes, verification results, and remaining limitations.
