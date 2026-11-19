// Framework and third-party non-ui
import React, { useState } from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';
import ScreeningData from '../../constants/ScreeningData';
import { findIndicator } from '../../utilities/indicatorSeasons';

// Third-party components (buttons, icons, etc.)
import { Icon } from '@trussworks/react-uswds';

// Component specific modules (Component-styled, etc.)
import './MapLegend.scss';

// Images
import ExtremeTemperatureIcon from '../../images/hazard_icons/extreme_temperature.png';
import DroughtIcon from '../../images/hazard_icons/drought.png';
import FireIcon from '../../images/hazard_icons/fire.png';
import FloodingCostalIcon from '../../images/hazard_icons/flooding_costal.png';
import FloodingInlandIcon from '../../images/hazard_icons/flooding_inland.png';

const MapLegend = ({ colorRamp, values }) => {
    const [t] = useTranslation();
    const { selectedIndicatorId, selectedHazard, timeframe, selectedModel } = useAppContext();
    const [infoOpen, setInfoOpen] = useState(false);

    const indicator = findIndicator(selectedIndicatorId);
    const isHistoric = timeframe === ScreeningData.timeframe.historic;
    const [low, mid, high] = (values ?? []).map((value) => String(value).replace('+', ''));

    const getHazardIcons = (hazardId) => {
        switch (hazardId) {
            case 'extreme_temperature':
                return <img src={ExtremeTemperatureIcon} alt="Extreme Temperature Icon" />;
            case 'humid_heat':
                return <img src={ExtremeTemperatureIcon} alt="Wet Bulb Temperature Icon" />;
            case 'drought':
                return <img src={DroughtIcon} alt="Drought Icon" />;
            case 'fire':
                return <img src={FireIcon} alt="Fire Icon" />;
            case 'flooding_inland':
                return <img src={FloodingInlandIcon} alt="Flood Icon" />;
            case 'flooding_costal':
                return <img src={FloodingCostalIcon} alt="Costal Flooding Icon" />;
            // no default
        }
    };

    return (
        <div className="mapLegend-container">
            <button
                type="button"
                className="mapLegend-info-button"
                aria-expanded={infoOpen}
                aria-controls="map-legend-info"
                aria-label={infoOpen ? t('MapLegend.CloseButton') : t('MapLegend.InfoButton')}
                title={infoOpen ? t('MapLegend.CloseButton') : t('MapLegend.InfoButton')}
                onClick={() => setInfoOpen(!infoOpen)}
            >
                {infoOpen ? <Icon.Close aria-hidden size={3} /> : <Icon.Info aria-hidden size={3} />}
            </button>
            {infoOpen && (
                <div id="map-legend-info" className="mapLegend-info font-sans-3xs">
                    <h3 className="mapLegend-info-title">{t('MapLegend.InfoTitle')}</h3>
                    <p>{t(`Indicators.${selectedIndicatorId}.Details`)}.</p>
                    <p>
                        {t('MapLegend.Showing', {
                            period: isHistoric
                                ? t('Data.Time.HISTORIC.LongLabel')
                                : `${t(`Data.Time.${timeframe}.Label`)} (${t(`Data.Time.${timeframe}.Years`)})`,
                            scenario: isHistoric
                                ? ''
                                : t('MapLegend.Scenario', { scenario: t(`Data.Models.${selectedModel}.ShortLabel`) }),
                        })}
                    </p>
                    <p>{t(indicator?.lowerIsWorse ? 'MapLegend.LowerDarker' : 'MapLegend.HigherDarker')}</p>
                    {mid !== undefined && <p>{t('MapLegend.Numbers', { low, mid, high })}</p>}
                    <p>{t('MapLegend.NoData')}</p>
                    <p>{t('MapLegend.Click')}</p>
                </div>
            )}
            <div className="mapLegend-row">
                <div className="mapLegend-icon">{getHazardIcons(selectedHazard)}</div>
                <div className="mapLegend-header font-sans-2xs">{t(`Indicators.${selectedIndicatorId}.Title`)}</div>
            </div>
            <div className="mapLegend-row">
                <div className="mapLegend-values-container">
                    {values?.map((value, index) => (
                        <div key={`map-legend-value-${index}`}>{value}</div>
                    ))}
                </div>
            </div>
            <div className="mapLegend-row">
                <div className={`mapLegend-colors-container ${colorRamp}`}></div>
            </div>
        </div>
    );
};

MapLegend.propTypes = {};
export default MapLegend;
