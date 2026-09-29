// Framework and third-party non-ui
import React from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { getHazardsWithIndicators } from '../../utilities/geographyUtils';

// App components
import HazardItem from './HazardItem';
// Component specific modules (Component-styled, etc.)
import './HazardList.scss';
import { ButtonGroup } from '@trussworks/react-uswds';

const HazardList = () => {
    const { t } = useTranslation();
    
    return (
        <div className="hazardList-container">
            <ButtonGroup>
                {getHazardsWithIndicators().map((hazard, index) => (
                    <HazardItem key={index} hazardId={hazard.id} />
                ))}
            </ButtonGroup>
        </div>
    );
};

export default HazardList;
