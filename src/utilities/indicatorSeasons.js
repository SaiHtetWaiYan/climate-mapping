import ScreeningData from '../constants/ScreeningData';

// Seasonal indicators share a group (e.g. WBT28_HOT and WBT28_WET are both WBT28)
export const groupOf = (indicator) => indicator?.group ?? indicator?.id;

export const findIndicator = (id) => ScreeningData.indicators.find((indicator) => indicator.id === id);

/**
 * Seasons available for an indicator group, in the order of ScreeningData.seasons.
 * Empty for indicators without seasons.
 */
export const seasonsOf = (groupId) =>
    ScreeningData.seasons.filter((season) =>
        ScreeningData.indicators.some((indicator) => groupOf(indicator) === groupId && indicator.season === season)
    );

/**
 * The indicator for a group in the given season, or the group's first indicator if it has no such season.
 */
export const findVariant = (groupId, season) => {
    const variants = ScreeningData.indicators.filter((indicator) => groupOf(indicator) === groupId);
    return variants.find((indicator) => indicator.season === season) ?? variants[0];
};
