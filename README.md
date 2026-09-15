# QR Studio

Create a QR code that suits your needs, complete with a call-to-action (CTA) frame, a custom logo, and vector export.

- **Stack:** Astro 7 + React 19 + Tailwind CSS 3 + TypeScript
- **QR engine:** `qr-code-styling` · **Decode:** `jsQR` (image upload + webcam) · **PDF:** `jspdf` · **Icons:** Iconify only
- **License:** MIT — see [LICENSE](./LICENSE)

## Features

- **10 content types:** URL, Wi-Fi, vCard (Contact), WhatsApp, Text, Email, Phone, SMS, Crypto, Event (VEVENT/ICS)
- **Styling & colors:** dot type, corner square/dot, solid + linear/radial gradients, color presets, error correction level (L/M/Q/H)
- **Logo & image:** logo upload, preset logos, size/margin/background controls, background remover
- **Frame & CTA:** scan-me bottom, top banner, polaroid, phone, neon badge, ticket + custom CTA text
- **Live preview:** 420px retina render + canvas frame compositing, ECC badge
- **Decode / Scan QR:** image upload or webcam → type detection → `Load in Editor` fills the form + preview automatically
- **Export:** high-resolution PNG (with frame), pure vector SVG, PDF; quick copy image to clipboard

## Quick Start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview  # preview the build
npx tsc --noEmit # typecheck
```

> **Camera note:** the webcam feature needs browser camera permission and a secure context (`https://` or `http://localhost`). On mobile, open via HTTPS so the camera can be accessed.

## Environment Variables

None required for the current MVP.

| Variable | Required | Default | Description |
| -------- | :------: | ------- | ----------- |
| — | — | — | No API/DB/auth integration requiring secrets yet |

A REST API structure (API keys, quotas, rate limits) is planned — not implemented yet to avoid over-engineering the MVP.

## Architecture

```text
src/
├── components/
│   ├── layout/Header.tsx            # top nav: brand + theme toggle
│   ├── qr/QRStudio.tsx              # studio state orchestration + tabs + modals
│   ├── qr/QRContentForm.tsx         # 10-type content grid + dynamic panel
│   ├── qr/forms/                    # URLForm, WiFiForm, VCardForm, TextEmailForms, SpecializedForms
│   ├── qr/QRStyleCustomizer.tsx     # style + color/pattern pickers
│   ├── qr/QRLogoManager.tsx         # upload + preset logos + bg remover
│   ├── qr/QRFrameSelector.tsx       # CTA frames
│   ├── qr/QRPreviewCanvas.tsx       # live preview + export/copy buttons
│   ├── qr/QRExportDialog.tsx        # PNG/SVG/PDF dialog
│   ├── qr/QRDecoderModal.tsx        # decode modal (upload + webcam)
│   └── ui/ColorInput.tsx            # reusable color input primitive
├── lib/
│   ├── types.ts        # QRConfig, QRContentType, DecodedQRResult, ...
│   ├── presets.ts      # DEFAULT_QR_CONFIG, COLOR_PRESETS, LOGO_PRESETS
│   ├── qr-formatter.ts # QRConfig → string payload (WIFI:, VCARD, mailto:, ...)
│   ├── qr-engine.ts    # createQRCodeInstance, exportPNG, exportSVG
│   ├── qr-frames.ts    # compositeQRWithFrame (canvas + CTA)
│   ├── qr-decoder.ts   # detectQRContentType, decodeQRFromImage, scanVideoFrame
│   ├── bg-remover.ts   # logo background removal
│   └── pdf-exporter.ts # PDF export
└── styles/global.css   # design tokens (light/dark) + neumorphic utilities
```

One-way data flow: `QRStudio` holds `QRConfig` → `formatQRContent()` → `qr-code-styling` → canvas → `compositeQRWithFrame()` → preview/export. Decode results are parsed back (`detectQRContentType` + per-type parsers in `handleApplyDecodedText`) into `QRConfig`.

Theme tokens live in `src/styles/global.css` (`:root` + `.dark`) and are mapped to Tailwind in `tailwind.config.mjs` (`background`, `surface`, `text-main`, `primary`, `cyan-accent`, ...). Radii: major `24px`, card `16px`, control `12px`.

## Adding a New Tool Module

Follow the QR feature-package pattern so new tools can be added without rebuilding the whole app:

1. Create a `src/components/<tool>/` folder + logic in `src/lib/<tool>-*.ts`, with types in `src/lib/types.ts` (or `src/lib/<tool>-types.ts` when large).
2. Reuse primitives in `src/components/ui/` and tokens in `global.css` — don't hardcode colors; use the `neu-card`, `neu-button`, `neu-input`, `rounded-major/card/control` classes.
3. Use Iconify icons only (commercial-friendly sets without attribution, consistent rounded-outline style and sizing). Every icon-only control must have an `aria-label` + `title`.
4. Register the tool in the navigation grid/tabs (example: `TABS` in `QRStudio.tsx`) with loading/empty/error/success states for every async action.
5. Keep dependencies minimal; justify any heavy dependency you add.
6. Update the README (features + architecture) and make sure `npx tsc --noEmit` + `npm run build` stay green.

## Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` / `npm start` | Astro dev server |
| `npm run build` | production static build |
| `npm run preview` | preview the build output |

## Limitations

- `jsQR` needs sharp images; blur, extreme angles, or low contrast may fail detection.
- SVG export is the pure QR (without the composite CTA frame — frames are drawn on canvas/PNG/PDF).
- No backend/REST API, DB, or auth yet (intentional, MVP scope).

