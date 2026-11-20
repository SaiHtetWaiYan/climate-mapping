// Framework and third-party non-ui
import React from 'react';

// App components
import AppHeader from './components/AppHeader';
import MapPage from './pages/MapPage';
import DetailsPage from './pages/DetailsPage';
import TextPage from './pages/TextPage';

// Hooks, context, and constants
import { useAppContext } from './context/AppContextSimple';
import AppRoutes from './constants/AppRoutes';

import './App.scss';

const App = () => {
    const { page } = useAppContext();

    return (
        <div className="app-container">
            <AppHeader />
            {page === AppRoutes.detailsPage && <DetailsPage />}
            {page === AppRoutes.userGuidePage && <TextPage key="guide" textKey="UserGuide" />}
            {page === AppRoutes.creditsPage && <TextPage key="credits" textKey="CreditsPage" />}
            <MapPage active={page === AppRoutes.mapPage} />
        </div>
    );
};

export default App;
