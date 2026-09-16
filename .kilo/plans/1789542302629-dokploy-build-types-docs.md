# Rencana: Dokumentasi Build Type Dokploy + Contoh Konfigurasi — QR-Studio

## 1. Tujuan

Menghasilkan dokumentasi lengkap semua **build type Dokploy** beserta tutorial langkah-demi-langkah dan contoh praktis yang dikhususkan untuk proyek ini (Astro 7, static output, npm, Node ≥ 22.12, output `dist/`), plus file konfigurasi nyata yang bisa langsung dipakai deploy.

**Deliverable:**

| File | Bahasa | Isi |
| --- | --- | --- |
| `docs/dokploy/README.md` | English | Daftar semua build type + tutorial per build type + contoh praktis + referensi & troubleshooting |
| `docs/dokploy/README-ID.md` | Indonesia | Versi Bahasa Indonesia dengan struktur & isi identik |
| `Dockerfile` (root) | — | Jalur produksi: multi-stage Node 22 → nginx |
| `.dockerignore` (root) | — | Konteks build bersih & layer cache efektif |
| `nginx.conf` (root) | — | Konfigurasi nginx untuk Dockerfile (gzip, cache, 404, `/health`) |
| `docs/dokploy/examples/nixpacks.toml` | — | Contoh opsional Nixpacks |
| `docs/dokploy/examples/railpack.json` | — | Contoh opsional Railpack |
| `docs/dokploy/examples/Procfile` | — | Untuk Heroku & Paketo buildpacks (salin ke root saat dipakai) |
| `docs/dokploy/examples/docker-compose.yml` | — | Untuk Docker Compose service Dokploy / testing lokal (salin ke root) |

**Perubahan pendukung yang sudah disetujui:**
1. `package.json`: tambah `"engines": { "node": ">=22.12.0" }` (dibaca Nixpacks, Railpack, Heroku, Paketo).
2. `package.json`: hapus script `start`, ganti menjadi `"preview:host": "astro preview --host"` — wajib agar Railpack mendeteksi Astro static-SPA (Railpack menonaktifkan mode Caddy bila ada script `start` kustom). Sekaligus mencegah buildpack rebuild saat start.
3. `README.md` root: update tabel Available Scripts (`npm start` → `npm run preview:host`) + tambah section kecil "Deployment" yang menautkan kedua dokumen baru.

**Catatan lokasi:** `nginx.conf` diletakkan di root (bukan `docs/dokploy/examples/`) karena ia bagian dari jalur produksi Dockerfile — root `nginx.conf` + root `Dockerfile` + `.dockerignore` saling terikat dan tidak menimbulkan konflik build type lain. Contoh build type lain tetap di `docs/dokploy/examples/` karena sebagian file (khususnya `Procfile`) mengubah perilaku build type lain jika ada di root.

---

## 2. Fakta terverifikasi (grounding — jangan salah tulis di dokumen)

Sumber: docs.dokploy.com, source Dokploy canary (`builders/*.ts`, `build/show.tsx`), docs.railpack.com + source Railpack, README heroku/nodejs, README paketo-buildpacks.

**6 build type (enum Dokploy):** `dockerfile`, `heroku_buildpacks`, `paketo_buildpacks`, `nixpacks`, `static`, `railpack`.

| Build type | Field UI (build settings) | Perilaku build & runtime | Port runtime |
| --- | --- | --- | --- |
| **Nixpacks** (default) | `Publish Directory` (opsional), checkbox `Single Page Application (SPA)` (muncul bila Publish Directory diisi) | `nixpacks build` di server; bila Publish Directory diisi → hasil `dist` di-copy ke host → dibuatkan Dockerfile `FROM nginx:alpine` (nginx konfigurasi dibuat Dokploy; SPA ON → `try_files $uri $uri/ /index.html`) | 80 |
| **Railpack** (New) | `Railpack Version` (dropdown, default di source: `0.15.4`; daftar sampai 0.39.0; ada opsi manual) | `railpack prepare` + `docker buildx build` dengan Railpack frontend. Astro terdeteksi static-SPA **hanya jika** `astro.config.mjs`/`.ts` ada **dan** script `build` memuat `astro build` **dan** TIDAK ada start command kustom (`start` di package.json / `deploy.startCommand`). Bila static-SPA: dist disajikan **Caddy** (`:{$PORT:80}`, ada endpoint `/health` 200, gzip+zstd, `try_files` dgn fallback `index.html`, override via `Staticfile` `index_fallback: false`) | 80 (kecuali env `PORT` di-set) |
| **Dockerfile** | `Docker File` (default `Dockerfile`), `Docker Context Path` (default `.`), `Docker Build Stage` (opsional); tab Environment → Build Time Arguments & Build-time Secrets | Docker build penuh dari repo; CMD dari Dockerfile | sesuai EXPOSE/CMD (rencana: 80) |
| **Heroku Buildpacks** | `Heroku Version (Optional)` (default 24) | `pack build <app> --builder heroku/builder:<ver>`; script `heroku-prebuild`, `heroku-build`/`build`, `heroku-postbuild` **dijalankan otomatis** saat build; web process dari `Procfile` (wajib, karena script `start` dihapus); Node versi dari `engines.node` | `$PORT` (set env `PORT` di Dokploy) |
| **Paketo Buildpacks** | (tanpa field) | `pack build <app> --builder paketobuildpacks/builder-jammy-full`; `BP_NODE_RUN_SCRIPTS=build` **harus di-set** agar `npm run build` jalan (tanpa default); Procfile CNB termasuk → `Procfile` didukung; Node versi dari `engines.node` | `$PORT` (set env `PORT` di Dokploy) |
| **Static** | checkbox `Single Page Application (SPA)` saja | **Tidak ada build sama sekali**. `COPY ${publishDirectory || "."}` (UI static selalu null → `.`) dari Build Path repo → image `FROM nginx:alpine`; SPA ON → nginx.conf dgn `try_files $uri $uri/ /index.html` | 80 |

**Fakta pendukung lain:**
- UI build menampilkan peringatan resource: builder butuh **4+ GB RAM & 2+ CPU cores**; Dokploy menyarankan CI/CD build + registry (guide "Going Production") untuk produksi.
- Dokumen resmi: Nixpacks env `NIXPACKS_*`, file `nixpacks.toml`; Railpack env `RAILPACK_*` (`RAILPACK_NODE_VERSION`, `RAILPACK_SPA_OUTPUT_DIR`, `RAILPACK_NO_SPA`, `RAILPACK_CONFIG_FILE`), file `railpack.json`; Dockerfile mendukung `ARG` (Build Time Arguments) & Build Secrets.
- **Docker Compose** adalah *service type* terpisah (bukan build type): mendukung `build:` (kecuali mode Stack/Swarm), env di tab Environment ditulis ke `.env` (tidak otomatis ter-inject; pakai `env_file`/`${VAR}`), bind mount harus lewat `../files`, file dari repo jangan di-mount langsung.
- Astro static proyek ini butuh secure context (HTTPS) untuk fitur kamera decoder — relevan untuk domain produksi.
- `astro.config.mjs` `site` dan `public/robots.txt` masih placeholder `https://example.com` — cantumkan sebagai prasyarat sebelum go-live (TIDAK diubah di task ini).

---

## 3. Urutan task implementasi

### Task 1 — `package.json`
- Tambah setelah `"type": "module"` (atau sebelum dependencies):
  ```json
  "engines": { "node": ">=22.12.0" },
  ```
- Ubah scripts menjadi:
  ```json
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "preview:host": "astro preview --host"
  }
  ```
  (hapus `"start"`).

### Task 2 — File root jalur produksi
**`Dockerfile`** (multi-stage, target = stage terakhir, jadi field Docker Build Stage boleh kosong):
- `FROM node:22-alpine AS build` → `WORKDIR /app` → `COPY package.json package-lock.json ./` → `RUN npm ci` → `COPY . .` → `RUN npm run build`.
- `FROM nginx:stable-alpine AS runtime` → `COPY nginx.conf /etc/nginx/conf.d/default.conf` → `COPY --from=build /app/dist /usr/share/nginx/html` → `EXPOSE 80` → HEALTHCHECK via `/health` → `CMD ["nginx", "-g", "daemon off;"]`.
- Tambah komentar singkat hanya bila perlu (standar repo: hindari komentar berlebihan).

**`nginx.conf`** (untuk `conf.d/default.conf`):
- `listen 80;` root `/usr/share/nginx/html;` `try_files $uri $uri/ =404;` + `error_page 404 /404.html;`
- `location = /health { access_log off; return 200 "ok"; add_header Content-Type text/plain; }` (untuk healthcheck Dokploy/Swarm).
- gzip on (types: text/css, application/javascript, image/svg+xml, dsb.), `gzip_comp_level 5`.
- Cache immutable 1 tahun untuk `/assets/` & `/_astro/` (nama file Astro ber-hash), `no-cache` untuk HTML.
- Header keamanan minimal: `X-Content-Type-Options nosniff`, `Referrer-Policy strict-origin-when-cross-origin`.
- `access_log /dev/stdout; error_log /dev/stderr;`

**`.dockerignore`**:
```
node_modules
dist
.astro
.git
.gitignore
.github
docs
.vscode
.env
.env.*
*.log
coverage
local-test-qr
```
(Penting: `docs` boleh di-ignore karena `nginx.conf` ada di root, bukan di docs.)

### Task 3 — `docs/dokploy/examples/`
- **`nixpacks.toml`** — contoh eksplisit (opsional, jelaskan bahwa `npm ci` + `npm run build` sebenarnya auto-detect):
  ```toml
  [phases.setup]
  nixPkgs = ["nodejs_22"]
  [phases.install]
  cmds = ["npm ci"]
  [phases.build]
  cmds = ["npm run build"]
  ```
- **`railpack.json`** — contoh pin Node + schema:
  ```json
  { "$schema": "https://schema.railpack.com", "packages": { "node": "22" } }
  ```
- **`Procfile`** — `web: npm run preview:host` (untuk Heroku & Paketo; jelaskan env `PORT` wajib di-set di Dokploy agar port cocok dengan domain; jelaskan pula bahwa `astro preview` hanya cocok demo/non-produksi).
- **`docker-compose.yml`** — diasumsikan disalin ke root repo:
  ```yaml
  services:
    web:
      build: .
      ports:
        - "8080:80"
      restart: unless-stopped
  ```
  Sertakan komentar (dalam file contoh boleh) bahwa untuk Dokploy Compose service cukup port 80 via Domains, dan untuk lokal: `docker compose up --build` → http://localhost:8080.

### Task 4 — `docs/dokploy/README.md` (English)
Struktur wajib (heading + isi ringkas, fokus praktis):

1. **Title + intro** — apa itu Dokploy build type, tautan resmi docs build type, tabel ringkas 6 build type + rekomendasi untuk proyek ini (Dockerfile = produksi; Nixpacks + Publish Directory = paling mudah; Static = prebuilt; Buildpacks & Railpack = opsi).
2. **Project profile** — Astro 7 static, npm + `package-lock.json`, Node ≥ 22.12 (alasan: `@astrojs/react` butuh `>=22.12.0`), output `dist/`, tanpa env var, tanpa backend, port produksi 80.
3. **Prerequisites** — server Dokploy aktif, repo terhubung (Git/GitHub/dll), resource builder 4 GB RAM / 2 vCPU (peringatan dari UI Dokploy), domain + HTTPS (kamera decoder butuh secure context), ganti placeholder `site` di `astro.config.mjs` + `robots.txt` sebelum go-live.
4. **Shared Dokploy setup** — membuat Application, pilih source, Build Type, tab Domains (target port!), Deployments/logs, Auto Deploy webhook, watch paths (singkat).
5. **Per build type** (urutan: Nixpacks → Railpack → Dockerfile → Static → Heroku Buildpacks → Paketo Buildpacks), masing-masing memuat:
   - Ringkasan cara kerja (1 paragraf, dari tabel fakta di atas).
   - **Langkah UI Dokploy** (field + nilai konkret untuk proyek ini).
   - **Contoh praktis** (rujuk file contoh yang relevan / blok kode).
   - **Config file** yang dipakai & di mana (root vs docs/dokploy/examples + instruksi salin).
   - **Port & domain** yang harus dipakai.
   - **Verifikasi** (lihat log deployment sukses, buka domain, cek `dist` ter-serve, cek `/health` untuk nginx/Caddy).
   - **Kelebihan/kekurangan & kapan dipakai**.
   Tabel nilai field ringkas per build type (tanpa menebak, sesuai fakta §2):
   | Build Type | Nilai field | File | Port |
   | --- | --- | --- | --- | --- |
   | Nixpacks | Publish Directory: `dist`; SPA: unchecked | root `Dockerfile` tidak dipakai; opsional `docs/dokploy/examples/nixpacks.toml` → salin ke root | 80 |
   | Railpack | Version: default; **jangan** set env `PORT` | opsional `docs/dokploy/examples/railpack.json` | 80 |
   | Dockerfile | Docker File: `Dockerfile`; Context: `.`; Stage: kosong | root `Dockerfile` + `nginx.conf` + `.dockerignore` | 80 |
   | Static | SPA: unchecked | tidak ada (prebuilt; lihat varian di bawah) | 80 |
   | Heroku | Heroku Version: `24`; env `PORT=4321` | `docs/dokploy/examples/Procfile` → salin ke root | `PORT` |
   | Paketo | env `BP_NODE_RUN_SCRIPTS=build` + `PORT=4321` | `docs/dokploy/examples/Procfile` → salin ke root | `PORT` |
   - **Static build type — 2 varian**: (a) commit `dist/` (hapus dari .gitignore) + Build Path `dist`; (b) **recommended:** CI (GitHub Actions, YAML inline di README) build lalu push output ke branch khusus (mis. `deploy-static`), arahkan app Dokploy ke branch itu dengan Build Path `/`. Tegaskan Static tidak menjalankan build apa pun dan Nixpacks + Publish Directory adalah alternatif "build lalu static" yang lebih nyaman.
   - Catatan gotcha Railpack: rencana ini menghapus script `start`; bila ada yang menambahkannya kembali, Railpack akan berubah menjadi menjalankan start command (mode preview) alih-alih Caddy static.
6. **Kapan pakai yang mana (rekomendasi)** — Produksi: Dockerfile/nginx (atau CI+registry). Simpel & cukup: Nixpacks + `dist`. Butuh nol config: Railpack (setelah perubahan package.json). Buildpacks: cocok eksperimen/migrasi Heroku. Static: hanya bila ada artefak prebuilt dari CI. Sertakan catatan resource build di server dan rujukan guide "Going Production" (CI build + push image ke registry, lalu Source Type Docker + image tag; healthcheck/rollback via Swarm settings).
7. **Appendix A — Docker Compose service** (bukan build type): docker-compose.yml contoh, env ditulis ke `.env` (pakai `env_file`/`${VAR}`), bind mount `../files`, build hanya di mode Compose (tidak di Stack).
8. **Appendix B — Tabel port & domain**: 80 untuk nginx/Caddy (Nixpacks+PD, Dockerfile, Static, Railpack), `PORT` env untuk buildpacks; cara set domain target port di tab Domains.
9. **Appendix C — Troubleshooting**: build gagal karena Node < 22.12; Publish Directory harus `dist` (bukan path absolut); 404 di route tak dikenal (SPA toggle vs Astro MPA); Railpack jalan `npm start` (start script kembali muncul); buildpack menampilkan preview bukan file statis; kamera tidak jalan tanpa HTTPS; sitemap/robots masih example.com; PORT env bocor ke Railpack/nginx (jangan diset untuk build type non-buildpack).
10. **Appendix D — Referensi** tautan resmi: build-type, applications, docker-compose, going-production, Railpack node/config, Nixpacks config, heroku/nodejs, paketo nodejs.

Dokumen pendek (~400–600 baris), gunakan tabel + langkah bernomor, hindari basa-basi.

### Task 5 — `docs/dokploy/README-ID.md`
- Terjemahkan Task 4 ke Bahasa Indonesia; pertahankan istilah teknis/nama field UI Inggris apa adanya (Build Type, Publish Directory, Docker Context Path, dsb.).
- Struktur heading, tabel, dan blok kode harus 1:1 dengan versi EN. Cantumkan baris: `🇬🇧 English version: [README.md](./README.md)` — dan sebaliknya di versi EN `🇮🇩 Versi Bahasa Indonesia: [README-ID.md](./README-ID.md)`.

### Task 6 — Update `README.md` root (minimal)
- Tabel **Available Scripts**: ganti baris `npm start` menjadi `npm run preview:host` ("Preview the production build from `dist/` with `--host`").
- Quick Start: ganti referensi `npm start` bila ada (cek hanya pada blok Quick Start & Available Scripts).
- Tambah section `## Deployment` tepat sebelum `## License`, 3–5 baris: link ke `docs/dokploy/README.md` + `docs/dokploy/README-ID.md`, sebut build type yang direkomendasikan (Dockerfile) dan keberadaan `Dockerfile`/`nginx.conf` di root serta contoh config lain di `docs/dokploy/examples/`.
- Jangan ubah bagian lain README.

### Task 7 — Validasi
1. `npm ci` lalu `npm run build` → pastikan `dist/index.html` + `dist/sitemap-index.xml` ada (regresi package.json).
2. `npx tsc --noEmit` → hijau (tidak ada perubahan TS, murni regresi).
3. `npm run preview:host` singkat (timeout) → server naik di 4321, hentikan.
4. Bila Docker tersedia: `docker build -t qr-studio-test .` lalu `docker run --rm -p 8080:80 qr-studio-test` + `curl http://localhost:8080/health` dan `curl -I http://localhost:8080/`. Bila Docker tidak tersedia (kemungkinan besar di sandbox), catat sebagai validasi manual untuk user — jangan diklaim sudah diuji.
5. Konsistensi dokumen: kedua README memuat 6 build type + tabel field + langkah verifikasi; link internal relatif hidup; tidak ada klaim yang bertentangan dengan tabel fakta §2.
6. `git status` — pastikan hanya file yang direncanakan yang berubah; `dist/` & `.astro/` tetap ter-ignore.

---

## 4. Risiko & catatan
- **Perubahan `start` → `preview:host` bersifat breaking** bagi siapa pun yang terbiasa `npm start`; sudah didokumentasikan di Available Scripts dan doctype Dokploy (dengan alasan teknis Railpack).
- **Buildpack = non-produksi** untuk kasus ini (menjalankan `astro preview`); dokumen harus jujur menyatakan ini demo/eksperimen dan mengarahkan ke Dockerfile/Nixpacks+dist/Static.
- **Railpack `PORT`**: bila user menyalin env `PORT` (untuk buildpack) ke aplikasi Railpack/Nixpacks/Static/Dockerfile, Caddy/nginx akan berubah port → domain mismatch. Tabel port & troubleshooting wajib menegaskan ini.
- **Static build type butuh artefak prebuilt** — jangan tulis tutorial yang menyiratkan Static melakukan build.
- Dockerfile tidak bisa diuji end-to-end bila Docker tidak tersedia; tandai eksplisit di ringkasan akhir implementasi.
- Jangan ubah domain placeholder (`astro.config.mjs`, `robots.txt`) pada task ini — hanya dicatat sebagai prasyarat go-live.
