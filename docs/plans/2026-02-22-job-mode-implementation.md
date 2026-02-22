# Field Buddy "Job Mode" Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign Field Buddy's frontend with a job-centric workflow, industrial aesthetic, bigger touch targets, and streamlined data flow between tabs.

**Architecture:** Single-file PWA (index.html). All changes happen in one file — CSS first, then HTML restructuring, then JS for job state management. Each task is independently committable and testable by loading in browser.

**Tech Stack:** Vanilla HTML/CSS/JS, no frameworks, no build tools. Google Fonts for Barlow Condensed. Service worker for offline caching.

---

### Task 1: Add Google Fonts and CSS Custom Properties

**Files:**
- Modify: `index.html:1-34` (head + body styles)

**Step 1: Add Google Fonts link in `<head>`**

Add after line 14 (before `<title>`):

```html
<!-- Industrial typography — Barlow Condensed for headers/labels -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Step 2: Replace base CSS with custom properties and new palette**

Replace the `body` rule (lines 27-34) and add CSS custom properties to `:root`:

```css
:root {
  /* Industrial dark palette */
  --bg: #111118;
  --surface: #1a1f2e;
  --input-bg: #0d1220;
  --primary: #e94560;
  --primary-dark: #c73650;
  --secondary: #3d7fff;
  --text: #f0f0f0;
  --text-muted: #8890a0;
  --border: #2a3040;
  --success: #22c55e;
  --warning: #eab308;

  /* Typography */
  --font-display: 'Barlow Condensed', sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Courier New', monospace;

  /* Spacing */
  --radius: 8px;
  --radius-sm: 6px;
}

body {
  font-family: var(--font-body);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overscroll-behavior: none;
  /* Subtle noise texture for industrial feel */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
}
```

**Step 3: Verify in browser**

Run: `cd ~/Projects/field-buddy && python3 -m http.server 8080`
Open: http://localhost:8080
Expected: Darker background with subtle noise texture, fonts loading. Colors will be off until CSS migration is complete — that's expected.

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add CSS custom properties, Google Fonts, industrial palette"
```

---

### Task 2: Migrate all CSS to use custom properties and increase touch targets

**Files:**
- Modify: `index.html:36-640` (all CSS rules)

**Step 1: Update header CSS (lines 39-53)**

```css
.header {
  background: var(--surface);
  padding: 12px 20px;
  text-align: center;
  border-bottom: 2px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header h1 {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 2px;
  text-transform: uppercase;
}
```

**Step 2: Update form elements CSS (lines 97-195)**

Labels — bigger, using display font:
```css
label {
  display: block;
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
  margin-top: 18px;
}
```

Inputs — chunky, 54px height:
```css
input[type="text"],
input[type="date"],
select,
textarea {
  width: 100%;
  padding: 16px 18px;
  background: var(--input-bg);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 18px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  min-height: 54px;
}

input[type="text"]:focus,
input[type="date"]:focus,
select:focus,
textarea:focus {
  border-color: var(--primary);
}
```

Primary buttons — 60px, industrial:
```css
.btn-primary {
  width: 100%;
  padding: 18px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 20px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  transition: background 0.15s, transform 0.1s;
  min-height: 60px;
}

.btn-primary:active {
  background: var(--primary-dark);
  transform: scale(0.97);
}
```

Secondary buttons — 48px:
```css
.btn-secondary {
  width: 100%;
  padding: 14px;
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: var(--radius-sm);
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: all 0.15s, transform 0.1s;
  min-height: 48px;
}

.btn-secondary:active {
  background: var(--primary);
  color: white;
  transform: scale(0.97);
}
```

Small buttons — 48px minimum:
```css
.btn-small {
  padding: 14px 20px;
  background: var(--surface);
  color: var(--text);
  border: 2px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  margin-right: 8px;
  min-height: 48px;
  transition: border-color 0.15s, transform 0.1s;
}

.btn-small:active {
  border-color: var(--primary);
  transform: scale(0.97);
}
```

**Step 3: Update brand chips CSS (lines 197-222)**

```css
.brand-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.brand-chip {
  padding: 12px 18px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 24px;
  color: var(--text-muted);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s, transform 0.1s;
  min-height: 48px;
  display: flex;
  align-items: center;
}

.brand-chip.selected {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

.brand-chip:active {
  transform: scale(0.95);
}
```

**Step 4: Update results, notes, history, toggle, bullet, and remaining CSS**

Update all remaining selectors to use `var()` references — replace every hardcoded color:
- `#0f3460` → `var(--surface)` or `var(--input-bg)` depending on context
- `#1a4a7a` → `var(--border)`
- `#e94560` → `var(--primary)`
- `#c73650` → `var(--primary-dark)`
- `#e0e0e0` → `var(--text)`
- `#8a8a9a` → `var(--text-muted)`
- `#c0c0d0` → `var(--text-muted)`
- `#1a1a2e` → `var(--bg)`
- `#16213e` → `var(--surface)`
- `#4caf50` → `var(--success)`
- `#ffc107` → `var(--warning)`

Key specific updates:

Toggle buttons:
```css
.toggle-btn {
  flex: 1;
  padding: 16px;
  background: var(--input-bg);
  border: none;
  color: var(--text-muted);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  min-height: 52px;
  letter-spacing: 0.5px;
}
```

Bullet rows — bigger remove button:
```css
.bullet-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.bullet-row span {
  color: var(--primary);
  font-weight: bold;
  font-size: 20px;
}

.remove-bullet {
  background: rgba(233, 69, 96, 0.15);
  border: none;
  color: var(--primary);
  font-size: 22px;
  cursor: pointer;
  padding: 0;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}

.remove-bullet:active {
  background: rgba(233, 69, 96, 0.3);
}
```

Note preview — bigger monospace:
```css
.note-preview {
  background: var(--input-bg);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  color: var(--text-muted);
  min-height: 120px;
}
```

Section dividers — dashed blueprint style:
```css
.section-divider {
  border: none;
  border-top: 2px dashed var(--border);
  margin: 24px 0;
}
```

Camera button — bigger:
```css
.camera-btn {
  width: 56px;
  height: 56px;
  background: var(--primary);
  border: none;
  border-radius: var(--radius-sm);
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s, transform 0.1s;
}

.camera-btn:active {
  background: var(--primary-dark);
  transform: scale(0.95);
}
```

History items — bigger:
```css
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 10px;
  cursor: pointer;
  min-height: 56px;
  transition: border-color 0.15s;
}

.history-item:active {
  border-color: var(--primary);
}

.history-model {
  font-weight: 700;
  font-size: 16px;
}

.history-brand {
  font-size: 13px;
  color: var(--text-muted);
}

.history-date {
  font-size: 13px;
  color: var(--text-muted);
}
```

Saved note items — bigger:
```css
.saved-note-item {
  padding: 16px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 10px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.saved-note-item:active {
  border-color: var(--primary);
}

.saved-note-title {
  font-weight: 700;
  font-size: 16px;
}

.saved-note-meta {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 6px;
}
```

Result links — bigger:
```css
.result-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--surface);
  border-radius: var(--radius);
  margin-bottom: 10px;
  text-decoration: none;
  color: var(--text);
  border: 2px solid var(--border);
  transition: border-color 0.15s;
  min-height: 56px;
}

.result-link:active {
  border-color: var(--primary);
}

.result-link .site-name {
  font-weight: 700;
  font-size: 16px;
}

.result-link .site-note {
  font-size: 13px;
  color: var(--text-muted);
}
```

Toast — use success color:
```css
.toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--success);
  color: white;
  padding: 14px 28px;
  border-radius: var(--radius);
  font-weight: 700;
  font-size: 16px;
  opacity: 0;
  transition: all 0.2s;
  pointer-events: none;
  z-index: 1000;
}
```

Stock table — bigger text:
```css
.stock-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.stock-table th {
  text-align: left;
  padding: 12px 8px;
  color: var(--text-muted);
  border-bottom: 2px solid var(--border);
  font-family: var(--font-display);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stock-table td {
  padding: 12px 8px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}

.stock-table td:first-child {
  font-family: var(--font-mono);
  font-size: 14px;
}

.stock-table td:last-child {
  text-align: right;
  font-weight: 700;
  white-space: nowrap;
}

.stock-row-out td {
  background: rgba(233, 69, 96, 0.15);
  color: var(--primary);
}

.stock-row-low td {
  background: rgba(234, 179, 8, 0.12);
  color: var(--warning);
}
```

OCR overlay and results — use variables:
```css
.ocr-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 200;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.ocr-status {
  color: var(--primary);
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: 1px;
}

.ocr-progress {
  width: 220px;
  height: 8px;
  background: var(--surface);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.ocr-progress-bar {
  height: 100%;
  background: var(--primary);
  width: 0%;
  transition: width 0.3s;
}

.ocr-result-item {
  padding: 16px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 8px;
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 16px;
  cursor: pointer;
  min-height: 56px;
  transition: border-color 0.15s;
}

.ocr-result-item:active {
  border-color: var(--primary);
}

.ocr-result-item .ocr-tag {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--text-muted);
  display: block;
  margin-top: 4px;
}

.ocr-close-btn {
  margin-top: 16px;
  padding: 16px 36px;
  background: transparent;
  color: var(--text-muted);
  border: 2px solid var(--text-muted);
  border-radius: var(--radius-sm);
  font-size: 16px;
  cursor: pointer;
  min-height: 52px;
}
```

**Step 5: Verify in browser**

Run: `python3 -m http.server 8080` (if not already running)
Expected: Complete visual overhaul — darker palette, industrial fonts, all touch targets visibly larger. All functionality still works. Test all 5 tabs.

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: migrate CSS to custom properties, increase all touch targets"
```

---

### Task 3: Restructure HTML — Bottom tab bar, job context bar, secondary tabs in menu

**Files:**
- Modify: `index.html` (HTML structure lines 643-838, plus new CSS)

**Step 1: Add new CSS for bottom tab bar, context bar, and menu overlay**

Add these rules to the `<style>` section (after existing rules, before `</style>`):

```css
/* ========================================
   BOTTOM TAB BAR — Primary navigation
   ======================================== */
.bottom-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: var(--surface);
  border-top: 2px solid var(--border);
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.bottom-tab-btn {
  flex: 1;
  padding: 8px 0 6px;
  background: none;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-height: 60px;
  justify-content: center;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  transition: color 0.15s;
  position: relative;
}

.bottom-tab-btn .tab-icon {
  font-size: 22px;
  line-height: 1;
}

.bottom-tab-btn.active {
  color: var(--primary);
}

.bottom-tab-btn.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 20%;
  right: 20%;
  height: 3px;
  background: var(--primary);
  border-radius: 0 0 3px 3px;
}

/* Menu button in tab bar */
.bottom-tab-btn.menu-btn {
  color: var(--text-muted);
}

/* ========================================
   JOB CONTEXT BAR — Replaces static header
   ======================================== */
.job-context-bar {
  background: var(--surface);
  border-bottom: 2px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
}

.job-context-bar .app-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 2px;
}

.job-context-bar .job-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.job-context-bar .job-info {
  display: none;
  flex: 1;
}

.job-context-bar.has-job .app-title-wrap {
  display: none;
}

.job-context-bar.has-job .job-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.job-model {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
}

.job-brand-chip {
  padding: 4px 12px;
  background: var(--primary);
  border-radius: 12px;
  color: white;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.job-customer {
  font-size: 14px;
  color: var(--text-muted);
  margin-left: auto;
}

.job-clear-btn {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  margin-left: 8px;
}

/* Job detail panel (expands on tap) */
.job-detail-panel {
  display: none;
  background: var(--surface);
  border-bottom: 2px solid var(--border);
  padding: 0 20px 16px;
}

.job-detail-panel.visible {
  display: block;
}

/* ========================================
   SECONDARY MENU OVERLAY
   ======================================== */
.menu-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 150;
}

.menu-overlay.visible {
  display: block;
}

.menu-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-top: 2px solid var(--border);
  border-radius: 16px 16px 0 0;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0));
  z-index: 151;
  transform: translateY(100%);
  transition: transform 0.25s ease-out;
}

.menu-overlay.visible .menu-drawer {
  transform: translateY(0);
}

.menu-drawer-handle {
  width: 40px;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  margin: 0 auto 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 16px;
  background: var(--input-bg);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 10px;
  cursor: pointer;
  min-height: 60px;
  transition: border-color 0.15s;
}

.menu-item:active {
  border-color: var(--primary);
}

.menu-item-icon {
  font-size: 24px;
}

.menu-item-label {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Add bottom padding to content area so it's not hidden behind tab bar */
.tab-content {
  display: none;
  padding: 20px;
  padding-bottom: 100px;
  max-width: 600px;
  margin: 0 auto;
}
```

**Step 2: Replace the header and tab bar HTML (lines 643-657)**

Replace the old header and tab bar with:

```html
<!-- ==================== JOB CONTEXT BAR ==================== -->
<div class="job-context-bar" id="jobContextBar">
  <!-- Default state: app title -->
  <div class="app-title-wrap">
    <div class="app-title">TECH PORTAL</div>
    <div class="job-subtitle">No active job</div>
  </div>
  <!-- Active job state -->
  <div class="job-info">
    <span class="job-model" id="jobBarModel">—</span>
    <span class="job-brand-chip" id="jobBarBrand" style="display:none"></span>
    <span class="job-customer" id="jobBarCustomer"></span>
    <button class="job-clear-btn" id="jobClearBtn" title="Clear job">&times;</button>
  </div>
</div>

<!-- Job detail panel (expand to edit job fields) -->
<div class="job-detail-panel" id="jobDetailPanel">
  <label for="jobModel">Model Number</label>
  <input type="text" id="jobModel" placeholder="Enter model number"
         autocapitalize="characters" autocomplete="off" spellcheck="false">
  <label for="jobSerial">Serial Number</label>
  <input type="text" id="jobSerial" placeholder="Enter serial number"
         autocapitalize="characters" autocomplete="off" spellcheck="false">
  <label for="jobCustomer">Customer Name</label>
  <input type="text" id="jobCustomer" placeholder="e.g. Smith, John">
  <label for="jobInvoice">Invoice #</label>
  <input type="text" id="jobInvoice" placeholder="e.g. 12345"
         autocomplete="off" spellcheck="false">
</div>
```

**Step 3: Remove old top tab bar, add bottom tab bar + menu overlay before `</body>`**

Remove the old `<div class="tab-bar">...</div>` (lines 651-657).

Add before `</body>` (after the toast div):

```html
<!-- ==================== BOTTOM TAB BAR ==================== -->
<div class="bottom-tab-bar">
  <button class="bottom-tab-btn active" data-tab="lookup">
    <span class="tab-icon">&#128270;</span>
    Lookup
  </button>
  <button class="bottom-tab-btn" data-tab="notes">
    <span class="tab-icon">&#128221;</span>
    Notes
  </button>
  <button class="bottom-tab-btn" data-tab="parts">
    <span class="tab-icon">&#128230;</span>
    Parts
  </button>
  <button class="bottom-tab-btn menu-btn" id="menuToggleBtn">
    <span class="tab-icon">&#9776;</span>
    More
  </button>
</div>

<!-- ==================== SECONDARY MENU OVERLAY ==================== -->
<div class="menu-overlay" id="menuOverlay">
  <div class="menu-drawer">
    <div class="menu-drawer-handle"></div>
    <div class="menu-item" data-menu-tab="history">
      <span class="menu-item-icon">&#128337;</span>
      <span class="menu-item-label">Search History</span>
    </div>
    <div class="menu-item" data-menu-tab="stock">
      <span class="menu-item-icon">&#128666;</span>
      <span class="menu-item-label">Truck Stock</span>
    </div>
  </div>
</div>
```

**Step 4: Remove old `.tab-bar` and `.tab-btn` CSS rules (lines 55-95)**

Delete the old top tab bar CSS. The `.tab-content` rule is already updated above.

**Step 5: Update tab switching JS (lines 950-959)**

Replace the old tab switching code with:

```javascript
// ============================================================
// TAB SWITCHING — Bottom tab bar + menu
// ============================================================

function switchTab(tabName) {
  // Deactivate all tabs and panels
  document.querySelectorAll('.bottom-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  // Activate the target panel
  document.getElementById(tabName).classList.add('active');
  // Activate the matching bottom tab button (if it's a primary tab)
  const matchingBtn = document.querySelector(`.bottom-tab-btn[data-tab="${tabName}"]`);
  if (matchingBtn) matchingBtn.classList.add('active');
}

// Primary tab buttons
document.querySelectorAll('.bottom-tab-btn[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    switchTab(btn.dataset.tab);
  });
});

// Menu toggle
document.getElementById('menuToggleBtn').addEventListener('click', () => {
  document.getElementById('menuOverlay').classList.add('visible');
});

// Menu items open secondary tabs
document.querySelectorAll('[data-menu-tab]').forEach(item => {
  item.addEventListener('click', () => {
    const tabName = item.dataset.menuTab;
    switchTab(tabName);
    document.getElementById('menuOverlay').classList.remove('visible');
  });
});

// Close menu on overlay backdrop click
document.getElementById('menuOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('menuOverlay')) {
    document.getElementById('menuOverlay').classList.remove('visible');
  }
});
```

**Step 6: Verify in browser**

Expected: Bottom tab bar with 3 primary tabs + More button. More opens a slide-up menu with History and Stock. Job context bar shows at top with "TECH PORTAL" title. All tabs still function.

**Step 7: Commit**

```bash
git add index.html
git commit -m "feat: bottom tab bar, job context bar, secondary tabs in menu drawer"
```

---

### Task 4: Implement Job Context state management and data flow

**Files:**
- Modify: `index.html` (JS section)

**Step 1: Add job state object and setter functions**

Add after the APP STATE section (around line 943):

```javascript
// ============================================================
// JOB CONTEXT — Central state that flows to all tabs
// ============================================================

const currentJob = {
  modelNumber: '',
  serialNumber: '',
  brand: '',
  customerName: '',
  invoiceNum: ''
};

// Load persisted job from localStorage
function loadJob() {
  const saved = localStorage.getItem('fb_current_job');
  if (saved) {
    try {
      Object.assign(currentJob, JSON.parse(saved));
      updateJobUI();
    } catch (e) { /* ignore corrupted data */ }
  }
}

// Save job to localStorage
function saveJob() {
  localStorage.setItem('fb_current_job', JSON.stringify(currentJob));
}

// Update a job field and propagate to all tabs
function setJobField(key, value) {
  currentJob[key] = value;
  saveJob();
  updateJobUI();
  propagateJobData();
}

// Check if a job is active (at least model number set)
function hasActiveJob() {
  return !!(currentJob.modelNumber || currentJob.customerName);
}

// Update the context bar display
function updateJobUI() {
  const bar = document.getElementById('jobContextBar');
  const active = hasActiveJob();

  bar.classList.toggle('has-job', active);

  if (active) {
    document.getElementById('jobBarModel').textContent = currentJob.modelNumber || '—';
    const brandChipEl = document.getElementById('jobBarBrand');
    if (currentJob.brand) {
      brandChipEl.textContent = currentJob.brand;
      brandChipEl.style.display = '';
    } else {
      brandChipEl.style.display = 'none';
    }
    document.getElementById('jobBarCustomer').textContent = currentJob.customerName || '';
  }

  // Sync the detail panel fields
  document.getElementById('jobModel').value = currentJob.modelNumber;
  document.getElementById('jobSerial').value = currentJob.serialNumber;
  document.getElementById('jobCustomer').value = currentJob.customerName;
  document.getElementById('jobInvoice').value = currentJob.invoiceNum;
}

// Push job data into all tab fields
function propagateJobData() {
  // Lookup tab
  if (currentJob.modelNumber) {
    document.getElementById('modelInput').value = currentJob.modelNumber;
    if (currentJob.brand) selectBrand(currentJob.brand);
  }

  // Notes tab
  document.getElementById('noteModel').value = currentJob.modelNumber;
  document.getElementById('noteSerial').value = currentJob.serialNumber;

  // Parts tab
  document.getElementById('partCustomer').value = currentJob.customerName;
  document.getElementById('partInvoice').value = currentJob.invoiceNum;

  // Update note preview since model/serial may have changed
  updateNotePreview();
}

// Clear the current job
function clearJob() {
  currentJob.modelNumber = '';
  currentJob.serialNumber = '';
  currentJob.brand = '';
  currentJob.customerName = '';
  currentJob.invoiceNum = '';
  saveJob();
  updateJobUI();
}
```

**Step 2: Wire up the job context bar interactions**

```javascript
// Toggle job detail panel on context bar tap
document.getElementById('jobContextBar').addEventListener('click', (e) => {
  // Don't toggle if they clicked the clear button
  if (e.target.id === 'jobClearBtn') return;
  const panel = document.getElementById('jobDetailPanel');
  panel.classList.toggle('visible');
});

// Clear job button
document.getElementById('jobClearBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  clearJob();
  document.getElementById('jobDetailPanel').classList.remove('visible');
});

// Job detail panel fields → update job state
['jobModel', 'jobSerial', 'jobCustomer', 'jobInvoice'].forEach(id => {
  document.getElementById(id).addEventListener('input', () => {
    const fieldMap = {
      jobModel: 'modelNumber',
      jobSerial: 'serialNumber',
      jobCustomer: 'customerName',
      jobInvoice: 'invoiceNum'
    };
    setJobField(fieldMap[id], document.getElementById(id).value.trim());
  });
});
```

**Step 3: Update existing tab fields to flow back to job context**

Modify the search button handler (around line 1006) — after the search, also update job:

```javascript
// After: document.getElementById('noteModel').value = model;
// Add:
setJobField('modelNumber', model);
if (selectedBrand) setJobField('brand', selectedBrand);
```

Modify the OCR result click handlers (around line 1578-1590) to also update job:

```javascript
// When model is selected from OCR, also set job:
// After: modelInput.value = item.text;
// Add:
setJobField('modelNumber', item.text);

// When serial is selected from OCR:
// After: document.getElementById('noteSerial').value = item.text;
// Add:
setJobField('serialNumber', item.text);
```

Modify Notes tab fields — when user types in noteModel/noteSerial, update job:

```javascript
document.getElementById('noteModel').addEventListener('input', () => {
  setJobField('modelNumber', document.getElementById('noteModel').value.trim());
});
document.getElementById('noteSerial').addEventListener('input', () => {
  setJobField('serialNumber', document.getElementById('noteSerial').value.trim());
});
```

Modify Parts tab fields — when user types in partCustomer/partInvoice, update job:

```javascript
document.getElementById('partCustomer').addEventListener('input', () => {
  setJobField('customerName', document.getElementById('partCustomer').value.trim());
});
document.getElementById('partInvoice').addEventListener('input', () => {
  setJobField('invoiceNum', document.getElementById('partInvoice').value.trim());
});
```

**Step 4: Call loadJob() in initialization section**

Add `loadJob();` to the initialization block at the end (around line 2180).

**Step 5: Verify in browser**

Test flow:
1. Type a model number in Lookup → should appear in Notes model field AND context bar
2. Type customer name in Parts → should appear in context bar
3. Refresh page → job should persist
4. Tap context bar → detail panel expands with all job fields
5. Clear job → all fields reset

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: job context system with cross-tab data flow"
```

---

### Task 5: Notes tab improvements — Enter-to-add, collapsible preview, sticky footer

**Files:**
- Modify: `index.html` (CSS + JS + HTML)

**Step 1: Add CSS for sticky notes footer and collapsible preview**

```css
/* Sticky notes action bar */
.notes-sticky-footer {
  position: sticky;
  bottom: 80px;
  background: var(--bg);
  padding: 12px 0;
  border-top: 2px dashed var(--border);
  margin-top: 20px;
  z-index: 10;
}

/* Collapsible preview */
.preview-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 12px 0;
}

.preview-toggle .toggle-arrow {
  transition: transform 0.2s;
  font-size: 16px;
  color: var(--text-muted);
}

.preview-toggle.open .toggle-arrow {
  transform: rotate(180deg);
}

.preview-collapsible {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.25s ease-out;
}

.preview-collapsible.open {
  max-height: 500px;
}
```

**Step 2: Update Notes tab HTML (lines 698-734)**

Replace the preview and buttons section:

```html
<!-- Preview — collapsible -->
<div class="preview-toggle" id="previewToggle">
  <label style="margin:0; cursor:pointer; pointer-events:none;">Preview</label>
  <span class="toggle-arrow">&#9660;</span>
</div>
<div class="preview-collapsible" id="previewCollapsible">
  <div class="note-preview" id="notePreview"></div>
</div>

<!-- Sticky action buttons -->
<div class="notes-sticky-footer">
  <button class="btn-primary" id="copyNoteBtn">COPY TO CLIPBOARD</button>
  <button class="btn-secondary" id="copyOpenDispatchBtn">COPY &amp; OPEN DISPATCH</button>
</div>

<button class="btn-secondary" id="saveNoteBtn">Save Note</button>
<button class="btn-secondary" id="clearNoteBtn">Clear</button>
```

**Step 3: Add Enter-to-add-bullet in JS**

Modify the `addBullet` function to add a keydown listener:

```javascript
// Inside addBullet(), after the 'input' event listener, add:
row.querySelector('input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addBullet();
  }
});
```

**Step 4: Add preview toggle JS**

```javascript
// Preview toggle
document.getElementById('previewToggle').addEventListener('click', () => {
  const toggle = document.getElementById('previewToggle');
  const collapsible = document.getElementById('previewCollapsible');
  toggle.classList.toggle('open');
  collapsible.classList.toggle('open');
});
```

**Step 5: Verify in browser**

Test:
1. Press Enter in a bullet → new bullet appears and is focused
2. Preview section is collapsed by default, clicking "Preview" expands it
3. Copy buttons are sticky at bottom when scrolling Notes tab

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: notes tab - enter-to-add bullet, collapsible preview, sticky actions"
```

---

### Task 6: Parts tab Quick Send mode

**Files:**
- Modify: `index.html` (CSS + JS + HTML)

**Step 1: Add CSS for Quick Send mode**

```css
/* Quick Send — collapsed state after first part sent */
.parts-context-strip {
  display: none;
  padding: 12px 16px;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 16px;
  cursor: pointer;
  transition: border-color 0.15s;
}

.parts-context-strip.visible {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.parts-context-strip:active {
  border-color: var(--primary);
}

.parts-context-strip .strip-info {
  font-size: 15px;
  color: var(--text);
}

.parts-context-strip .strip-info span {
  color: var(--text-muted);
  font-size: 13px;
}

.parts-context-strip .strip-edit {
  color: var(--secondary);
  font-size: 13px;
  font-family: var(--font-display);
  letter-spacing: 0.5px;
}

.parts-full-form {
  transition: max-height 0.25s ease-out;
}

.parts-full-form.collapsed {
  display: none;
}
```

**Step 2: Wrap Parts tab customer/invoice/status/warranty in a collapsible div**

In the Parts tab HTML, wrap the customer through warranty fields:

```html
<div id="parts" class="tab-content">
  <!-- Context strip (shows after first send) -->
  <div class="parts-context-strip" id="partsContextStrip">
    <div class="strip-info">
      <strong id="stripCustomer">—</strong><br>
      <span>Inv: <span id="stripInvoice">—</span> | <span id="stripStatus">Aa</span></span>
    </div>
    <div class="strip-edit">TAP TO EDIT &#9660;</div>
  </div>

  <!-- Full form (collapses after first send in Quick Send mode) -->
  <div class="parts-full-form" id="partsFullForm">
    <label for="partCustomer">Customer Name</label>
    <!-- ... existing customer/invoice/status/warranty fields ... -->
  </div>

  <!-- Part # and Description always visible -->
  <label for="partNumber">Part Number</label>
  <!-- ... existing part number and description fields ... -->
```

**Step 3: Add Quick Send JS logic**

```javascript
let quickSendActive = false;

function activateQuickSend() {
  quickSendActive = true;
  const strip = document.getElementById('partsContextStrip');
  const form = document.getElementById('partsFullForm');

  // Update strip with current values
  document.getElementById('stripCustomer').textContent =
    document.getElementById('partCustomer').value || '—';
  document.getElementById('stripInvoice').textContent =
    document.getElementById('partInvoice').value || '—';
  document.getElementById('stripStatus').textContent = getPartStatusValue();

  strip.classList.add('visible');
  form.classList.add('collapsed');
}

// Toggle Quick Send form expansion
document.getElementById('partsContextStrip').addEventListener('click', () => {
  const form = document.getElementById('partsFullForm');
  form.classList.toggle('collapsed');
});

// Deactivate quick send on Clear
// (modify existing clearPartsBtn handler to also reset quick send)
```

**Step 4: Modify send handlers to activate Quick Send after first success**

In the `sendToSheetBtn` and `addAnotherPartBtn` click handlers, after `const success = await sendPart();`, add:

```javascript
if (success && !quickSendActive) {
  activateQuickSend();
}
```

Also modify the `clearPartsBtn` handler to reset quick send:

```javascript
// Add to existing clear handler:
quickSendActive = false;
document.getElementById('partsContextStrip').classList.remove('visible');
document.getElementById('partsFullForm').classList.remove('collapsed');
```

**Step 5: Verify in browser**

Test:
1. Fill out full parts form, send → form collapses to context strip + part fields only
2. Send another part → only need Part # and Description
3. Tap context strip → expands the full form
4. Clear → resets to full form

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: parts tab quick send mode - collapses form after first send"
```

---

### Task 7: Motion, reduced-motion support, and final polish

**Files:**
- Modify: `index.html` (CSS)

**Step 1: Add motion and reduced-motion CSS**

```css
/* ========================================
   MOTION & TRANSITIONS
   ======================================== */

/* Tab content crossfade */
.tab-content {
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 2: Verify everything works end-to-end**

Full test checklist:
- [ ] Lookup: search a model, brand auto-detects, results show, links open
- [ ] Job context bar updates with model + brand
- [ ] Switch to Notes → model field is pre-filled
- [ ] Enter bullets with Enter key, preview toggles
- [ ] Copy note, copy & open dispatch both work
- [ ] Switch to Parts → customer/invoice from job context
- [ ] Send a part → Quick Send activates
- [ ] Send another part → only enter part # and desc
- [ ] Clear → full form returns
- [ ] More menu → History and Stock both accessible
- [ ] OCR → model/serial flow to job context
- [ ] Refresh page → job persists
- [ ] Clear job → all fields reset

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: motion transitions and reduced-motion support"
```

---

### Task 8: Update service worker cache and manifest

**Files:**
- Modify: `sw.js`
- Modify: `manifest.json`

**Step 1: Bump service worker cache name**

In `sw.js`, update the `CACHE_NAME` constant:

```javascript
const CACHE_NAME = 'tech-portal-v4';  // bumped from v3
```

**Step 2: Update manifest theme color**

In `manifest.json`, update colors to match new palette:

```json
{
  "background_color": "#111118",
  "theme_color": "#1a1f2e"
}
```

**Step 3: Update meta theme-color in index.html**

Change line 8:
```html
<meta name="theme-color" content="#1a1f2e">
```

**Step 4: Commit**

```bash
git add sw.js manifest.json index.html
git commit -m "chore: bump service worker cache, update theme colors"
```

---

### Task 9: Update CLAUDE.md project documentation

**Files:**
- Modify: `.claude/CLAUDE.md`

**Step 1: Update the project guide**

Update the CLAUDE.md to reflect:
- New navigation structure (bottom tab bar, job context bar, menu drawer)
- Job context system (localStorage key: `fb_current_job`)
- Quick Send mode in Parts tab
- New CSS custom property system
- Updated color palette
- Google Fonts dependency (Barlow Condensed, JetBrains Mono)
- Updated line number references for major sections

**Step 2: Commit**

```bash
git add .claude/CLAUDE.md
git commit -m "docs: update CLAUDE.md for job mode redesign"
```
