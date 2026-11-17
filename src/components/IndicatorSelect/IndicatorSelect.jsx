// Framework and third-party non-ui
import React, { useMemo } from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';

// App components

// Component specific modules (Component-styled, etc.)
import './IndicatorSelect.scss';

// Third-party components (buttons, icons, etc.)
import { Select } from '@trussworks/react-uswds';
import ScreeningData from '../../constants/ScreeningData';

const IndicatorSelect = () => {
    // ----- Language -----
    const { t } = useTranslation();

    const { selectedIndicatorId, setSelectedIndicatorId, selectedHazard } = useAppContext();

    const localIndicators = useMemo(() => {
        return ScreeningData.indicators
            .filter((indicator) => !!indicator[selectedHazard])
            .sort((a, b) => a[selectedHazard] - b[selectedHazard]);
    }, [selectedHazard]);

    return (
        <div className="indicatorSelect-container grid-row flex-column">
            <h2 className="font-serif-2md" htmlFor="indicator-dropdown">
                {t('Inputs.Indicators.ShortLabel')}
            </h2>

            <Select
                id="indicator-dropdown"
                name="indicator-dropdown"
                value={selectedIndicatorId || ''}
                onChange={(event) => {
                    if (event?.target?.value) {
                        setSelectedIndicatorId(event?.target?.value);
                    }
                }}
            >
                {localIndicators.map((indicator, idx) => {
                    return (
                        <option value={indicator.id} key={idx}>
                            {t(`Indicators.${indicator.id}.Title`)}
                        </option>
                    );
                })}
            </Select>
        </div>
    );
};

export default IndicatorSelect;
