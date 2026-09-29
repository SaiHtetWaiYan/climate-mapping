# Climate Mapping

An interactive map of township-level climate hazard projections for Myanmar, using data from the Climate Futures Myanmar modelling team. Choose a hazard, indicator, time period and emissions scenario to colour all townships on the map, then open any township to see its projections as a chart, table and written summary.

Built with React 19, Vite and the [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/) 5.1.

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

The app reads a single file, `public/data/myanmar/townships.geojson`, which holds the township boundaries and every indicator value. Two scripts build it:

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

```bash
npm run build
```

Upload the contents of `dist/` so the app is served at `/assessment-tool/`. To serve it at a different path, change `base` in [`vite.config.js`](vite.config.js) and `VITE_BASE_URL` in `.env`, then rebuild.

Because the data is not in the repository, check that `dist/data/myanmar/townships.geojson` exists before uploading. `npm run build` copies it from `public/` only if you have built it locally.

Link previews (Open Graph tags in `index.html`) use `VITE_SITE_URL` from `.env` for their absolute URLs, so set it to the site's public address. The preview image `public/og-image.png` is drawn from the township data; regenerate it after the data changes:

```bash
python3 scripts/build_og_image.py
```

Server configuration is included for Apache (`.htaccess`), IIS (`web.config`, which adds the `.geojson` MIME type) and Tomcat (`WEB-INF/rewrite.config`).

To check the production build locally:

```bash
npm run preview
```

Then open http://localhost:4173/assessment-tool/.

### Before a public launch

- **Data permission**: confirm the data owners allow publication. Anyone using the site can download `townships.geojson`.
- **Esri API key**: the basemap and place search use Esri's online services without an API key. This is fine for testing, but production use needs an [ArcGIS Location Platform](https://developers.arcgis.com/documentation/security-and-authentication/api-key-authentication/) API key.

## Project structure

```
scripts/                      data conversion scripts (Python)
public/data/myanmar/          townships.geojson (not committed)
src/
  constants/ScreeningData.js  indicators, hazards, periods, scenarios
  constants/translations/     all user-facing text
  constants/AppConfig.js      basemap, data URL, renderer template
  context/                    app state and map controller
  components/                 map, controls, legend, search, indicator views
  pages/                      map page and township details page
```
