// Framework and third-party non-ui
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import * as rendererJsonUtils from '@arcgis/core/renderers/support/jsonUtils';
import classNames from 'classnames';
import numeral from 'numeral';

// Hooks, context, and constants
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContextSimple';
import { useDebouncedEffect } from '../../hooks/useDebouncedEffect';
import {
    getIndicatorVisualVariable,
    mergeAttributesWithIndicators,
} from '../../utilities/arcgisUtils';
import { getTownshipName } from '../../utilities/geographyUtils';

import AppConfig from '../../constants/AppConfig';
import AppRoutes from '../../constants/AppRoutes';
import ScreeningData from '../../constants/ScreeningData';
import MapSymbols from '../../constants/MapSymbols';

// App components
import Map from '../Map';
import MapLegend from '../MapLegend';

// Component specific modules (Component-styled, etc.)
import './AppMap.scss';

// Third-party components (buttons, icons, etc.)
import ClipLoader from 'react-spinners/ClipLoader';

const AppMap = ({ basemap }) => {
    // ----- Language -----
    const { t } = useTranslation();
    // ----- Context -----
    const {
        // JSAPI State
        dataLayerView,
        setAlertInfo,
        mapView,

        // Data Filters
        selectedHazard,
        selectedIndicatorId,
        selectedModel,
        timeframe,

        // App State
        setAreaOfInterestInfo,
        setPage,
    } = useAppContext();

    // ----- State -----
    const [showMapLoading, setShowMapLoading] = useState(false);
    const [rendererJSON, setRendererJSON] = useState();

    // ----- Effects -----
    useDebouncedEffect(
        /**
         * When the data filters change, update the renderer
         */
        () => {
            updateRenderer();
        },
        [
            // normally I would just have updateRenderer here, but it's not debounced.
            mapView,
            dataLayerView,
            selectedHazard,
            selectedIndicatorId,
            selectedModel,
            timeframe,
        ],
        200
    );

    useEffect(
        /**
         * Effect to update the map renderer when data filters change
         * The main trigger is a change to the rendererJSON state
         * @returns {void}
         */
        () => {
            if (!dataLayerView) {
                return;
            }
            if (!rendererJSON) {
                dataLayerView.layer.renderer = MapSymbols.emptyRenderer;
                return;
            }
            dataLayerView.layer.visible = true;
            dataLayerView.layer.renderer = rendererJsonUtils.fromJSON(rendererJSON);
        },
        [dataLayerView, rendererJSON, t]
    );

    const updateRenderer = useCallback(async () => {
        try {
            if (!dataLayerView || !mapView) return;

            const timeoutId = setTimeout(() => {
                setShowMapLoading(true);
            }, 500);
            const modelPrefix = timeframe === ScreeningData.timeframe.historic ? '' : selectedModel;
            const indicatorFieldName = `${modelPrefix}${timeframe}_${ScreeningData.statistics.mean}_${selectedIndicatorId}`;

            const visualVariable = await getIndicatorVisualVariable(
                dataLayerView,
                ScreeningData.indicators.find((ind) => ind.id === selectedIndicatorId),
                indicatorFieldName
            );

            // I was having issues with references being maintained when modifying the renderer template
            const rendererTemplate = JSON.parse(JSON.stringify(AppConfig.renderer));

            // get the template renderer from comfig and update field
            const renderer = { ...rendererTemplate, field: indicatorFieldName };
            // add color visual variable for selcted indicator
            renderer.visualVariables.push({ ...visualVariable, field: indicatorFieldName });
            console.log('renderer', renderer);
            setRendererJSON(renderer);
            clearTimeout(timeoutId);
            setShowMapLoading(false);
        } catch (error) {
            setAlertInfo({
                heading: t('Alert.RenderError.Title'),
                message: t('Alert.RenderError.Message'),
            });
        }
    }, [dataLayerView, mapView, setAlertInfo, setShowMapLoading, selectedIndicatorId, timeframe, selectedModel, t]);

    const popupTitle = useMemo(() => {
        const { nameField, regionNameField } = ScreeningData.township;
        return `{${nameField}}, {${regionNameField}}`;
    }, []);

    const legendValues = useMemo(() => {
        if (!rendererJSON) {
            return [];
        }
        const field = rendererJSON.field;
        const visualVariable = rendererJSON.visualVariables.find((vv) => vv.field === field);
        if (!visualVariable) {
            return [];
        }
        const stops = visualVariable.stops;
        const values = stops
            .filter((s, idx) => {
                return [0, 2, 4].includes(idx);
            })
            .map((stop) => stop.value);
        values[values.length - 1] += '+';
        return values;
    }, [rendererJSON, selectedIndicatorId]);

    const colorRamp = useMemo(() => {
        const indicator = ScreeningData.indicators.find((ind) => ind.id === selectedIndicatorId);
        if (!indicator) return 'error';

        return indicator.colorRampName?.toLowerCase().replace(' ', '-') || 'orange-4';
    }, [selectedIndicatorId]);

    useEffect(() => {
        if (!dataLayerView) return;

        if (!rendererJSON || !selectedIndicatorId) {
            dataLayerView.layer.popupTemplate = null;
            mapView?.closePopup();
            return;
        }
        const field = rendererJSON.field;
        // update popup
        const fieldInfos = [
            {
                fieldName: field,
                format: {
                    digitSeparator: true,
                    places: 1,
                },
            },
        ];
        dataLayerView.layer.popupTemplate = {
            title: popupTitle,
            outFields: ['*'],
            content: (feature) => {
                const indicator = (attr) => t(`Indicators.${selectedIndicatorId}.${attr}`);
                const { attributes, geometry } = feature.graphic;
                const objectIdField = dataLayerView.layer.objectIdField;
                const div = document.createElement('div');
                const divInner = document.createElement('div');
                const actions = document.createElement('div');

                // Add classes to the divs
                div.classList.add('popup-content');
                divInner.classList.add('popup-content-inner');
                actions.classList.add('popup-actions');

                const popupContent = `
                    <h2>${
                        attributes[field] === null || attributes[field] === undefined
                            ? 'N/A'
                            : `${indicator('Prefix')} ${numeral(attributes[field]).format(indicator.format)} ${indicator(
                                  'Postfix'
                              )}`
                    }</h2>
                    <p>${indicator('Title')}</p>
                `;
                divInner.innerHTML = popupContent;

                const popupButtonExplore = document.createElement('button');
                popupButtonExplore.innerText = t('Map.Popup.actionButton1');
                popupButtonExplore.classList.add('usa-button', 'e-popup__explore-data');

                const popupButtonUse = document.createElement('button');
                popupButtonUse.innerText = t('Map.Popup.actionButton2');
                popupButtonUse.classList.add('usa-button', 'e-popup__use-location');

                actions.appendChild(popupButtonUse);
                actions.appendChild(popupButtonExplore);
                div.appendChild(divInner);
                div.appendChild(actions);

                // configure popup button click handlers
                popupButtonExplore.addEventListener('click', () => {
                    mapView.graphics.removeAll();
                    setAreaOfInterestInfo({
                        allIndicators: mergeAttributesWithIndicators({ attributes, objectIdField }),
                        geoId: attributes[ScreeningData.township.geoIdField],
                        geoName: getTownshipName(attributes),
                        geometry: geometry,
                        oid: attributes[objectIdField],
                    });
                    mapView.closePopup();
                    setPage(AppRoutes.detailsPage);
                });

                popupButtonUse.addEventListener('click', () => {
                    mapView.graphics.removeAll();
                    // Set the AOI info but do not navigate
                    setAreaOfInterestInfo({
                        allIndicators: mergeAttributesWithIndicators({ attributes, objectIdField }),
                        geoId: attributes[ScreeningData.township.geoIdField],
                        geoName: getTownshipName(attributes),
                        geometry: geometry,
                        oid: attributes[objectIdField],
                    });
                });

                return div;
            },
            fieldInfos,
        };
    }, [selectedIndicatorId, dataLayerView, mapView, popupTitle, rendererJSON, t]);

    const loadingIndicatorClassNames = classNames(['appMap-loading'], {
        'appMap-loading--hidden': !showMapLoading,
    });

    return (
        <div className={'appMap-full'}>
            <div className={loadingIndicatorClassNames}>
                <div className="appMap-loading-background"></div>
                <ClipLoader loading={true} size={30} />
            </div>
            <MapLegend values={legendValues} colorRamp={colorRamp} />
            <Map basemap={basemap} />
        </div>
    );
};

export default AppMap;
