import { createRoot } from 'react-dom/client';
import React from 'react';

import '@trussworks/react-uswds/lib/uswds.css';
import '@trussworks/react-uswds/lib/index.css';
import 'react-loading-skeleton/dist/skeleton.css';
import '@arcgis/core/assets/esri/themes/light/main.css';

import './index.scss';

import AppSimple from './AppSimple';

//Helpers

// Internationalization
import './utilities/i18n';
import { AppContextProvider } from './context/AppContextSimple';

async function init() {
    const root = createRoot(document.getElementById('root'));

    root.render(
        <React.StrictMode>
            <AppContextProvider>
                <AppSimple />
            </AppContextProvider>
        </React.StrictMode>
    );
}

init();
