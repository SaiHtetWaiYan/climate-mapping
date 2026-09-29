// Framework and third-party non-ui
import React from 'react';
import classNames from 'classnames';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContextSimple';

// App components

// Component specific modules (Component-styled, etc.)

// Third-party components (buttons, icons, etc.)

// Images
import ExtremeTemperatureIcon from '../../../images/hazard_icons/extreme_temperature.png';
import DroughtIcon from '../../../images/hazard_icons/drought.png';
import FireIcon from '../../../images/hazard_icons/fire.png';
import FloodingCostalIcon from '../../../images/hazard_icons/flooding_costal.png';
import FloodingInlandIcon from '../../../images/hazard_icons/flooding_inland.png';

import './HazardItem.scss';
import { Button, ButtonGroup } from '@trussworks/react-uswds';

const HazardItem = ({ hazardId }) => {
    // ----- Language -----
    const { t } = useTranslation();

    const { selectedHazard, updateSelectedHazard } = useAppContext();

    const buttonClassName = classNames(['hazardItem', { 'usa-button--outline': hazardId !== selectedHazard }]);

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
        <Button
            className={`hazardItem__btn ${buttonClassName}`}
            onClick={() => {
                updateSelectedHazard(hazardId);
            }}
        >
            {getHazardIcons(hazardId)}
            {t(`Hazards.${hazardId}.Title`)}
        </Button>
    );
};

export default HazardItem;
