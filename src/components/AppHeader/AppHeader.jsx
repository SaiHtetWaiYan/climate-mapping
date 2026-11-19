// Framework and third-party non-ui
import React from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { version } from '../../../package.json';

// Component specific modules (Component-styled, etc.)
import './AppHeader.scss';

// Links shown in the header; they are disabled until their pages exist
const NAV_ITEMS = ['DataSources', 'UserGuide'];

// Four bars in the colours of the four hazards (heat, wet bulb, drought, flood)
const LogoMark = () => (
    <svg className="appHeader__logo" viewBox="0 0 28 24" aria-hidden="true" focusable="false">
        <rect x="0" y="10" width="5" height="14" rx="1" fill="#e8743b" />
        <rect x="7.5" y="4" width="5" height="20" rx="1" fill="#9a7bc4" />
        <rect x="15" y="12" width="5" height="12" rx="1" fill="#c79a5b" />
        <rect x="22.5" y="0" width="5" height="24" rx="1" fill="#5aa0d8" />
    </svg>
);

const AppHeader = () => {
    const { t } = useTranslation();

    return (
        <header className="appHeader">
            <div className="appHeader__box appHeader__title-box">
                <LogoMark />
                <h1 className="appHeader__title">{t('App.Title')}</h1>
                <span className="appHeader__version">v{version}</span>
            </div>
            <nav className="appHeader__box appHeader__nav" aria-label={t('AppHeader.NavLabel')}>
                {NAV_ITEMS.map((item) => (
                    <span
                        key={item}
                        className="appHeader__nav-item"
                        aria-disabled="true"
                        title={t('AppHeader.ComingSoon')}
                    >
                        {t(`AppHeader.Nav.${item}`)}
                    </span>
                ))}
            </nav>
        </header>
    );
};

export default AppHeader;
