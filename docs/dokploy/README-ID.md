# Build Type Dokploy — Panduan Deployment QR Studio

🇬🇧 English version: [README.md](./README.md)

Dokploy dapat mem-build repositori ini dengan enam cara berbeda. Masing-masing disebut **Build Type**, dan perbedaannya terletak pada cara image dibuat, port yang dipakai aplikasi, serta seberapa banyak konfigurasi yang dibutuhkan. Panduan ini memberikan nilai field Dokploy yang tepat untuk QR Studio, menjelaskan apa yang sebenarnya dilakukan setiap build type, dan menunjukkan cara memverifikasi hasil deployment.

Referensi resmi: [Dokploy — Build Type](https://docs.dokploy.com/docs/core/applications/build-type).

Ringkasan singkat untuk proyek ini:

- **Rekomendasi produksi:** Dockerfile — [`Dockerfile`](../../Dockerfile) + [`nginx.conf`](../../nginx.conf) di root repositori.
- **Build di server paling mudah:** Nixpacks dengan `Publish Directory = dist`.
- **Opsi tanpa konfigurasi:** Railpack (berfungsi karena `package.json` tidak punya script `start` kustom).
- **Buildpacks (Heroku/Paketo) dan Static punya catatan khusus** — baca bagiannya sebelum memilih.

## Ringkasan Build Type

Enum build type Dokploy berisi tepat enam nilai: `dockerfile`, `heroku_buildpacks`, `paketo_buildpacks`, `nixpacks`, `static`, dan `railpack`.

| Build Type | Yang dilakukan | Runtime yang dihasilkan | Penilaian untuk QR Studio |
| ---------- | -------------- | ----------------------- | ------------------------- |
| **Nixpacks** (default) | Menjalankan `nixpacks build` di server Dokploy. Bila `Publish Directory` diisi, Dokploy menyalin direktori itu ke host lalu membuat image `nginx:alpine` yang menyajikannya. | `nginx:alpine`, port **80** | Build di server yang mudah. Default bagus bila tidak ingin membuat Dockerfile. |
| **Railpack** | Menjalankan `railpack prepare` + `docker buildx build` dengan frontend Railpack. Mendeteksi situs statis Astro lalu menyajikannya dengan **Caddy**. | Server statis Caddy, port **80** | Nol konfigurasi setelah perubahan `package.json`/`engines` di repo ini. |
| **Dockerfile** | `docker build` biasa memakai Dockerfile dari repositori. | Sesuai Dockerfile — di sini `nginx:stable-alpine`, port **80** | **Rekomendasi produksi.** Perilaku dapat diprediksi dan bisa diuji lokal. |
| **Static** | **Tidak melakukan build sama sekali.** Menyalin sebuah direktori dari repositori ke image `nginx:alpine` yang baru. | `nginx:alpine`, port **80** | Hanya berguna dengan artefak prebuilt (mis. `dist/` hasil CI). |
| **Heroku Buildpacks** | `pack build <app> --builder heroku/builder:<version>`; script build dijalankan otomatis. | Container menjalankan proses web dari `Procfile` (`astro preview`), port **4321** | Hanya demo/eksperimen — menyajikan preview server Astro, bukan hosting statis produksi. |
| **Paketo Buildpacks** | `pack build <app> --builder paketobuildpacks/builder-jammy-full`. | Sama seperti Heroku — proses web dari `Procfile` (`astro preview`), port **4321** | Hanya demo/eksperimen. |

### Tabel nilai field

| Build Type | Nilai field di Dokploy | File repositori yang dipakai | Port container |
| ---------- | ---------------------- | ---------------------------- | -------------- |
| Nixpacks | `Publish Directory`: `dist`; `Single Page Application (SPA)`: unchecked | `Dockerfile` root **tidak** dipakai. Opsional: [`examples/nixpacks.toml`](./examples/nixpacks.toml) (salin ke root untuk mengaktifkan) | 80 |
| Railpack | `Railpack Version`: biarkan default; **jangan** set env `PORT` | Opsional: [`examples/railpack.json`](./examples/railpack.json) (salin ke root untuk mengaktifkan) | 80 |
| Dockerfile | `Docker File`: `Dockerfile`; `Docker Context Path`: `.`; `Docker Build Stage`: kosong | [`Dockerfile`](../../Dockerfile) + [`nginx.conf`](../../nginx.conf) + [`.dockerignore`](../../.dockerignore) di root | 80 |
| Static | `Single Page Application (SPA)`: unchecked | Tidak ada (direktori prebuilt — lihat dua varian di bawah) | 80 |
| Heroku Buildpacks | `Heroku Version (Optional)`: `24`; env `PORT=4321` | [`examples/Procfile`](./examples/Procfile) (salin ke root untuk mengaktifkan) | 4321 |
| Paketo Buildpacks | env `BP_NODE_RUN_SCRIPTS=build` dan `PORT=4321` | [`examples/Procfile`](./examples/Procfile) (salin ke root untuk mengaktifkan) | 4321 |

> Peringatan resource dari UI Dokploy: build di server membutuhkan sekitar **4 GB RAM dan 2 core CPU**. Untuk produksi, sebaiknya build di CI lalu pull image yang sudah jadi — lihat [Going Production](https://docs.dokploy.com/docs/core/applications/going-production).

## Profil Proyek

Gunakan tabel ini saat mengisi field Dokploy. Semua nilai berasal dari repositori ini.

| Item | Nilai |
| ---- | ----- |
| Framework | Astro 7, output statis default (tanpa adapter), satu halaman `src/pages/index.astro` |
| Package manager | npm dengan `package-lock.json` |
| Node.js | `engines.node` = `>=22.12.0` (dibutuhkan `@astrojs/react` 6, yang memerlukan Node ≥ 22.12) |
| Perintah build | `npm run build` → `dist/` plus `dist/sitemap-index.xml` dan `dist/sitemap-0.xml` |
| Publish directory | `dist` |
| Env var runtime | tidak ada |
| Backend / database / auth | tidak ada — semuanya berjalan di browser |
| Port produksi | 80 untuk jalur nginx/Caddy; 4321 untuk jalur `astro preview` buildpack |
| Scripts | `dev`, `build`, `preview`, `preview:host` — sengaja **tidak ada script `start`** (kalau ada, Railpack akan menjalankannya, bukan menyajikan file statis) |

## Prasyarat

1. Instance Dokploy yang berjalan dengan minimal satu server (lokal atau remote) terhubung.
2. Repositori dapat diakses Dokploy: GitHub/GitLab/Bitbucket/Gitea app, URL Git publik, atau upload `drop`.
3. Domain (atau subdomain) yang mengarah ke server Dokploy, idealnya dengan HTTPS otomatis aktif.
4. Resource server yang cukup untuk build di server: sekitar 4 GB RAM dan 2 core CPU.
5. HTTPS di produksi: decoder kamera membutuhkan secure context (`https://`), jika tidak kamera tidak bisa dibuka.
6. Domain produksi sudah diarahkan ke `https://qr.numaya.my.id` — `site` di `astro.config.mjs` dan URL sitemap di `robots.txt`. Perbarui keduanya bila Anda deploy dengan domain berbeda.
7. Node.js ≥ 22.12 di setiap tempat build dijalankan. Field `engines.node` dibaca Nixpacks, Railpack, Heroku, dan Paketo; bila builder tetap memilih Node lama, set env versinya (lihat [Troubleshooting](#lampiran-c--troubleshooting)).

## Setup Dokploy Umum

Langkah-langkah ini sama untuk semua build type; bagian build type setelahnya hanya mengisi field build.

1. Buat (atau buka) sebuah **Project**, lalu klik **Create Service → Application**.
2. Beri nama aplikasi (misalnya `qr-studio`) dan pilih server yang akan menjalankannya.
3. Buka tab **General** dan hubungkan sumber: GitHub App, Git (URL repositori + kredensial), GitLab, Bitbucket, Gitea, atau Drop.
4. Set **Branch** ke `main` (atau branch tempat Anda deploy).
5. Buka tab **Build Type** dan pilih build type dari bagian yang Anda pilih di bawah; isi field tambahannya persis seperti yang tertera.
6. Buka tab **Environment** dan tambahkan hanya variabel yang dibutuhkan build type tersebut. QR Studio sendiri tidak butuh variabel apa pun.
7. Buka tab **Domains**, klik **Add Domain**, isi hostname, biarkan path `/`, dan set **Container Port** ke port yang tertera untuk build type Anda (80 atau 4321). Aktifkan HTTPS.
8. Klik **Deploy** dan pantau log deployment sampai container berjalan.
9. Opsional: aktifkan **Auto Deploy** (webhook GitHub) dan atur **Watch Paths** agar perubahan yang tidak relevan (misalnya `docs/**`) tidak memicu rebuild.

## Build Type: Nixpacks

### Cara kerja

Dokploy menjalankan `nixpacks build <repo> --name <app>`. Nixpacks mendeteksi Node dari `package-lock.json` / `engines.node`, menginstal dependency, dan menjalankan `npm run build`. Karena `Publish Directory` diisi, Dokploy menambahkan `--no-error-without-start`, menjalankan container sementara dari image hasil build, menyalin `dist` keluar dengan `docker cp`, lalu membuat Dockerfile kecil `FROM nginx:alpine` yang menyajikan direktori tersebut. Dengan checkbox `Single Page Application (SPA)` mati, image memakai konfigurasi statis default nginx (path yang tidak ada menghasilkan 404); bila dinyalakan, path tak dikenal dialihkan ke `index.html`.

### Nilai UI Dokploy

| Field | Nilai |
| ----- | ----- |
| Build Type | `Nixpacks` |
| Build Path | `/` (default) |
| Publish Directory | `dist` |
| Single Page Application (SPA) | unchecked |
| Environment | tidak ada yang wajib; opsional `NIXPACKS_NODE_VERSION=22` bila Node terdeteksi salah |

### Contoh konfigurasi

File ini opsional — Nixpacks sudah mendeteksi `npm ci` + `npm run build` untuk proyek ini. Salin [`examples/nixpacks.toml`](./examples/nixpacks.toml) ke root repositori untuk mem-pin Node dan phase secara eksplisit:

```toml
[phases.setup]
nixPkgs = ["nodejs_22"]

[phases.install]
dependsOn = ["setup"]
cmds = ["npm ci"]

[phases.build]
dependsOn = ["install"]
cmds = ["npm run build"]
```

Catat bahwa `nixPkgs` **menggantikan** paket setup default, jadi biarkan seperti ini kecuali Anda tahu paket apa yang dibutuhkan. Nixpacks juga membaca environment variable `NIXPACKS_*` sebagai alternatif file.

### Lokasi file konfigurasi

`docs/dokploy/examples/nixpacks.toml` → salin ke `nixpacks.toml` di root repositori. Bila file dibiarkan di `docs/`, Nixpacks tidak akan pernah melihatnya.

### Port dan domain

Image nginx buatan Dokploy mendengarkan di **port 80**. Set container port domain ke `80`. Jangan set environment variable `PORT` — tidak ada yang membacanya di jalur ini, dan mencampurnya dengan port buildpack (4321) adalah kesalahan yang umum.

### Verifikasi deployment

1. Log deployment harus memuat `Starting nixpacks build...`, `✅ Nixpacks build completed.`, dan selesai tanpa `❌ Nixpacks build failed`.
2. Buka domain — QR Studio harus termuat dengan style dan preview canvas QR yang berfungsi.
3. Push perubahan kecil ke `src/`, biarkan redeploy, lalu pastikan konten baru muncul (ini membuktikan build benar-benar berjalan, bukan sekadar cache).
4. Jalur ini tidak punya route `/health`; gunakan domain itu sendiri untuk cek kesehatan, atau pindah ke build type Dockerfile bila butuh endpoint healthcheck eksplisit.

### Kelebihan dan kekurangan

- **Kelebihan:** tidak perlu Dockerfile, semua terjadi di server, `nixpacks.toml` memberi kontrol detail.
- **Kekurangan:** ada langkah Dockerfile generated yang lebih sulit direproduksi lokal; tidak ada endpoint `/health` bawaan; build berjalan di server (butuh resource besar).
- **Pakai bila:** Anda ingin alur "push and deploy" paling sederhana dan tidak butuh perilaku nginx kustom.

## Build Type: Railpack

### Cara kerja

Dokploy menjalankan `railpack prepare` lalu `docker buildx build` dengan image frontend Railpack, dan mengirim environment variable sebagai build secret. Railpack mendeteksi output statis Astro untuk repositori ini (ada `astro.config.mjs`, script `build` memuat `astro build`, tidak ada adapter Astro SSR yang terpasang, dan **tidak ada script `start` kustom**). Hasilnya adalah container yang menyajikan `dist/` dengan **Caddy** di `:{$PORT:80}`, lengkap dengan kompresi gzip/zstd, route `/health` bawaan yang mengembalikan `200`, dan fallback `try_files` ala SPA ke `index.html` untuk path tak dikenal.

### Nilai UI Dokploy

| Field | Nilai |
| ----- | ----- |
| Build Type | `Railpack` |
| Railpack Version | biarkan default (UI menampilkan default dari kode; versi yang lebih baru tersedia di dropdown) |
| Environment | tidak ada — khususnya **jangan set `PORT`** |

### Contoh konfigurasi

Opsional. Salin [`examples/railpack.json`](./examples/railpack.json) ke root repositori untuk mem-pin Node 22 secara eksplisit:

```json
{
  "$schema": "https://schema.railpack.com",
  "packages": { "node": "22" }
}
```

Tanpa file ini, Railpack membaca `engines.node` dari `package.json` (dan `.nvmrc` / `.node-version` bila ada). Environment variable yang setara adalah `RAILPACK_NODE_VERSION=22` dan, untuk kasus lain, `RAILPACK_SPA_OUTPUT_DIR`, `RAILPACK_NO_SPA`, `RAILPACK_CONFIG_FILE`.

### Lokasi file konfigurasi

`docs/dokploy/examples/railpack.json` → salin ke `railpack.json` di root repositori.

### Port dan domain

Caddy mendengarkan di **port 80** kecuali `PORT` di-set di environment. Set container port domain ke `80` dan jangan set `PORT`.

### Verifikasi deployment

1. Log deployment menampilkan `railpack prepare` / `docker buildx build` dan tidak ada eksekusi `npm start`.
2. Buka domain — halaman dan QR studio yang berjalan di sisi klien harus berfungsi.
3. `curl -I https://<domain-anda>/health` mengembalikan `200`.
4. Pastikan `package.json` masih tidak punya script `start`. Bila `start` ditambahkan kembali, Railpack berhenti memakai server statis Caddy dan menjalankan start command (lihat [Troubleshooting](#lampiran-c--troubleshooting)).
5. Path tak dikenal mengembalikan `index.html` dengan status `200` (Caddy `index_fallback`). Ini benar untuk SPA; bila butuh 404 keras, tambahkan `src/pages/404.astro` dan `Staticfile` dengan `index_fallback: false`.

### Kelebihan dan kekurangan

- **Kelebihan:** tanpa konfigurasi untuk repo ini, build BuildKit yang cepat, Caddy menambah kompresi dan `/health` gratis, tidak ada Dockerfile yang harus dirawat.
- **Kekurangan:** kontrol atas header/caching lebih sedikit dibanding jalur nginx; perilaku (fallback SPA, deteksi statis) bergantung heuristik Astro milik Railpack; build tetap berjalan di server.
- **Pakai bila:** Anda ingin container statis berkualitas produksi dengan konfigurasi paling minim.

## Build Type: Dockerfile

### Cara kerja

Dokploy menjalankan `docker build -f <Dockerfile> <context>` dengan field di bawah. Repositori menyediakan [`Dockerfile`](../../Dockerfile) dua tahap: tahap `build` memakai `node:22-alpine` untuk menjalankan `npm ci` dan `npm run build`, dan tahap `runtime` terakhir memakai `nginx:stable-alpine`, menyalin `dist/` ke `/usr/share/nginx/html`, lalu menyajikannya dengan [`nginx.conf`](../../nginx.conf). Karena tahap runtime adalah tahap terakhir, `Docker Build Stage` boleh dibiarkan kosong.

`nginx.conf` (dipasang sebagai `/etc/nginx/conf.d/default.conf`) menyediakan gzip, cache immutable jangka panjang untuk file ber-hash di `/_astro/` dan `/assets/`, `no-cache` untuk HTML, header `X-Content-Type-Options` dan `Referrer-Policy`, log ke stdout/stderr, serta endpoint `/health` yang mengembalikan `200` untuk healthcheck Dokploy/Swarm. `error_page 404 /404.html` sudah dikonfigurasi — tambahkan `src/pages/404.astro` bila ingin halaman 404 sendiri.

### Nilai UI Dokploy

| Field | Nilai |
| ----- | ----- |
| Build Type | `Dockerfile` |
| Docker File | `Dockerfile` |
| Docker Context Path | `.` (kosong juga berarti root repositori) |
| Docker Build Stage | biarkan kosong (tahap terakhir adalah image runtime) |
| Build Time Arguments / Secrets | tidak diperlukan |
| Environment | tidak diperlukan |

### Contoh perintah

Reproduksi image produksi yang persis sama secara lokal:

```bash
docker build -t qr-studio .
docker run --rm -p 8080:80 qr-studio
curl -I http://localhost:8080/
curl http://localhost:8080/health
```

### Lokasi file konfigurasi

Root repositori — [`Dockerfile`](../../Dockerfile), [`nginx.conf`](../../nginx.conf), dan [`.dockerignore`](../../.dockerignore) di-commit bersama dan hanya dipakai build type ini. `.dockerignore` menjaga `node_modules`, `dist`, `docs`, `.git`, dan file env agar tidak masuk build context. Edit `nginx.conf` di root, bukan salinannya.

### Port dan domain

nginx mendengarkan di **port 80**. Set container port domain ke `80`. Jangan set `PORT`.

### Verifikasi deployment

1. Log deployment menampilkan `✅ Docker build completed.` dan container berjalan.
2. Buka domain — aplikasi termuat dengan aset CSS/JS dari `/_astro/`.
3. `/health` mengembalikan `ok` (berguna sebagai healthcheck path Swarm/Dokploy).
4. Response header memuat `Cache-Control: public, max-age=31536000, immutable` untuk `/_astro/*` dan `Cache-Control: no-cache` untuk HTML.
5. Redeploy dan pastikan nama file aset berubah saat kode berubah (cache busting bekerja).

### Kelebihan dan kekurangan

- **Kelebihan:** sepenuhnya dapat direproduksi lokal, perilaku runtime tidak mengejutkan, nginx kustom, cocok untuk deployment CI + registry.
- **Kekurangan:** Anda merawat Dockerfile dan konfigurasi nginx; build tetap berjalan di server kecuali dibangun di CI.
- **Pakai bila:** Anda ingin deployment produksi yang bisa diuji sebelum dikirim — default yang direkomendasikan untuk proyek ini.

## Build Type: Static

### Cara kerja

Build type Static **tidak mem-build apa pun**. Dokploy mengambil direktori yang sudah ada di checkout (`Publish Directory`, yang untuk tipe ini dibiarkan kosong di UI sehingga seluruh Build Path dipakai) dan membuat image `nginx:alpine` yang menyajikannya. Bila checkbox `Single Page Application (SPA)` menyala, path tak dikenal dialihkan ke `index.html`; bila mati, file yang tidak ada dilayani sebagai 404.

Karena `dist/` di-ignore git di repositori ini, build type Static hanya masuk akal setelah Anda mempublikasikan artefak build dengan salah satu dari dua cara berikut.

#### Varian A — commit `dist/` ke branch yang di-deploy

1. Hapus `dist/` dari [`.gitignore`](../../.gitignore).
2. Jalankan `npm ci && npm run build` secara lokal.
3. Commit dan push `dist/` bersama source-nya.
4. Di Dokploy set **Build Path** ke `dist` (Dockerfile generated dibuat di dalam direktori itu dan menyalinnya).

Ini varian paling sederhana, tetapi artefak build yang di-commit membuat repositori membengkak dan bisa berbeda dari source-nya.

#### Varian B — build di CI, push `dist/` ke branch deploy (recommended)

Tambahkan workflow seperti `.github/workflows/deploy-static.yml`:

```yaml
name: Publish static build

on:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run build

      - name: Push dist/ to the deploy-static branch
        run: |
          cd dist
          git init -b deploy-static
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git commit -m "deploy: ${GITHUB_SHA::7}"
          git push --force "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git" deploy-static
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Lalu di Dokploy:

| Field | Nilai |
| ----- | ----- |
| Source | GitHub app |
| Branch | `deploy-static` |
| Build Path | `/` (root branch berisi `index.html` dan `_astro/`) |
| Build Type | `Static` |
| Single Page Application (SPA) | unchecked |

Aplikasi lalu redeploy setiap kali CI push commit baru ke `deploy-static`. Ini menjaga artefak build tetap di luar `main` dan memberi deployment tercepat.

### Lokasi file konfigurasi

Tidak ada. Dokploy membuat `Dockerfile` dan `.dockerignore` sendiri di server, di samping direktori yang disalin.

### Port dan domain

Image nginx generated mendengarkan di **port 80**. Set container port domain ke `80`.

### Verifikasi deployment

1. Log deployment tidak menampilkan instalasi paket maupun `npm run build` — itu memang wajar untuk Static.
2. Buka domain dan pastikan file yang disajikan sesuai dengan artefak yang Anda publikasikan (`index.html`, `_astro/`, `favicon*.svg`, `robots.txt`, sitemap).
3. Pastikan commit yang di-deploy adalah commit yang di-push CI ke `deploy-static`.

### Kelebihan dan kekurangan

- **Kelebihan:** deployment instan (tanpa langkah build di server), pemakaian resource minimal, cocok dengan CI apa pun.
- **Kekurangan:** tidak pernah mem-build — artefak basi atau hilang bukan error, melainkan apa yang tersaji; butuh tambahan plumbing CI.
- **Pakai bila:** Anda sudah menghasilkan `dist/` di CI dan ingin Dokploy hanya menyajikannya. Bila ingin Dokploy yang mem-build, gunakan **Nixpacks dengan `Publish Directory = dist`**.

## Build Type: Heroku Buildpacks

### Cara kerja

Dokploy menjalankan `pack build <app> --path <repo> --builder heroku/builder:<version>` (versi default `24`). Buildpack Node.js Heroku membaca `engines.node`, menginstal dependency, lalu otomatis menjalankan `heroku-prebuild`, dilanjutkan `heroku-build` atau `build`, lalu `heroku-postbuild` — sehingga `npm run build` berjalan saat image dibangun. Saat runtime, container menjalankan process type dari `Procfile`; karena repositori ini tidak punya script `start`, `Procfile` **wajib** ada.

[`examples/Procfile`](./examples/Procfile) yang disediakan menjalankan `astro preview --host`, yang menyajikan `dist/` dengan preview server Astro. Preview server Astro praktis, tetapi secara eksplisit tidak direkomendasikan untuk produksi, dan ia mendengarkan di **4321** (tidak membaca `$PORT`).

### Nilai UI Dokploy

| Field | Nilai |
| ----- | ----- |
| Build Type | `Heroku Buildpacks` |
| Heroku Version (Optional) | `24` (default) |
| Environment | `PORT=4321` (menjaga port platform dan port aplikasi tetap sinkron) |

### Contoh konfigurasi

Salin [`examples/Procfile`](./examples/Procfile) ke root repositori:

```text
web: npm run preview:host
```

### Lokasi file konfigurasi

`docs/dokploy/examples/Procfile` → `Procfile` di root repositori. File ini **tidak** boleh di-commit permanen ke root: `Procfile` di root juga mengubah perilaku Railpack/Nixpacks, jadi simpan hanya selama Anda memakai build type buildpack.

### Port dan domain

Preview server mendengarkan di port **4321**. Set container port domain ke `4321`. Set `PORT=4321` di environment Dokploy agar konvensi buildpack dan aplikasi sepakat; jangan set nilai `PORT` lain, karena `astro preview` tidak membacanya dan aplikasi akan tetap di 4321 sementara domain Anda mengarah ke tempat lain.

### Verifikasi deployment

1. Log deployment menampilkan output `pack build` dan deteksi buildpack yang berhasil (`heroku/nodejs`).
2. Container menjalankan proses `web` tanpa restart loop.
3. Buka domain pada container port 4321 — aplikasi termuat.
4. Pastikan sekali lagi bahwa ini kualitas demo: tanpa file server statis, tanpa `/health`, ada peringatan preview di log.

### Kelebihan dan kekurangan

- **Kelebihan:** build bergaya Heroku yang familiar (script dan `engines.node` dihormati), tanpa Dockerfile.
- **Kekurangan:** menjalankan `astro preview` (tidak direkomendasikan untuk produksi), butuh `Procfile` di root, memakai port 4321, output build berupa image runtime Node penuh.
- **Pakai bila:** Anda sedang bereksperimen dengan buildpack atau migrasi dari pipeline bergaya Heroku. Untuk produksi gunakan Dockerfile, Railpack, atau Nixpacks dengan `dist`.

## Build Type: Paketo Buildpacks

### Cara kerja

Dokploy menjalankan `pack build <app> --path <repo> --builder paketobuildpacks/builder-jammy-full` (tidak ada field versi). Buildpack Node.js Paketo membaca `engines.node`, tetapi **tidak** menjalankan `npm run build` secara default — Anda harus set `BP_NODE_RUN_SCRIPTS=build`. Buildpack Procfile sudah termasuk, sehingga [`examples/Procfile`](./examples/Procfile) yang sama berfungsi, dan perilaku runtime-nya sama seperti Heroku: preview server `astro preview` di port **4321**.

### Nilai UI Dokploy

| Field | Nilai |
| ----- | ----- |
| Build Type | `Paketo Buildpacks` |
| Environment | `BP_NODE_RUN_SCRIPTS=build` dan `PORT=4321` |

### Contoh konfigurasi

Salin [`examples/Procfile`](./examples/Procfile) ke root repositori:

```text
web: npm run preview:host
```

Bila build selesai tetapi `dist/` tidak ada, berarti `BP_NODE_RUN_SCRIPTS=build` belum di-set.

### Lokasi file konfigurasi

`docs/dokploy/examples/Procfile` → `Procfile` di root repositori, hanya selama build type ini dipakai (catatan yang sama seperti bagian Heroku).

### Port dan domain

Sama seperti Heroku: aplikasi mendengarkan di **4321**, jadi container port domain adalah `4321` dan `PORT=4321` sebaiknya di-set di environment.

### Verifikasi deployment

1. Log deployment menampilkan deteksi buildpack Paketo dan `pack build` yang berhasil.
2. Proses `web` dari Procfile berjalan dan tidak restart.
3. Buka domain pada container port 4321 — aplikasi termuat.
4. Perlakukan sebagai demo/eksperimen saja, persis seperti jalur Heroku.

### Kelebihan dan kekurangan

- **Kelebihan:** tooling CNB modern, dukungan `Procfile`, `engines.node` dihormati.
- **Kekurangan:** butuh `BP_NODE_RUN_SCRIPTS=build`, tanpa pilihan versi, dengan catatan runtime `astro preview` yang sama.
- **Pakai bila:** Anda memang ingin buildpack Paketo. Selain itu, pilih Dockerfile atau Railpack.

## Memilih Build Type

| Situasi | Build type yang direkomendasikan |
| ------- | -------------------------------- |
| Produksi, perilaku dapat diprediksi, caching/header kustom | **Dockerfile** (`Dockerfile` + `nginx.conf` di root) |
| Produksi dengan image hasil CI yang di-push ke registry | **Dockerfile** dengan Source Type `Docker` + image tag, atau **Static** dengan branch deploy |
| Build di server paling sederhana, tanpa Dockerfile | **Nixpacks** dengan `Publish Directory = dist` |
| Konfigurasi paling minim, builder modern | **Railpack** |
| Artefak prebuilt dari CI yang tidak boleh di-build ulang | **Static** (Varian B) |
| Eksperimen dengan buildpack Heroku/Paketo | Heroku atau Paketo, demo saja |

Untuk deployment produksi, Dokploy merekomendasikan build di luar server produksi lalu pull image yang sudah jadi dari registry: build di CI, push ke Docker Hub/GHCR, kemudian buat application dengan Source Type `Docker` dan image tag-nya, serta gunakan pengaturan Swarm untuk healthcheck dan rollback. Lihat [Going Production](https://docs.dokploy.com/docs/core/applications/going-production). Build di sisi server untuk proyek ini membutuhkan anggaran ~4 GB RAM / 2 vCPU yang disebut di UI.

## Lampiran A — Docker Compose Service

Docker Compose adalah **service type** terpisah di Dokploy, bukan build type. Ia tetap bisa mem-build repositori ini, sehingga berguna untuk pengujian lokal.

Salin [`examples/docker-compose.yml`](./examples/docker-compose.yml) ke root repositori:

```yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

- Lokal: `docker compose up --build` → <http://localhost:8080> (dan `/health` → `ok`).
- Di Dokploy: buat service **Docker Compose**, arahkan ke repositori, dan hapus blok `ports` — tambahkan **Domain** untuk service `web` dengan container port `80` agar Dokploy/Traefik merutekan trafik.
- `build:` berfungsi di mode Compose default; di mode **Stack** (Swarm) Dokploy hanya men-deploy image yang sudah jadi.
- Variabel yang diisi di tab Environment ditulis ke file `.env`, tetapi **tidak** otomatis di-inject ke container. Rujuk secara eksplisit, misalnya `environment: - FOO=${FOO}` atau entri `env_file:`. QR Studio tidak membutuhkannya.
- Bind mount harus berada di bawah `../files` pada Dokploy; jangan bind-mount file langsung dari checkout repositori.

## Lampiran B — Port dan Domain

| Build Type | Port container | Target port domain Dokploy | Catatan |
| ---------- | -------------- | -------------------------- | ------- |
| Nixpacks (Publish Directory diisi) | 80 | 80 | Image `nginx:alpine` generated |
| Railpack | 80 | 80 | Caddy; berubah bila env `PORT` di-set — jangan di-set |
| Dockerfile | 80 | 80 | `nginx:stable-alpine` dari Dockerfile root |
| Static | 80 | 80 | Image `nginx:alpine` generated |
| Heroku Buildpacks | 4321 | 4321 | `astro preview`; set `PORT=4321` |
| Paketo Buildpacks | 4321 | 4321 | `astro preview`; set `PORT=4321` |

Set target port di **Domains → Add Domain → Container Port**. Ketidakcocokan antara nilai ini dan port yang benar-benar didengarkan container menghasilkan `502 Bad Gateway` lewat Traefik walaupun container-nya sehat.

## Lampiran C — Troubleshooting

| Gejala | Penyebab dan solusi |
| ------ | ------------------- |
| Build gagal dengan error engine Node (`Unsupported engine`, `>=22.12.0`) | Builder memilih Node lama. Nixpacks: `NIXPACKS_NODE_VERSION=22`; Railpack: `RAILPACK_NODE_VERSION=22`; Heroku: `engines.node` (buildpack klasik: `NODE_VERSION`); Paketo: `BP_NODE_VERSION=22`. |
| Log Nixpacks menampilkan `❌ Copying dist to ... failed` | `Publish Directory` salah. Gunakan path relatif `dist` — tanpa `/` di awal, tanpa `/` di akhir, dan pastikan `npm run build` benar-benar membuatnya. |
| URL tak dikenal mengembalikan halaman 404 polos nginx | Umumnya wajar untuk situs Astro satu halaman dengan toggle SPA mati. Repo ini menyertakan `src/pages/404.astro` (di-build menjadi `dist/404.html`) dan `nginx.conf` menyajikannya lewat `error_page 404`; nyalakan `Single Page Application (SPA)` (Nixpacks/Static) bila lebih suka fallback `index.html`. |
| URL tak dikenal mengembalikan aplikasi dengan status 200 | Caddy milik Railpack memakai `index_fallback: true` secara default. Tambahkan `Staticfile` dengan `index_fallback: false` bila ingin 404 sebenarnya. |
| Railpack tiba-tiba menjalankan preview/start server alih-alih menyajikan file statis | Script `start` ditambahkan kembali ke `package.json` (atau ada `deploy.startCommand`). Hapus `start`; pertahankan `preview:host`. |
| Deployment buildpack menyajikan preview server Astro | Memang begitulah jalur Heroku/Paketo di sini. Keduanya kualitas demo; gunakan Dockerfile, Railpack, atau Nixpacks + `dist` untuk produksi. |
| Decoder kamera/webcam tidak berfungsi di situs yang di-deploy | Kamera butuh secure context. Sajikan aplikasi lewat HTTPS (aktifkan HTTPS di domain Dokploy) atau via `localhost`. |
| `robots.txt` dan sitemap masih mengarah ke `example.com` | `site` di `astro.config.mjs` dan/atau `public/robots.txt` masih berisi placeholder lama; di repo keduanya sudah di-set ke `https://qr.numaya.my.id`. Perbarui bila domain deployment Anda berbeda. |
| Domain mengembalikan `502 Bad Gateway` | Container port domain tidak cocok dengan port aplikasi (80 untuk nginx/Caddy, 4321 untuk buildpack), atau container tidak berjalan. |
| Build Static tidak menyajikan apa pun / 404 untuk `/` | Build Path yang dipilih tidak berisi `index.html`. Gunakan `dist` bila meng-commit output, atau `/` untuk branch deploy khusus. |
| Container Nixpacks/Railpack/Static tiba-tiba berubah port | Ada env var `PORT` yang di-set. Hapus kecuali Anda memakai buildpack; Caddy dan image nginx generated Dokploy mematuhinya. |

## Lampiran D — Referensi

Dokploy:

- [Build Type](https://docs.dokploy.com/docs/core/applications/build-type)
- [Applications](https://docs.dokploy.com/docs/core/applications)
- [Going Production](https://docs.dokploy.com/docs/core/applications/going-production)
- [Domains](https://docs.dokploy.com/docs/core/domains)
- [Auto Deploy](https://docs.dokploy.com/docs/core/auto-deploy)
- [Watch Paths](https://docs.dokploy.com/docs/core/watch-paths)
- [Docker Compose](https://docs.dokploy.com/docs/core/docker-compose)
- [Panduan Dokploy + Astro](https://docs.dokploy.com/docs/core/astro)

Builder:

- [Dokumentasi Railpack](https://railpack.com) dan [railwayapp/railpack](https://github.com/railwayapp/railpack)
- [File konfigurasi Nixpacks](https://nixpacks.com/docs/configuration/file) dan [Node provider](https://nixpacks.com/docs/providers/node)
- [heroku/heroku-buildpack-nodejs](https://github.com/heroku/heroku-buildpack-nodejs)
- [paketo-buildpacks/nodejs](https://github.com/paketo-buildpacks/nodejs) dan [Panduan Node.js Paketo](https://paketo.io/docs/howto/nodejs/)

File proyek:

- [`Dockerfile`](../../Dockerfile), [`nginx.conf`](../../nginx.conf), [`.dockerignore`](../../.dockerignore)
- [`examples/nixpacks.toml`](./examples/nixpacks.toml), [`examples/railpack.json`](./examples/railpack.json), [`examples/Procfile`](./examples/Procfile), [`examples/docker-compose.yml`](./examples/docker-compose.yml)
