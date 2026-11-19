// Position of an indicator in its hazard's list (0 = not part of that hazard)
const hazardOrder = (hazardId, order) => ({
    extreme_temperature: 0,
    humid_heat: 0,
    drought: 0,
    flooding_inland: 0,
    [hazardId]: order,
});

// Seasons in the API field names, e.g. Max_CWD_hot_season_...
const SEASONS = {
    ANNUAL: 'annual',
    HOT: 'hot_season',
    COLD: 'cold_season',
    WET: 'wet_season',
};

/**
 * One indicator per season, with IDs like WBT28_HOT. They share a `group` so the app can show
 * one entry in the indicator list and a season dropdown.
 * @param {Object} base indicator settings; `source` contains {season}
 * @param {Object} formats number format per season, when it differs from base.format
 * @param {string} annualName API name of the annual season ('annual_season' for wet-bulb fields)
 */
const seasonal = (base, formats = {}, annualName = SEASONS.ANNUAL) =>
    Object.entries(SEASONS).map(([season, apiSeason]) => ({
        ...base,
        id: `${base.id}_${season}`,
        group: base.id,
        season,
        source: base.source.replace('{season}', season === 'ANNUAL' ? annualName : apiSeason),
        format: formats[season] ?? base.format,
    }));

// Drought indices: intensity, duration and number of events for SPEI and SPI over 3–24 months
const DROUGHT_MEASURES = [
    { key: 'INT', api: 'intensity', format: '0,0.00', reverseColorRamp: false },
    { key: 'DUR', api: 'duration', format: '0,0.0', reverseColorRamp: true },
    { key: 'NUM', api: 'NumEvents', format: '0,0.00', reverseColorRamp: true },
];
const droughtIndicators = () => {
    let order = 0;
    return DROUGHT_MEASURES.flatMap((measure) =>
        ['SPEI', 'SPI'].flatMap((index) =>
            [3, 6, 12, 24].map((months) => ({
                id: `${index}${months}_${measure.key}`,
                source: `${index}${months}_${measure.api}_annual`,
                ...hazardOrder('drought', ++order),
                format: measure.format,
                // Brown 1 runs dark to light: intensity is negative (most severe = darkest);
                // duration and number of events are reversed so the highest values are darkest
                colorRampName: 'Brown 1',
                reverseColorRamp: measure.reverseColorRamp,
            }))
        )
    );
};

const ScreeningData = {
    // The API provides the 30-year mean for each period
    statistics: {
        mean: 'MEAN',
    },
    // Present 1981-2010, near future 2031-2060, far future 2071-2100
    timeframe: {
        historic: 'HISTORIC',
        mid: 'MID',
        late: 'LATE',
    },
    // SSP2-4.5 and SSP5-8.5 (field prefixes kept from the original tool's data layout)
    models: {
        rcp45: 'RCP45',
        rcp85: 'RCP85',
    },
    // API field suffix for each period, e.g. RCP85LATE -> ..._SSP585_2071_2100
    periodSuffixes: {
        HISTORIC: 'Hist_1981_2010',
        RCP45MID: 'SSP245_2031_2060',
        RCP45LATE: 'SSP245_2071_2100',
        RCP85MID: 'SSP585_2031_2060',
        RCP85LATE: 'SSP585_2071_2100',
    },
    hazardIds: {
        heat: 'extreme_temperature',
        humidHeat: 'humid_heat',
        drought: 'drought',
        flood: 'flooding_inland',
        coastalInundation: 'flooding_costal',
    },
    hazards: [{ id: 'extreme_temperature' }, { id: 'humid_heat' }, { id: 'drought' }, { id: 'flooding_inland' }],
    // Myanmar townships (MIMU boundaries)
    township: {
        geoIdField: 'GEOID',
        nameField: 'TS',
        regionNameField: 'ST',
    },
    seasons: Object.keys(SEASONS),
    // `source` is the API field alias without the period suffix.
    // Seasonal indicators have `group` (shared by its seasons) and `season`.
    indicators: [
        // Extreme heat
        {
            id: 'D40C',
            source: 'Extreme_heat_days_above_40_hot_season',
            ...hazardOrder('extreme_temperature', 1),
            format: '0,0.0',
            colorRampName: 'Orange 4',
        },
        {
            id: 'D45C',
            source: 'Extreme_heat_days_above_45_hot_season',
            ...hazardOrder('extreme_temperature', 2),
            format: '0,0.0',
            colorRampName: 'Orange 4',
        },
        {
            id: 'CD40C',
            source: 'Extreme_heat_maximum_consecutive_days_above_40_annual',
            ...hazardOrder('extreme_temperature', 3),
            format: '0,0.0',
            colorRampName: 'Orange 4',
        },
        {
            id: 'CN30C',
            source: 'Extreme_heat_maximum_consecutive_nights_above_30_annual',
            ...hazardOrder('extreme_temperature', 4),
            format: '0,0.0',
            colorRampName: 'Orange 4',
        },
        {
            id: 'CN35C',
            source: 'Extreme_heat_maximum_consecutive_nights_above_35_annual',
            ...hazardOrder('extreme_temperature', 5),
            format: '0,0.00',
            colorRampName: 'Orange 4',
        },
        {
            id: 'HWD',
            source: 'Extreme_heat_max_heat_wave_duration_annual',
            ...hazardOrder('extreme_temperature', 6),
            format: '0,0.0',
            colorRampName: 'Orange 4',
        },
        // Wet bulb temperature
        ...seasonal(
            {
                id: 'WBT25',
                source: 'Days_above_WBT25C_{season}',
                ...hazardOrder('humid_heat', 1),
                format: '0,0.0',
                colorRampName: 'Purple 4',
            },
            {},
            'annual_season'
        ),
        ...seasonal(
            {
                id: 'WBT28',
                source: 'Days_above_WBT28C_{season}',
                ...hazardOrder('humid_heat', 2),
                format: '0,0.0',
                colorRampName: 'Purple 4',
            },
            { COLD: '0,0.00' },
            'annual_season'
        ),
        ...seasonal(
            {
                id: 'WBT31',
                source: 'Days_above_WBT31C_{season}',
                ...hazardOrder('humid_heat', 3),
                format: '0,0.00',
                colorRampName: 'Purple 4',
            },
            {},
            'annual_season'
        ),
        // Drought
        ...droughtIndicators(),
        // Flood
        ...seasonal({
            id: 'DRY',
            source: 'Dry_days_{season}',
            ...hazardOrder('flooding_inland', 1),
            format: '0,0.0',
            // Brown 1 runs dark to light; reversed so the most dry days are darkest
            colorRampName: 'Brown 1',
            reverseColorRamp: true,
        }),
        ...seasonal({
            id: 'CWD',
            source: 'Max_CWD_{season}',
            ...hazardOrder('flooding_inland', 2),
            format: '0,0.0',
            colorRampName: 'Blue 6',
        }),
        ...seasonal(
            {
                id: 'RR50',
                source: 'Number_days_with_RR50_{season}',
                ...hazardOrder('flooding_inland', 3),
                format: '0,0.0',
                colorRampName: 'Blue 6',
            },
            { COLD: '0,0.00', HOT: '0,0.00' }
        ),
    ],
};

export default ScreeningData;
