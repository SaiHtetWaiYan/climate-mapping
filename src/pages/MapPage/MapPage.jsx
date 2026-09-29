// Framework and third-party non-ui
import React from 'react';
import classNames from 'classnames';

// App components
import AppMap from '../../components/AppMap/AppMap';
import MapControls from '../../components/MapControls';

// Hooks, context, and constants
import AppConfig from '../../constants/AppConfig';

import './MapPage.scss';

const MapPage = ({ active }) => {
    const mapPageClassNames = classNames(['mapPage-container'], {
        hidden: !active,
    });
    return (
        <div className={mapPageClassNames}>
            <MapControls />
            <AppMap basemap={AppConfig.basemap} />
        </div>
    );
};

export default MapPage;
