// Framework and third-party non-ui
import React from 'react';

// App components
import HazardList from '../../components/HazardList';
import IndicatorList from '../../components/IndicatorList/IndicatorList';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';
import AppRoutes from '../../constants/AppRoutes';

// Third-party components (buttons, icons, etc.)
import { Button, Icon } from '@trussworks/react-uswds';

import './DetailsPage.scss';

const DetailsPage = () => {
    // ----- Language -----
    const { t } = useTranslation();

    const { areaOfInterestInfo, setPage } = useAppContext();

    return (
        <div className="detailsPage-container">
            <section className="detailsPage__header">
                <div className="detailsPage__header-start">
                    <Button
                        className="detailsPage__header-button usa-button--ghost-light"
                        onClick={() => {
                            setPage(AppRoutes.mapPage);
                        }}
                    >
                        <Icon.ArrowBack className="detailsPage__header-start-icon" size={2} />
                        {t('App.BackButtonText')}
                    </Button>
                    <h2 className="detailsPage__header-title--desktop">{areaOfInterestInfo.geoName}</h2>
                </div>
                <div className="detailsPage__header-end">
                </div>
            </section>
            <h2 className="detailsPage__header-title--mobile">{areaOfInterestInfo.geoName}</h2>
            <HazardList />
            <IndicatorList />
        </div>
    );
};

export default DetailsPage;
