const ScreeningData = {
    statistics: {
        max: 'MIN',
        mean: 'MEAN',
        min: 'MAX',
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
    hazardIds: {
        heat: 'extreme_temperature',
        drought: 'drought',
        fire: 'fire',
        flood: 'flooding_inland',
        coastalInundation: 'flooding_costal',
    },
    hazards: [
        { id: 'extreme_temperature' },
        { id: 'drought' },
        { id: 'fire' },
        { id: 'flooding_inland' },
        { id: 'flooding_costal' },
    ],
    // Myanmar townships (MIMU boundaries), built by scripts/build_myanmar_townships.py
    township: {
        geoIdField: 'GEOID',
        nameField: 'TS',
        regionNameField: 'ST',
    },
    indicators: [
        // Climate Futures Myanmar
        {
            id: 'D40C',
            drought: 0,
            extreme_temperature: 1,
            fire: 0,
            flooding_inland: 0,
            flooding_costal: 0,
            Details: 'Number of days in the hot season when the daily maximum temperature exceeds 40°C',
            format: '0,0.0',
            colorRampName: 'Orange 4',
        },
        {
            id: 'WBT28',
            drought: 0,
            extreme_temperature: 2,
            fire: 0,
            flooding_inland: 0,
            flooding_costal: 0,
            Details: 'Number of days per year when the daily wet-bulb temperature exceeds 28°C',
            format: '0,0.0',
            colorRampName: 'Purple 4',
        },
        {
            id: 'SPEI6',
            drought: 1,
            extreme_temperature: 0,
            fire: 0,
            flooding_inland: 0,
            flooding_costal: 0,
            Details: 'Annual drought intensity from the 6-month Standardized Precipitation Evapotranspiration Index',
            format: '0,0.00',
            // Brown 1 runs dark to light, so the most negative (most severe) values are darkest
            colorRampName: 'Brown 1',
        },
    ],
};

export default ScreeningData;
