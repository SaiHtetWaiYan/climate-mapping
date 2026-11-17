import { useRef, useEffect, useState } from 'react';
import { loadView, destroyView } from './utils/arcgis';

export function useMapView(basemap, options = {}) {
    // create a ref to element to be used as the map's container
    const elRef = useRef(null);
    // hold on to the view in state
    const [view, setView] = useState(null);
    // use a ref so we can use initial values in a componentDidMount-like effect
    // otherwise we'd get a lint error, or have to make it a dependency of the effect
    // see: https://github.com/facebook/react/issues/15865#issuecomment-540715333
    const initialArguments = useRef({ basemap, options });

    // use a side effect to create the view after react has rendered the DOM
    useEffect(() => {
        // define local variables to be used in the clean up function
        let cancelled = false;
        let _view;
        async function load() {
            const { basemap, options } = initialArguments.current;
            const loadViewResults = loadView(basemap, options);
            _view = loadViewResults.view;
            // Zoom with the mouse wheel or pinch; the zoom buttons sat behind the side panel
            _view.ui.remove('zoom');
            if (cancelled) {
                return;
            }
            // show the view at the element & add it to the state
            _view.container = elRef.current;
            setView(_view);
        }
        load();
        return function cleanUp() {
            // cancel any pending attempts to load the view
            // see: https://juliangaramendy.dev/use-promise-subscription/
            cancelled = true;
            // clean up the map view
            destroyView(_view);
        };
    }, []); // similar to componentDidMount(), componentWillUnmount()

    // return the ref and the view
    return [elRef, view];
}
