import AppConfig from '../constants/AppConfig';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import MapSymbols from '../constants/MapSymbols';
import ScreeningData from '../constants/ScreeningData';
import { findIndicator, findVariant, groupOf } from '../utilities/indicatorOptions';
import { getIndicatorData, unionExtents } from '../utilities/arcgisUtils';
import { getTownshipName } from '../utilities/geographyUtils';
import { loadTownshipsGeoJSON } from '../utilities/townshipData';
import { emptyAreaOfInterestInfo } from './AppContextSimple';

const _updateMapView = async (args, setter) => {
    const { mapView, setDataLayerView, setTownshipsLayerView } = args;

    const townshipsLayer = new GeoJSONLayer({
        url: await loadTownshipsGeoJSON(),
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
    const { value, selectedIndicatorId, selectedOptions, setSelectedIndicatorId } = args;
    // If the selected indicator isn't part of the new hazard, select the hazard's first indicator
    const selectedIndicator = findIndicator(selectedIndicatorId);

    if (!selectedIndicator || !selectedIndicator[value]) {
        const firstIndicator = ScreeningData.indicators
            .filter((indicator) => indicator[value])
            .sort((a, b) => a[value] - b[value])[0];
        if (firstIndicator) {
            setSelectedIndicatorId(findVariant(groupOf(firstIndicator), selectedOptions).id);
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
