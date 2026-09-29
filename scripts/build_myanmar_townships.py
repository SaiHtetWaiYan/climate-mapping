"""
Join Myanmar township boundaries (MIMU, EPSG:4326 GeoJSON) with indicator
records produced by build_myanmar_indicator.py, simplify the geometry, and write
the GeoJSON the assessment tool loads as its township data layer.

Townships without indicator data are kept (with null values) so the map has
no holes.

Usage:
    python3 scripts/build_myanmar_townships.py <boundaries.geojson> <indicator.json> [<indicator.json> ...]
        [--out public/data/myanmar/townships.geojson] [--tolerance 0.003]
"""

import argparse
import json

from shapely.geometry import mapping, shape

BOUNDARY_FIELDS = {
    'TS_PCODE': 'GEOID',
    'TS': 'TS',
    'TS_MMR': 'TS_MMR',
    'ST': 'ST',
}
COORD_PRECISION = 4


def round_coords(coords):
    if isinstance(coords[0], (int, float)):
        return [round(c, COORD_PRECISION) for c in coords]
    return [round_coords(c) for c in coords]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('boundaries')
    parser.add_argument('indicators', nargs='+')
    parser.add_argument('--out', default='public/data/myanmar/townships.geojson')
    parser.add_argument('--tolerance', type=float, default=0.003)
    args = parser.parse_args()

    values = {}
    indicator_fields = []
    for path in args.indicators:
        records = json.load(open(path))
        fields = [k for k in records[0] if k != 'GEOID']
        indicator_fields.extend(fields)
        for record in records:
            values.setdefault(record['GEOID'], {}).update({k: record[k] for k in fields})

    features = []
    for feature in json.load(open(args.boundaries))['features']:
        props = feature['properties']
        out = {target: props[source] for source, target in BOUNDARY_FIELDS.items()}
        record = values.pop(out['GEOID'], {})
        out.update({field: record.get(field) for field in indicator_fields})

        geometry = shape(feature['geometry']).simplify(args.tolerance, preserve_topology=True)
        geometry = mapping(geometry)
        geometry['coordinates'] = round_coords(geometry['coordinates'])
        features.append({'type': 'Feature', 'properties': out, 'geometry': geometry})

    if values:
        raise ValueError(f'No boundary for {len(values)} townships with data: {sorted(values)[:10]}')

    with open(args.out, 'w') as f:
        json.dump({'type': 'FeatureCollection', 'features': features}, f, separators=(',', ':'))

    with_data = sum(1 for f in features if f['properties'][indicator_fields[0]] is not None)
    print(f'{len(features)} townships ({with_data} with data) -> {args.out}')


if __name__ == '__main__':
    main()
