// Framework and third-party non-ui
import React from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import ScreeningData from '../../constants/ScreeningData';

// App components

// Component specific modules (Component-styled, etc.)
import '../IndicatorDetails/IndicatorDetails.scss';
import { indicatorKeyToString } from '../../utilities/indicatorUtils';

// Third-party components (buttons, icons, etc.)

const futureTimeframes = Object.values(ScreeningData.timeframe).filter(
    (timeframe) => timeframe !== ScreeningData.timeframe.historic
);

const IndicatorTable = ({ selectedIndicator }) => {
    // ----- Language -----
    const { t } = useTranslation();

    /**
     * One block of the table: a coloured title, then a row per period.
     * @param {string} title block title
     * @param {string} modifier class suffix for the title colour
     * @param {Array<{timeframe: string, key: string}>} rows period and the indicator value to show
     */
    const renderBlock = (title, modifier, rows) => (
        <div key={`${modifier}-item-container`} className="indicatorDetails-item-container">
            <h5
                className={`indicatorDetails-item-title indicatorDetails-item-title--${modifier} font-serif-1xs text-base-darkest`}
            >
                {title}
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
                {rows.map(({ timeframe, key }) => (
                    <div key={`${timeframe}-item-row`} className="indicatorDetails-item-row">
                        <div className="indicatorDetails-item-row-item font-sans-3xs text-base-darker indicatorDetails-item-row-item-header">
                            <div>{t(`Data.Time.${timeframe}.Label`)}</div>
                            <div>({t(`Data.Time.${timeframe}.Years`)})</div>
                        </div>
                        <div className="indicatorDetails-item-row-item text-ink font-sans-2lg">
                            {indicatorKeyToString(selectedIndicator, key + '_MEAN')}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // The historical period has no emissions scenario, so it gets its own block
    return [
        renderBlock(t('Data.Time.HISTORIC.Label'), 'historic', [
            { timeframe: ScreeningData.timeframe.historic, key: ScreeningData.timeframe.historic },
        ]),
        ...Object.values(ScreeningData.models).map((model) =>
            renderBlock(
                t(`Data.Models.${model}.ShortLabel`),
                model.toLowerCase(),
                futureTimeframes.map((timeframe) => ({ timeframe, key: model + timeframe }))
            )
        ),
    ];
};

export default IndicatorTable;
