# Dokploy Build Types — QR Studio Deployment Guide

🇮🇩 Versi Bahasa Indonesia: [README-ID.md](./README-ID.md)

Dokploy can build this repository in six different ways. Each of these is called a **Build Type** and they differ in how the image is produced, which port the app listens on, and how much configuration is required. This guide gives the exact Dokploy field values for QR Studio, explains what each build type does under the hood, and shows how to verify a deployment.

Official reference: [Dokploy — Build Type](https://docs.dokploy.com/docs/core/applications/build-type).

At a glance for this project:

- **Recommended for production:** Dockerfile — [`Dockerfile`](../../Dockerfile) + [`nginx.conf`](../../nginx.conf) in the repository root.
- **Easiest server-side build:** Nixpacks with `Publish Directory = dist`.
- **Zero-config option:** Railpack (works because `package.json` has no custom `start` script).
- **Buildpacks (Heroku/Paketo) and Static have caveats** — read their sections before choosing them.

## Build Type Overview

Dokploy's build type enum has exactly six values: `dockerfile`, `heroku_buildpacks`, `paketo_buildpacks`, `nixpacks`, `static`, and `railpack`.

| Build Type | What it does | Resulting runtime | Verdict for QR Studio |
| ---------- | ------------ | ----------------- | --------------------- |
| **Nixpacks** (default) | Runs `nixpacks build` on the Dokploy server. When `Publish Directory` is set, Dokploy copies that directory to the host and generates an `nginx:alpine` image that serves it. | `nginx:alpine`, port **80** | Easy, fully server-side build. Good default when you do not want a Dockerfile. |
| **Railpack** | Runs `railpack prepare` + `docker buildx build` with the Railpack frontend. Detects an Astro static site and serves the output with **Caddy**. | Caddy static server, port **80** | Zero config after the repo's `package.json`/`engines` changes. |
| **Dockerfile** | Plain `docker build` using a Dockerfile from the repository. | Whatever the Dockerfile defines — here `nginx:stable-alpine`, port **80** | **Recommended for production.** Predictable, testable locally. |
| **Static** | **No build at all.** Copies a directory from the repository into a fresh `nginx:alpine` image. | `nginx:alpine`, port **80** | Only useful with prebuilt artifacts (e.g. `dist/` produced by CI). |
| **Heroku Buildpacks** | `pack build <app> --builder heroku/builder:<version>`; build scripts run automatically. | Container runs the `Procfile` web process (`astro preview`), port **4321** | Demo/experiment only — serves the Astro preview server, not production static hosting. |
| **Paketo Buildpacks** | `pack build <app> --builder paketobuildpacks/builder-jammy-full`. | Same as Heroku — `Procfile` web process (`astro preview`), port **4321** | Demo/experiment only. |

### Field value cheat sheet

| Build Type | Field values in Dokploy | Repository files used | Container port |
| ---------- | ----------------------- | --------------------- | -------------- |
| Nixpacks | `Publish Directory`: `dist`; `Single Page Application (SPA)`: unchecked | Root `Dockerfile` is **not** used. Optional [`examples/nixpacks.toml`](./examples/nixpacks.toml) (copy to root to activate) | 80 |
| Railpack | `Railpack Version`: leave default; **do not** set env `PORT` | Optional [`examples/railpack.json`](./examples/railpack.json) (copy to root to activate) | 80 |
| Dockerfile | `Docker File`: `Dockerfile`; `Docker Context Path`: `.`; `Docker Build Stage`: empty | Root [`Dockerfile`](../../Dockerfile) + [`nginx.conf`](../../nginx.conf) + [`.dockerignore`](../../.dockerignore) | 80 |
| Static | `Single Page Application (SPA)`: unchecked | None (prebuilt directory — see the two variants below) | 80 |
| Heroku Buildpacks | `Heroku Version (Optional)`: `24`; env `PORT=4321` | [`examples/Procfile`](./examples/Procfile) (copy to root to activate) | 4321 |
| Paketo Buildpacks | env `BP_NODE_RUN_SCRIPTS=build` and `PORT=4321` | [`examples/Procfile`](./examples/Procfile) (copy to root to activate) | 4321 |

> Builder resource warning from the Dokploy UI: building on the server needs roughly **4 GB RAM and 2 CPU cores**. For production, prefer building in CI and pulling a ready image — see [Going Production](https://docs.dokploy.com/docs/core/applications/going-production).

## Project Profile

Use this table when filling in Dokploy fields. All values come from this repository.

| Item | Value |
| ---- | ----- |
| Framework | Astro 7, default static output (no adapter), single page `src/pages/index.astro` |
| Package manager | npm with `package-lock.json` |
| Node.js | `engines.node` = `>=22.12.0` (required by `@astrojs/react` 6, which needs Node ≥ 22.12) |
| Build command | `npm run build` → `dist/` plus `dist/sitemap-index.xml` and `dist/sitemap-0.xml` |
| Publish directory | `dist` |
| Runtime env vars | none |
| Backend / database / auth | none — everything runs in the browser |
| Production port | 80 for nginx/Caddy paths; 4321 for the buildpack `astro preview` path |
| Scripts | `dev`, `build`, `preview`, `preview:host` — there is deliberately **no `start` script** (Railpack would otherwise run it instead of serving static files) |

## Prerequisites

1. A running Dokploy instance with at least one server (local or remote) connected.
2. The repository reachable from Dokploy: GitHub/GitLab/Bitbucket/Gitea app, a public Git URL, or a `drop` upload.
3. A domain (or subdomain) pointing to the Dokploy server, ideally with automatic HTTPS enabled.
4. Enough server resources for a server-side build: ~4 GB RAM and 2 CPU cores.
5. HTTPS in production: the webcam decoder needs a secure context (`https://`), otherwise the camera cannot be opened.
6. Before going live, replace the placeholders — `site` in `astro.config.mjs` and the `robots.txt` sitemap URL still point to `https://example.com` (not changed by this documentation task).
7. Node.js ≥ 22.12 everywhere a build runs. The `engines.node` field is read by Nixpacks, Railpack, Heroku, and Paketo; if a builder still picks an older Node, set its version env (see [Troubleshooting](#appendix-c--troubleshooting)).

## Shared Dokploy Setup

These steps are the same for every build type; the build-type section afterwards only fills in the build fields.

1. Create (or open) a **Project**, then click **Create Service → Application**.
2. Give the application a name (for example `qr-studio`) and pick the server that will run it.
3. Open the **General** tab and connect the source: GitHub App, Git (repository URL + credentials), GitLab, Bitbucket, Gitea, or Drop.
4. Set the **Branch** to `main` (or the branch you deploy from).
5. Open the **Build Type** tab and select the build type from the section you chose below; fill the extra fields exactly as listed there.
6. Open the **Environment** tab and add only the variables required by that build type. QR Studio itself needs none.
7. Open the **Domains** tab, click **Add Domain**, enter the hostname, keep path `/`, and set **Container Port** to the port listed for your build type (80 or 4321). Enable HTTPS.
8. Click **Deploy** and watch the deployment logs until the container is running.
9. Optional: enable **Auto Deploy** (GitHub webhook) and configure **Watch Paths** so unrelated changes (for example `docs/**`) do not trigger rebuilds.

## Build Type: Nixpacks

### How it works

Dokploy runs `nixpacks build <repo> --name <app>`. Nixpacks detects Node from `package-lock.json` / `engines.node`, installs dependencies, and runs `npm run build`. Because `Publish Directory` is set, Dokploy adds `--no-error-without-start`, starts a throwaway container from the built image, copies `dist` out of it with `docker cp`, then generates a small `FROM nginx:alpine` Dockerfile that serves that directory. With the `Single Page Application (SPA)` checkbox off, the generated image uses nginx's default static configuration (missing paths are 404s); with it on, unknown paths fall back to `index.html`.

### Dokploy UI values

| Field | Value |
| ----- | ----- |
| Build Type | `Nixpacks` |
| Build Path | `/` (default) |
| Publish Directory | `dist` |
| Single Page Application (SPA) | unchecked |
| Environment | none required; optional `NIXPACKS_NODE_VERSION=22` if Node is detected incorrectly |

### Example configuration

The file is optional — Nixpacks already detects `npm ci` + `npm run build` for this project. Copy [`examples/nixpacks.toml`](./examples/nixpacks.toml) to the repository root to pin Node and the phases explicitly:

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

Note that `nixPkgs` **replaces** the default setup packages, so keep it as-is unless you know which packages you need. Nixpacks also reads `NIXPACKS_*` environment variables instead of a file.

### Where the config file goes

`docs/dokploy/examples/nixpacks.toml` → copy to `nixpacks.toml` in the repository root. If the file stays in `docs/`, Nixpacks never sees it.

### Port and domain

Dokploy's generated nginx image listens on **port 80**. Set the domain container port to `80`. Do not set a `PORT` environment variable — nothing in this path reads it, and confusing it with the buildpack port (4321) is a common mistake.

### Verify the deployment

1. The deployment log must contain `Starting nixpacks build...`, `✅ Nixpacks build completed.`, and finish without `❌ Nixpacks build failed`.
2. Open the domain — QR Studio should load with styles and the QR preview canvas working.
3. Push a small change to `src/`, let it redeploy, and confirm the new content appears (this proves the build ran, not just the cache).
4. This path has no `/health` route; use the domain itself to check health, or switch to the Dockerfile build type if you need an explicit healthcheck endpoint.

### Pros and cons

- **Pros:** no Dockerfile needed, everything happens server-side, `nixpacks.toml` gives fine-grained control.
- **Cons:** an extra generated-Dockerfile step that is harder to reproduce locally; no built-in `/health` endpoint; build runs on the server (resource-heavy).
- **Use when:** you want the simplest "push and deploy" flow and do not need custom nginx behavior.

## Build Type: Railpack

### How it works

Dokploy runs `railpack prepare` and then `docker buildx build` with the Railpack frontend image, passing environment variables as build secrets. Railpack detects Astro static output for this repository (an `astro.config.mjs` exists, the `build` script contains `astro build`, no Astro SSR adapter is installed, and there is **no custom `start` script**). The result is a container that serves `dist/` with **Caddy** on `:{$PORT:80}`, with gzip/zstd compression, a built-in `/health` route returning `200`, and `try_files` SPA-style fallback to `index.html` for unknown paths.

### Dokploy UI values

| Field | Value |
| ----- | ----- |
| Build Type | `Railpack` |
| Railpack Version | leave the default (the UI shows the code default; newer versions are listed in the dropdown) |
| Environment | none — in particular **do not set `PORT`** |

### Example configuration

Optional. Copy [`examples/railpack.json`](./examples/railpack.json) to the repository root to pin Node 22 explicitly:

```json
{
  "$schema": "https://schema.railpack.com",
  "packages": { "node": "22" }
}
```

Without this file, Railpack reads `engines.node` from `package.json` (and `.nvmrc` / `.node-version` if present). The equivalent environment variables are `RAILPACK_NODE_VERSION=22` and, for other cases, `RAILPACK_SPA_OUTPUT_DIR`, `RAILPACK_NO_SPA`, `RAILPACK_CONFIG_FILE`.

### Where the config file goes

`docs/dokploy/examples/railpack.json` → copy to `railpack.json` in the repository root.

### Port and domain

Caddy listens on **port 80** unless `PORT` is set in the environment. Set the domain container port to `80` and do not set `PORT`.

### Verify the deployment

1. The deployment log shows `railpack prepare` / `docker buildx build` and no `npm start` execution.
2. Open the domain — the page and the client-side QR studio must work.
3. `curl -I https://<your-domain>/health` returns `200`.
4. Confirm `package.json` still has no `start` script. If `start` is reintroduced, Railpack stops using the Caddy static server and runs the start command instead (see [Troubleshooting](#appendix-c--troubleshooting)).
5. Unknown paths return `index.html` with status `200` (Caddy `index_fallback`). This is correct for an SPA; if you need hard 404s, add `src/pages/404.astro` and a `Staticfile` with `index_fallback: false`.

### Pros and cons

- **Pros:** zero configuration for this repo, fast BuildKit builds, Caddy adds compression and `/health` for free, no Dockerfile to maintain.
- **Cons:** less control over headers/caching than the nginx path; behavior (SPA fallback, static detection) depends on Railpack's Astro heuristics; still a server-side build.
- **Use when:** you want a production-quality static container with the least configuration.

## Build Type: Dockerfile

### How it works

Dokploy runs `docker build -f <Dockerfile> <context>` with the fields below. The repository ships a two-stage [`Dockerfile`](../../Dockerfile): the `build` stage uses `node:22-alpine` to run `npm ci` and `npm run build`, and the final `runtime` stage uses `nginx:stable-alpine`, copies `dist/` into `/usr/share/nginx/html`, and serves it with [`nginx.conf`](../../nginx.conf). Because the runtime stage is the last stage, `Docker Build Stage` can stay empty.

`nginx.conf` (mounted as `/etc/nginx/conf.d/default.conf`) provides gzip, long-lived immutable caching for hashed `/_astro/` and `/assets/` files, `no-cache` for HTML, `X-Content-Type-Options` and `Referrer-Policy` headers, logs to stdout/stderr, and a `/health` endpoint returning `200` for Dokploy/Swarm healthchecks. `error_page 404 /404.html` is configured — add `src/pages/404.astro` if you want a branded 404 page.

### Dokploy UI values

| Field | Value |
| ----- | ----- |
| Build Type | `Dockerfile` |
| Docker File | `Dockerfile` |
| Docker Context Path | `.` (empty also defaults to the repository root) |
| Docker Build Stage | leave empty (the last stage is the runtime image) |
| Build Time Arguments / Secrets | none needed |
| Environment | none needed |

### Example commands

Reproduce the exact production image locally:

```bash
docker build -t qr-studio .
docker run --rm -p 8080:80 qr-studio
curl -I http://localhost:8080/
curl http://localhost:8080/health
```

### Where the config files go

Root of the repository — [`Dockerfile`](../../Dockerfile), [`nginx.conf`](../../nginx.conf), and [`.dockerignore`](../../.dockerignore) are committed together and are only used by this build type. The `.dockerignore` keeps `node_modules`, `dist`, `docs`, `.git`, and env files out of the build context. Edit `nginx.conf` in the root, not a copy.

### Port and domain

nginx listens on **port 80**. Set the domain container port to `80`. Do not set `PORT`.

### Verify the deployment

1. The deployment log shows `✅ Docker build completed.` and the container starts.
2. Open the domain — the app loads with CSS/JS assets served from `/_astro/`.
3. `/health` returns `ok` (useful as a Swarm/Dokploy healthcheck path).
4. Response headers include `Cache-Control: public, max-age=31536000, immutable` for `/_astro/*` and `Cache-Control: no-cache` for HTML.
5. Redeploy and confirm the asset filenames change when the code changes (cache busting works).

### Pros and cons

- **Pros:** fully reproducible locally, no build on the server at runtime surprises, custom nginx behavior, works with CI + registry image deployments.
- **Cons:** you maintain the Dockerfile and nginx config; the build still runs on the server unless you build in CI.
- **Use when:** you want a production deployment you can test before shipping — the recommended default for this project.

## Build Type: Static

### How it works

The Static build type **does not build anything**. Dokploy takes a directory that already exists in the checkout (`Publish Directory`, which the UI leaves empty for this type so the whole Build Path is used) and generates an `nginx:alpine` image that serves it. If the `Single Page Application (SPA)` checkbox is on, unknown paths fall back to `index.html`; if it is off, nginx serves missing files as 404s.

Because `dist/` is git-ignored in this repository, the Static build type only makes sense after you publish build artifacts in one of these two ways.

#### Variant A — commit `dist/` to the deployed branch

1. Remove `dist/` from [`.gitignore`](../../.gitignore).
2. Run `npm ci && npm run build` locally.
3. Commit and push `dist/` together with the source.
4. In Dokploy set **Build Path** to `dist` (the generated Dockerfile is created inside that directory and copies it).

This is the simplest variant, but committed build artifacts bloat the repository and can drift from the source.

#### Variant B — build in CI, push `dist/` to a deploy branch (recommended)

Add a workflow such as `.github/workflows/deploy-static.yml`:

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

Then in Dokploy:

| Field | Value |
| ----- | ----- |
| Source | GitHub app |
| Branch | `deploy-static` |
| Build Path | `/` (the branch root contains `index.html` and `_astro/`) |
| Build Type | `Static` |
| Single Page Application (SPA) | unchecked |

The app then redeploys whenever CI pushes a new commit to `deploy-static`. This keeps build artifacts out of `main` and gives the fastest possible deploys.

### Where the config files go

None. Dokploy creates its own `Dockerfile` and `.dockerignore` next to the copied directory on the server.

### Port and domain

The generated nginx image listens on **port 80**. Set the domain container port to `80`.

### Verify the deployment

1. The deployment log shows no package install and no `npm run build` — that is expected for Static.
2. Open the domain and confirm the files match the artifact you published (`index.html`, `_astro/`, `favicon*.svg`, `robots.txt`, sitemaps).
3. Confirm the deployed commit is the one CI pushed to `deploy-static`.

### Pros and cons

- **Pros:** instant deploys (no build step on the server), minimal resource use, works with any CI.
- **Cons:** it never builds — a stale or missing artifact is not an error, it is simply what gets served; requires extra CI plumbing.
- **Use when:** you already produce `dist/` in CI and want Dokploy to only serve it. If you want Dokploy to build for you, use **Nixpacks with `Publish Directory = dist`** instead.

## Build Type: Heroku Buildpacks

### How it works

Dokploy runs `pack build <app> --path <repo> --builder heroku/builder:<version>` (default version `24`). The Heroku Node.js buildpack reads `engines.node`, installs dependencies, and automatically runs `heroku-prebuild`, then `heroku-build` or `build`, then `heroku-postbuild` — so `npm run build` executes during the image build. At runtime the container runs the process type from the `Procfile`; because this repository has no `start` script, a `Procfile` is **required**.

The supplied [`examples/Procfile`](./examples/Procfile) starts `astro preview --host`, which serves `dist/` with Astro's preview server. Astro's preview server is convenient but explicitly not recommended for production, and it listens on **4321** (it does not read `$PORT`).

### Dokploy UI values

| Field | Value |
| ----- | ----- |
| Build Type | `Heroku Buildpacks` |
| Heroku Version (Optional) | `24` (default) |
| Environment | `PORT=4321` (keeps the platform port and the app port in sync) |

### Example configuration

Copy [`examples/Procfile`](./examples/Procfile) to the repository root:

```text
web: npm run preview:host
```

### Where the config file goes

`docs/dokploy/examples/Procfile` → `Procfile` in the repository root. This file must **not** be committed permanently to the root: a root `Procfile` also changes Railpack/Nixpacks behavior, so keep it only while you actively use a buildpack build type.

### Port and domain

The preview server listens on port **4321**. Set the domain container port to `4321`. Set `PORT=4321` in the Dokploy environment so the buildpack convention and the app agree; do not set a different `PORT` value, since `astro preview` does not read it and the app would stay on 4321 while your domain pointed elsewhere.

### Verify the deployment

1. The deployment log shows the `pack build` output and a successful buildpack detection (`heroku/nodejs`).
2. The container starts the `web` process without restart loops.
3. Open the domain on container port 4321 — the app loads.
4. Confirm again that this is demo-grade: no static file server, no `/health`, preview warnings in the logs.

### Pros and cons

- **Pros:** familiar Heroku-style build (scripts and `engines.node` are honored), no Dockerfile.
- **Cons:** runs `astro preview` (not recommended for production), needs a root `Procfile`, uses port 4321, all build output is a full Node runtime image.
- **Use when:** you are experimenting with buildpacks or migrating from a Heroku-style pipeline. For production use the Dockerfile, Railpack, or Nixpacks with `dist`.

## Build Type: Paketo Buildpacks

### How it works

Dokploy runs `pack build <app> --path <repo> --builder paketobuildpacks/builder-jammy-full` (there is no version field). Paketo's Node.js buildpack reads `engines.node`, but it does **not** run `npm run build` by default — you must set `BP_NODE_RUN_SCRIPTS=build`. The Procfile buildpack is included, so the same [`examples/Procfile`](./examples/Procfile) works, and the runtime behavior is the same `astro preview` server on port **4321** as with Heroku.

### Dokploy UI values

| Field | Value |
| ----- | ----- |
| Build Type | `Paketo Buildpacks` |
| Environment | `BP_NODE_RUN_SCRIPTS=build` and `PORT=4321` |

### Example configuration

Copy [`examples/Procfile`](./examples/Procfile) to the repository root:

```text
web: npm run preview:host
```

If the build completes but `dist/` is missing, `BP_NODE_RUN_SCRIPTS=build` was not set.

### Where the config file goes

`docs/dokploy/examples/Procfile` → `Procfile` in the repository root, only while this build type is in use (see the Heroku section for the same caveat).

### Port and domain

Same as Heroku: the app listens on **4321**, so the domain container port is `4321` and `PORT=4321` should be set in the environment.

### Verify the deployment

1. The deployment log shows Paketo buildpack detection and a successful `pack build`.
2. The `web` process starts from the Procfile and does not restart.
3. Open the domain on container port 4321 — the app loads.
4. Treat it as demo/experiment only, exactly like the Heroku path.

### Pros and cons

- **Pros:** modern CNB tooling, `Procfile` support, `engines.node` honored.
- **Cons:** requires `BP_NODE_RUN_SCRIPTS=build`, no version selector, same `astro preview` runtime caveats.
- **Use when:** you specifically want Paketo buildpacks. Otherwise prefer the Dockerfile or Railpack.

## Choosing a Build Type

| Situation | Recommended build type |
| --------- | ---------------------- |
| Production, predictable behavior, custom caching/headers | **Dockerfile** (root `Dockerfile` + `nginx.conf`) |
| Production with CI-built images pushed to a registry | **Dockerfile** with Source Type `Docker` + image tag, or **Static** with a deploy branch |
| Simplest server-side build, no Dockerfile | **Nixpacks** with `Publish Directory = dist` |
| Least configuration, modern builder | **Railpack** |
| Prebuilt artifacts from CI that must not be rebuilt | **Static** (Variant B) |
| Experimenting with Heroku/Paketo buildpacks | Heroku or Paketo, demo only |

For production deployments Dokploy recommends building outside the production server and pulling a ready image from a registry: build in CI, push to Docker Hub/GHCR, then create an application with Source Type `Docker` and the image tag, and use Swarm settings for healthchecks and rollbacks. See [Going Production](https://docs.dokploy.com/docs/core/applications/going-production). Server-side builds of this project need the ~4 GB RAM / 2 vCPU budget mentioned in the UI.

## Appendix A — Docker Compose Service

Docker Compose is a separate **service type** in Dokploy, not a build type. It can still build this repository, which makes it handy for local testing.

Copy [`examples/docker-compose.yml`](./examples/docker-compose.yml) to the repository root:

```yaml
services:
  web:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

- Local: `docker compose up --build` → <http://localhost:8080> (and `/health` → `ok`).
- In Dokploy: create a **Docker Compose** service, point it at the repository, and remove the `ports` block — add a **Domain** for the `web` service with container port `80` instead, so Dokploy/Traefik routes traffic.
- `build:` works in the default Compose mode; in **Stack** (Swarm) mode Dokploy only deploys prebuilt images.
- Variables entered on the Environment tab are written to a `.env` file, but they are **not** injected into containers automatically. Reference them explicitly, for example `environment: - FOO=${FOO}` or an `env_file:` entry. QR Studio needs none.
- Bind mounts must live under `../files` in Dokploy; never bind-mount files from the repository checkout directly.

## Appendix B — Ports and Domains

| Build Type | Container port | Dokploy domain target port | Notes |
| ---------- | -------------- | -------------------------- | ----- |
| Nixpacks (Publish Directory set) | 80 | 80 | Generated `nginx:alpine` image |
| Railpack | 80 | 80 | Caddy; changes if env `PORT` is set — do not set it |
| Dockerfile | 80 | 80 | `nginx:stable-alpine` from the root Dockerfile |
| Static | 80 | 80 | Generated `nginx:alpine` image |
| Heroku Buildpacks | 4321 | 4321 | `astro preview`; set `PORT=4321` |
| Paketo Buildpacks | 4321 | 4321 | `astro preview`; set `PORT=4321` |

Set the target port in **Domains → Add Domain → Container Port**. A mismatch between this value and the port the container actually listens on produces a `502 Bad Gateway` through Traefik even though the container is healthy.

## Appendix C — Troubleshooting

| Symptom | Cause and fix |
| ------- | ------------- |
| Build fails with a Node engine error (`Unsupported engine`, `>=22.12.0`) | The builder picked an older Node. Nixpacks: `NIXPACKS_NODE_VERSION=22`; Railpack: `RAILPACK_NODE_VERSION=22`; Heroku: `engines.node` (classic buildpack: `NODE_VERSION`); Paketo: `BP_NODE_VERSION=22`. |
| Nixpacks log shows `❌ Copying dist to ... failed` | `Publish Directory` is wrong. Use the relative path `dist` — no leading `/`, no trailing `/`, and make sure `npm run build` actually creates it. |
| Unknown URLs return nginx's plain 404 page | Expected for a single-page Astro site with the SPA toggle off. Enable `Single Page Application (SPA)` (Nixpacks/Static) if you want `index.html` fallback, or add a `src/pages/404.astro`. |
| Unknown URLs return the app with status 200 | Railpack's Caddy serves `index_fallback: true` by default. Add a `Staticfile` with `index_fallback: false` if you want real 404s. |
| Railpack suddenly runs a preview/start server instead of serving static files | A `start` script was added back to `package.json` (or `deploy.startCommand` exists). Remove `start`; keep `preview:host`. |
| Buildpack deployment serves the Astro preview server | That is how the Heroku/Paketo paths work here. They are demo-grade; use Dockerfile, Railpack, or Nixpacks + `dist` for production. |
| Camera/webcam decoder does not work on the deployed site | The camera needs a secure context. Serve the app over HTTPS (enable HTTPS on the Dokploy domain) or via `localhost`. |
| `robots.txt` and sitemap point to `example.com` | `astro.config.mjs` `site` and `public/robots.txt` still contain the placeholder. Replace both with the production domain before go-live. |
| Domain returns `502 Bad Gateway` | Domain container port does not match the app port (80 for nginx/Caddy, 4321 for buildpacks), or the container is not running. |
| Static build serves nothing / 404 for `/` | The selected Build Path does not contain `index.html`. Use `dist` when committing the output, or `/` for a dedicated deploy branch. |
| Nixpacks/Railpack/Static container changed ports unexpectedly | A `PORT` env var is set. Remove it unless you are using a buildpack; Caddy and Dokploy's generated nginx images honor it. |

## Appendix D — References

Dokploy:

- [Build Type](https://docs.dokploy.com/docs/core/applications/build-type)
- [Applications](https://docs.dokploy.com/docs/core/applications)
- [Going Production](https://docs.dokploy.com/docs/core/applications/going-production)
- [Domains](https://docs.dokploy.com/docs/core/domains)
- [Auto Deploy](https://docs.dokploy.com/docs/core/auto-deploy)
- [Watch Paths](https://docs.dokploy.com/docs/core/watch-paths)
- [Docker Compose](https://docs.dokploy.com/docs/core/docker-compose)
- [Dokploy + Astro guide](https://docs.dokploy.com/docs/core/astro)

Builders:

- [Railpack documentation](https://railpack.com) and [railwayapp/railpack](https://github.com/railwayapp/railpack)
- [Nixpacks configuration file](https://nixpacks.com/docs/configuration/file) and [Node provider](https://nixpacks.com/docs/providers/node)
- [heroku/heroku-buildpack-nodejs](https://github.com/heroku/heroku-buildpack-nodejs)
- [paketo-buildpacks/nodejs](https://github.com/paketo-buildpacks/nodejs) and [Paketo Node.js how-to](https://paketo.io/docs/howto/nodejs/)

Project files:

- [`Dockerfile`](../../Dockerfile), [`nginx.conf`](../../nginx.conf), [`.dockerignore`](../../.dockerignore)
- [`examples/nixpacks.toml`](./examples/nixpacks.toml), [`examples/railpack.json`](./examples/railpack.json), [`examples/Procfile`](./examples/Procfile), [`examples/docker-compose.yml`](./examples/docker-compose.yml)
