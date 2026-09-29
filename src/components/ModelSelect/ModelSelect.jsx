// Framework and third-party non-ui
import React from 'react';
import classNames from 'classnames';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';
import ScreeningData from '../../constants/ScreeningData';

// App components

// Component specific modules (Component-styled, etc.)
import './ModelSelect.scss';

// Third-party components (buttons, icons, etc.)
import { Select } from '@trussworks/react-uswds';

const ModelSelect = ({ column }) => {
    // ----- Language -----
    const { t } = useTranslation();

    const { selectedModel, setSelectedModel } = useAppContext();

    const radioContainerClassName = classNames({
        'modelSelect-container-radio-column font-sans-2xs': column,
        'modelSelect-container-radio-row font-sans-2xs': !column,
    });

    return (
        <div className="modelSelect-container grid-row flex-column">
            <h2 className="font-serif-2md" htmlFor="model-radios">
                {t('Inputs.Models.ShortLabel')}
            </h2>
            <div className={radioContainerClassName}>
                <Select
                    id="model-dropdown"
                    name="model-dropdown"
                    value={selectedModel}
                    onChange={(event) => {
                        if (event?.target?.value) {
                            setSelectedModel(event.target.value);
                        }
                    }}
                >
                    {Object.values(ScreeningData.models).map((model) => (
                        <option value={model} key={`${model}-radio`}>
                            {t(`Data.Models.${model}.ShortLabel`)}
                        </option>
                    ))}
                </Select>
            </div>
        </div>
    );
};

export default ModelSelect;
