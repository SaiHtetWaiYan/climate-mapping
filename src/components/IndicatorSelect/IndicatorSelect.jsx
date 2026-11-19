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
import { findIndicator, groupOf } from '../../utilities/indicatorSeasons';

const IndicatorSelect = () => {
    // ----- Language -----
    const { t } = useTranslation();

    const { selectedIndicatorId, selectIndicatorGroup, selectedHazard } = useAppContext();

    // One entry per indicator; its seasons are chosen in the season dropdown
    const localIndicators = useMemo(() => {
        const seen = new Set();
        return ScreeningData.indicators
            .filter((indicator) => !!indicator[selectedHazard])
            .sort((a, b) => a[selectedHazard] - b[selectedHazard])
            .filter((indicator) => {
                const group = groupOf(indicator);
                return seen.has(group) ? false : seen.add(group);
            });
    }, [selectedHazard]);

    return (
        <div className="indicatorSelect-container grid-row flex-column">
            <h2 className="font-serif-2md" htmlFor="indicator-dropdown">
                {t('Inputs.Indicators.ShortLabel')}
            </h2>

            <Select
                id="indicator-dropdown"
                name="indicator-dropdown"
                value={groupOf(findIndicator(selectedIndicatorId)) || ''}
                onChange={(event) => {
                    if (event?.target?.value) {
                        selectIndicatorGroup(event.target.value);
                    }
                }}
            >
                {localIndicators.map((indicator, idx) => {
                    return (
                        <option value={groupOf(indicator)} key={idx}>
                            {t(`Indicators.${indicator.id}.GroupTitle`, {
                                defaultValue: t(`Indicators.${indicator.id}.Title`),
                            })}
                        </option>
                    );
                })}
            </Select>
        </div>
    );
};

export default IndicatorSelect;
