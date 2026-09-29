const enTranslation = {
    App: {
        Title: 'Climate Futures Myanmar',
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
                LongLabel: 'Present Baseline (1981–2010)',
                Label: 'Present Baseline',
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
            MAX: 'Maximum',
            MEAN: 'Mean',
            MIN: 'Minimum',
            PROJECTION: 'Projection',
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
        drought: {
            Title: 'Drought',
        },
        extreme_temperature: {
            Title: 'Extreme Heat',
        },
        fire: {
            Title: 'Wildfire',
        },
        flooding_inland: {
            Title: 'Flooding',
        },
        flooding_costal: {
            Title: 'Coastal Inundation',
        },
    },
    Indicators: {
        D40C: {
            Title: 'Hot-season days with maximum temperature > 40°C',
            Details: 'Number of days in the hot season when the daily maximum temperature exceeds 40°C',
            Prefix: '',
            Postfix: 'Days',
            LongText: `For the 30 years from 1981 to 2010, models estimate that {{geoName}} averaged {{HISTORIC_MEAN}} days per hot season when the highest temperature of the day exceeded 40°C.

Under a moderate emissions scenario (SSP2-4.5), models project an average of:

-   {{RCP45MID_MEAN}} days per hot season in the near future, from 2031 to 2060; and
-   {{RCP45LATE_MEAN}} days per hot season in the far future, from 2071 to 2100\.

Under a high emissions scenario (SSP5-8.5), models project an average of:

-   {{RCP85MID_MEAN}} days per hot season in the near future, from 2031 to 2060; and
-   {{RCP85LATE_MEAN}} days per hot season in the far future, from 2071 to 2100\.

Note that this interpretation shows 30-year averages. The Chart and Table tabs show the range from the lowest to the highest single year in each 30-year period.

Source: Climate Futures Myanmar, preliminary township projections.`,
        },
        WBT28: {
            Title: 'Days with wet-bulb temperature > 28°C',
            Details: 'Number of days per year when the daily wet-bulb temperature exceeds 28°C',
            Prefix: '',
            Postfix: 'Days',
            LongText: `Wet-bulb temperature combines heat and humidity. Above about 28°C the body struggles to cool itself by sweating, causing serious physiological strain, including heat stress injuries, cardiovascular events and kidney damage. The theoretical limit for human survival is about 31°C.

For the 30 years from 1981 to 2010, models estimate that {{geoName}} averaged {{HISTORIC_MEAN}} days per year with a wet-bulb temperature above 28°C.

Under a moderate emissions scenario (SSP2-4.5), models project an average of:

-   {{RCP45MID_MEAN}} days per year in the near future, from 2031 to 2060; and
-   {{RCP45LATE_MEAN}} days per year in the far future, from 2071 to 2100\.

Under a high emissions scenario (SSP5-8.5), models project an average of:

-   {{RCP85MID_MEAN}} days per year in the near future, from 2031 to 2060; and
-   {{RCP85LATE_MEAN}} days per year in the far future, from 2071 to 2100\.

Most of these days fall between May and September, peaking in June with the onset of the southwest monsoon.

Note that this interpretation shows 30-year averages. The Chart and Table tabs show the range from the lowest to the highest single year in each 30-year period.

Source: Climate Futures Myanmar, preliminary township projections.`,
        },
        SPEI6: {
            Title: 'Drought intensity (SPEI-6)',
            Details: 'Annual drought intensity from the 6-month Standardized Precipitation Evapotranspiration Index',
            Prefix: '',
            Postfix: 'SPEI',
            LongText: `The Standardized Precipitation Evapotranspiration Index (SPEI) measures the difference between water supply (rainfall) and water demand (evaporation from land and plants). SPEI-6 looks at drought conditions over 6 months. A value of 0 means no drought; the more negative the value, the more intense the drought.

For the 30 years from 1981 to 2010, models estimate an average annual drought intensity of {{HISTORIC_MEAN}} for {{geoName}}.

Under a moderate emissions scenario (SSP2-4.5), models project an average of:

-   {{RCP45MID_MEAN}} in the near future, from 2031 to 2060; and
-   {{RCP45LATE_MEAN}} in the far future, from 2071 to 2100\.

Under a high emissions scenario (SSP5-8.5), models project an average of:

-   {{RCP85MID_MEAN}} in the near future, from 2031 to 2060; and
-   {{RCP85LATE_MEAN}} in the far future, from 2071 to 2100\.

Note that this interpretation shows 30-year averages. The Chart and Table tabs show the range from the most to the least intense single year in each 30-year period.

Source: Climate Futures Myanmar, preliminary township projections.`,
        },
    },
};

export default enTranslation;
