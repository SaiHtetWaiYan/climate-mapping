// Framework and third-party non-ui
import React, { useEffect, useRef } from 'react';
import '@arcgis/map-components/components/arcgis-search';

// Hooks, context, and constants
import { useAppContext } from '../../context/AppContextSimple';

// Component specific modules (Component-styled, etc.)
import './MapSearch.scss';

const MapSearch = () => {
    const searchRef = useRef(null);
    const { searchResult, updateSearchResult, mapView } = useAppContext();

    // Connect the search component to the app's MapView
    useEffect(() => {
        if (searchRef.current && mapView) {
            searchRef.current.view = mapView;
        }
    }, [mapView]);

    // Clear the input when the selection is cleared elsewhere in the app
    useEffect(() => {
        if (!searchResult) {
            searchRef.current?.clear?.();
        }
    }, [searchResult]);

    useEffect(() => {
        const search = searchRef.current;
        if (!search) return;

        const handleComplete = (event) => {
            const result = event.detail?.results?.[0]?.results?.[0];
            if (result) {
                updateSearchResult({ searchTerm: event.detail.searchTerm, result });
            }
        };
        const handleClear = () => updateSearchResult(null);

        search.addEventListener('arcgisSearchComplete', handleComplete);
        search.addEventListener('arcgisSearchClear', handleClear);
        return () => {
            search.removeEventListener('arcgisSearchComplete', handleComplete);
            search.removeEventListener('arcgisSearchClear', handleClear);
        };
    }, [updateSearchResult]);

    return (
        <div className="mapSearch mapSearch--container">
            {/* The app draws its own location marker, so the component's result graphic is off */}
            <arcgis-search
                ref={searchRef}
                class="mapSearch--search-widget-container"
                popup-disabled
                result-graphic-disabled
            />
        </div>
    );
};

MapSearch.propTypes = {};
export default MapSearch;
