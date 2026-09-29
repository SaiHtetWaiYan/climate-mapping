// Framework and third-party non-ui
import React from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { getHazardsWithIndicators } from '../../utilities/geographyUtils';
import { useAppContext } from '../../context/AppContextSimple';

// App components

// Component specific modules (Component-styled, etc.)
import './HazardSelect.scss';

// Third-party components (buttons, icons, etc.)
import { Select } from '@trussworks/react-uswds';

const HazardSelect = () => {
    // ----- Language -----
    const { t } = useTranslation();

    const { selectedHazard, updateSelectedHazard } = useAppContext();

    return (
        <div className="hazardSelect-container grid-row flex-column">
            <h2 className="font-serif-2md" htmlFor="hazard-dropdown">
                {t('Inputs.Hazards.ShortLabel')}
            </h2>
            <Select
                id="hazard-dropdown"
                name="hazard-dropdown"
                value={selectedHazard}
                onChange={(event) => {
                    if (event?.target?.value) {
                        updateSelectedHazard(event.target.value);
                    }
                }}
            >
                {getHazardsWithIndicators().map((hazard, idx) => {
                    return (
                        <option value={hazard.id} key={idx}>
                            {t(`Hazards.${hazard.id}.Title`)}
                        </option>
                    );
                })}
            </Select>
        </div>
    );
};

export default HazardSelect;
