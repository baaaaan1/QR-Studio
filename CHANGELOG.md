# Changelog

All notable changes to QR Studio are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-16

QR Studio is a 100% client-side QR code studio built with Astro 7 and React 19 islands. It covers the full workflow — generating QR codes for ten content types, styling them with dots, corners, gradients, logo branding, and CTA frames, then decoding existing codes and exporting to PNG, SVG, or PDF.

There is no backend, database, or authentication layer; everything runs in the browser.

### Added

- **10 content types** (`QRContentType`, `src/lib/types.ts:1`): URL, Text, Wi-Fi (WPA/WEP/nopass plus hidden SSID), vCard, Email, Phone, SMS, WhatsApp, Crypto (BTC/ETH/SOL/USDT), and Event (VEVENT/ICS).
- **Visual styling**: 6 dot types, 3 corner-square shapes, 2 corner-dot shapes, solid and linear/radial gradients, and 4 error-correction levels (L/M/Q/H, default `Q`).
- **Preset library** (`src/lib/presets.ts`): **14** color presets, **8** gradient presets, and **10** logo presets.
- **Logo & branding**: logo upload, preset logos, size `0.1–0.4` (default `0.26`), margin `0–20` (default `4`), logo background color, a hide-background toggle, and an automatic background remover (`src/lib/bg-remover.ts`).
- **CTA frames** (`FrameType`, `src/lib/types.ts:24`): `scan-me-bottom`, `top-banner`, `polaroid`, `phone`, `neon-badge`, `ticket`, plus `none`; with custom CTA text, text position (bottom/top/both), and frame/text/background colors.
- **Live preview**: 420px retina canvas render with frame compositing and an ECC badge.
- **Decode / scan**: image upload or webcam capture via `jsQR`, automatic content-type detection, and **Load in Editor** to round-trip a decoded payload back into the form and preview.
- **Export**: high-resolution PNG (frame composited), pure vector SVG, PDF via `jspdf`, and copy-image-to-clipboard.
- **Theming**: intentional light and dark modes with zero first-paint flash, using an inline script in `src/layouts/Layout.astro` that reads `localStorage.qr_studio_theme` with a system-preference fallback, plus a theme-aware favicon.
- **Discoverability**: `@astrojs/sitemap` integration and `public/robots.txt`.
- **Deployment path**: a multi-stage `Dockerfile` (Node 22 builder → nginx runtime, base images pinned by digest) and `nginx.conf` with gzip, immutable asset caching, security headers, and a `/health` endpoint.
- **Deployment docs**: Dokploy Build Types guides in English and Indonesian (`docs/dokploy/README.md`, `docs/dokploy/README-ID.md`) plus example configs for `Procfile`, `nixpacks.toml`, `railpack.json`, and `docker-compose.yml`.

### Changed

- **Design system replaced** with a "Signal" emerald/blue identity, superseding the original indigo/cyan/pink soft-neon palette (`src/styles/global.css`).
- **Styling architecture migrated to Tailwind CSS 4** using `@tailwindcss/vite`; all theme configuration moved into the `@theme` block.
- **Accessibility hardening**: 35 `htmlFor` → `id` label associations added across 11 components, `React.useId()` in `ColorInput.tsx`, `aria-label` on the color picker, and a global keyboard `:focus-visible` ring driven by the new `--focus` token.
- **Neumorphic shadows re-tuned** with split `--shadow-dark` / `--shadow-light`, and inset shadows restricted to inputs and pressed/selected states.
- **Typecheck/engine policy**: minimum Node.js raised to `22.12`, aligned with `engines.node`.
- **Scripts**: added `preview:host`; **`npm start` was removed on purpose** because a `start` script makes Railpack run a server instead of serving the static build.
- **Framework majors**: Astro 7, React 19, TypeScript 7, Tailwind CSS 4, and `jspdf` 4.

### Fixed

These are fixes resolved **during development, prior to the first release**. v1.0.0 is the initial release, so there are no prior-version regressions addressed here.

- Restored `cursor: pointer` on `button:not(:disabled)` and `[role="button"]:not(:disabled)`, which Tailwind v4's preflight resets to `default`.
- Pinned `input::placeholder` / `textarea::placeholder` to `#9ca3af`, offsetting Tailwind v4's switch to `currentColor` at 50%.
- Corrected the v4 blur-scale rename (`backdrop-blur-sm` → `backdrop-blur-xs`), preventing doubled backdrop blur.
- Fixed dark-mode contrast on primary buttons by replacing `text-white` with the new `text-on-primary` token (`#06281C` in dark mode, where primary is light emerald `#34D399`).
- Strengthened the input focus indicator (`.neu-input:focus`) from a 1px ring to a 2px `color-mix` ring plus the shared `--focus` outline.

### Breaking Changes

Breaking changes are stated relative to the pre-Tailwind-v4 codebase.

- Tailwind CSS **v3 → v4**. `tailwind.config.mjs` is **deleted**; theme values now live in the `@theme` block of `src/styles/global.css`.
- `@astrojs/tailwind` **removed**; `@tailwindcss/vite` **added** and must be registered in `astro.config.mjs` under `vite.plugins`.
- CSS variable renames: `--bg-color`→`--bg`, `--surface-color`→`--surface`, `--text-main`→`--text`, `--border-color`→`--border`, `--primary-indigo`→`--primary`, `--cyan-accent`→`--accent-blue`. `--pink-accent` and `--green-accent` are gone. Legacy aliases exist for the first four only.
- Ambient tokens consolidated to `--ambient-emerald` and `--ambient-blue` (four were removed).
- Utility class renames in markup: `shadow-glow-indigo`→`shadow-glow-emerald`, `text-cyan-accent`→`text-blue-accent`/`text-primary`, `bg-red-500/10 text-red-500`→`bg-error/10 text-error`, `text-white`→`text-on-primary`.
- Color and gradient preset ids/names were renamed to Signal branding (e.g. `signal-emerald`); any external reference to a preset id breaks.
- **Node.js `>=22.12.0` is now required.**
- `npm start` no longer exists (`preview:host` replaces LAN preview).

### Known Issues

Items 1 and 2 block the shipped container path, and item 3 must be resolved before public deployment.

1. **`nginx.conf:1` is `fsfsserver {`** — an invalid directive (stray `fsfs` prefix). nginx fails to parse the config, so the runtime container from `Dockerfile` will not start. Verified present in the committed `HEAD` revision.
2. **`nginx.conf` declares `error_page 404 /404.html`, but no `404.html` is emitted** — there is no `src/pages/404.astro` and `dist/` contains no `404.html`. Expect nginx config-validation failure or broken 404 handling.
3. **Placeholder production domain**: `astro.config.mjs` uses `site: 'https://example.com'` (with an inline Indonesian TODO) and `public/robots.txt` points its sitemap at the same placeholder. Sitemap and canonical URLs are wrong until replaced.
4. **SVG export excludes the composite CTA frame** — frames are canvas-raster only (PNG/PDF).
5. **Decoding needs sharp input**: `jsQR` fails on blurry, low-contrast, or steeply angled images.
6. **Webcam scanning requires a secure context** (`https://` or `http://localhost`) plus explicit camera permission.
7. **No backend, REST API, database, or auth** — intentional MVP scope; the planned API-key/quota/rate-limit structure is not implemented.
8. **No automated test suite and no lint script** — the only verification command is `npx tsc --noEmit`, alongside `npm run build`.
9. `public/logo.svg` is a legacy brand asset that is currently unreferenced.

[1.0.0]: https://github.com/baaaaan1/QR-Studio/releases/tag/v1.0.0
