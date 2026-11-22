# Worko — official website

Light, interactive product site for [Worko](https://github.com/gyuv/worko-office): feature tour, live quick-add demo, screenshots, modules, architecture and **downloads that always point at the latest release**.

## How downloads work
`assets/js/main.js` reads the GitHub Releases API and picks the newest `.exe`, `.dmg` (arm64 / Intel) and `.apk`:

1. `gyuv/workooffice-official` releases (public mirror) — used first
2. `gyuv/worko-office` releases — fallback while that repo is public

If neither answers, the buttons open the releases page.

### Keeping the source repo private
`.github/workflows/sync-releases.yml` copies installers from the private repo into this repo's releases every 6 hours (or on demand):

1. Create a fine-grained PAT with **Contents: Read** on `gyuv/worko-office`.
2. Save it here as the Actions secret `SOURCE_REPO_TOKEN`.
3. Run **Actions → Sync releases from source** once.

## Hosting
`.github/workflows/pages.yml` deploys to GitHub Pages on every push to `main` (enable Pages → Source: *GitHub Actions*). Any static host works too — just serve the repo root.

Local preview: `python3 -m http.server` then open http://localhost:8000.
