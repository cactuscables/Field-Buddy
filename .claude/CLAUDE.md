# Field Buddy (Tech Portal) — Project Guide

## What This Is
A Progressive Web App for appliance repair workflow. Used daily on iPhone Safari in the field, often with spotty cell service.

**Live:** https://cactuscables.github.io/Field-Buddy/
**Repo:** https://github.com/cactuscables/Field-Buddy

## Architecture
- **Single-file PWA** — all HTML, CSS, and JS live in `index.html` (~1800 lines)
- **No build step** — edit `index.html` directly, deploy via `git push` to GitHub Pages
- **No frameworks** — vanilla HTML/CSS/JS only
- **Offline-capable** via service worker (`sw.js`) with network-first, cache-fallback strategy
- **External dependency:** Tesseract.js v5 loaded from CDN (OCR feature)

## Local Development
```bash
cd ~/Projects/Field-Buddy && python3 -m http.server 8080
```
Then open http://localhost:8080 in browser. No npm, no build, no compilation.

## Deploying
```bash
git add -A && git commit -m "description" && git push origin main
```
GitHub Pages serves from `main` branch automatically. Changes are live in ~60 seconds.

**Important:** After updating `sw.js`, bump `CACHE_NAME` version (currently `'tech-portal-v2'`) so browsers pick up the new service worker.

## App Structure (Tabs in index.html)

### Lookup Tab (lines ~660-700)
- Model number input with brand auto-detection from prefix patterns
- Generates deep-links to: Marcone, Sears Parts Direct, Reliable Parts
- Brand-specific links for Bosch, Thermador, Viking, GE
- Auto-copies model number to clipboard
- Search history saved in localStorage

### Notes Tab (lines ~1015-1206)
- Workorder note template with markdown formatting
- Service Call / Install Labor toggle
- Auto-fills date and model number from Lookup tab
- Copy to clipboard, save/load via localStorage

### Parts Tab (lines ~666-713)
- Sends part orders to "Dustin's Parts" Google Sheet
- Fields: Customer, Invoice #, Part #, Description, Status, Warranty flag
- Column C format: `***P# [number]*** **[description]**`
- Warranty flag highlights entire row yellow in the sheet
- Uses hidden iframe to POST to Google Apps Script (avoids CORS)

### History Tab
- All past searches saved and reloadable from localStorage

### OCR/Camera (lines ~1264-1603)
- Tesseract.js for in-browser OCR of model/serial tags
- Auto-rotate: tries 0, 90, 270 degrees for sideways tags
- Image preprocessing and downscaling for performance
- Smart label detection (MOD., SER., MODEL, SERIAL patterns)

## Google Sheets Integration
- **Backend:** `google-apps-script.js` — deployed as Google Apps Script Web App
- **Sheet name:** "Parts to be ordered" tab within the "Dustin's Parts" spreadsheet (hard-coded in script)
- **Columns:** A=Customer, B=Invoice#, C=Part Info, D=Status
- **Row logic:** Scans column A for first empty row (fills gaps)
- **Auth:** Script URL stored in browser localStorage (user enters once)
- **CORS workaround:** Hidden iframe GET request instead of fetch()

## Key Configuration (in index.html)

### Sites Config (~line 745)
`SITES` object maps brand names to arrays of search URLs. `{model}` placeholder gets replaced.

### Brand Detection (~line 805)
`BRAND_PATTERNS` array of regex prefixes mapped to brand names. Order matters — first match wins.

## Common Brands
Whirlpool family (Whirlpool/Maytag/KitchenAid/Amana), Samsung, LG, Frigidaire, GE, Electrolux, Bosch, Thermador, Viking

## Conventions
- Heavy inline comments explaining what each section does
- CSS organized by component with section headers
- Dark theme: background `#1a1a2e`, header `#16213e`, accent `#0f3460`
- Mobile-first design, tested primarily on iPhone Safari
- localStorage keys prefixed with app context (search history, notes, sheet URL)

## What NOT to Do
- Don't add npm/build tooling — this is intentionally a zero-build project
- Don't split into multiple files unless there's a strong reason — single-file keeps deployment simple
- Don't remove inline comments — they're there for learning
- Don't change the Google Sheet column format without checking with the boss
