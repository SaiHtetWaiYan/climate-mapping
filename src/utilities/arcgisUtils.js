import Polygon from '@arcgis/core/geometry/Polygon';
import * as colorRendererCreator from '@arcgis/core/smartMapping/renderers/color';
import * as colorSchemes from '@arcgis/core/smartMapping/symbology/color';
import numeral from 'numeral';

import ScreeningData from '../constants/ScreeningData';

// Keep missing values as null so they display as N/A instead of 0
function formatValue(value, format) {
    return value === null || value === undefined ? null : numeral(value).format(format);
}

/**
 * Build the indicator records for one township from its feature attributes.
 * Fields named {TIMEFRAME}_{STAT}_{INDICATOR_ID} become {TIMEFRAME}_{STAT} on that indicator.
 * @param {Object} attributes feature attributes
 * @param {number} oid feature object id
 */
function buildIndicators(attributes, oid) {
    const { geoIdField, nameField, regionNameField } = ScreeningData.township;

    return ScreeningData.indicators.map((indicator) => {
        const data = { ...indicator };
        Object.keys(attributes).forEach((key) => {
            if (key.endsWith('_' + indicator.id)) {
                const propName = key.replace('_' + indicator.id, '');
                data[propName] = formatValue(attributes[key], indicator.format);
            }
        });

        data.OID = oid;
        data[geoIdField] = attributes[geoIdField];
        data[nameField] = attributes[nameField];
        data[regionNameField] = attributes[regionNameField];

        return data;
    });
}

/**
 * Query the township at a location and build its indicator records
 * @param {Object} layerView township layer view
 * @param {Object} geometry location to query
 * @returns {Promise<{data: Array, geometry: Object}>}
 */
export async function getIndicatorData({ layerView, geometry }) {
    try {
        const query = {
            where: '1=1',
            geometry,
            returnGeometry: true,
            outFields: ['*'],
        };

        const queryResults = await layerView.layer.queryFeatures(query);

        if (!queryResults?.features?.length) {
            return { data: [], geometry: null };
        }

        const result = queryResults.features[0];
        const resultGeometry = {
            type: queryResults.geometryType,
            ...result.geometry.toJSON(),
        };
        const indicators = buildIndicators(result.attributes, result.attributes[layerView.layer.objectIdField]);

        return { data: indicators, geometry: resultGeometry };
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export function mergeAttributesWithIndicators({ attributes, objectIdField }) {
    return buildIndicators(attributes, attributes[objectIdField]);
}

/**
 * Union the extents of polygons.
 * @param {Array<Polygon>} pologons Array of Pologons JSON objects
 * @param {Array<String>} expandFactor Array of groupLayer "Title" properties representing the dataets
 * @returns {Extent}  Extent Object containing all geometries expanded by the expandFactor
 */
export function unionExtents({ pologons, expandFactor }) {
    if (!pologons.length) {
        return null;
    }
    const firstGeom = Polygon.fromJSON(pologons[0]);
    let extent = firstGeom.extent;

    pologons.forEach((geom) => {
        extent = extent.union(Polygon.fromJSON(geom).extent);
    });
    return expandFactor ? extent.expand(expandFactor) : extent;
}

export async function getIndicatorVisualVariable(layerView, indicator, indicatorFieldName) {
    try {
        const schemeName = indicator.colorRampName ? indicator.colorRampName : 'Blue 14';
        const colorScheme = colorSchemes.getSchemeByName({
            name: schemeName,
            basemapTheme: 'light',
            geometryType: 'polygon',
            theme: 'high-to-low',
        });

        const vvResults = await colorRendererCreator.createVisualVariable({
            layer: layerView.layer,
            field: indicatorFieldName,
            theme: 'high-to-low',
            colorScheme: indicator.reverseColorRamp ? colorSchemes.flipColors(colorScheme) : colorScheme,
        });
        const visualVariable = vvResults.visualVariable.toJSON();
        return visualVariable;
    } catch (error) {
        console.error(error);
    }
    return null;
}
