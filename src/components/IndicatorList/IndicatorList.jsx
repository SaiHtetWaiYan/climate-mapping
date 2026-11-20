// Framework and third-party non-ui
import React, { useEffect, useMemo } from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';
import ScreeningData from '../../constants/ScreeningData';

// App components
import IndicatorItem from './IndicatorItem';
import OptionSelect from '../OptionSelect';
import { optionTypesOfHazard } from '../../utilities/indicatorOptions';

// Component specific modules (Component-styled, etc.)
import './IndicatorList.scss';

// Third-party components (buttons, icons, etc.)
import { Select, Tooltip } from '@trussworks/react-uswds';
import Skeleton from 'react-loading-skeleton';

const futureTimeframes = Object.values(ScreeningData.timeframe).filter(
    (value) => value !== ScreeningData.timeframe.historic
);

const IndicatorList = () => {
    // ----- Language -----
    const { t } = useTranslation();

    const { indicators, timeframe, setTimeframe, selectedHazard } = useAppContext();

    // Seasons or drought indices used by this hazard's indicators
    const hazardOptionTypes = useMemo(() => optionTypesOfHazard(selectedHazard), [selectedHazard]);

    const localIndicators = useMemo(() => {
        return (indicators ?? []).sort((a, b) => a[selectedHazard] - b[selectedHazard]);
    }, [indicators, selectedHazard]);

    useEffect(() => {
        // update the timeframe if it was historic (or has no data) change to the first future timeframe
        if (timeframe && !futureTimeframes.includes(timeframe)) {
            setTimeframe(futureTimeframes[0]);
        }
    }, [setTimeframe, timeframe]);

    return (
        <div className="indicatorList-container grid-col flex-row">
            {!indicators?.length && (
                <div className="indicatorList-skeleton-container">
                    <Skeleton className="indicatorList-item-container-skeleton-item" count={4} />
                </div>
            )}
            {indicators?.length && (
                <div className="indicatorList-item-container grid-row flex-column flex-no-wrap">
                    <div className="indicatorList-header-container">
                        <div className="indicatorList-header-container--start">
                            <h2 className="font-serif-2xs">
                                <span>{t('IndicatorList.Title')}</span>
                            </h2>
                            <Select
                                className=""
                                id="timeframe-dropdown"
                                name="timeframe-dropdown"
                                onChange={(event) => {
                                    if (event?.target?.value) {
                                        setTimeframe(event.target.value);
                                    }
                                }}
                                value={timeframe}
                            >
                                {futureTimeframes.map((value, idx) => (
                                    <option value={value} key={idx}>
                                        {t(`Data.Time.${value}.Label`) + ' (' + t(`Data.Time.${value}.Years`) + ')'}
                                    </option>
                                ))}
                            </Select>
                            {hazardOptionTypes.map((type) => (
                                <OptionSelect
                                    key={type}
                                    type={type}
                                    values={ScreeningData.options[type]}
                                    showLabel={false}
                                />
                            ))}
                        </div>
                        <div className="indicatorList-header-container--end">
                            <div className="indicatorList-header--orange">
                                <Tooltip label={t('Data.Models.RCP45.Tooltip')} position="bottom">
                                    <span className="">{t(`Data.Models.RCP45.ShortLabel`)}</span>
                                </Tooltip>
                            </div>
                            <div className="indicatorList-header--red">
                                <Tooltip
                                    label={t('Data.Models.RCP85.Tooltip')}
                                    position="bottom"
                                    disabled={selectedHazard === ScreeningData.hazardIds.coastalInundation}
                                >
                                    <span className="">{t(`Data.Models.RCP85.ShortLabel`)}</span>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    {localIndicators.map((indicator, idx) => (
                        <IndicatorItem key={idx} indicator={indicator} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default IndicatorList;
