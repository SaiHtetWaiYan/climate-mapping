// Framework and third-party non-ui
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ScreeningData from '../constants/ScreeningData';

// Setter Functions
import {
    _updateAreaOfInterestInfo,
    _updateMapView,
    _updateSelectedHazard,
} from './MapControllerSimple';
import AppRoutes from '../constants/AppRoutes';
import { findIndicator, findVariant, groupOf } from '../utilities/indicatorSeasons';

export const AppContext = createContext();

export const emptyAreaOfInterestInfo = {
    geoId: null,
    geoName: null,
    geometry: null,
    allIndicators: null,
    oid: null,
};

export const AppContextProvider = ({ children }) => {
    const [t] = useTranslation();

    // ----- Data Filters -----
    const [selectedHazard, setSelectedHazard] = useState('extreme_temperature');
    const [selectedIndicatorId, setSelectedIndicatorId] = useState('D40C');
    const [selectedSeason, setSelectedSeason] = useState(ScreeningData.seasons[0]);
    const [selectedModel, setSelectedModel] = useState(ScreeningData.models.rcp45);
    const [timeframe, setTimeframe] = useState(ScreeningData.timeframe.mid);

    // ----- App State -----
    const [alertInfo, setAlertInfo] = useState();
    const [areaOfInterestInfo, setAreaOfInterestInfo] = useState(emptyAreaOfInterestInfo);

    const [indicators, setIndicators] = useState();
    const [page, setPage] = useState(AppRoutes.mapPage);

    // ----- JSAPI State -----
    const [mapView, setMapView] = useState(null);
    const [dataLayerView, setDataLayerView] = useState(null);
    const [townshipsLayerView, setTownshipsLayerView] = useState(null);
    const [searchResult, setSearchResult] = useState(null);
    const [highlightHandle, setHighlightHandle] = useState(null);

    // JSAPI Setters

    const updateMapView = useCallback(
        async (mapView) => {
            try {
                // Add mapView to context
                await _updateMapView(
                    {
                        mapView,
                        setDataLayerView,
                        setTownshipsLayerView,
                    },
                    setMapView
                );
            } catch (error) {
                console.error('Error in updateMapView:', error);
                setAlertInfo({
                    type: 'error',
                    title: t('Alert.MapLoadError.title'),
                    message: t('Alert.MapLoadError.message'),
                });
            }
        },
        [setDataLayerView, setTownshipsLayerView]
    );

    const updateSelectedHazard = useCallback(
        async (value) => {
            await _updateSelectedHazard(
                { value, selectedIndicatorId, selectedSeason, setSelectedIndicatorId },
                setSelectedHazard
            );
        },
        [selectedIndicatorId, selectedSeason, setSelectedIndicatorId]
    );

    // Pick an indicator from the list; seasonal ones use the selected season
    const selectIndicatorGroup = useCallback(
        (groupId) => {
            const indicator = findVariant(groupId, selectedSeason);
            if (indicator) {
                setSelectedIndicatorId(indicator.id);
            }
        },
        [selectedSeason]
    );

    // Change the season and switch the selected indicator to the same season
    const updateSelectedSeason = useCallback(
        (season) => {
            setSelectedSeason(season);
            const current = findIndicator(selectedIndicatorId);
            if (current?.season) {
                setSelectedIndicatorId(findVariant(groupOf(current), season).id);
            }
        },
        [selectedIndicatorId]
    );

    const updateSearchResult = useCallback(
        async (value) => {
            if (!mapView) {
                return;
            }
            setSearchResult(value);
            if (!value || value === 'CLEAR') {
                mapView.graphics.removeAll();
                setAreaOfInterestInfo(emptyAreaOfInterestInfo);
            } else if (value?.result?.feature) {
                await _updateAreaOfInterestInfo({
                    pointGeometry: { ...value.result.feature.geometry.toJSON(), type: 'point' },
                    dataLayerView,
                    mapView,
                    setAreaOfInterestInfo,
                });
            }
        },
        [mapView, dataLayerView, setAreaOfInterestInfo]
    );

    const updateHighlightHandle = useCallback(
        (handle) => {
            // Remove existing highlight
            if (highlightHandle?.remove) {
                highlightHandle?.remove();
            }
            setHighlightHandle(handle);
        },
        [highlightHandle]
    );
    useEffect(() => {
        /**
         * Effect to update the highlight on the map, when the areaOfInterestInfo changes
         */
        if (areaOfInterestInfo) {
            const handle = townshipsLayerView?.highlight(areaOfInterestInfo.oid, { name: 'aoi' });
            updateHighlightHandle(handle);
        } else {
            updateHighlightHandle(null);
        }
    }, [areaOfInterestInfo, townshipsLayerView]);

    useEffect(() => {
        // Cleanup highlight handle on component unmount
        return () => {
            if (highlightHandle?.remove) {
                highlightHandle.remove();
            }
        };
    }, [highlightHandle]);

    useEffect(() => {
        if (selectedHazard && areaOfInterestInfo?.allIndicators) {
            // Seasonal indicators are listed for the selected season only
            const hazardIndicators = areaOfInterestInfo?.allIndicators.filter(
                (indicator) => indicator[selectedHazard] && (!indicator.season || indicator.season === selectedSeason)
            );
            setIndicators(hazardIndicators);
        }
    }, [selectedHazard, selectedSeason, areaOfInterestInfo]);

    return (
        <AppContext.Provider
            value={{
                // Data Filters
                selectedHazard,
                selectedIndicatorId,
                selectedModel,
                selectedSeason,
                timeframe,
                updateSelectedHazard,
                updateSelectedSeason,
                selectIndicatorGroup,
                setSelectedModel,
                setTimeframe,

                setSelectedIndicatorId,

                // App State
                alertInfo,
                setAlertInfo,
                areaOfInterestInfo,
                setAreaOfInterestInfo,
                indicators,
                setIndicators,
                page,
                setPage,

                // JSAPI State
                mapView,
                updateMapView,
                dataLayerView,
                townshipsLayerView,
                searchResult,
                updateSearchResult,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const appContext = useContext(AppContext);
    if (!appContext) throw new Error(`Cannot use 'useAppContext' outside of a AppContextProvider`);
    return appContext;
};
