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

Source: CDE (2026), Myanmar Township Climate and Climate-Related Hazard Indicators Dataset, based on Messmer et al. (2026).`;
};

const WET_BULB_INTRO =
    'Wet-bulb temperature combines heat and humidity. Above about 28°C the body struggles to cool itself by sweating, causing serious physiological strain, including heat stress injuries, cardiovascular events and kidney damage. The theoretical limit for human survival is about 31°C.';
const SPEI_INTRO = (months) =>
    `The Standardized Precipitation Evapotranspiration Index (SPEI) measures the difference between water supply (rainfall) and water demand (evaporation from land and plants). SPEI-${months} looks at drought conditions over ${months} months.`;
const SPI_INTRO = (months) =>
    `The Standardized Precipitation Index (SPI) compares rainfall with the long-term normal. SPI-${months} looks at rainfall over ${months} months.`;

const HEAT_NIGHTS_INTRO =
    'Hot nights stop the body from recovering from daytime heat, raising the risk of heat stress, especially for older people and those without cooling.';

// How each season is described in the text
const SEASON_TEXT = {
    ANNUAL: { label: 'annual', per: 'per year', in: 'in a year' },
    HOT: { label: 'hot season', per: 'per hot season', in: 'in the hot season' },
    WET: { label: 'wet season', per: 'per wet season', in: 'in the wet season' },
    COLD: { label: 'cold season', per: 'per cold season', in: 'in the cold season' },
};

/**
 * Text for one indicator in each season, keyed like WBT28_HOT.
 * GroupTitle (listTitle, or the title) is shown in the indicator list; Title (with the season) on the
 * legend and details page.
 * @param {string} id indicator group ID, e.g. 'WBT28'
 * @param {Function} text (season) => { title, details, baseline, unit, intro, postfix }
 */
const seasonalText = (id, text) =>
    Object.fromEntries(
        Object.entries(SEASON_TEXT).map(([season, s]) => {
            // listTitle: the indicator list entry, when it differs from the title (e.g. adds a threshold)
            const { title, listTitle = title, details, baseline, unit, intro, postfix = 'Days' } = text(s);
            return [
                `${id}_${season}`,
                {
                    GroupTitle: listTitle,
                    Title: `${title} (${s.label})`,
                    Details: details,
                    Prefix: '',
                    Postfix: postfix,
                    LongText: projectionText({ intro, baseline, unit }),
                },
            ];
        })
    );

// valueNote explains the index values; it only applies to drought intensity
const DROUGHT_INDEX = {
    SPEI: {
        intro: SPEI_INTRO,
        name: 'Standardized Precipitation Evapotranspiration Index',
        valueNote: 'A value of 0 means no drought; the more negative the value, the more intense the drought.',
    },
    SPI: {
        intro: SPI_INTRO,
        name: 'Standardized Precipitation Index',
        valueNote: 'A value of 0 means normal rainfall; the more negative the value, the more intense the drought.',
    },
};

// Intensity, duration and number of events for SPEI and SPI over 3, 6, 12 and 24 months
const droughtText = () =>
    Object.fromEntries(
        ['SPEI', 'SPI'].flatMap((index) =>
            [3, 6, 12, 24].flatMap((months) => {
                const { intro, name, valueNote } = DROUGHT_INDEX[index];
                const label = `${index}-${months}`;
                const full = `the ${months}-month ${name}`;
                // Title includes the index (legend, details page); GroupTitle is the indicator list
                // entry, with the unit in brackets. measureNote follows the index introduction on the
                // Details tab and explains this measure.
                const entry = (title, listUnit, details, baseline, unit, postfix, measureNote) => ({
                    Title: `${title} (${label})`,
                    GroupTitle: `${title} (${listUnit})`,
                    Details: details,
                    Prefix: '',
                    Postfix: postfix,
                    LongText: projectionText({ intro: `${intro(months)} ${measureNote}`, baseline, unit }),
                });
                return [
                    [
                        `${index}${months}_INT`,
                        entry(
                            'Drought intensity',
                            'SPI/SPEI value',
                            `Average intensity of drought events from ${full} (${index} value)`,
                            `{{geoName}} had an average drought intensity of {{HISTORIC_MEAN}} (${index} value)`,
                            '',
                            index,
                            `This indicator is the average intensity of drought events. ${valueNote}`
                        ),
                    ],
                    [
                        `${index}${months}_DUR`,
                        entry(
                            'Drought-event duration',
                            'months/event',
                            `Average length of drought events from ${full} (months/event)`,
                            'drought events in {{geoName}} lasted {{HISTORIC_MEAN}} months on average',
                            'months per event',
                            'Months/event',
                            'This indicator is the average length of a drought event, in months per event.'
                        ),
                    ],
                    [
                        `${index}${months}_NUM`,
                        entry(
                            'Number of drought events',
                            'events/year',
                            `Average number of drought events per year from ${full} (events/year)`,
                            '{{geoName}} had an average of {{HISTORIC_MEAN}} drought events per year',
                            'drought events per year',
                            'Events/year',
                            'This indicator is the average number of separate drought events per year.'
                        ),
                    ],
                ];
            })
        )
    );

const enTranslation = {
    App: {
        Title: 'Future Climate Hazards for Adaptation',
        BackButtonText: 'Back',
    },
    AppHeader: {
        NavLabel: 'Main',
        OpenMenu: 'Open menu',
        CloseMenu: 'Close menu',
        Nav: {
            MainPage: 'Main Page',
            UserGuide: 'User Guide',
            CreditsAndSources: 'Credits and Sources',
        },
    },
    // Credits and sources page; links are written as [label](url)
    CreditsPage: {
        Title: 'Credits and Sources',
        Intro: [
            'This dashboard is produced under the Myanmar Locally Led Adaptation Project (MLLAP), 2025–2027, implemented by the Centre for Development and Environment (CDE) of the University of Bern, Switzerland, in collaboration with climate scientists from the Delft University of Technology, Netherlands and University of the Basque Country, Spain, with the financial support of the Department of Foreign Affairs and Trade (DFAT) and Swiss Agency for Development and Cooperation (SDC).',
            'The user interface design and source code of this dashboard is adapted from the [Climate Resilience Information System (CRIS)](https://github.com/NOAA-CRIS/CRIS), developed by NOAA-CRIS and made available under the [MIT License](/licenses/CRIS-LICENSE.txt).',
        ],
        Sections: [
            {
                Id: 'sources',
                Title: 'Additional data and information sources',
                Blocks: [
                    'The dashboard draws on data, information, and resources from the following organisations and sources:',
                    {
                        List: [
                            {
                                Text: 'Centre for Development and Environment (CDE). (2026). Myanmar Township Climate and Climate-Related Hazard Indicators Dataset. Derived township-level climate and climate-related hazard indicators for Myanmar, based on Messmer et al. (2026) and MIMU administrative boundaries (2023).',
                            },
                            {
                                Text: 'Messmer, M., González-Rojí, S. J., Nay Chi, M. A., & Leonard, S. (2026). High-resolution regional climate modeling over Myanmar using WRF: Historical validation and future projections under different shared socioeconomic pathways. PLOS Climate, 5(2), e0000820. [https://doi.org/10.1371/journal.pclm.0000820](https://doi.org/10.1371/journal.pclm.0000820)',
                            },
                            {
                                Text: 'Messmer, M., & González-Rojí, S. J. (2025). WRF climate projection datasets for Myanmar. Zenodo. [https://doi.org/10.5281/zenodo.17113911](https://doi.org/10.5281/zenodo.17113911)',
                            },
                            {
                                Text: 'Myanmar Information Management Unit (MIMU). (2023). Myanmar Administrative Boundaries – PCode Version 9.4. MIMU Geospatial Data. [https://data.themimu.info/en/dataset/myanmar-administrative-boundary](https://data.themimu.info/en/dataset/myanmar-administrative-boundary)',
                            },
                        ],
                    },
                    'Original data and materials remain the property of their respective providers and are subject to their applicable licences and terms of use.',
                ],
            },
            {
                Id: 'development',
                Title: 'Dashboard adaptation and development',
                Blocks: [
                    'Additional adaptations, locally developed components, analytical indicators, and custom functionalities are developed by CDE and its partners. These original contributions remain subject to the applicable intellectual property rights of their respective creators and rights holders.',
                    'This dashboard is an independent adaptation and is not an official NOAA product or an endorsement by NOAA.',
                ],
            },
            {
                Id: 'disclaimer',
                Title: 'Disclaimer and Limitations',
                Blocks: [
                    'The administrative boundaries are for reference and operational mapping purposes. CDE does not claim ownership of the original boundary data and does not independently certify their accuracy, completeness, legal status, or currency. The boundaries are reproduced subject to the limitations of the original source data.',
                    'Neither MIMU nor the United Nations provides warranties regarding the accuracy or completeness of the source boundary information. The boundaries and names shown and the designations used on this map do not imply official endorsement or acceptance by the United Nations or MIMU. CDE shall not be held responsible for errors, omissions, or changes originating from the original administrative boundary data. MIMU and the United Nations should not be held responsible for the subsequent processing, derived indicators, analyses, or interpretations produced by CDE.',
                    'Climate projections represent model-based scenarios rather than definitive predictions of future conditions. The dataset is intended for regional screening, research, and planning purposes and should be complemented by local data, field verification, and expert assessment where required. It should not be used as a substitute for authoritative administrative, cadastral, or legal boundary information.',
                ],
            },
        ],
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
        // Dropdowns for indicators that come in several versions (see ScreeningData.options)
        Options: {
            season: 'Season',
            index: 'Drought index',
        },
    },
    UserGuide: {
        Title: 'User Guide',
        Intro: 'Future Climate Hazards for Adaptation shows how extreme heat, humid heat, drought and flood-related conditions are projected to change in each of Myanmar’s 330 townships. Use it to compare townships, see how a township may change by mid-century and the end of the century, and find which hazards matter most for planning adaptation.',
        Contents: 'Contents',
        Sections: [
            {
                Id: 'map',
                Images: [
                    {
                        File: '01-overview.webp',
                        Alt: 'The map page: the header at the top, the filter panel on the left, zoom buttons, Myanmar coloured by the selected indicator and the legend at the bottom right.',
                    },
                ],
                Title: 'Getting around the map',
                Blocks: [
                    'The map fills the screen. The filter panel is on the left (on a phone, tap Search and filters at the bottom to open it) and the legend is in the corner of the map.',
                    {
                        List: [
                            { Term: 'Move the map', Text: 'drag it with the mouse or one finger.' },
                            {
                                Term: 'Zoom',
                                Text: 'use the + and − buttons, the mouse wheel, a two-finger pinch, or double-click.',
                            },
                        ],
                    },
                ],
            },
            {
                Id: 'township',
                Images: [
                    {
                        File: '02-popup.webp',
                        Alt: 'A township pop-up showing its name, its value for the selected indicator, and the Select Location and Explore Data buttons.',
                    },
                ],
                Title: 'Finding a township',
                Blocks: [
                    'Type a township name in the Find a Myanmar township box and choose it from the suggestions. The map zooms to the township and selects it.',
                    'You can also click any township on the map. A pop-up shows its value for the current selection. Use Select Location to make it the selected township, or Explore Data to open its detailed projections. Clicking another township shows its value without changing your selection.',
                    'To clear the selected township, use the × next to its name at the top of the filter panel.',
                ],
            },
            {
                Id: 'filters',
                Images: [
                    {
                        File: '03-filters.webp',
                        Alt: 'The filter panel with a selected township, and the Hazards, Indicators, Season, Timeframe and Scenario dropdowns.',
                    },
                ],
                Title: 'Choosing what to map',
                Blocks: [
                    'The filters decide what colours the map. Change any of them and the map updates straight away.',
                    {
                        List: [
                            {
                                Term: 'Hazards',
                                Text: 'Extreme Heat, Wet Bulb Temperature (heat combined with humidity), Drought and Flood.',
                            },
                            {
                                Term: 'Indicators',
                                Text: 'the measures available for the chosen hazard, for example hot-season days above 40°C or the longest run of wet days. The list changes when you change the hazard.',
                            },
                            {
                                Term: 'Season',
                                Text: 'shown only for indicators that have seasonal values (wet bulb temperature and flood): Annual, Hot season (March–May), Wet season (June–October) or Cold season (November–February).',
                            },
                            {
                                Term: 'Drought index',
                                Text: 'shown for drought: the index used to measure drought intensity, duration or number of events. SPEI uses rainfall and evaporation, SPI uses rainfall only, each over 3, 6, 12 or 24 months.',
                            },
                            {
                                Term: 'Timeframe',
                                Text: 'Modeled History (1981–2010), Near Future (2031–2060) or Far Future (2071–2100). Each value is a 30-year average.',
                            },
                            {
                                Term: 'Scenario',
                                Text: 'Lower emissions (SSP2-4.5) or Higher emissions (SSP5-8.5). The scenario does not apply to the historical period.',
                            },
                        ],
                    },
                ],
            },
            {
                Id: 'legend',
                Images: [
                    {
                        File: '04-legend.webp',
                        Alt: 'The legend with its About this map explanation open above the colour scale.',
                    },
                ],
                Title: 'Reading the map and legend',
                Blocks: [
                    'Each township is coloured by its value for the selected indicator, season, timeframe and scenario. For most indicators, darker colours mean higher values. For drought intensity, darker colours mean more negative values, which is more severe drought.',
                    'The legend shows three numbers. The middle one is the average of all townships; townships beyond the outer numbers get the lightest or darkest colour. Select the i button on the legend for an explanation of the current map.',
                    'Townships without data are left uncoloured on the map and show N/A in pop-ups and tables.',
                ],
            },
            {
                Id: 'explore',
                Images: [
                    {
                        File: '05-details.webp',
                        Alt: 'The township details page with hazard tabs, period and season dropdowns, and an indicator expanded to show its bar chart.',
                    },
                ],
                Title: 'Exploring a township',
                Blocks: [
                    'Select Explore Data (in the filter panel or a pop-up) to open the projections for the selected township.',
                    {
                        List: [
                            {
                                Term: 'Hazard tabs',
                                Text: 'switch between the four hazards at the top of the page.',
                            },
                            {
                                Term: 'Period, season and drought index',
                                Text: 'choose Near Future or Far Future, and the season or drought index where it applies.',
                            },
                            {
                                Term: 'Indicator rows',
                                Text: 'each row shows the value under both scenarios and how much it changes from 1981–2010.',
                            },
                            {
                                Term: 'Chart, Table and Details',
                                Text: 'select + on a row to see a bar chart of every period, a table of the values, and a written summary.',
                            },
                        ],
                    },
                    'Select Back to return to the map. Your selections are kept.',
                ],
            },
            {
                Id: 'phone',
                Images: [
                    {
                        File: '06-phone.webp',
                        Alt: 'The map on a phone, with the legend under the header and the Search and filters bar at the bottom.',
                    },
                    {
                        File: '07-phone-filters.webp',
                        Alt: 'The Search and filters panel opened from the bottom of a phone screen.',
                    },
                ],
                Title: 'Using a phone or tablet',
                Blocks: [
                    'On small screens the menu button (☰) in the header opens the links, the filters open from the Search and filters bar at the bottom, and the legend sits under the header.',
                ],
            },
            {
                Id: 'data',
                Title: 'About the data',
                Blocks: [
                    'The values come from the Myanmar Township Climate and Climate-Related Hazard Indicators Dataset of the Centre for Development and Environment (CDE, 2026): township averages of the high-resolution regional climate projections by Messmer et al. (2026). They are loaded from the CDE climate hazard service each time the map opens. Township boundaries and names are from MIMU (2023). Full references are on the Credits and Sources page.',
                    'Projections describe possible future conditions under each emissions scenario. They are 30-year averages, not forecasts for a particular year, and are best used to compare townships and to see the direction and size of change.',
                ],
            },
            {
                Id: 'credits',
                Title: 'Credits and sources',
                Blocks: [
                    'The full credits, data sources, and disclaimer and limitations are on the Credits and Sources page, opened from the header. The user interface is adapted from the Climate Resilience Information System (CRIS) by NOAA-CRIS, used under the MIT License.',
                ],
            },
        ],
    },
    MapLegend: {
        InfoButton: 'About this map',
        CloseButton: 'Close',
        InfoTitle: 'About this map',
        Showing: 'Showing {{period}}{{scenario}}.',
        Scenario: ', {{scenario}}',
        HigherDarker: 'Each township is coloured by its value: the darker the colour, the higher the value.',
        LowerDarker:
            'Each township is coloured by its value: the darker the colour, the lower (more negative) the value and the more severe the drought.',
        Numbers:
            'The middle number ({{mid}}) is the average of all townships. Townships at {{low}} or below get the colour on the left, and those at {{high}} or above the colour on the right.',
        NoData: 'Townships without data are not coloured.',
        Click: 'Click a township to see its values, or use Explore Data for charts and a table.',
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
                LongLabel: 'Modeled History (1981–2010)',
                Label: 'Modeled History',
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
        Options: {
            // Months of each season in the dataset
            season: {
                ANNUAL: 'Annual',
                HOT: 'Hot season (Mar–May)',
                WET: 'Wet season (Jun–Oct)',
                COLD: 'Cold season (Nov–Feb)',
            },
            index: {
                SPEI3: 'SPEI-3 (3 months)',
                SPEI6: 'SPEI-6 (6 months)',
                SPEI12: 'SPEI-12 (12 months)',
                SPEI24: 'SPEI-24 (24 months)',
                SPI3: 'SPI-3 (3 months)',
                SPI6: 'SPI-6 (6 months)',
                SPI12: 'SPI-12 (12 months)',
                SPI24: 'SPI-24 (24 months)',
            },
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
        CD40C: {
            Title: 'Annual longest run of days with maximum temperature > 40°C',
            Details: 'Longest run of consecutive days per year when the daily maximum temperature exceeds 40°C',
            Prefix: '',
            Postfix: 'Days',
            LongText: projectionText({
                baseline:
                    'the longest run of consecutive days above 40°C in {{geoName}} averaged {{HISTORIC_MEAN}} days per year',
                unit: 'days',
            }),
        },
        CN30C: {
            Title: 'Annual longest run of nights > 30°C',
            Details: 'Longest run of consecutive nights per year when the temperature stays above 30°C',
            Prefix: '',
            Postfix: 'Nights',
            LongText: projectionText({
                intro: HEAT_NIGHTS_INTRO,
                baseline:
                    'the longest run of consecutive nights above 30°C in {{geoName}} averaged {{HISTORIC_MEAN}} nights per year',
                unit: 'nights',
            }),
        },
        CN35C: {
            Title: 'Annual longest run of nights > 35°C',
            Details: 'Longest run of consecutive nights per year when the temperature stays above 35°C',
            Prefix: '',
            Postfix: 'Nights',
            LongText: projectionText({
                intro: HEAT_NIGHTS_INTRO,
                baseline:
                    'the longest run of consecutive nights above 35°C in {{geoName}} averaged {{HISTORIC_MEAN}} nights per year',
                unit: 'nights',
            }),
        },
        HWD: {
            Title: 'Hot-season longest heatwave duration',
            // No final full stop: the legend explanation adds one
            Details:
                'Maximum number of consecutive days during April–June on which daily maximum temperature exceeds the historical 90th percentile threshold, with a minimum duration of two consecutive days',
            Prefix: '',
            Postfix: 'Days',
            LongText: projectionText({
                intro: 'A heatwave here is a run of at least two consecutive days, during April–June, on which the daily maximum temperature exceeds the historical 90th percentile threshold. This indicator is the length of the longest such run.',
                baseline: 'the longest hot-season heatwave in {{geoName}} lasted {{HISTORIC_MEAN}} days on average',
                unit: 'days',
            }),
        },
        ...[25, 28, 31].reduce(
            (all, threshold) => ({
                ...all,
                ...seasonalText(`WBT${threshold}`, (s) => ({
                    title: `Days with maximum wet-bulb temperature > ${threshold}°C`,
                    details: `Number of days ${s.in} when the daily maximum wet-bulb temperature exceeds ${threshold}°C`,
                    intro: WET_BULB_INTRO,
                    baseline: `{{geoName}} averaged {{HISTORIC_MEAN}} days ${s.per} with a maximum wet-bulb temperature above ${threshold}°C`,
                    unit: `days ${s.per}`,
                })),
            }),
            {}
        ),
        ...droughtText(),
        ...seasonalText('DRY', (s) => ({
            title: 'Dry days',
            listTitle: 'Dry days (< 1mm)',
            details: `Number of dry days ${s.in}`,
            baseline: `{{geoName}} averaged {{HISTORIC_MEAN}} dry days ${s.per}`,
            unit: `dry days ${s.per}`,
        })),
        ...seasonalText('CWD', (s) => ({
            title: 'Longest run of wet days',
            listTitle: 'Longest run of wet days (> 1mm)',
            details: `Longest run of consecutive wet days ${s.in}`,
            intro: 'Long wet spells saturate the soil and raise the risk of river flooding.',
            baseline: `the longest run of consecutive wet days in {{geoName}} averaged {{HISTORIC_MEAN}} days ${s.per}`,
            unit: 'days',
        })),
        ...seasonalText('RR50', (s) => ({
            title: 'Days with more than 50 mm of rain',
            details: `Number of days ${s.in} with more than 50 mm of rain`,
            intro: 'Days with very heavy rain can cause flash floods and landslides.',
            baseline: `{{geoName}} averaged {{HISTORIC_MEAN}} days ${s.per} with more than 50 mm of rain`,
            unit: `days ${s.per}`,
        })),
    },
};

export default enTranslation;
