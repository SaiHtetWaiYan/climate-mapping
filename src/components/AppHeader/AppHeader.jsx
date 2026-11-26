// Framework and third-party non-ui
import React, { useEffect, useRef, useState } from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { Icon } from '@trussworks/react-uswds';
import { useAppContext } from '../../context/AppContextSimple';
import AppRoutes from '../../constants/AppRoutes';
import { version } from '../../../package.json';

// Component specific modules (Component-styled, etc.)
import './AppHeader.scss';

// Links shown in the header: `href` opens another site in a new tab, `page` a page of this app
const NAV_ITEMS = [
    { key: 'MainPage', href: 'https://www.climatefutures-mm.org/' },
    { key: 'UserGuide', page: AppRoutes.userGuidePage },
    { key: 'CreditsAndSources', page: AppRoutes.creditsPage },
];

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
    const { page: currentPage, openTextPage } = useAppContext();
    // Narrow screens: the links open from a menu button
    const [menuOpen, setMenuOpen] = useState(false);
    const headerRef = useRef(null);

    // Close the menu with Escape or a click outside the header
    useEffect(() => {
        if (!menuOpen) {
            return undefined;
        }
        const onKeyDown = (event) => event.key === 'Escape' && setMenuOpen(false);
        const onPointerDown = (event) => !headerRef.current?.contains(event.target) && setMenuOpen(false);
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('pointerdown', onPointerDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('pointerdown', onPointerDown);
        };
    }, [menuOpen]);

    return (
        <header ref={headerRef} className={`appHeader ${menuOpen ? 'appHeader--menu-open' : ''}`}>
            <div className="appHeader__box appHeader__title-box">
                <LogoMark />
                <h1 className="appHeader__title">{t('App.Title')}</h1>
                <span className="appHeader__version">v{version}</span>
                <button
                    type="button"
                    className="appHeader__menu-button"
                    aria-expanded={menuOpen}
                    aria-controls="app-header-nav"
                    aria-label={menuOpen ? t('AppHeader.CloseMenu') : t('AppHeader.OpenMenu')}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <Icon.Close aria-hidden size={3} /> : <Icon.Menu aria-hidden size={3} />}
                </button>
            </div>
            <nav id="app-header-nav" className="appHeader__box appHeader__nav" aria-label={t('AppHeader.NavLabel')}>
                {NAV_ITEMS.map(({ key, href, page }) =>
                    page ? (
                        <button
                            key={key}
                            type="button"
                            className="appHeader__nav-item appHeader__nav-button"
                            aria-current={currentPage === page ? 'page' : undefined}
                            onClick={() => {
                                setMenuOpen(false);
                                openTextPage(page);
                            }}
                        >
                            {t(`AppHeader.Nav.${key}`)}
                        </button>
                    ) : (
                        <a
                            key={key}
                            className="appHeader__nav-item"
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t(`AppHeader.Nav.${key}`)}
                        </a>
                    )
                )}
            </nav>
        </header>
    );
};

export default AppHeader;
