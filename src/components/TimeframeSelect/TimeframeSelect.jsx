// Framework and third-party non-ui
import React, { useEffect, useState } from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';
import ScreeningData from '../../constants/ScreeningData';

// App components

// Component specific modules (Component-styled, etc.)
import './TimeframeSelect.scss';

// Third-party components (buttons, icons, etc.)
import { Select } from '@trussworks/react-uswds';

const TimeframeSelect = ({ timeframes }) => {
    const { t } = useTranslation();
    const [timeframeOptions, setTimeframeOptions] = useState(Object.values(ScreeningData.timeframe));
    const { timeframe, setTimeframe } = useAppContext();

    useEffect(() => {
        if (timeframes?.length && timeframe) {
            if (!timeframes.includes(timeframe)) {
                setTimeframe(timeframes[0]);
            }
        }
    }, [setTimeframe, timeframe, timeframes]);

    useEffect(() => {
        setTimeframeOptions(timeframes?.length ? timeframes : Object.values(ScreeningData.timeframe));
    }, [timeframes]);

    return (
        <div className="timeframeSelect-container grid-row flex-column">
            <h2 className="font-serif-2md" htmlFor="timeframe-dropdown">
                {t('Inputs.Timeframe.All')}
            </h2>
            <Select
                id="timeframe-dropdown"
                name="timeframe-dropdown"
                value={timeframe}
                onChange={(event) => {
                    if (event?.target?.value) {
                        setTimeframe(event.target.value);
                    }
                }}
            >
                {timeframeOptions.map((timeframe, idx) => {
                    return (
                        <option value={timeframe} key={idx}>
                            {t(`Data.Time.${timeframe}.Label`) +
                                ' (' +
                                t(`Data.Time.${timeframe}.Years`) +
                                ')'}
                        </option>
                    );
                })}
            </Select>
        </div>
    );
};

export default TimeframeSelect;
