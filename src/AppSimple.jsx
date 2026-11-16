// Framework and third-party non-ui
import React from 'react';

// App components
import MapPage from './pages/MapPage';
import DetailsPage from './pages/DetailsPage';

// Hooks, context, and constants
import { useAppContext } from './context/AppContextSimple';
import AppRoutes from './constants/AppRoutes';

import './App.scss';

const App = () => {
    const { page } = useAppContext();

    return (
        <div className="app-container">
            {page === AppRoutes.detailsPage && <DetailsPage />}
            <MapPage active={page === AppRoutes.mapPage} />
        </div>
    );
};

export default App;
