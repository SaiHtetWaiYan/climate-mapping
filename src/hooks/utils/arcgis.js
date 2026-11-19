import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import MapSymbols from '../../constants/MapSymbols';

// const MIN_WIDTH = 400;
// const OPT_WIDTH = 25.925926 * window.innerWidth; // 700px at 2700px width
// const MAX_WIDTH = 534;
// let innerWidth = window.innerWidth;

// // get padding left value
// function getPaddingLeft(left = 550) {
//     console.log('left', left);
//     return left;
// }

// // set padding left based on window width
// function setPaddingLeft(innerWidth) {
//     return Math.min(Math.max(0.25925926 * (innerWidth - 264), MIN_WIDTH), MAX_WIDTH);
// }

// // set padding left on resize
// window.addEventListener('resize', () => {
//     innerWidth = window.innerWidth;

//     let left = setPaddingLeft(innerWidth);
//     getPaddingLeft(left);
// });

// Small screens show the filters as a bar at the bottom and the legend at the top;
// larger screens show the filters as a panel on the left (280px wide up to 960px, see MapControls.scss)
const smallScreen = window.matchMedia('(max-width: 720px)');
const mediumScreen = window.matchMedia('(max-width: 960px)');
const getViewPadding = () => {
    // top: room for the header (and on phones the legend below it)
    if (smallScreen.matches) return { top: 150, bottom: 72 };
    if (mediumScreen.matches) return { top: 80, left: 320 };
    // the filter panel ends at 514px (32px margin + 482px)
    return { top: 80, left: 520 };
};

export function loadView(basemap, options) {
    const map = new Map({ basemap });
    const { view } = options;
    const mapView = new MapView({
        ...view,
        map,
        padding: getViewPadding(),
        popup: {
            dockOptions: {
                // Disable the dock button so users cannot undock the popup
                buttonEnabled: false,
            },
        },
        highlights: [
            {
                name: 'default',
                color: 'cyan',
                haloOpacity: 1,
                fillOpacity: 0.25,
                shadowColor: 'black',
                shadowOpacity: 0.4,
                shadowDifference: 0.2,
            },
            {
                name: 'aoi',
                color: [27, 27, 27, 255],
                haloOpacity: 1,
                fillOpacity: 0,
                shadowColor: 'black',
                shadowOpacity: 0.4,
                shadowDifference: 0.2,
            },
        ],
        constraints: {
            maxZoom: 17,
        },
    });
    [smallScreen, mediumScreen].forEach((query) =>
        query.addEventListener('change', () => {
            mapView.padding = getViewPadding();
        })
    );
    return {
        view: mapView,
        map,
    };
}

export function destroyView(view) {
    if (!view) return;
    // undocumented way to destroy a view
    view = view.container = null;
}
