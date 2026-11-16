const AppConfig = {
    // Esri light gray canvas basemap
    basemap: 'gray-vector',
    datasets: {
        // Township boundaries and indicator values (Climate Futures Myanmar, CDE)
        climateHazards: {
            url: 'https://gis.cde.unibe.ch/gis/rest/services/Hosted/climate_hazard/FeatureServer/0',
            // Simplify the boundaries (degrees, about 200 m) to keep the download small
            maxAllowableOffset: 0.002,
            geometryPrecision: 4,
        },
        // Township and region names by TS_PCODE (MIMU), which the API doesn't include
        townshipNames: {
            url: `${import.meta.env.BASE_URL}data/myanmar/township-names.json`,
        },
    },
    searchZoom: 13,
    zoomToGeomExtentFactor: 1.5,
    rendererDataExtentFactor: 1.5,
    renderer: {
        type: 'classBreaks',
        visualVariables: [
            {
                type: 'sizeInfo',
                valueExpression: '$view.scale',
                stops: [
                    {
                        size: 2,
                        value: 421728,
                    },
                    {
                        size: 1,
                        value: 1317901,
                    },
                    {
                        size: 0.5,
                        value: 5271605,
                    },
                    {
                        size: 0,
                        value: 10543209,
                    },
                ],
                target: 'outline',
            },
        ],
        classBreakInfos: [
            {
                classMaxValue: 9007199254740991,
                symbol: {
                    type: 'esriSFS',
                    color: [170, 170, 170, 255],
                    outline: {
                        type: 'esriSLS',
                        color: [194, 194, 194, 64],
                        width: 0.375,
                        style: 'esriSLSSolid',
                    },
                    style: 'esriSFSSolid',
                },
            },
        ],
        field: '',
        minValue: -9007199254740991,
    },
};

export default AppConfig;
