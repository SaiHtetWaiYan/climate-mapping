// Framework and third-party non-ui
import React from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';

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
    const { selectedIndicatorId, selectedHazard } = useAppContext();

    const getHazardIcons = (hazardId) => {
        switch (hazardId) {
            case 'extreme_temperature':
                return <img src={ExtremeTemperatureIcon} alt="Extreme Temperature Icon" />;
            case 'drought':
                return <img src={DroughtIcon} alt="Drought Icon" />;
            case 'fire':
                return <img src={FireIcon} alt="Fire Icon" />;
            case 'flooding_inland':
                return <img src={FloodingInlandIcon} alt="Inland Flooding Icon" />;
            case 'flooding_costal':
                return <img src={FloodingCostalIcon} alt="Costal Flooding Icon" />;
            // no default
        }
    };

    return (
        <div className="mapLegend-container">
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
