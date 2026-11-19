# Climate Mapping

An interactive map of township-level climate hazard projections for Myanmar, using data from the Climate Futures Myanmar modelling team. Choose a hazard, indicator, time period and emissions scenario to colour all townships on the map, then open any township to see its projections as a chart, table and written summary.

Built with React 19, Vite and the [ArcGIS Maps SDK for JavaScript](https://developers.arcgis.com/javascript/latest/) 5.1, adapted from the assessment tool of the [Climate Resilience Information System (CRIS)](https://github.com/NOAA-CRIS/CRIS) by NOAA, used under the MIT License (see [Credits](#credits)).

- **Repository:** [git.cde.unibe.ch/OneMapMyanmar/climate-futures-hazards](https://git.cde.unibe.ch/OneMapMyanmar/climate-futures-hazards)
- **Site:** hazards.climatefutures-mm.org

## Indicators

| Hazard | Indicators | Seasons |
|---|---|---|
| Extreme heat | Hot-season days above 40°C and 45°C, longest run of days above 40°C, longest run of nights above 30°C and 35°C, longest heat wave | — |
| Wet bulb temperature | Days with wet-bulb temperature above 25°C, 28°C and 31°C | Annual, hot, cold, wet |
| Drought | Intensity, duration and number of drought events (SPEI and SPI over 3, 6, 12 and 24 months) | — |
| Flood | Dry days, longest run of wet days, days with more than 50 mm of rain | Annual, hot, cold, wet |

Each indicator has values for three periods and two scenarios:

| Period | Years | Scenarios |
|---|---|---|
| Historical | 1981–2010 | — |
| Near future | 2031–2060 | SSP2-4.5, SSP5-8.5 |
| Far future | 2071–2100 | SSP2-4.5, SSP5-8.5 |

For each township, period and scenario, the app shows the 30-year average.

## Data

The browser loads the township boundaries and indicator values from the [climate hazard API](https://gis.cde.unibe.ch/gis/rest/services/Hosted/climate_hazard/FeatureServer/0) (ArcGIS FeatureServer, CDE). The API has no township names, so they come from `public/data/myanmar/township-names.json` (MIMU), matched by `TS_PCODE`.

API fields are named `{indicator}_{period}`, for example `Extreme_heat_days_above_40_hot_season_SSP585_2071_2100`. Townships without a value show as N/A.

## Development

Requires Node.js 20.19+ or 22.12+ (Vite 7).

```bash
npm install
npm run dev
```

Open http://localhost:5173/.

If the dev server shows a blank page or `esri.Map is not a subclass of esri.Map` after installing or upgrading packages, clear Vite's dependency cache and restart:

```bash
rm -rf node_modules/.vite
```

To test a production build: `npm run build && npm run preview`, then open http://localhost:4173/.

## Adding an indicator

1. Add an entry to `indicators` in [`src/constants/ScreeningData.js`](src/constants/ScreeningData.js) with a short ID, its API field name without the period (`source`), its hazard, number format and colour scheme. For an indicator with seasons, wrap it in `seasonal(...)` and put `{season}` in `source`.
2. Add its title, units and explanation under `Indicators` in [`src/constants/translations/enTranslation.js`](src/constants/translations/enTranslation.js) (`seasonalText(...)` for one with seasons).
3. If the colour scheme is new, add its gradient to [`src/components/MapLegend/MapLegend.scss`](src/components/MapLegend/MapLegend.scss).

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

The script builds the site and pushes it to the `deploy` branch. It won't run with uncommitted changes.

On the server, run `git pull` to get the new version.

### Setting up a server (first time)

1. Add a read-only deploy key in GitLab (*Settings → Repository → Deploy keys*).
2. Clone the `deploy` branch into the web root:

   ```bash
   git clone --single-branch --branch deploy git@git.cde.unibe.ch:OneMapMyanmar/climate-futures-hazards.git /path/to/webroot
   ```

3. Point the domain at the web root and enable HTTPS.

To update later, run `git pull` in the web root. Apache uses the included `.htaccess`; on nginx, block `/.git`.

## Project structure

```
scripts/
  deploy.sh                   build onto the deploy branch
  guide-screenshots.mjs       retake the user guide screenshots (needs the dev server and Chrome)
public/
  .htaccess                   Apache settings (blocks /.git, MIME type, caching)
  data/myanmar/               township names by code
  licenses/                   CRIS MIT license, linked from the app
  images/user-guide/          user guide screenshots
src/
  constants/ScreeningData.js  indicators, hazards, periods, scenarios
  constants/translations/     all user-facing text
  constants/AppConfig.js      basemap, API URL, renderer template
  utilities/townshipData.js   loads the townships from the API
  utilities/indicatorSeasons.js  picks the indicator for the selected season
  context/                    app state and map controller
  components/                 map, controls, legend, search, indicator views
  pages/                      map page and township details page
```

## Credits

This project is adapted from the [Climate Resilience Information System (CRIS)](https://github.com/NOAA-CRIS/CRIS) assessment tool, Copyright (c) 2024 NOAA-CRIS, released under the MIT License. The full license text is in [`LICENSE`](LICENSE); a copy is deployed with the site at `/licenses/CRIS-LICENSE.txt` and linked from the app.

Climate data: Climate Futures Myanmar. Township boundaries and names: MIMU.
