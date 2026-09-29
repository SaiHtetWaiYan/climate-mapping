"""
Render the link-preview (Open Graph) image: a title panel next to a map of
Myanmar townships coloured by hot-season days above 40°C, SSP5-8.5 far future.

Usage:
    python3 scripts/build_og_image.py [townships.geojson] [out.png]
"""

import json
import math
import sys

from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1200, 630
SCALE = 2  # draw at 2x, then downsample for smooth edges
FIELD = 'RCP85LATE_MEAN_D40C'

PRIMARY = (22, 46, 81)  # --color-primary
PRIMARY_LIGHT = (41, 67, 125)  # --color-primary-light
BACKGROUND = (240, 240, 240)  # --color-base-lightest
NO_DATA = (205, 205, 205)
OUTLINE = (255, 255, 255)
# Esri "Orange 4", as used for this indicator in the app
RAMP = [(255, 255, 178), (254, 204, 92), (253, 141, 60), (240, 59, 32), (189, 0, 38)]

FONT_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
FONT_REGULAR = '/System/Library/Fonts/Supplemental/Arial.ttf'


def ramp_colour(t):
    t = min(max(t, 0.0), 1.0) * (len(RAMP) - 1)
    i = min(int(t), len(RAMP) - 2)
    f = t - i
    return tuple(round(a + (b - a) * f) for a, b in zip(RAMP[i], RAMP[i + 1]))


def polygons(geometry):
    if geometry['type'] == 'Polygon':
        return [geometry['coordinates']]
    return geometry['coordinates']


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else 'public/data/myanmar/townships.geojson'
    out = sys.argv[2] if len(sys.argv) > 2 else 'public/og-image.png'
    features = json.load(open(src))['features']

    values = [f['properties'][FIELD] for f in features if f['properties'][FIELD] is not None]
    low, high = min(values), max(values)

    lons = [x for f in features for poly in polygons(f['geometry']) for x, _ in poly[0]]
    lats = [y for f in features for poly in polygons(f['geometry']) for _, y in poly[0]]
    min_lon, max_lon, min_lat, max_lat = min(lons), max(lons), min(lats), max(lats)
    lon_factor = math.cos(math.radians((min_lat + max_lat) / 2))

    # Map area: right side of the card
    pad = 30 * SCALE
    box_left, box_right = 700 * SCALE, WIDTH * SCALE - pad
    box_top, box_bottom = pad, HEIGHT * SCALE - pad
    map_w = (max_lon - min_lon) * lon_factor
    map_h = max_lat - min_lat
    scale = min((box_right - box_left) / map_w, (box_bottom - box_top) / map_h)
    off_x = box_left + ((box_right - box_left) - map_w * scale) / 2
    off_y = box_top + ((box_bottom - box_top) - map_h * scale) / 2

    def project(lon, lat):
        return (off_x + (lon - min_lon) * lon_factor * scale, off_y + (max_lat - lat) * scale)

    image = Image.new('RGB', (WIDTH * SCALE, HEIGHT * SCALE), BACKGROUND)
    draw = ImageDraw.Draw(image)

    # Title panel
    draw.rectangle([0, 0, 640 * SCALE, HEIGHT * SCALE], fill=PRIMARY)
    title = ImageFont.truetype(FONT_BOLD, 72 * SCALE)
    subtitle = ImageFont.truetype(FONT_REGULAR, 32 * SCALE)
    small = ImageFont.truetype(FONT_REGULAR, 24 * SCALE)
    x = 64 * SCALE
    draw.text((x, 150 * SCALE), 'Climate', font=title, fill='white')
    draw.text((x, 232 * SCALE), 'Mapping', font=title, fill='white')
    draw.rectangle([x, 336 * SCALE, x + 96 * SCALE, 342 * SCALE], fill=RAMP[3])
    draw.text((x, 372 * SCALE), 'Township climate hazard', font=subtitle, fill='white')
    draw.text((x, 412 * SCALE), 'projections for Myanmar', font=subtitle, fill='white')
    draw.text((x, 500 * SCALE), 'Extreme heat  ·  Humid heat  ·  Drought', font=small, fill=(200, 210, 230))

    # Townships
    for feature in features:
        value = feature['properties'][FIELD]
        fill = NO_DATA if value is None else ramp_colour((value - low) / (high - low))
        for poly in polygons(feature['geometry']):
            ring = [project(lon, lat) for lon, lat in poly[0]]
            draw.polygon(ring, fill=fill, outline=OUTLINE, width=SCALE)

    # Legend
    legend_x, legend_y, legend_w, legend_h = 716 * SCALE, 560 * SCALE, 150 * SCALE, 12 * SCALE
    for i in range(legend_w):
        draw.line([(legend_x + i, legend_y), (legend_x + i, legend_y + legend_h)], fill=ramp_colour(i / legend_w))
    caption = ImageFont.truetype(FONT_REGULAR, 15 * SCALE)
    draw.text((legend_x, legend_y - 44 * SCALE), 'Days above 40°C', font=caption, fill=PRIMARY_LIGHT)
    draw.text((legend_x, legend_y - 24 * SCALE), 'SSP5-8.5, 2071–2100', font=caption, fill=PRIMARY_LIGHT)
    draw.text((legend_x, legend_y + 16 * SCALE), f'{low:.0f}', font=caption, fill=PRIMARY_LIGHT)
    right = f'{high:.0f}'
    draw.text((legend_x + legend_w - draw.textlength(right, font=caption), legend_y + 16 * SCALE), right, font=caption, fill=PRIMARY_LIGHT)

    image.resize((WIDTH, HEIGHT), Image.LANCZOS).save(out, optimize=True)
    print(f'{out} ({WIDTH}x{HEIGHT})')


if __name__ == '__main__':
    main()
