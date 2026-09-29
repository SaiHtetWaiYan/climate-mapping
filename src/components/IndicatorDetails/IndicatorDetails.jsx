// Framework and third-party non-ui
import React, { useState } from 'react';
import classNames from 'classnames';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';

// App components
import IndicatorChart from '../IndicatorChart/IndicatorChart';
import IndicatorLongDescription from '../IndicatorLongDescription';

// Component specific modules (Component-styled, etc.)
import './IndicatorDetails.scss';

// Third-party components (buttons, icons, etc.)
import Skeleton from 'react-loading-skeleton';
import IndicatorTable from '../IndicatorTable';

const IndicatorDetails = ({ selectedIndicator }) => {
    // ----- Language -----
    const { t } = useTranslation();
    
    const [mode, setMode] = useState('Chart');

    const chartClassNames = classNames(['usa-button'], {
        active: mode === 'Chart',
    });

    const tableClassNames = classNames(['usa-button'], {
        active: mode === 'Details',
    });

    const textClassNames = classNames(['usa-button'], {
        active: mode === 'Text',
    });

    return (
        <div className="indicatorDetails-container">
            <div className="indicatorDetails-header">
                <h2 className="indicatorDetails-header-title">{t(`Indicators.${selectedIndicator.id}.Title`)}</h2>

                <div className="indicatorDetails-header-actions">
                    <button
                        className={chartClassNames}
                        onClick={() => {
                            setMode('Chart');
                        }}
                    >
                        {t('IndicatorDetails.Tab1')}
                    </button>
                    <button
                        className={tableClassNames}
                        onClick={() => {
                            setMode('Details');
                        }}
                    >
                        {t('IndicatorDetails.Tab2')}
                    </button>
                    <button
                        className={textClassNames}
                        onClick={() => {
                            setMode('Text');
                        }}
                    >
                        {t('IndicatorDetails.Tab3')}
                    </button>
                </div>
            </div>
            <div className="indicatorDetails-content">
                {mode === 'Details' && <IndicatorTable selectedIndicator={selectedIndicator} />}
                {mode === 'Chart' && <IndicatorChart selectedIndicator={selectedIndicator} />}
                {mode === 'Text' && <IndicatorLongDescription selectedIndicator={selectedIndicator} />}
            </div>
        </div>
    );
};

export default IndicatorDetails;
