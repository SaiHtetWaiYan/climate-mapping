import AppConfig from '../constants/AppConfig';
import ScreeningData from '../constants/ScreeningData';

async function fetchJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed (${response.status}): ${url}`);
    }
    return response.json();
}

/**
 * Load the townships from the climate hazard API as GeoJSON, with the township names added and
 * the indicator fields renamed to {PERIOD}_MEAN_{INDICATOR_ID}, e.g. RCP85LATE_MEAN_D40C.
 * @returns {Promise<string>} object URL of the GeoJSON, for a GeoJSONLayer
 */
export async function loadTownshipsGeoJSON() {
    const { url, geometryPrecision } = AppConfig.datasets.climateHazards;
    const [layerInfo, names] = await Promise.all([
        fetchJSON(`${url}?f=json`),
        fetchJSON(AppConfig.datasets.townshipNames.url),
    ]);

    // The API's field names are cut to 63 characters, so find them by their full alias
    const fieldByAlias = Object.fromEntries(layerInfo.fields.map((field) => [field.alias, field.name]));
    const pcodeField = fieldByAlias.TS_PCODE;

    const fieldMap = [];
    ScreeningData.indicators.forEach((indicator) => {
        Object.entries(ScreeningData.periodSuffixes).forEach(([period, suffix]) => {
            const apiField = fieldByAlias[`${indicator.source}_${suffix}`];
            if (apiField) {
                fieldMap.push([apiField, `${period}_${ScreeningData.statistics.mean}_${indicator.id}`]);
            } else {
                console.warn(`Missing API field for ${indicator.id} ${period}`);
            }
        });
    });

    const params = new URLSearchParams({
        where: '1=1',
        outFields: [pcodeField, ...fieldMap.map(([apiField]) => apiField)].join(','),
        returnGeometry: true,
        outSR: 4326,
        geometryPrecision,
        f: 'geojson',
    });
    const data = await fetchJSON(`${url}/query?${params}`);

    const { geoIdField, nameField, regionNameField } = ScreeningData.township;
    const features = data.features.map((feature) => {
        const pcode = feature.properties[pcodeField];
        const [name, region] = names[pcode] ?? [pcode, ''];
        const properties = { [geoIdField]: pcode, [nameField]: name, [regionNameField]: region };
        fieldMap.forEach(([apiField, appField]) => {
            properties[appField] = feature.properties[apiField] ?? null;
        });
        return { type: 'Feature', geometry: feature.geometry, properties };
    });

    const geojson = JSON.stringify({ type: 'FeatureCollection', features });
    return URL.createObjectURL(new Blob([geojson], { type: 'application/geo+json' }));
}
