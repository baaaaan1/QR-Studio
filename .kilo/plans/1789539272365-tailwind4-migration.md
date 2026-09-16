# Migrasi Tailwind CSS 3 → 4 (@tailwindcss/vite)

## Goal

Ganti `@astrojs/tailwind` (deprecated & bentrok dengan Astro 7) dengan plugin resmi `@tailwindcss/vite`, dan pindahkan seluruh konfigurasi tema dari `tailwind.config.mjs` ke blok `@theme` di CSS. Sekali jalan, tanpa menyisakan mode kompatibilitas v3.

**Target: parity visual penuh.** Sesudah migrasi, tampilan harus identik dengan versi v3, kecuali 2 perbaikan yang memang disengaja (lihat Risks).

## Keputusan yang sudah dikonfirmasi

- Parity visual penuh: utility yang berubah makna di v4 dipetakan ke padanan v3-nya.
- `tailwind.config.mjs` dihapus; semua token masuk `@theme` di `src/styles/global.css`.
- Migrasi manual (bukan `npx @tailwindcss/upgrade`) agar deterministik.
- `.neu-*` **tidak** direfaktor jadi `@utility`; hanya dibungkus `@layer components`.

## Fakta repo yang relevan

- `package.json`: `@astrojs/tailwind ^6.0.2`, `tailwindcss ^3.4.19`, `astro ^7.3.2`, `@astrojs/react ^6.0.5`. Tidak ada `postcss.config.*`, tidak ada `autoprefixer`/`postcss-import`.
- `astro.config.mjs` memakai `tailwind({ applyBaseStyles: false })`; preflight sebenarnya ikut masuk lewat `@tailwind base` di `global.css`.
- Tidak ada `.astro` `<style>` block, tidak ada `@apply`, tidak ada `postcss.config`.
- Tidak ada JS yang membaca CSS variable (`getComputedStyle` / `var(--color-*)` / `--color-*` di `src/**` = 0 match), jadi tree-shaking theme var v4 tidak berdampak ke runtime.
- Tidak ditemukan pemakaian `bg-opacity-*`, `text-opacity-*`, `flex-shrink-*`, `flex-grow-*`, `outline-none`, `ring`/`ring-*`, shorthand `[--var]`, `dark:` variant, `bg-gradient-to-*`, `divide-*`, `container`. Jadi rename/removal v4 itu tidak perlu diurus.
- Google Fonts di-`@import` **dua kali**: `global.css:1` dan `<link>` di `Layout.astro:27-30`.

---

## Task list

### 1. Dependencies

1. `npm uninstall @astrojs/tailwind tailwindcss`
2. `npm install -D tailwindcss@^4.3.0 @tailwindcss/vite@^4.3.0`
3. Pastikan `tailwindcss` dan `@tailwindcss/vite` resolve ke major yang sama di `package-lock.json`.
4. Jangan sentuh `tailwind-merge ^3.7.0` (sudah kompatibel v4; saat ini belum dipakai di `src/`) dan `clsx`.

### 2. `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### 3. `src/styles/global.css` — restrukturisasi

1. **Hapus** baris 1 (`@import url('https://fonts.googleapis.com/...')`). Font sudah di-`<link>` di `Layout.astro:27-30`; import di CSS hanya menambah fetch render-blocking duplikat.
2. **Ganti** baris 3-5 (`@tailwind base/components/utilities`) dengan:
   ```css
   @import "tailwindcss";
   ```
3. **Tambah** pengganti `darkMode: 'class'`:
   ```css
   @custom-variant dark (&:where(.dark, .dark *));
   ```
4. **Tambah** blok `@theme` (non-`inline`) tepat setelah `@import`/`@custom-variant`, berisi seluruh isi `tailwind.config.mjs`:

   | v3 config | v4 `@theme` token |
   |---|---|
   | `colors.background` | `--color-background: var(--bg)` |
   | `colors.surface` | `--color-surface: var(--surface)` |
   | `colors.surface-elevated` | `--color-surface-elevated: var(--surface-elevated)` |
   | `colors.text-main` | `--color-text-main: var(--text)` |
   | `colors.text-muted` | `--color-text-muted: var(--text-muted)` |
   | `colors.on-primary` | `--color-on-primary: var(--on-primary)` |
   | `colors.primary.DEFAULT` | `--color-primary: var(--primary)` |
   | `colors.primary.hover` | `--color-primary-hover: var(--primary-hover)` |
   | `colors.blue.accent` | `--color-blue-accent: var(--accent-blue)` |
   | `colors.blue.strong` | `--color-blue-strong: var(--accent-blue-strong)` |
   | `colors.yellow.accent` | `--color-yellow-accent: var(--accent-yellow)` |
   | `colors.success` / `warning` / `error` / `focus` / `border` | `--color-success` / `--color-warning` / `--color-error` / `--color-focus` / `--color-border` |
   | `fontFamily.heading` | `--font-heading: "Space Grotesk", sans-serif` |
   | `fontFamily.sans` | `--font-sans: Inter, system-ui, sans-serif` |
   | `borderRadius.major/card/control` | `--radius-major: 24px` / `--radius-card: 16px` / `--radius-control: 12px` |
   | `boxShadow.neu-*` | `--shadow-neu-flat: var(--neu-flat)`, `--shadow-neu-pressed: var(--neu-pressed)`, `--shadow-neu-hover: var(--neu-hover)`, `--shadow-neu-sm: var(--neu-sm)` |
   | `boxShadow.glow-emerald` | `--shadow-glow-emerald: 0 0 25px -6px var(--primary)` |
   | `boxShadow.glow-blue` | `--shadow-glow-blue: 0 0 25px -6px var(--accent-blue)` |
   | `animation.fade-in` | `--animate-fade-in: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards` |
   | `keyframes.fadeIn` | `@keyframes fadeIn { 0% { opacity: 0; transform: translateY(8px) } 100% { opacity: 1; transform: translateY(0) } }` (nested di dalam `@theme`) |

   Catatan: `var(--primary)`, `var(--accent-blue)`, `var(--neu-*)` didefinisikan di `:root`/`.dark` di file yang sama. Nilai `var()` ini disubstitusi per-elemen, sehingga override `.dark` tetap berlaku walaupun token `@theme` hanya di-`declare` sekali — verifikasi di langkah 6.

5. **Bungkus hanya blok komponen neumorphic dengan `@layer components`** — `global.css:112-154`: `.neu-card`, `.neu-elevated`, `.neu-button`, `.neu-button:hover`, `.neu-button:active, .neu-button.active`, `.neu-input`, `.neu-input:focus`.

   Alasan: v4 memakai native cascade layer. CSS tanpa layer **selalu** menang atas `@layer utilities`, sehingga tanpa perubahan ini `hover:border-primary/50` dan `border-l-4` (utility berlayer) akan selalu kalah dari `.neu-button`/`.neu-card`. Di v3 keduanya menang lewat specificity/urutan.

   Biarkan tetap tanpa layer (jangan dipindah): `:root`, `.dark`, `*`, `body`, `:where(a, button, ...):focus-visible`, dan semua rule scrollbar. Rule-rule ini memang harus menang atas utility.

6. **Tambah base rule parity** (di dalam `@layer base` di file yang sama):

   ```css
   @layer base {
     /* v4 preflight mengubah cursor tombol jadi `default` */
     button:not(:disabled),
     [role="button"]:not(:disabled) {
       cursor: pointer;
     }

     /* v4 memakai currentColor @50% untuk placeholder; kunci ke v3 gray-400 */
     input::placeholder,
     textarea::placeholder {
       color: #9ca3af;
     }
   }
   ```

   Jangan tambahkan compat rule `border-color: var(--color-gray-200)` untuk default border v3: semua pemakaian lebar border di repo sudah dipasangkan warna eksplisit (`border-border`, `border-l-primary`, `border-blue-accent/50`) atau `border-0` (lebar 0, warna tidak relevan).

### 4. Hand-fix utility yang berubah makna di v4

Semua lokasi sudah diverifikasi lewat grep; tidak ada lokasi lain.

| File:line | Dari | Ke | Alasan |
|---|---|---|---|
| `src/components/qr/QRLogoManager.tsx:74` | `shadow-inner` | `inset-shadow-sm` | `shadow-inner` dihapus di v4; `inset-shadow-sm` = `inset 0 2px 4px rgb(0 0 0 / 0.05)` (identik v3) |
| `src/components/qr/style/ColorPresetPicker.tsx:50` | `shadow-inner` | `inset-shadow-sm` | idem |
| `src/components/qr/style/ColorDetailPicker.tsx:109` | `shadow-inner` | `inset-shadow-sm` | idem |
| `src/components/qr/QRExportDialog.tsx:101` | `shadow-sm` | `shadow-xs` | v3 `shadow-sm` (0 1px 2px) == v4 `shadow-xs` |
| `src/components/qr/style/ColorDetailPicker.tsx:44` | `shadow-sm` | `shadow-xs` | idem |
| `src/components/qr/style/ColorDetailPicker.tsx:53` | `shadow-sm` | `shadow-xs` | idem |
| `src/components/qr/style/ColorDetailPicker.tsx:87` | `shadow-sm` | `shadow-xs` | idem |
| `src/components/qr/style/ColorDetailPicker.tsx:139` | `shadow-sm` | `shadow-xs` | idem |
| `src/components/qr/QRFrameSelector.tsx:74` | `shadow-sm` | `shadow-xs` | idem |
| `src/components/qr/QRExportDialog.tsx:54` | `backdrop-blur-sm` | `backdrop-blur-xs` | v3 `backdrop-blur-sm` (4px) == v4 `backdrop-blur-xs` |
| `src/components/qr/QRDecoderModal.tsx:84` | `backdrop-blur-sm` | `backdrop-blur-xs` | idem |
| `src/pages/index.astro:18` | `backdrop-blur-sm` | `backdrop-blur-xs` | idem |

Tidak perlu diubah (sudah benar di v4): `shadow-lg` (`QRPreviewCanvas.tsx:87`), `backdrop-blur-md` (`Header.tsx:25`), `backdrop-blur-[2px]` (`QRPreviewCanvas.tsx:92`), `shadow-glow-emerald`, `shadow-neu-sm`, `rounded` telanjang (`ColorInput.tsx:21`, `ColorDetailPicker.tsx:172` — bare version masih didukung v4), semua `space-y-*` (selector v4 berbeda tapi ekuivalen di sini).

### 5. Hapus file & update dokumentasi

- Hapus `tailwind.config.mjs`.
- `README.md:5`: `Tailwind CSS 3` → `Tailwind CSS 4`.
- `README.md:71`: ganti referensi `tailwind.config.mjs` → `@theme` di `src/styles/global.css`.

### 6. Verifikasi

1. `npm run build` sukses, tanpa warning PostCSS/Tailwind lama.
2. Cek CSS hasil build di `dist/_astro/*.css` (grep) harus mengandung: `--color-primary`, `.bg-background`, `.rounded-major`, `.shadow-neu-sm`, `.shadow-glow-emerald`, `.animate-fade-in`, `@keyframes fadeIn`, `.neu-card`, `.shadow-xs`, `.inset-shadow-sm`, `.backdrop-blur-xs`. Dan **tidak** mengandung `.shadow-inner` atau `.bg-opacity-`.
3. `npm run dev`, lalu smoke test:
   - Toggle light/dark di `Header.tsx` → background/text/border/surface ikut berubah (membuktikan indirection `var(--token)` di `@theme` tetap dievaluasi terhadap `.dark`); inline script zero-flicker di `Layout.astro:33-43` masih jalan.
   - Pill selected (`bg-primary text-on-primary shadow-glow-emerald`) di `PatternSelector`, `QRFrameSelector`, `QRContentForm`, `QRExportDialog`, `ColorDetailPicker` tampil solid + glow.
   - Hover kartu preset → border jadi emerald: `ColorPresetPicker.tsx:47`, `ColorDetailPicker.tsx:106`, `PresetLogoGrid.tsx:96` (ini efek sengaja dari langkah 3.5).
   - Kartu hasil decode `QRDecoderModal.tsx:124` kini menampilkan accent border kiri `border-l-4 border-l-primary` (juga efek sengaja dari 3.5).
   - `.neu-input` focus ring emerald, `.neu-button` lift saat hover / tenggelam saat active, `.neu-card` shadow.
   - Semua tombol icon/text menampilkan cursor pointer.
   - Blur header sticky, overlay export/decoder, blur footer.
   - Alur QR: ganti tipe konten, dot pattern, gradient, logo upload, frame + CTA, export PNG/SVG/PDF, dan decode image/webcam tetap normal (Tailwind-independent, tapi cek tidak ada regresi ukuran canvas `QRPreviewCanvas.tsx` `max-h-[360px] max-w-[320px] sm:max-w-[360px]`).
   - Animasi `animate-fade-in` saat dialog export muncul.
4. `npx astro check` bila tooling-nya tersedia (repo belum punya script lint/typecheck; `tsconfig.json` strict).

---

## Risks & catatan

- **Perubahan perilaku yang disengaja** (dari `@layer components`): `hover:border-primary/50` (3 lokasi) dan `border-l-4 border-l-primary` (`QRDecoderModal.tsx:124`) akan aktif. Di v3 keduanya tertimpa `.neu-button`/`.neu-card` yang berada setelah `@tailwind utilities` dengan specificity sama. Ini perbaikan, bukan regresi, tapi perlu dikonfirmasi saat smoke test.
- **Verifikasi kombinasi `neu-*` + utility `bg-*`**: grep menunjukkan semua kombinasinya kondisional (`bg-primary` XOR `neu-button`), jadi melayerkan `.neu-*` tidak mematikan override background apa pun. Kalau nanti ada elemen `neu-* bg-<lain>`, utility akan menang (seperti v3).
- **Preflight v4**: tombol jadi `cursor: default`, placeholder jadi currentColor@50%, `hidden` attribute lebih diprioritaskan daripada utility display. Dua yang pertama ditangani di 3.6; yang ketiga tidak dipakai di repo (tidak ada `hidden` attribute).
- **Hover hanya di perangkat hover** (`@media (hover: hover)`) — hover di repo ini murni enhancement; base style sudah menerapkan state normal. Tidak ada aksi.
- **Target browser v4** (Safari 16.4+, Chrome 111+, Firefox 128+) sama dengan baseline Astro 7. Tidak ada aksi.
- **Aturan v4**: `@apply` di stylesheet terpisah / `<style>` block Astro butuh `@reference`. Saat ini tidak ada; catat untuk kontribusi berikutnya.
- `tailwind-merge` dan `clsx` saat ini tidak dipakai di `src/`; biarkan apa adanya (di luar scope).

## Out of scope

- Refaktor `.neu-*` ke API `@utility`.
- Menambah plugin (`@plugin`), `@source inline()`, safelist, atau `prettier-plugin-tailwindcss`.
- Menghapus dependency yang tidak terpakai (`tailwind-merge`, `clsx`).
- Perubahan desain/visual, atau redesign token warna.
