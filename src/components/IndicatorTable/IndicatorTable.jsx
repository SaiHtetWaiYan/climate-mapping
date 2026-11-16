// Framework and third-party non-ui
import React from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';
import ScreeningData from '../../constants/ScreeningData';

// App components

// Component specific modules (Component-styled, etc.)
import '../IndicatorDetails/IndicatorDetails.scss';
import { indicatorKeyToString } from '../../utilities/indicatorUtils';

// Third-party components (buttons, icons, etc.)

const IndicatorTable = ({ selectedIndicator }) => {
    // ----- Language -----
    const { t } = useTranslation();
    const { selectedHazard } = useAppContext();

    return Object.values(ScreeningData.models).map((model) => {
        return (
            <div key={`${model}-item-container`} className="indicatorDetails-item-container">
                {/* Table Title */}
                <h5 className="indicatorDetails-item-title font-serif-1xs font-serif-1xs text-base-darkest">
                    {t(`Data.Models.${model}.ShortLabel`)}
                </h5>
                <div className="indicatorDetails-item-row-container">
                    {/* Header cells */}
                    <div className="indicatorDetails-item-row indicatorDetails-item-row-header">
                        <div className="indicatorDetails-item-row-item" key="empty"></div>
                        <div className="indicatorDetails-item-row-item" key="mean">
                            <span className="font-sans-3xs text-base">{t('Data.Stats.MEAN')}</span>
                            <span className="font-sans-4xs text-base">
                                ({t(`Indicators.${selectedIndicator.id}.Postfix`)})
                            </span>
                        </div>
                    </div>
                    {/* Data Cells */}
                    {Object.values(ScreeningData.timeframe).map((timeframe) => {
                        const notHistoric = timeframe !== ScreeningData.timeframe.historic;
                        let modelTimeframe = notHistoric ? model + timeframe : timeframe;

                        return (
                            <div key={`${timeframe}-item-row`} className="indicatorDetails-item-row">
                                <div
                                    className="indicatorDetails-item-row-item font-sans-3xs text-base-darker indicatorDetails-item-row-item-header"
                                    key={timeframe + '-label'}
                                >
                                    <div key="timeframe-label">{t(`Data.Time.${timeframe}.Label`)}</div>
                                    <div key="timeframe-years">({t(`Data.Time.${timeframe}.Years`)})</div>
                                </div>
                                <div
                                    className="indicatorDetails-item-row-item text-ink font-sans-2lg"
                                    key={timeframe + '-mean'}
                                >
                                    {indicatorKeyToString(selectedIndicator, modelTimeframe + '_MEAN')}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    });
};

export default IndicatorTable;
