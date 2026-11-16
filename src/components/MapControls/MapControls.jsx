// Framework and third-party non-ui
import React from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';
import AppRoutes from '../../constants/AppRoutes';
import ScreeningData from '../../constants/ScreeningData';

// Third-party components (buttons, icons, etc.)
import { Button, Alert, Icon } from '@trussworks/react-uswds';

// App components
import HazardSelect from '../HazardSelect';
import IndicatorSelect from '../IndicatorSelect';
import ModelSelect from '../ModelSelect/ModelSelect';
import TimeframeSelect from '../TimeframeSelect';
import Divider from '../Divider';
import MapSearch from '../MapSearch';

// Component specific modules (Component-styled, etc.)
import './MapControls.scss';

// Third-party components (buttons, icons, etc.)

const MapControls = () => {
    const [t] = useTranslation();
    const [infoAlertOpen, setInfoAlertOpen] = React.useState(false);
    const [mapControls, setShowMapControls] = React.useState(true);
    // Small screens only: the panel starts closed so the map is visible
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { areaOfInterestInfo, setPage, selectedIndicatorId, updateSearchResult } = useAppContext();

    return (
        <div className={`mapControls-container ${mobileOpen ? 'mobile-open' : ''}`}>
            <button
                type="button"
                className="mapControls__mobile-toggle"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                <span>{t('MapControls.MobileToggle')}</span>
                {mobileOpen ? <Icon.ExpandMore size={3} /> : <Icon.ExpandLess size={3} />}
            </button>
            <div className="mapControls__inner">
                <Alert className="mapControls__inner-alert" type="info" headingLevel="h2">
                    <Button
                        onClick={(e) => {
                            e.currentTarget.closest('.mapControls__inner-alert').classList.add('hidden', 'close');
                            setInfoAlertOpen(!infoAlertOpen);
                        }}
                        className="mapControls__alert-button"
                        aria-label={t('MapControls.WelcomeIntro.ButtonClose')}
                    >
                        <Icon.Close className="mapControls__alert-close" />
                    </Button>
                    <span>
                        <strong>{t('MapControls.WelcomeIntro.Title')}</strong>
                    </span>
                    <span>{t('MapControls.WelcomeIntro.P1')}</span>
                    <span>{t('MapControls.WelcomeIntro.P2')}</span>
                </Alert>
                <h2 className="font-serif-2md mapControls__search-title">{t('MapControls.SearchTitle')}</h2>
                <MapSearch />
                <Divider />
                <div className={`mapControls__inner-controls ${mapControls ? 'active' : ''}`}>
                    {areaOfInterestInfo?.geoName && (
                        <div className="mapControls__inner-header">
                            <h3 className="mapControls__inner-header-title">{areaOfInterestInfo.geoName}</h3>
                            <div className="mapControls__inner-header-actions">
                                <Button
                                    onClick={() => {
                                        setShowMapControls(!mapControls);
                                    }}
                                    className="mapControls__minimize-button"
                                    title="Close filters"
                                    aria-label={
                                        mapControls
                                            ? t('MapControls.CloseBtn.Close')
                                            : t('MapControls.MinimizeBtn.Open')
                                    }
                                >
                                    {mapControls ? (
                                        <Icon.UnfoldLess size={3} className="mapControls__minimize-icon" />
                                    ) : (
                                        <Icon.UnfoldMore size={3} className="mapControls__minimize-icon" />
                                    )}
                                </Button>
                                <Button
                                    onClick={() => {
                                        updateSearchResult(null);
                                    }}
                                    title={t('MapControls.ClearBtn')}
                                    className="mapControls__close-button "
                                    aria-label={t('MapControls.ClearBtn')}
                                >
                                    <Icon.Close size={3} className="mapControls__close-icon" />
                                </Button>
                            </div>
                        </div>
                    )}
                    <HazardSelect />
                    <IndicatorSelect />
                    <TimeframeSelect
                        timeframes={ScreeningData.indicators.find((ind) => ind.id === selectedIndicatorId)?.timeframes}
                    />
                    <ModelSelect />
                    <div className="mapControls__inner-actions">
                        <Button
                            className="mapControls__inner-actions-btn usa-button usa-button--outline"
                            disabled={!areaOfInterestInfo?.geoId}
                            onClick={() => {
                                setPage(AppRoutes.detailsPage);
                            }}
                        >
                            {t('MapControls.InnerActionsBtn1.Title')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

MapControls.propTypes = {};
export default MapControls;
