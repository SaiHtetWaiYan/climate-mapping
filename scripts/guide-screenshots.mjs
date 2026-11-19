// Takes the user guide screenshots with the installed Google Chrome.
// Start the dev server (npm run dev), then run:
//   node scripts/guide-screenshots.mjs [baseUrl]
// Images are written to public/images/user-guide/ as WebP.
import puppeteer from 'puppeteer-core';
import fs from 'fs';

const outDir = new URL('../public/images/user-guide/', import.meta.url).pathname;
const baseUrl = process.argv[2] ?? 'http://localhost:5173/';
const chromePath = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
fs.mkdirSync(outDir, { recursive: true });

// The app must be running, e.g. with `npm run dev` in another terminal
try {
    await fetch(baseUrl);
} catch {
    console.error(`Can't reach ${baseUrl}. Start the dev server first (npm run dev), then run this again.`);
    process.exit(1);
}

if (!fs.existsSync(chromePath)) {
    console.error(`Chrome not found at ${chromePath}. Set CHROME_PATH to your Chrome or Chromium executable.`);
    process.exit(1);
}

const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--hide-scrollbars'],
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function openApp(viewport) {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 120000 });
    // Wait until the township data has coloured the map
    await page.waitForFunction(() => document.querySelector('.mapLegend-values-container')?.innerText.trim(), {
        timeout: 120000,
    });
    await sleep(3000);
    return page;
}

async function shot(page, name, clip) {
    const path = `${outDir}${name}.webp`;
    await page.screenshot({ path, clip, type: 'webp', quality: 80 });
    console.log('saved', path);
}

// Padding around an element's box, kept inside the viewport
async function boxOf(page, selector, pad = 12) {
    const b = await page.$eval(selector, (el) => {
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
    });
    const vp = page.viewport();
    const x = Math.max(0, b.x - pad);
    const y = Math.max(0, b.y - pad);
    return {
        x,
        y,
        width: Math.min(vp.width - x, b.width + pad * 2),
        height: Math.min(vp.height - y, b.height + pad * 2),
    };
}

// ---------- Desktop ----------
const desktop = { width: 1280, height: 900, deviceScaleFactor: 2 };
const page = await openApp(desktop);

// 1. Overview of the map page
await shot(page, '01-overview');

// 2. Click a township to open its pop-up
const points = [
    [868, 400],
    [855, 380],
    [880, 430],
];
let popupOpen = false;
for (const [x, y] of points) {
    await page.mouse.click(x, y);
    await sleep(2500);
    popupOpen = await page.evaluate(() =>
        [...document.querySelectorAll('button, calcite-button')].some((b) => /Select Location/.test(b.textContent))
    );
    if (popupOpen) break;
}
console.log('popup open', popupOpen);
await shot(page, '02-popup');

// Select the township from the pop-up so the filter panel shows its name
await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button, calcite-button')].find((b) =>
        /Select Location/i.test(b.textContent)
    );
    btn?.click();
});
await sleep(2500);

// Close the welcome message so the whole filter panel fits
await page.evaluate(() => document.querySelector('.mapControls__alert-button')?.click());
await sleep(800);

// 3. Filters with the Season dropdown (Wet Bulb Temperature)
await page.select('#hazard-dropdown', 'humid_heat');
await sleep(2500);
await page.select('#indicator-dropdown', 'WBT28');
await sleep(2500);
await page.select('#season-dropdown', 'HOT');
await sleep(3500);
await page.evaluate(() => document.querySelector('.esri-popup')?.remove());
await shot(page, '03-filters', await boxOf(page, '.mapControls-container', 16));

// 4. Legend with its explanation open
await page.click('.mapLegend-info-button');
await sleep(800);
// Show the whole explanation (it scrolls in the app)
await page.evaluate(() => {
    document.querySelector('.mapLegend-info').style.maxHeight = 'none';
});
await sleep(300);
await shot(page, '04-legend', await boxOf(page, '.mapLegend-container', 16));
await page.click('.mapLegend-info-button');
await sleep(500);

// 5. Explore Data: details page with the first indicator expanded
await page.evaluate(() => {
    const btn = [...document.querySelectorAll('.mapControls__inner-actions button')].find((b) =>
        /Explore Data/.test(b.textContent)
    );
    btn?.click();
});
await sleep(2500);
const hasDetails = await page.evaluate(() => !!document.querySelector('.detailsPage-container'));
console.log('details page', hasDetails);
await page.evaluate(() => {
    const row = document.querySelector('.indicatorItem-row-container');
    row?.click();
});
await sleep(2500);
await shot(page, '05-details');
await page.close();

// ---------- Phone ----------
const phone = await openApp({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await shot(phone, '06-phone');
await phone.click('.mapControls__mobile-toggle');
await sleep(1500);
await shot(phone, '07-phone-filters');
await phone.close();

await browser.close();
