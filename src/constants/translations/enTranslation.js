/**
 * Explanation shown on the township details page. Values like {{HISTORIC_MEAN}} are filled in by the app.
 * @param {string} intro paragraph explaining the indicator (optional)
 * @param {string} baseline what the 1981–2010 value means, e.g. "{{geoName}} averaged {{HISTORIC_MEAN}} days ..."
 * @param {string} unit unit after each projected value, e.g. "days per year" (optional)
 */
const projectionText = ({ intro, baseline, unit }) => {
    const u = unit ? ` ${unit}` : '';
    return `${intro ? `${intro}\n\n` : ''}For the 30 years from 1981 to 2010, models estimate that ${baseline}.

Under a moderate emissions scenario (SSP2-4.5), models project an average of:

-   {{RCP45MID_MEAN}}${u} in the near future, from 2031 to 2060; and
-   {{RCP45LATE_MEAN}}${u} in the far future, from 2071 to 2100.

Under a high emissions scenario (SSP5-8.5), models project an average of:

-   {{RCP85MID_MEAN}}${u} in the near future, from 2031 to 2060; and
-   {{RCP85LATE_MEAN}}${u} in the far future, from 2071 to 2100.

All values are 30-year averages.

Source: Climate Futures Myanmar township projections.`;
};

const WET_BULB_INTRO =
    'Wet-bulb temperature combines heat and humidity. Above about 28°C the body struggles to cool itself by sweating, causing serious physiological strain, including heat stress injuries, cardiovascular events and kidney damage. The theoretical limit for human survival is about 31°C.';
const SPEI_INTRO = (months) =>
    `The Standardized Precipitation Evapotranspiration Index (SPEI) measures the difference between water supply (rainfall) and water demand (evaporation from land and plants). SPEI-${months} looks at drought conditions over ${months} months. A value of 0 means no drought; the more negative the value, the more intense the drought.`;
const SPI_INTRO = (months) =>
    `The Standardized Precipitation Index (SPI) compares rainfall with the long-term normal. SPI-${months} looks at rainfall over ${months} months. A value of 0 means normal rainfall; the more negative the value, the more intense the drought.`;

const enTranslation = {
    App: {
        Title: 'Climate Mapping',
        BackButtonText: 'Back',
    },
    Alert: {
        RenderError: {
            Title: 'Error Displaying Data',
            Message: 'An Error has occurred, please modify your selection.',
        },
        MapLoadError: {
            title: 'Error Loading Map',
            message: 'An error occurred while loading the map. Please try again later.',
        },
    },
    IndicatorList: {
        Title: 'Climate Projections for',
    },
    IndicatorItem: {
        PositiveDelta: '+ {{value}} since 1981–2010',
        NegativeDelta: '- {{value}} since 1981–2010',
        NoDelta: 'No change since 1981–2010',
    },
    IndicatorDetails: {
        Tab1: 'Chart',
        Tab2: 'Table',
        Tab3: 'Details',
    },
    Inputs: {
        Hazards: {
            ShortLabel: 'Hazards',
        },
        Indicators: {
            ShortLabel: 'Indicators',
        },
        Models: {
            ShortLabel: 'Scenario',
        },
        Timeframe: {
            All: 'Timeframe',
        },
    },
    Map: {
        Popup: {
            actionButton1: 'Explore Data',
            actionButton2: 'Select Location',
        },
    },
    MapControls: {
        WelcomeIntro: {
            Title: 'To get started',
            P1: 'Select a township.',
            P2: 'Apply filters. Use the ‘Explore Data’ button after filtering for more details on the township.',
            ButtonClose: 'close welcome message',
        },
        MinimizeBtn: {
            Open: 'Open filters',
        },
        ClearBtn: 'Clear Selection',
        SearchTitle: 'Find a Myanmar township',
        MobileToggle: 'Search and filters',
        CloseBtn: {
            Close: 'Clear selected area',
        },
        InnerActionsBtn1: {
            Title: 'Explore Data',
        },
    },
    Data: {
        Time: {
            HISTORIC: {
                LongLabel: 'Historical (1981–2010)',
                Label: 'Historical',
                Years: '1981–2010',
            },
            MID: {
                Label: 'Near Future',
                Years: '2031–2060',
            },
            LATE: {
                Label: 'Far Future',
                Years: '2071–2100',
            },
        },
        Stats: {
            MEAN: 'Mean',
        },
        Models: {
            RCP45: {
                ShortLabel: 'Lower emissions (SSP2-4.5)',
                Tooltip:
                    'SSP2-4.5 is an intermediate scenario in which emissions of heat-trapping gases stay around current levels until mid-century and then decline.',
            },
            RCP85: {
                ShortLabel: 'Higher emissions (SSP5-8.5)',
                Tooltip:
                    'SSP5-8.5 is a high emissions scenario in which emissions of heat-trapping gases from fossil fuels keep increasing through 2100.',
            },
        },
    },
    Hazards: {
        extreme_temperature: {
            Title: 'Extreme Heat',
        },
        humid_heat: {
            Title: 'Wet Bulb Temperature',
        },
        drought: {
            Title: 'Drought',
        },
        flooding_inland: {
            Title: 'Flood',
        },
    },
    Indicators: {
        D40C: {
            Title: 'Hot-season days with maximum temperature > 40°C',
            Details: 'Number of days in the hot season when the daily maximum temperature exceeds 40°C',
            Prefix: '',
            Postfix: 'Days',
            LongText: projectionText({
                baseline:
                    '{{geoName}} averaged {{HISTORIC_MEAN}} days per hot season when the highest temperature of the day exceeded 40°C',
                unit: 'days per hot season',
            }),
        },
        D45C: {
            Title: 'Hot-season days with maximum temperature > 45°C',
            Details: 'Number of days in the hot season when the daily maximum temperature exceeds 45°C',
            Prefix: '',
            Postfix: 'Days',
            LongText: projectionText({
                baseline:
                    '{{geoName}} averaged {{HISTORIC_MEAN}} days per hot season when the highest temperature of the day exceeded 45°C',
                unit: 'days per hot season',
            }),
        },
        WBT25: {
            Title: 'Days with wet-bulb temperature > 25°C',
            Details: 'Number of days per year when the daily wet-bulb temperature exceeds 25°C',
            Prefix: '',
            Postfix: 'Days',
            LongText: projectionText({
                intro: WET_BULB_INTRO,
                baseline: '{{geoName}} averaged {{HISTORIC_MEAN}} days per year with a wet-bulb temperature above 25°C',
                unit: 'days per year',
            }),
        },
        WBT28: {
            Title: 'Days with wet-bulb temperature > 28°C',
            Details: 'Number of days per year when the daily wet-bulb temperature exceeds 28°C',
            Prefix: '',
            Postfix: 'Days',
            LongText: projectionText({
                intro: WET_BULB_INTRO,
                baseline: '{{geoName}} averaged {{HISTORIC_MEAN}} days per year with a wet-bulb temperature above 28°C',
                unit: 'days per year',
            }),
        },
        WBT31: {
            Title: 'Days with wet-bulb temperature > 31°C',
            Details: 'Number of days per year when the daily wet-bulb temperature exceeds 31°C',
            Prefix: '',
            Postfix: 'Days',
            LongText: projectionText({
                intro: WET_BULB_INTRO,
                baseline: '{{geoName}} averaged {{HISTORIC_MEAN}} days per year with a wet-bulb temperature above 31°C',
                unit: 'days per year',
            }),
        },
        DRY: {
            Title: 'Dry days',
            Details: 'Number of dry days per year',
            Prefix: '',
            Postfix: 'Days',
            LongText: projectionText({
                baseline: '{{geoName}} averaged {{HISTORIC_MEAN}} dry days per year',
                unit: 'dry days per year',
            }),
        },
        SPEI3: {
            Title: 'Drought intensity (SPEI-3)',
            Details: 'Drought intensity from the 3-month Standardized Precipitation Evapotranspiration Index',
            Prefix: '',
            Postfix: 'SPEI',
            LongText: projectionText({
                intro: SPEI_INTRO(3),
                baseline: '{{geoName}} had an average drought intensity of {{HISTORIC_MEAN}}',
            }),
        },
        SPEI6: {
            Title: 'Drought intensity (SPEI-6)',
            Details: 'Drought intensity from the 6-month Standardized Precipitation Evapotranspiration Index',
            Prefix: '',
            Postfix: 'SPEI',
            LongText: projectionText({
                intro: SPEI_INTRO(6),
                baseline: '{{geoName}} had an average drought intensity of {{HISTORIC_MEAN}}',
            }),
        },
        SPEI12: {
            Title: 'Drought intensity (SPEI-12)',
            Details: 'Drought intensity from the 12-month Standardized Precipitation Evapotranspiration Index',
            Prefix: '',
            Postfix: 'SPEI',
            LongText: projectionText({
                intro: SPEI_INTRO(12),
                baseline: '{{geoName}} had an average drought intensity of {{HISTORIC_MEAN}}',
            }),
        },
        SPI3: {
            Title: 'Drought intensity (SPI-3)',
            Details: 'Drought intensity from the 3-month Standardized Precipitation Index',
            Prefix: '',
            Postfix: 'SPI',
            LongText: projectionText({
                intro: SPI_INTRO(3),
                baseline: '{{geoName}} had an average drought intensity of {{HISTORIC_MEAN}}',
            }),
        },
        SPI6: {
            Title: 'Drought intensity (SPI-6)',
            Details: 'Drought intensity from the 6-month Standardized Precipitation Index',
            Prefix: '',
            Postfix: 'SPI',
            LongText: projectionText({
                intro: SPI_INTRO(6),
                baseline: '{{geoName}} had an average drought intensity of {{HISTORIC_MEAN}}',
            }),
        },
        SPI12: {
            Title: 'Drought intensity (SPI-12)',
            Details: 'Drought intensity from the 12-month Standardized Precipitation Index',
            Prefix: '',
            Postfix: 'SPI',
            LongText: projectionText({
                intro: SPI_INTRO(12),
                baseline: '{{geoName}} had an average drought intensity of {{HISTORIC_MEAN}}',
            }),
        },
        RR50: {
            Title: 'Days with more than 50 mm of rain',
            Details: 'Number of days per year with more than 50 mm of rain',
            Prefix: '',
            Postfix: 'Days',
            LongText: projectionText({
                intro: 'Days with very heavy rain can cause flash floods and landslides.',
                baseline: '{{geoName}} averaged {{HISTORIC_MEAN}} days per year with more than 50 mm of rain',
                unit: 'days per year',
            }),
        },
        CWD: {
            Title: 'Longest run of wet days',
            Details: 'Longest run of consecutive wet days per year',
            Prefix: '',
            Postfix: 'Days',
            LongText: projectionText({
                intro: 'Long wet spells saturate the soil and raise the risk of river flooding.',
                baseline:
                    'the longest run of consecutive wet days in {{geoName}} averaged {{HISTORIC_MEAN}} days per year',
                unit: 'days',
            }),
        },
    },
};

export default enTranslation;
