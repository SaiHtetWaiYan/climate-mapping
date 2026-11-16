// Position of an indicator in its hazard's list (0 = not part of that hazard)
const hazardOrder = (hazardId, order) => ({
    extreme_temperature: 0,
    humid_heat: 0,
    drought: 0,
    flooding_inland: 0,
    [hazardId]: order,
});

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
    // `source` is the API field alias without the period suffix
    indicators: [
        // Extreme heat
        {
            id: 'D40C',
            source: 'Extreme_heat_days_above_40_hot_season',
            ...hazardOrder('extreme_temperature', 1),
            Details: 'Number of days in the hot season when the daily maximum temperature exceeds 40°C',
            format: '0,0.0',
            colorRampName: 'Orange 4',
        },
        {
            id: 'D45C',
            source: 'Extreme_heat_days_above_45_hot_season',
            ...hazardOrder('extreme_temperature', 2),
            Details: 'Number of days in the hot season when the daily maximum temperature exceeds 45°C',
            format: '0,0.0',
            colorRampName: 'Orange 4',
        },
        // Wet bulb temperature
        {
            id: 'WBT25',
            source: 'Days_above_WBT25C_annual_season',
            ...hazardOrder('humid_heat', 1),
            Details: 'Number of days per year when the daily wet-bulb temperature exceeds 25°C',
            format: '0,0.0',
            colorRampName: 'Purple 4',
        },
        {
            id: 'WBT28',
            source: 'Days_above_WBT28C_annual_season',
            ...hazardOrder('humid_heat', 2),
            Details: 'Number of days per year when the daily wet-bulb temperature exceeds 28°C',
            format: '0,0.0',
            colorRampName: 'Purple 4',
        },
        {
            id: 'WBT31',
            source: 'Days_above_WBT31C_annual_season',
            ...hazardOrder('humid_heat', 3),
            Details: 'Number of days per year when the daily wet-bulb temperature exceeds 31°C',
            format: '0,0.00',
            colorRampName: 'Purple 4',
        },
        // Drought
        // Brown 1 runs dark to light, so the most negative (most severe) values are darkest
        {
            id: 'SPEI3',
            source: 'SPEI3_intensity_annual',
            ...hazardOrder('drought', 1),
            Details: 'Drought intensity from the 3-month Standardized Precipitation Evapotranspiration Index',
            format: '0,0.00',
            colorRampName: 'Brown 1',
        },
        {
            id: 'SPEI6',
            source: 'SPEI6_intensity_annual',
            ...hazardOrder('drought', 2),
            Details: 'Drought intensity from the 6-month Standardized Precipitation Evapotranspiration Index',
            format: '0,0.00',
            colorRampName: 'Brown 1',
        },
        {
            id: 'SPEI12',
            source: 'SPEI12_intensity_annual',
            ...hazardOrder('drought', 3),
            Details: 'Drought intensity from the 12-month Standardized Precipitation Evapotranspiration Index',
            format: '0,0.00',
            colorRampName: 'Brown 1',
        },
        {
            id: 'SPI3',
            source: 'SPI3_intensity_annual',
            ...hazardOrder('drought', 4),
            Details: 'Drought intensity from the 3-month Standardized Precipitation Index',
            format: '0,0.00',
            colorRampName: 'Brown 1',
        },
        {
            id: 'SPI6',
            source: 'SPI6_intensity_annual',
            ...hazardOrder('drought', 5),
            Details: 'Drought intensity from the 6-month Standardized Precipitation Index',
            format: '0,0.00',
            colorRampName: 'Brown 1',
        },
        {
            id: 'SPI12',
            source: 'SPI12_intensity_annual',
            ...hazardOrder('drought', 6),
            Details: 'Drought intensity from the 12-month Standardized Precipitation Index',
            format: '0,0.00',
            colorRampName: 'Brown 1',
        },
        // Flood
        {
            id: 'DRY',
            source: 'Dry_days_annual',
            ...hazardOrder('flooding_inland', 1),
            Details: 'Number of dry days per year',
            format: '0,0.0',
            // Brown 1 runs dark to light; reversed so the most dry days are darkest
            colorRampName: 'Brown 1',
            reverseColorRamp: true,
        },
        {
            id: 'RR50',
            source: 'Number_days_with_RR50_annual',
            ...hazardOrder('flooding_inland', 3),
            Details: 'Number of days per year with more than 50 mm of rain',
            format: '0,0.0',
            colorRampName: 'Blue 6',
        },
        {
            id: 'CWD',
            source: 'Max_CWD_annual',
            ...hazardOrder('flooding_inland', 2),
            Details: 'Longest run of consecutive wet days per year',
            format: '0,0.0',
            colorRampName: 'Blue 6',
        },
    ],
};

export default ScreeningData;
