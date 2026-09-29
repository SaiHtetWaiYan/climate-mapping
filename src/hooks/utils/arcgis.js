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

export function loadView(basemap, options) {
    const map = new Map({ basemap });
    const { view } = options;
    return {
        view: new MapView({
            ...view,
            map,
            padding: { left: 480 },
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
        }),
        map,
    };
}

export function destroyView(view) {
    if (!view) return;
    // undocumented way to destroy a view
    view = view.container = null;
}
