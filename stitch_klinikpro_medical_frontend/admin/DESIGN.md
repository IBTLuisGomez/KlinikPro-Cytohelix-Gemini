---
name: Clinical Precision
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f484c'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6f787d'
  outline-variant: '#bec8cd'
  surface-tint: '#006781'
  primary: '#005a71'
  on-primary: '#ffffff'
  primary-container: '#0e7490'
  on-primary-container: '#d3f1ff'
  inverse-primary: '#81d1f0'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#57dffe'
  on-secondary-container: '#006172'
  tertiary: '#005f40'
  on-tertiary: '#ffffff'
  tertiary-container: '#007a53'
  on-tertiary-container: '#a3ffd0'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b9eaff'
  primary-fixed-dim: '#81d1f0'
  on-primary-fixed: '#001f29'
  on-primary-fixed-variant: '#004d62'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  metric-num:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 26px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system targets modern clinical practitioners, laboratory specialists, and healthcare administrators managing high-velocity patient flows, diagnostics, and multi-tenant clinical branches. The interface embodies clinical precision, quiet confidence, and operational clarity.

The visual direction combines **Corporate / Modern** discipline with **Minimalist** clarity:
- **Atmosphere:** Sterile yet welcoming, rigorously organized, and low-friction under cognitive load.
- **Visual Weight:** Light surfaces dominate to maximize readability of diagnostic metrics, patient vitals, and tabular records.
- **Hierarchy:** High data density balanced with generous typographic hierarchy, micro-borders, and disciplined color attribution (action vs. observation vs. warning).
- **Tone:** Professional, objective, calm, and reliable.

## Colors

The palette pairs surgical deep teals with calm structural slates, complemented by clinical status accents:

- **Primary (`#0E7490` - Deep Teal):** The foundational anchor for primary actions, active navigational states, and high-level section branding.
- **Secondary (`#06B6D4` - Cyan Accent):** Used for interactive focus rings, metric callouts, and secondary visual signals without distracting from primary workflows.
- **Tertiary (`#10B981` - Emerald Green):** Strictly reserved for verified statuses, normal physiological parameters, and successful confirmations.
- **Neutral (`#0F172A` - Slate):** Delivers high contrast for primary text, data values, and structural dividers.

### Contextual Tokens & Accents
- **Canvas Base:** `#F8FAFC` (Slate 50) delivers an eye-resting background.
- **Surface Cards:** `#FFFFFF` (Pure White) with crisp `#E2E8F0` borders for maximum separation.
- **Attention / Warning:** `#F59E0B` (Amber) for pending review, critical scheduling conflicts, or borderline lab metrics.
- **Critical / Danger:** `#EF4444` (Rose / Red) for contraindications, lab abnormal alerts, and destructive actions.

## Typography

The type system relies on **Plus Jakarta Sans** across all roles, delivering clear letterforms with modern geometric stability. Its wide counters and balanced x-height preserve legibility even in dense medical charts, dosage lists, and lab tables.

- **Tabular Numerals:** All quantitative displays (lab results, timestamps, serial codes, vital statistics) must enforce `font-feature-settings: "tnum" 1` to ensure vertical column alignment across records.
- **Hierarchy Rules:** Section titles rely on SemiBold (`600`) weights rather than extreme heavy weights to retain an authoritative, clinical tone.
- **Labels & Microcopy:** `label-sm` utilizes uppercase tracking for sub-headers and badge status tags.

## Layout & Spacing

The layout is built around a dense 12-column grid designed for data-rich dashboards, patient record sidebars, and split views:

- **Desktop (>= 1280px):** 12-column structure with `gutter-desktop` (24px) and `margin-desktop` (32px). Persistent 260px collapsible clinical sidebar navigation with sticky header controls.
- **Tablet (768px - 1279px):** 8-column layout with `gutter` (16px) and `margin` (20px). Collapsible icon rail navigation; secondary diagnostic panels collapse into sliding draw overlays.
- **Mobile (< 768px):** 4-column layout with `gutter` (12px) and `margin` (16px). Complex multi-column records reflow into stacked accordion cards.

Spacing is deliberately tightened compared to standard consumer interfaces to reduce scrolling friction for clinical staff during consultations.

## Elevation & Depth

To preserve clinical sterility and visual order, depth is created primarily through crisp surface borders and subtle, low-spread ambient shadows:

- **Surface 0 (Background Canvas):** `#F8FAFC`, flat.
- **Surface 1 (Cards, Tables, Panels):** `#FFFFFF` paired with a 1px border (`#E2E8F0`) and an ambient shadow: `0 1px 3px rgba(15, 23, 42, 0.04), 0 1px 2px rgba(15, 23, 42, 0.02)`.
- **Surface 2 (Dropdowns, Branch Switcher, Flyouts):** `#FFFFFF` border `#CBD5E1` with elevated depth: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Surface 3 (Clinical Modals & Critical Overlays):** `#FFFFFF` with backdrop blur (`4px` blur over `rgba(15, 23, 42, 0.35)`) and shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.12)`.

## Shapes

This design system uses **Soft** geometry (`roundedness: 1`), conveying structured control and modern software efficiency rather than whimsical friendliness:

- **Base Components (Inputs, Buttons, Badges):** `4px` (`0.25rem`) corner radius.
- **Containers & Data Cards:** `8px` (`0.5rem`) corner radius.
- **Modals & Drawers:** `12px` (`0.75rem`) corner radius.
- **Status Pills & Avatars:** Fully circular (`9999px`) to immediately distinguish identity and metadata chips from rectangular data controls.

## Components

### Buttons
- **Primary:** Solid `#0E7490` with white text. Focus: 2px ring in `#06B6D4` with 2px offset. Hover: `#0C647C`.
- **Secondary / Outline:** White surface, 1px `#CBD5E1` border, `#0F172A` text. Hover: `#F1F5F9`.
- **Destructive:** Light rose background (`#FEF2F2`), border `#FECACA`, text `#DC2626`. Hover: `#FEE2E2`.
- **Compact Sizing:** Default height `36px`, small `30px` for table row actions.

### Multi-Tenant Clinic / Branch Switcher
- **Structure:** Dropdown button anchored in the top-left masthead displaying clinic logo avatar, tenant name, active branch, and subtle chevron.
- **Flyout:** Includes real-time search input for locations, distinct status indicators for active branch connectivity, and tenant-level role pills (`Physician Admin`, `Pathology Staff`).

### Clinical Badges & Status Chips
- **Success / Normal:** `#ECFDF5` background, `#047857` text, subtle `#A7F3D0` border.
- **Pending / In Review:** `#FFFBEB` background, `#B45309` text, subtle `#FDE68A` border.
- **Critical / Elevated:** `#FEF2F2` background, `#B91C1C` text, subtle `#FECACA` border.
- **Badge Shape:** Rounded full (`pill`), padding `2px 8px`, typography `label-sm`.

### Input Fields & Selects
- **Default State:** Height `36px`, background `#FFFFFF`, border 1px `#CBD5E1`, text `#0F172A`, placeholder `#94A3B8`.
- **Focus State:** Border `#0E7490`, outline 2px `#06B6D4` with 15% opacity.
- **Validation:** Inline microcopy underneath field with leading status icon. Red border for errors, amber for warning ranges.

### Checkboxes & Radio Buttons
- **Style:** Compact 16x16px bounding box. In active state, filled `#0E7490` with crisp white checkmark or center pip. Border `#94A3B8` in idle state.

### Data Cards & Tables
- **Cards:** White surface, 1px `#E2E8F0` border, `16px` inner padding. Header displays category eyebrow in `label-sm` with optional actions on the right.
- **Tables:** Sticky column headers in `#F8FAFC` with 1px bottom border `#CBD5E1`. Row height `44px` for high-density scanability. Alternating row background omitted in favor of clean 1px border dividers (`#F1F5F9`) and hover highlight `#F8FAFC`. Numeric data right-aligned using tabular numerals.