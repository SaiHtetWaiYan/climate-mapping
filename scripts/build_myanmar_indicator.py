"""
Convert Climate Futures Myanmar township workbooks into the field layout the
assessment tool reads from its data layer: {TIMEFRAME}_{STAT}_{INDICATOR_ID}
(e.g. HISTORIC_MEAN_D40C, RCP85LATE_MAX_D40C).

Source workbooks have one row per township per model year (30 years) with one
column per scenario. Monthly workbooks (with a `month` column) are summed to
annual totals first. MEAN is the 30-year mean; MIN / MAX are the lowest and
highest single year in the 30-year window.

Townships with blank values are left out (they show as N/A in the tool).

Scenario mapping (the tool's model/timeframe slots):
    Present 1981-2010  -> HISTORIC
    SSP245 2031-2060   -> RCP45MID
    SSP245 2071-2100   -> RCP45LATE
    SSP585 2031-2060   -> RCP85MID
    SSP585 2071-2100   -> RCP85LATE

Usage:
    python3 scripts/build_myanmar_indicator.py <workbook.xlsx> <INDICATOR_ID> [out_dir]

Output goes to data-build/myanmar by default. These files are intermediate and are
not deployed; build_myanmar_townships.py joins them into the GeoJSON the app loads.
"""

import csv
import json
import os
import sys
from collections import defaultdict

import openpyxl

SCENARIO_COLUMNS = {
    'Present 1981-2010': 'HISTORIC',
    'SSP245 2031-2060': 'RCP45MID',
    'SSP245 2071-2100': 'RCP45LATE',
    'SSP585 2031-2060': 'RCP85MID',
    'SSP585 2071-2100': 'RCP85LATE',
}
GEOID_COLUMN = 'TS_PCODE'
YEAR_COLUMN = 'year'
MONTH_COLUMN = 'month'
YEARS_PER_PERIOD = 30
MONTHS_PER_YEAR = 12


def read_workbook(path):
    """Return ({geoid: {timeframe: [annual values]}}, [geoids with blanks])."""
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    rows = wb.active.iter_rows(values_only=True)
    header = list(next(rows))
    missing = [c for c in [GEOID_COLUMN, YEAR_COLUMN, *SCENARIO_COLUMNS] if c not in header]
    if missing:
        raise ValueError(f'{path}: missing columns {missing}')
    monthly = MONTH_COLUMN in header

    # {geoid: {year: {timeframe: total}}}, and months seen per geoid/year
    totals = defaultdict(lambda: defaultdict(lambda: defaultdict(float)))
    months = defaultdict(int)
    blank = set()
    for row in rows:
        row = list(row) + [None] * (len(header) - len(row))
        geoid = row[header.index(GEOID_COLUMN)]
        if not geoid:
            continue
        year = row[header.index(YEAR_COLUMN)]
        months[(geoid, year)] += 1
        for column, timeframe in SCENARIO_COLUMNS.items():
            value = row[header.index(column)]
            if value is None:
                blank.add(geoid)
                continue
            totals[geoid][year][timeframe] += float(value)

    expected_rows = MONTHS_PER_YEAR if monthly else 1
    bad = {geoid for (geoid, _), n in months.items() if n != expected_rows}
    if bad:
        raise ValueError(f'{path}: expected {expected_rows} rows per township-year, got otherwise for {sorted(bad)[:5]}')

    values = {}
    for geoid, years in totals.items():
        if geoid in blank:
            continue
        values[geoid] = {tf: [years[y][tf] for y in sorted(years)] for tf in SCENARIO_COLUMNS.values()}
    return values, sorted(blank)


def summarise(values, indicator_id):
    records = []
    for geoid in sorted(values):
        record = {'GEOID': geoid}
        for timeframe, series in values[geoid].items():
            if len(series) != YEARS_PER_PERIOD:
                raise ValueError(f'{geoid} {timeframe}: expected {YEARS_PER_PERIOD} years, got {len(series)}')
            record[f'{timeframe}_MIN_{indicator_id}'] = round(min(series), 2)
            record[f'{timeframe}_MEAN_{indicator_id}'] = round(sum(series) / len(series), 2)
            record[f'{timeframe}_MAX_{indicator_id}'] = round(max(series), 2)
        records.append(record)
    return records


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    workbook, indicator_id = sys.argv[1], sys.argv[2].upper()
    out_dir = sys.argv[3] if len(sys.argv) > 3 else 'data-build/myanmar'

    values, blank = read_workbook(workbook)
    records = summarise(values, indicator_id)
    os.makedirs(out_dir, exist_ok=True)
    base = os.path.join(out_dir, indicator_id.lower())

    with open(base + '.csv', 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=list(records[0]))
        writer.writeheader()
        writer.writerows(records)
    with open(base + '.json', 'w') as f:
        json.dump(records, f, separators=(',', ':'))

    print(f'{len(records)} townships -> {base}.csv, {base}.json')
    if blank:
        print(f'Left out {len(blank)} townships with blank values: {", ".join(blank)}')


if __name__ == '__main__':
    main()
