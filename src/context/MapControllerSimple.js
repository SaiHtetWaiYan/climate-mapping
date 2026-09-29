import AppConfig from '../constants/AppConfig';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import MapSymbols from '../constants/MapSymbols';
import ScreeningData from '../constants/ScreeningData';
import { getIndicatorData, unionExtents } from '../utilities/arcgisUtils';
import { getTownshipName } from '../utilities/geographyUtils';
import { emptyAreaOfInterestInfo } from './AppContextSimple';

const _updateMapView = async (args, setter) => {
    const { mapView, setDataLayerView, setTownshipsLayerView } = args;

    const townshipsLayer = new GeoJSONLayer({
        url: AppConfig.datasets.townships.url,
        renderer: MapSymbols.emptyRenderer,
        visible: false,
        outFields: ['*'],
    });
    mapView.map.add(townshipsLayer);

    const townshipsLayerView = await mapView.whenLayerView(townshipsLayer);
    setTownshipsLayerView(townshipsLayerView);
    setDataLayerView(townshipsLayerView);

    await mapView.goTo(townshipsLayer.fullExtent);
    await setter(mapView);
};

const _updateSelectedHazard = async (args, setter) => {
    const { value, selectedIndicatorId, setSelectedIndicatorId } = args;
    /**
     * Some indicators are shared across multiple hazards.
     * When switching hazards, ensure the selected indicator is valid for the new hazard.
     * If not, set it to the first available indicator for that hazard.
     */
    const indicators = ScreeningData.indicators;
    const selectedIndicator = indicators.find((indicator) => indicator.id === selectedIndicatorId);

    if (!selectedIndicator || !selectedIndicator[value]) {
        const firstIndicator = indicators
            .sort((a, b) => a[value] - b[value])
            .find((indicator) => indicator[value]);
        if (firstIndicator) {
            setSelectedIndicatorId(firstIndicator.id);
        }
    }
    await setter(value);
};

const _updateAreaOfInterestInfo = async (args) => {
    // do something with args if needed
    const { pointGeometry, dataLayerView, mapView, setAreaOfInterestInfo } = args;

    mapView.graphics.removeAll();

    mapView.graphics.add({
        geometry: pointGeometry,
        symbol: MapSymbols.location,
    });
    if (pointGeometry && dataLayerView) {
        const indicatorDataResult = await getIndicatorData({
            layerView: dataLayerView,
            geometry: pointGeometry,
            mapView: mapView,
        });

        const indicators = indicatorDataResult.data;
        const standardGeoGeometry = indicatorDataResult.geometry;
        if (standardGeoGeometry && mapView) {
            const extent = unionExtents({
                pologons: [standardGeoGeometry],
                expandFactor: AppConfig.zoomToGeomExtentFactor ? AppConfig.zoomToGeomExtentFactor : 1.5,
            });
            mapView.goTo({
                target: extent,
            });
        }
        const { geoIdField } = ScreeningData.township;
        if (indicators.length) {
            const indicator = indicators[0];
            setAreaOfInterestInfo({
                allIndicators: indicators,
                geoId: indicator[geoIdField],
                geoName: getTownshipName(indicator),
                geometry: standardGeoGeometry,
                oid: indicator.OID,
            });
        } else {
            setAreaOfInterestInfo(emptyAreaOfInterestInfo);
        }
    } else {
        setAreaOfInterestInfo(emptyAreaOfInterestInfo);
    }
};

export { _updateMapView, _updateSelectedHazard, _updateAreaOfInterestInfo };
