# Climate Mapping

An interactive map of township-level climate hazard projections for Myanmar, using data from the Climate Futures Myanmar modelling team. Choose a hazard, indicator, time period and emissions scenario to colour all townships on the map, then open any township to see its projections as a chart, table and written summary.

Built with React 19, Vite and the [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/) 5.1, adapted from NOAA's [Climate Mapping for Resilience and Adaptation](https://resilience.climate.gov/) assessment tool.

- **Repository:** [git.cde.unibe.ch/OneMapMyanmar/climate-futures-hazards](https://git.cde.unibe.ch/OneMapMyanmar/climate-futures-hazards)
- **Site:** hazards.climatefutures-mm.org

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

> **The data is preliminary and unpublished.** It is kept out of `main` and included only in the `deploy` branch. Do not distribute it without the data owners' permission.

The app reads `public/data/myanmar/townships.geojson`: one feature per township, with fields named `{PERIOD}_{STAT}_{ID}`, for example `RCP85LATE_MEAN_D40C`.

| Period prefix | Meaning |
|---|---|
| `HISTORIC` | Present baseline, 1981–2010 |
| `RCP45MID`, `RCP45LATE` | SSP2-4.5, near / far future |
| `RCP85MID`, `RCP85LATE` | SSP5-8.5, near / far future |

Townships without a value show as N/A.

## Development

Requires Node.js 20.19+ or 22.12+ (Vite 7).

```bash
npm install
npm run dev
```

Open http://localhost:5173/assessment-tool/. The map stays empty until `public/data/myanmar/townships.geojson` exists.

If the dev server shows a blank page or `esri.Map is not a subclass of esri.Map` after installing or upgrading packages, clear Vite's dependency cache and restart:

```bash
rm -rf node_modules/.vite
```

To test a production build: `npm run build && npm run preview`, then open http://localhost:4173/assessment-tool/.

## Adding an indicator

1. Add its values to the data, using a short ID (for example `D45C`).
2. Add an entry to `indicators` in [`src/constants/ScreeningData.js`](src/constants/ScreeningData.js) with its hazard, number format and colour scheme.
3. Add its title, units and explanation under `Indicators` in [`src/constants/translations/enTranslation.js`](src/constants/translations/enTranslation.js).
4. If the colour scheme is new, add its gradient to [`src/components/MapLegend/MapLegend.scss`](src/components/MapLegend/MapLegend.scss).

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
| `SITE_URL=https://…` | Public address (default `https://hazards.climatefutures-mm.org`) |
| `REMOTE=…` | Git remote to push to (default `gitlab`) |

The server then picks up the new version with `git pull`, either manually or automatically (a scheduled pull or a GitLab webhook).

### Setting up a server (first time)

1. Add a read-only deploy key in GitLab (*Settings → Repository → Deploy keys*).
2. Clone the `deploy` branch into the web root:

   ```bash
   git clone --single-branch --branch deploy git@git.cde.unibe.ch:OneMapMyanmar/climate-futures-hazards.git /path/to/webroot
   ```

3. Point the domain at the web root and enable HTTPS.

To update later, run `git pull` in the web root. Apache uses the included `.htaccess`; on nginx, block `/.git`.

### Before a public launch

Confirm the data owners allow publication: anyone using the site can download `townships.geojson`.

## Project structure

```
scripts/
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
