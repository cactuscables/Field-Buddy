# Field Buddy "Job Mode" Frontend Redesign

**Date:** 2026-02-22
**Status:** Approved

## Problem Statement

Field Buddy (branded "Tech Portal") is a PWA used by an appliance repair tech on iPhone in the field. Three core UX pain points:

1. **Buttons and inputs too small** — hard to tap with dirty/wet hands
2. **Data doesn't flow between tabs** — model/serial/customer re-entered across Lookup, Notes, Parts
3. **Too many steps per task** — common actions (adding bullets, sending parts) take too many taps

## Design Direction

**Aesthetic:** Industrial/Utilitarian (90%) with Clean/Minimal touches (10%). Like a well-designed power tool — chunky, high-contrast, glanceable.

## Architecture: Job Mode

The app shifts from 5 disconnected tabs to a job-centric workflow. A job has a customer, model, serial, and brand. All tabs share that context.

### Job Context Object

```javascript
const currentJob = {
  modelNumber: '',    // → Lookup input, Notes model
  serialNumber: '',   // → Notes serial
  brand: '',          // → Lookup brand chip
  customerName: '',   // → Parts customer
  invoiceNum: ''      // → Parts invoice
};
```

Changing any field in any tab updates the central object and propagates to all tabs. Job persists in localStorage.

### Navigation

- **Bottom tab bar**: 3 primary tabs (Lookup, Notes, Parts), 60px tall, icons + labels
- **History & Stock**: accessible via menu icon in header (secondary tools)
- Active tab: bold red indicator bar on top

### Job Context Bar (replaces static header)

- No active job: "TECH PORTAL" title with "No active job" subtitle
- Active job: model number (bold), brand chip, customer name
- Tap to expand/edit job details
- "Clear Job" button to end context

## Visual Design

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#111118` | Page background |
| Surface | `#1a1f2e` | Cards, sections |
| Input BG | `#0d1220` | Recessed input fields |
| Primary | `#e94560` | Primary actions, accents |
| Secondary | `#3d7fff` | Info/secondary actions |
| Text Primary | `#f0f0f0` | Main text |
| Text Secondary | `#8890a0` | Labels, meta |
| Border | `#2a3040` | 2px borders |
| Success | `#22c55e` | Confirmations |
| Warning | `#eab308` | Warranty, low stock |

### Typography

- **Headers/Labels:** Barlow Condensed (Google Fonts), uppercase, letter-spaced
- **Body/Inputs:** System font stack, 16-18px
- **Monospace:** JetBrains Mono or SF Mono (part numbers, note preview)

### Touch Targets

| Element | Min Height |
|---------|-----------|
| Tab bar buttons | 60px |
| Primary buttons | 60px |
| Input fields | 54px (18px font) |
| Brand chips | 48px |
| Toggle buttons | 52px |
| Delete/remove buttons | 48x48px |
| Secondary buttons | 48px |

### Textures & Details

- Subtle CSS noise/grain overlay on background (matte industrial feel)
- 2px borders (substantial, not wispy)
- `border-radius: 8px` cards, `6px` inputs/buttons (squared off, not bubbly)
- Active press: `transform: scale(0.97)` + darken
- Section dividers: thin dashed lines (blueprint aesthetic)

## Tab Designs

### Lookup Tab

Mostly unchanged, just bigger:
- Model input: 54px height, 18px font
- Camera button: 56x56px
- Brand chips: 48px tall, 2px borders, 15px bold font
- Search button: 60px tall, full width, uppercase "SEARCH"
- Results: larger link cards, 16px font

### Notes Tab

Streamlined:
- Model/Serial auto-filled from job context (read-only chips, tap to edit)
- Bullet inputs: 54px height, 16px font
- Enter key auto-adds next bullet and focuses it
- Visible 48x48 × button on each bullet for delete
- Preview: collapsed by default, "SHOW PREVIEW" toggle
- Sticky footer: "COPY" and "COPY & OPEN DISPATCH" fixed to bottom
- Saved notes: larger cards, 16px text

### Parts Tab (Quick Send Mode)

- Customer/Invoice auto-filled from job context
- After first successful send:
  - Customer/Invoice/Status/Warranty collapse to summary strip
  - Form shows only Part # and Description
  - "SEND" and "SEND + ANOTHER" buttons prominent
  - Tap summary strip to expand and edit
- Parts log: larger text, clearer formatting

### History Tab (in menu)

Same functionality, 56px min height per item.

### Stock Tab (in menu)

Same functionality, larger table text, same color coding.

## Motion

- Tab switch: 150ms crossfade
- Context bar expand/collapse: 200ms ease-out
- Button press: instant `scale(0.97)` on `:active`
- Toast: 200ms slide up from bottom
- Quick Send collapse: 200ms accordion
- `prefers-reduced-motion` disables all transitions

## Constraints

- Single-file architecture (all in index.html)
- Vanilla HTML/CSS/JS (no frameworks, no build tools)
- Offline-first (service worker + localStorage)
- Google Sheets JSONP integration unchanged
- Tesseract.js OCR via CDN unchanged
- All existing functionality preserved
