# Field Buddy (Tech Portal) — Project Guide

## What This Is
A Progressive Web App for appliance repair workflow. Used daily on iPhone Safari in the field, often with spotty cell service.

**Live:** https://cactuscables.github.io/Field-Buddy/
**Repo:** https://github.com/cactuscables/Field-Buddy

## Architecture
- **Single-file PWA** — all HTML, CSS, and JS live in `index.html` (~2700 lines)
- **No build step** — edit `index.html` directly, deploy via `git push` to GitHub Pages
- **No frameworks** — vanilla HTML/CSS/JS only
- **Offline-capable** via service worker (`sw.js`) with network-first, cache-fallback strategy
- **External dependencies:** Tesseract.js v5 (CDN), Google Fonts (Barlow Condensed, JetBrains Mono)

## Local Development
```bash
cd ~/Projects/field-buddy && python3 -m http.server 8080
```
Then open http://localhost:8080 in browser. No npm, no build, no compilation.

## Deploying
```bash
git add -A && git commit -m "description" && git push origin main
```
GitHub Pages serves from `main` branch automatically. Changes are live in ~60 seconds.

**Important:** After updating `sw.js`, bump `CACHE_NAME` version (currently `'tech-portal-v6'`) so browsers pick up the new service worker.

## Navigation Structure

### Bottom Tab Bar (fixed, 3 primary tabs)
- **Lookup** — model search + brand detection + parts site links
- **Notes** — workorder note builder
- **Parts** — send parts to Google Sheet

### Menu Drawer (via "More" button)
- **History** — past searches
- **Stock** — truck inventory
- **Resources** — manufacturer phone numbers (one-tap calling)

### Job Context Bar (sticky header)
- Shows "TECH PORTAL" when no job is active
- Shows model number, brand chip, and customer name when a job is active
- Tap to expand/edit job details (model, serial, customer, invoice)
- Clear button to end current job

## Job Context System

Central state object that flows data between all tabs:
```javascript
const currentJob = {
  modelNumber: '',   // → Lookup input, Notes model
  serialNumber: '',  // → Notes serial
  brand: '',         // → Lookup brand chip
  customerName: '',  // → Parts customer
  invoiceNum: ''     // → Parts invoice
};
```
- **localStorage key:** `fb_current_job`
- Changes in any tab propagate to all others automatically
- Job persists across page refreshes
- Infinite-loop guard: `setJobField()` skips propagation if value unchanged

## App Features

### Lookup Tab
- Model number input with camera button for OCR
- Brand auto-detection from model prefix patterns
- 12 brand chips for manual override
- Search generates deep-links to parts sites (Marcone, Sears Parts Direct, Reliable Parts, Appliantology + brand-specific)
- Appliantology link searches downloadable files (service manuals, tech sheets) via `_nodeSelectName=downloads_file_node` filter
- "Open All" button opens all sites at once
- Auto-copies model to clipboard, auto-updates job context

### Notes Tab
- Workorder note template with markdown formatting
- Service Call / Install Labor toggle
- Model/Serial auto-filled from job context
- **Enter key** in a bullet input creates the next bullet
- **Collapsible preview** (collapsed by default, saves space)
- **Condensed layout** — inputs, toggles, and bullets sized smaller (44px touch targets) to maximize visible area when iPhone keyboard is up
- **Inline action buttons** — Copy and Copy & Open Dispatch scroll with content (not sticky, to save vertical space)
- Save/load notes to localStorage

### Parts Tab
- Sends part orders to "Dustin's Parts" Google Sheet via JSONP
- Customer/Invoice auto-filled from job context
- **Quick Send mode**: after first part sent, customer/invoice/status collapse to a summary strip; only Part # and Description remain visible
- Tap the summary strip to expand and edit
- Clear resets to full form
- Warranty checkbox highlights row yellow in sheet

### OCR/Camera
- Tesseract.js for in-browser OCR of model/serial tags
- Auto-rotate: tries 0°, 90°, 270° for sideways tags
- Image preprocessing and downscaling for performance
- Smart label detection: Phase 1 line-based matching (highest confidence), Phase 2 full-text regex fallback, Phase 3 token heuristics
- Results flow to job context automatically

### Resources Tab
- Searchable list of manufacturer phone numbers
- One-tap calling via `tel:` links
- Add/delete contacts with optional notes
- Stored in localStorage (`fb_resources`), alphabetically sorted

### Truck Stock
- Fetches inventory from separate Google Apps Script
- Real-time search filtering
- Color coding: red = out of stock, yellow = low stock
- Cached in localStorage for offline use

## CSS Architecture

### Custom Properties (`:root`)
All colors, fonts, and spacing defined as CSS variables:
- `--bg: #111118` — page background
- `--surface: #1a1f2e` — cards, panels
- `--input-bg: #0d1220` — input fields
- `--primary: #e94560` — primary accent (red)
- `--secondary: #3d7fff` — secondary accent (blue)
- `--text: #f0f0f0` / `--text-muted: #8890a0`
- `--border: #2a3040`
- `--font-display: 'Barlow Condensed'` — headers, labels, buttons
- `--font-mono: 'JetBrains Mono'` — part numbers, previews

### Design Language
- Industrial/utilitarian aesthetic
- 2px borders, 6-8px border radius
- Minimum 48px touch targets (60px for primary actions)
- Subtle noise texture on background
- Blueprint-style dashed section dividers
- `prefers-reduced-motion` respected

## Google Sheets Integration
- **Backend:** `google-apps-script.js` — deployed as Google Apps Script Web App
- **Sheet name:** "Parts to be ordered" tab within the "Dustin's Parts" spreadsheet
- **Columns:** A=Customer, B=Invoice#, C=Part Info, D=Status
- **Row logic:** Scans column A for first empty row (fills gaps)
- **Auth:** Script URL stored in browser localStorage (user enters once)
- **CORS workaround:** JSONP (script tag injection) instead of fetch()

## localStorage Keys
- `fb_current_job` — active job context
- `fb_history` — search history (max 50)
- `fb_notes` — saved notes (max 100)
- `fb_sheets_url` — Google Apps Script URL for parts
- `fb_truck_stock_url` — Google Apps Script URL for stock
- `fb_truck_stock` — cached stock data
- `fb_parts_log` — sent parts log (max 200)
- `fb_resources` — manufacturer phone contacts

## Gotchas
- **Toggle button selectors must be scoped** — Notes uses `.toggle-btn[data-type]`, Parts uses `.toggle-btn[data-status]`. Using unscoped `.toggle-btn` will create cross-tab listener collisions.
- **Inline styles can't use `var()`** — any remaining inline `style=` attributes with hardcoded colors should be migrated to CSS classes when touched.
- **Service worker caching** — users may need to close/reopen the app to get updates even after bumping `CACHE_NAME`. Force-refresh doesn't work on iOS PWAs.

## What NOT to Do
- Don't add npm/build tooling — this is intentionally a zero-build project
- Don't split into multiple files unless there's a strong reason — single-file keeps deployment simple
- Don't remove inline comments — they're there for learning
- Don't change the Google Sheet column format without checking with the boss
- Don't break the JSONP callback pattern for Google Sheets integration
