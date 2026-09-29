// Framework and third-party non-ui
import React from 'react';

// App components
import MapPage from './pages/MapPage';
import DetailsPage from './pages/DetailsPage';

// Hooks, context, and constants
import { useAppContext } from './context/AppContextSimple';
import AppRoutes from './constants/AppRoutes';

import logo from './images/logo.png';
import './App.scss';

const App = () => {
    const { page } = useAppContext();
    const APP_BASE_URL = import.meta.env.VITE_base_url || import.meta.env.VITE_BASE_URL || '/';

    return (
        <div className="app-container">
            {page === AppRoutes.detailsPage && <DetailsPage />}
            <MapPage active={page === AppRoutes.mapPage} />
            <div className="app-container__window-too-small">
                <div className="app-container__window-too-small-text">
                    <a className="app-container__window-too-small-link" href={APP_BASE_URL}>
                        <img
                            className="app-container__window-too-small-img"
                            src={logo}
                            alt={'Climate Mapping logo'}
                            width="50"
                        />
                        Climate Mapping
                    </a>
                    <p>
                        This tool currently does not support mobile devices or screens that have a resolution less
                        than 720px in width.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;
