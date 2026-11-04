# Climate Mapping

An interactive map of township-level climate hazard projections for Myanmar, using data from the Climate Futures Myanmar modelling team. Choose a hazard, indicator, time period and emissions scenario to colour all townships on the map, then open any township to see its projections as a chart, table and written summary.

Built with React 19, Vite and the [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/) 5.1, adapted from NOAA's [Climate Mapping for Resilience and Adaptation](https://resilience.climate.gov/) assessment tool.

- **Repository:** [git.cde.unibe.ch/OneMapMyanmar/climate-futures-hazards](https://git.cde.unibe.ch/OneMapMyanmar/climate-futures-hazards)
- **Site:** hazards.climatefutures-mm.org (password-protected until the official release)

## Indicators

| Hazard | Indicator | ID | Unit |
|---|---|---|---|
| Extreme heat | Hot-season days with maximum temperature above 40°C | `D40C` | days |
| Extreme heat | Days with wet-bulb temperature above 28°C | `WBT28` | days per year |
| Drought | Drought intensity from the 6-month Standardized Precipitation Evapotranspiration Index | `SPEI6` | SPEI (0 = no drought, more negative = more severe) |

Each indicator has values for three periods and two scenarios:

| Period | Years | Scenarios |
|---|---|---|
| Present baseline | 1981–2010 | — |
| Near future | 2031–2060 | SSP2-4.5, SSP5-8.5 |
| Far future | 2071–2100 | SSP2-4.5, SSP5-8.5 |

For each township, period and scenario, the app shows the 30-year **mean** and the range from the lowest (**min**) to the highest (**max**) single year.

## Data

> **The township data is preliminary and unpublished, and is not included in this repository.** Do not commit or distribute it without the data owners' permission. `.gitignore` excludes `/data-build` and `public/data/myanmar/*.geojson`.

The app reads a single file, `public/data/myanmar/townships.geojson`, which holds the township boundaries and every indicator value. The data is planned to come from an API later; until then, two scripts build the file:

```
Source workbooks (.xlsx, one per indicator)
  │  scripts/build_myanmar_indicator.py
  ▼
data-build/myanmar/<id>.json (+ .csv)      30-year min / mean / max per township
  │  scripts/build_myanmar_townships.py    + MIMU township boundaries
  ▼
public/data/myanmar/townships.geojson       the only file the app loads
```

### Source files you need

- **Indicator workbooks** from the Climate Futures Myanmar modelling team. Each has one row per township (`TS_PCODE`) per model year, with the columns `Present 1981-2010`, `SSP245 2031-2060`, `SSP245 2071-2100`, `SSP585 2031-2060` and `SSP585 2071-2100`. Monthly workbooks (with a `month` column) are summed to annual totals.
- **Township boundaries**: [MIMU Myanmar Township Boundaries v9.4](https://data.humdata.org/dataset/mimu-geonode-myanmar-township-boundaries-mimu) as GeoJSON. Check MIMU's terms before publishing.

### Building the data

Requires Python 3 with `openpyxl` and `shapely`:

```bash
pip install openpyxl shapely
```

Convert each workbook (output goes to `data-build/myanmar/`):

```bash
python3 scripts/build_myanmar_indicator.py Extreme_heat_days_above_40_hot_season_Township_mean_D02.xlsx D40C
python3 scripts/build_myanmar_indicator.py Days_exceeding_WBT28_monthly_Township_mean_D02.xlsx WBT28
python3 scripts/build_myanmar_indicator.py SPEI6_intensity_annual_Township_mean_D02.xlsx SPEI6
```

Join them to the boundaries:

```bash
python3 scripts/build_myanmar_townships.py mmr_polbnda_adm3_250k_mimu.geojson data-build/myanmar/d40c.json data-build/myanmar/wbt28.json data-build/myanmar/spei6.json
```

Field names in the output follow `{PERIOD}_{STAT}_{ID}`, for example `RCP85LATE_MEAN_D40C`:

| Period prefix | Meaning |
|---|---|
| `HISTORIC` | Present baseline, 1981–2010 |
| `RCP45MID`, `RCP45LATE` | SSP2-4.5, near / far future |
| `RCP85MID`, `RCP85LATE` | SSP5-8.5, near / far future |

Townships without data (for example Myeik and Cocokyun for `WBT28`) are kept on the map and show as N/A.

## Development

Requires Node.js 20.19+ or 22.12+ (Vite 7).

```bash
npm install
npm run dev
```

Open http://localhost:5173/assessment-tool/. The map stays empty until `public/data/myanmar/townships.geojson` exists (see [Building the data](#building-the-data)).

If the dev server shows a blank page or `esri.Map is not a subclass of esri.Map` after installing or upgrading packages, clear Vite's dependency cache and restart:

```bash
rm -rf node_modules/.vite
```

## Adding an indicator

1. Convert the workbook with `build_myanmar_indicator.py`, giving it a short ID (for example `D45C`).
2. Re-run `build_myanmar_townships.py` with all indicator files.
3. Add an entry to `indicators` in [`src/constants/ScreeningData.js`](src/constants/ScreeningData.js) with its hazard, number format and colour scheme.
4. Add its title, units and explanation under `Indicators` in [`src/constants/translations/enTranslation.js`](src/constants/translations/enTranslation.js).
5. If the colour scheme is new, add its gradient to [`src/components/MapLegend/MapLegend.scss`](src/components/MapLegend/MapLegend.scss).

The dropdowns, map, legend, popup and details page pick up the new indicator automatically.

## Deployment

The site is static files, so no PHP, database or Node.js is needed on the server: any web server works (Apache on Hostpoint, nginx on a VPS).

The repository has two branches:

| Branch | Contains | Used by |
|---|---|---|
| `main` | Source code | Developers |
| `deploy` | The built site only (the contents of `dist/`), with its own history | The web server, which pulls it |

Never merge the two. GitLab may offer to create a merge request for `deploy`; ignore it.

### Publishing a new version

Commit your changes on `main`, push, then run:

```bash
scripts/deploy.sh --push
```

The script builds the site for the public address, replaces the contents of the `deploy` branch with the build, commits it as `Deploy <commit>` and pushes it. It works in a separate worktree (`.deploy-worktree/`), so `main` is not touched, and it refuses to run with uncommitted changes, so every deploy matches a commit.

| Option or variable | Effect |
|---|---|
| `--push` | Push the `deploy` branch (without it, the deploy is only committed locally) |
| `--with-data` | Include `townships.geojson` (left out by default, see [Data](#data)) |
| `SITE_URL=https://…` | Public address (default `https://hazards.climatefutures-mm.org`) |
| `REMOTE=…` | Git remote to push to (default `gitlab`) |

The server then picks up the new version with `git pull`, either manually or automatically (a scheduled pull or a GitLab webhook).

### Setting up a server (first time)

1. Add a **read-only deploy key** for the server in GitLab (*Settings → Repository → Deploy keys*).
2. Clone only the `deploy` branch into the web root:

   ```bash
   git clone --single-branch --branch deploy git@git.cde.unibe.ch:OneMapMyanmar/climate-futures-hazards.git /path/to/webroot
   ```

3. Unless the site was deployed with `--with-data`, upload the data file to `data/myanmar/townships.geojson` inside the web root. `git pull` leaves this untracked file alone.
4. Point the domain at the web root and enable HTTPS.
5. Make sure the web server **never serves `/.git`**, since the web root is a git checkout:
   - **Apache (Hostpoint):** the included `.htaccess` blocks `/.git` and the IIS/Tomcat config files, and sets the GeoJSON MIME type, compression and cache headers.
   - **nginx:** add these lines to the `server` block:

     ```nginx
     location ~ /\.(git|htaccess) { return 404; }
     location ~ ^/(WEB-INF|web\.config) { return 404; }
     ```

6. Until the official release, add password protection (basic authentication).

### Password protection

Basic authentication shows the browser's login box before anything loads, including the data. It's configured on the server, so the app doesn't change. Use separate logins per group (for example `team`, `donors`, `scientists`) so access can be changed per group, and keep the password file outside the web root.

**Apache:** don't edit the site's own `.htaccess` on the server: it's tracked in the `deploy` branch, so the next `git pull` would conflict. Put these lines in a `.htaccess` in the **parent folder** of the checkout instead (Apache applies it to the folders below):

```apache
AuthType Basic
AuthName "Climate Futures Myanmar (preview)"
AuthUserFile /path/outside/webroot/.htpasswd
Require valid-user
```

**nginx:** add to the `server` block:

```nginx
auth_basic "Climate Futures Myanmar (preview)";
auth_basic_user_file /etc/nginx/.htpasswd;
```

Create logins with `htpasswd -c /path/to/.htpasswd team` (omit `-c` for further users). Link previews in Teams and other apps don't work while the site is protected.

### Link previews

The Open Graph tags in `index.html` use `VITE_SITE_URL` from `.env` for their absolute URLs (`scripts/deploy.sh` overrides it with `SITE_URL`). The preview image `public/og-image.png` is drawn from the township data; regenerate it after the data changes:

```bash
python3 scripts/build_og_image.py
```

### Checking a build locally

```bash
npm run build
npm run preview
```

Then open http://localhost:4173/assessment-tool/. (Local builds use the `/assessment-tool/` path from `vite.config.js`; `scripts/deploy.sh` builds for the domain root instead.)

### Before a public launch

- **Data permission:** confirm the data owners allow publication. Anyone using the site can download `townships.geojson`.
- **Remove the password protection.**
- **Esri API key (optional):** the basemap and place search currently work without an API key. If Esri restricts anonymous access, add an [ArcGIS Location Platform](https://developers.arcgis.com/documentation/security-and-authentication/api-key-authentication/) key.
- **Security headers:** if a Content-Security-Policy is added, it must allow `*.arcgis.com` and `blob:` workers.

## Project structure

```
scripts/
  build_myanmar_*.py          data conversion (Python)
  build_og_image.py           link-preview image
  deploy.sh                   build onto the deploy branch
public/
  .htaccess                   Apache settings (blocks /.git, MIME type, caching)
  data/myanmar/               townships.geojson (not committed)
src/
  constants/ScreeningData.js  indicators, hazards, periods, scenarios
  constants/translations/     all user-facing text
  constants/AppConfig.js      basemap, data URL, renderer template
  context/                    app state and map controller
  components/                 map, controls, legend, search, indicator views
  pages/                      map page and township details page
```
