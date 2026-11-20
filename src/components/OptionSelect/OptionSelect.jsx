// Framework and third-party non-ui
import React from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';

// Third-party components (buttons, icons, etc.)
import { Select } from '@trussworks/react-uswds';

/**
 * Dropdown for an indicator option: the season or the drought index.
 * Shown only when there is more than one value to choose from.
 * @param {string} type option type, 'season' or 'index' (see ScreeningData.options)
 * @param {string[]} values values to offer, e.g. ['ANNUAL', 'HOT', 'COLD', 'WET']
 * @param {boolean} showLabel show the heading above the dropdown
 */
const OptionSelect = ({ type, values, showLabel = true }) => {
    const { t } = useTranslation();
    const { selectedOptions, updateSelectedOption } = useAppContext();

    if (!values || values.length < 2) {
        return null;
    }

    const selected = selectedOptions[type];

    return (
        <div className="optionSelect-container grid-row flex-column">
            {showLabel && <h2 className="font-serif-2md">{t(`Inputs.Options.${type}`)}</h2>}
            <Select
                id={showLabel ? `${type}-dropdown` : `details-${type}-dropdown`}
                name={`${type}-dropdown`}
                aria-label={t(`Inputs.Options.${type}`)}
                value={values.includes(selected) ? selected : values[0]}
                onChange={(event) => {
                    if (event?.target?.value) {
                        updateSelectedOption(type, event.target.value);
                    }
                }}
            >
                {values.map((value) => (
                    <option value={value} key={value}>
                        {t(`Data.Options.${type}.${value}`)}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default OptionSelect;
