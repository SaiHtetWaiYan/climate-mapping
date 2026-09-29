// Framework and third-party non-ui
import React, { useEffect } from 'react';

// Hooks
import { useMapView } from '../../hooks/useMapView';

// Context
import { useWatch } from '../../hooks/useWatch';

// App components

// Utilities

// JSON & Styles
import './Map.scss';
import { useAppContext } from '../../context/AppContextSimple';

// Third-party components (buttons, icons, etc.)

const Map = ({ basemap }) => {
    // Get values from context
    const { updateMapView } = useAppContext();

    const viewOptions = {
        view: null,
    };

    // Get values from context
    // Use hooks to establish the map view
    const [ref, view] = useMapView(basemap, viewOptions);

    const handleMapReady = async () => {
        try {
            // Initialize map view
            // Update context
            updateMapView(view);
        } catch (err) {
            console.error(err);
        }
    };

    // Watch for When view is ready, init map when ready
    useWatch(view, 'ready', handleMapReady);

    // Removed logic to set display hidden while mapView is loading
    // to add it back consider something like mapview ? '' : 'hidden' to the className below
    return <div ref={ref} className="map-container" />;
};

export default Map;
