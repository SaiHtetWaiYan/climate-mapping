// Framework and third-party non-ui
import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import ScreeningData from '../../../constants/ScreeningData';
import { useAppContext } from '../../../context/AppContextSimple';

// App components
import IndicatorDetails from '../../IndicatorDetails';

// Component specific modules (Component-styled, etc.)
import './IndicatorItem.scss';
import { indicatorToString } from '../../../utilities/indicatorUtils';

// Third-party components (buttons, icons, etc.)
// import { IconInfoOutline, Tooltip } from '@trussworks/react-uswds';

const IndicatorItemCell = ({ indicator, modelType, usePostfix = false }) => {
    const { t } = useTranslation();
    const indicatorKey = `Indicators.${indicator.id}`;
    const { timeframe } = useAppContext();

    const historicalValue = indicator[`${ScreeningData.timeframe.historic}_MEAN`];

    const value = indicator[`${modelType}${timeframe}_MEAN`];
    const delta = Math.round((value - historicalValue) * 100) / 100;
    const hasHistoricalValue = value !== null && historicalValue !== undefined && historicalValue !== null;

    const getDeltaSign = (delta) => (delta === 0 ? 'NoDelta' : delta > 0 ? 'PositiveDelta' : 'NegativeDelta');

    return (
        <div className="indicatorList-table-data-column indicatorList-data">
            <div className="indicatorItem-metric indicatorList-table-data-column grid-row flex-row">
                <div>{t(`${indicatorKey}.Prefix`)}</div>
                <p className="font-sans-2lg indicatorItem-data">{indicatorToString(indicator, value)}</p>
                <div className="font-sans-4xs text-base">{t(`${indicatorKey}.Postfix`)}</div>
            </div>
            <div className="indicatorItem-metric indicatorList-table-data-column grid-row flex-row">
                <div className="font-sans-4xs text-base">
                    {hasHistoricalValue &&
                        t(`IndicatorItem.${getDeltaSign(delta)}`, {
                            value: indicatorToString(indicator, Math.abs(delta)),
                            postfix: usePostfix ? t(`${indicatorKey}.Postfix`) : '',
                        })}
                </div>
            </div>
        </div>
    );
};

const IndicatorItem = ({ indicator }) => {
    // ----- Language -----
    const { t } = useTranslation();

    const { selectedHazard } = useAppContext();

    const [showDetails, setShowDetails] = useState(false);

    const containerClassName = classNames(['indicatorItem-container']);

    useEffect(() => {
        // Close details if hazard changes
        setShowDetails(false);
    }, [selectedHazard]);

    const handleIndicatorClick = useCallback(() => {
        setShowDetails(!showDetails);
    }, [showDetails]);

    return (
        <div className={containerClassName}>
            <div className="indicatorItem-row-container" onClick={handleIndicatorClick}>
                <div className="indicatorItem-row-container--start">
                    <h5
                        className="indicatorList-table-main-column indicatorItem-title font-sans-sm"
                        title={t(`Indicators.${indicator.id}.Details`)}
                    >
                        {t(`Indicators.${indicator.id}.Title`)}
                    </h5>
                </div>
                <div className="indicatorItem-row-container--end">
                    <IndicatorItemCell indicator={indicator} modelType={ScreeningData.models.rcp45} />
                    <IndicatorItemCell indicator={indicator} modelType={ScreeningData.models.rcp85} usePostfix />
                </div>
            </div>
            {showDetails && <IndicatorDetails selectedIndicator={indicator} />}
        </div>
    );
};

export default IndicatorItem;
