import ScreeningData from '../constants/ScreeningData';

// Indicators with options share a group (e.g. WBT28_HOT and WBT28_WET are both WBT28,
// SPEI6_INT and SPI12_INT are both DROUGHT_INT)
export const groupOf = (indicator) => indicator?.group ?? indicator?.id;

export const findIndicator = (id) => ScreeningData.indicators.find((indicator) => indicator.id === id);

/**
 * The options of an indicator group, in the order of ScreeningData.options,
 * e.g. { type: 'season', values: ['ANNUAL', 'HOT', 'COLD', 'WET'] }. Null if it has none.
 */
export const optionsOf = (groupId) => {
    const variants = ScreeningData.indicators.filter(
        (indicator) => groupOf(indicator) === groupId && indicator.optionType
    );
    if (!variants.length) {
        return null;
    }
    const type = variants[0].optionType;
    const values = ScreeningData.options[type].filter((value) =>
        variants.some((indicator) => indicator.option === value)
    );
    return { type, values };
};

/**
 * Option types used by a hazard's indicators, e.g. ['index'] for drought.
 */
export const optionTypesOfHazard = (hazardId) =>
    Object.keys(ScreeningData.options).filter((type) =>
        ScreeningData.indicators.some((indicator) => indicator[hazardId] && indicator.optionType === type)
    );

/**
 * The indicator of a group for the selected options (e.g. { season: 'HOT', index: 'SPEI6' }),
 * or the group's first indicator if none matches.
 */
export const findVariant = (groupId, selectedOptions) => {
    const variants = ScreeningData.indicators.filter((indicator) => groupOf(indicator) === groupId);
    return (
        variants.find(
            (indicator) => indicator.optionType && indicator.option === selectedOptions[indicator.optionType]
        ) ?? variants[0]
    );
};
