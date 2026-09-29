import ScreeningData from '../constants/ScreeningData';

/**
 * Hazards that have at least one indicator.
 */
export function getHazardsWithIndicators() {
    return ScreeningData.hazards.filter((hazard) =>
        ScreeningData.indicators.some((indicator) => indicator[hazard.id])
    );
}

/**
 * Display name for a township feature, e.g. "Pauk, Magway".
 * @param {Object} attributes feature attributes
 */
export function getTownshipName(attributes) {
    const { nameField, regionNameField } = ScreeningData.township;
    return `${attributes[nameField]}, ${attributes[regionNameField]}`;
}
