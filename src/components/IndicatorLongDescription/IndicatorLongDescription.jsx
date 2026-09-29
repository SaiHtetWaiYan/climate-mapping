// Framework and third-party non-ui
import React from 'react';
import { marked } from 'marked';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';

// Component specific modules (Component-styled, etc.)
import './IndicatorLongDescription.scss';

const IndicatorLongDescription = ({ selectedIndicator }) => {
    const { t } = useTranslation();
    const { areaOfInterestInfo } = useAppContext();

    const getMarkdownText = () => {
        return {
            __html: marked(
                t(`Indicators.${selectedIndicator.id}.LongText`, {
                    ...selectedIndicator,
                    geoName: areaOfInterestInfo.geoName,
                })
            ),
        };
    };

    return <div dangerouslySetInnerHTML={getMarkdownText()} />;
};

IndicatorLongDescription.propTypes = {};
export default IndicatorLongDescription;
