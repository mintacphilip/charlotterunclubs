# Charlotte Run Clubs (GitHub Pages)

Mobile-first run club listing app that serves static files from `docs/` and uses a daily GitHub Actions job to scrape:

- https://www.charlotterunningclub.org/Run-Clubs

Daily job writes refreshed data to:

- `docs/data/run-clubs.json`

## File hierarchy

- `docs/` app UI (`index.html`, `styles.css`, `app.js`)
- `docs/assets/clubs/` thumbnail icons/images
- `docs/data/run-clubs.json` scraped run club data used by the app
- `scripts/scrape-run-clubs.mjs` scraper used locally + by GitHub Actions
- `.github/workflows/update-run-clubs.yml` daily scheduled data refresh

## Local commands

Install dependencies:

```bash
npm install
```

Run scraper manually:

```bash
npm run scrape
```

Preview site locally (any static server):

```bash
python3 -m http.server 5500
```

Open `http://localhost:5500/docs/`.

## GitHub setup (free hosting)

1. Push this repo to GitHub.
2. In GitHub repo, go to `Settings -> Pages`.
3. Under `Build and deployment`:
   - `Source`: `Deploy from a branch`
   - `Branch`: `main`
   - `Folder`: `/docs`
4. Save and wait for Pages URL.

## Daily data refresh automation

Workflow file already included:

- `.github/workflows/update-run-clubs.yml`

It runs daily at `09:15 UTC` (about `5:15 AM ET` during daylight time) and can also be run manually (`workflow_dispatch`).

## Custom domain (GoDaddy)

1. In GitHub: `Settings -> Pages -> Custom domain`, enter your domain.
2. Add DNS records in GoDaddy:
   - `A` host `@` -> `185.199.108.153`
   - `A` host `@` -> `185.199.109.153`
   - `A` host `@` -> `185.199.110.153`
   - `A` host `@` -> `185.199.111.153`
   - `CNAME` host `www` -> `<your-github-username>.github.io`
3. Keep your email records (MX/SPF/DKIM/DMARC) unchanged.
4. Back in GitHub Pages, enable `Enforce HTTPS` once cert is issued.
