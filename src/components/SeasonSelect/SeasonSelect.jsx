// Framework and third-party non-ui
import React from 'react';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';

// Third-party components (buttons, icons, etc.)
import { Select } from '@trussworks/react-uswds';

/**
 * Season dropdown, shown only when there is more than one season to choose from.
 * @param {string[]} seasons season keys, e.g. ['ANNUAL', 'HOT', 'COLD', 'WET']
 * @param {boolean} showLabel show the "Season" heading above the dropdown
 */
const SeasonSelect = ({ seasons, showLabel = true }) => {
    const { t } = useTranslation();
    const { selectedSeason, updateSelectedSeason } = useAppContext();

    if (!seasons || seasons.length < 2) {
        return null;
    }

    return (
        <div className="seasonSelect-container grid-row flex-column">
            {showLabel && <h2 className="font-serif-2md">{t('Inputs.Season.ShortLabel')}</h2>}
            <Select
                id={showLabel ? 'season-dropdown' : 'details-season-dropdown'}
                name="season-dropdown"
                aria-label={t('Inputs.Season.ShortLabel')}
                value={seasons.includes(selectedSeason) ? selectedSeason : seasons[0]}
                onChange={(event) => {
                    if (event?.target?.value) {
                        updateSelectedSeason(event.target.value);
                    }
                }}
            >
                {seasons.map((season) => (
                    <option value={season} key={season}>
                        {t(`Data.Seasons.${season}`)}
                    </option>
                ))}
            </Select>
        </div>
    );
};

export default SeasonSelect;
