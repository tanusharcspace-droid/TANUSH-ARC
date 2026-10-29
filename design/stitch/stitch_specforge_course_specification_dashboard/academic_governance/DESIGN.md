---
name: Academic Governance
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#4e45d5'
  on-secondary: '#ffffff'
  secondary-container: '#6860ef'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#00201d'
  on-tertiary-container: '#0c9488'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#100069'
  on-secondary-fixed-variant: '#372abf'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
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
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an authoritative, precise, and cognitively calm interface tailored for university curriculum governance committees, provosts, deans, and academic accreditation auditors. 

The aesthetic is Modern Institutional: a balance of rigorous academic structure and high-performance workflow utility. It draws inspiration from peer-reviewed scientific journals, high-density regulatory systems, and modern legaltech platforms. The visual tone eliminates decorative noise in favor of meticulous alignment, dense information hierarchy, crisp structural borders, and purposeful typographic cadence.

Interactions evoke auditability, intellectual clarity, and institutional stability. Every interface element must convey institutional weight, verifiability, and computational confidence when parsing syllabi, learning outcome matrices, and compliance mandates.

## Colors

The palette relies on deliberate contrast, formal hierarchy, and strict semantic governance:

- **Primary (`#0F172A`)**: Deep Scholarly Slate/Navy. Anchors all top-level layout frames, primary typography, high-priority actions, and formal institutional framing.
- **Secondary (`#4338CA`)**: Sharp Governance Indigo. Applied to interactive navigation elements, active progress states, focused inputs, and AI synthesis callouts.
- **Tertiary (`#0D9488`)**: Academic Teal. Designated for verified accreditation checkpoints, rubric compliance indicators, and curriculum alignment badges.
- **Neutral (`#64748B`)**: Structural Slate. Used for secondary metadata, subtle borders, inactive control states, and system outlines.

### Background and Surface Tokens
- `surface-canvas`: `#F8FAFC` — Base interface layer for entire platform views.
- `surface-card`: `#FFFFFF` — Primary elevated workspace container for curriculum specs, review sheets, and tables.
- `surface-muted`: `#F1F5F9` — Table headers, code blocks, read-only specification panels, and audit log strips.
- `border-subtle`: `#E2E8F0` — Fine structural dividers, column delimiters, and input borders.
- `border-strong`: `#CBD5E1` — Active containment boundaries and header dividers.

### Status and Alert Tokens
- **Draft**: Background `#F1F5F9`, Text `#475569`, Border `#CBD5E1`.
- **Under Review**: Background `#EEF2FF`, Text `#3730A3`, Border `#C7D2FE`.
- **Approved**: Background `#CCFBF1`, Text `#115E59`, Border `#99F6E4`.
- **Defect Alert / Non-Compliant**: Background `#FEF2F2`, Text `#991B1B`, Border `#FECACA`.

## Typography

The type system balances administrative efficiency with structured technical data. 

- **Primary Engine (`Inter`)**: Governs structural titles, navigation labels, inputs, and academic body text. It is calibrated with slight negative letter tracking at display sizes to ensure crisp authority.
- **Monospace Accent (`JetBrains Mono`)**: Powers course catalog codes (e.g., `ENGR-4020`), Bloom's Taxonomy classification keys, credit weighting calculations, audit hashes, and tabular alignment points.
- **Document Preview Mode**: When generating or inspecting formal PDF course specs, switch document preview panels to an integrated editorial scale with high contrast and explicit vertical rhythm to reflect physical accreditation documentation.

## Layout & Spacing

The layout model is built on an enterprise 12-column grid prioritizing dense, parallel information processing over decorative white space.

### Grid & Breakpoints
- **Mobile (< 768px)**: 4-column layout with `margin: 1rem` and `gutter: 1rem`. Side panels and audit histories collapse beneath main specification cards.
- **Tablet (768px - 1199px)**: 8-column layout. Document views dynamically stack above the validation matrix.
- **Desktop (≥ 1200px)**: 12-column dual- or triple-pane workspace. Fixed 280px left governance navigation, fluid central course specification editor (6 to 8 columns), and 360px sticky right verification & AI rationale inspector.

### Spacing Principles
- Density takes precedence over padding. Table rows, metadata cards, and audit entries utilize compact spacing (`space-xs` through `space-md`) to ensure governance committees can review multi-page curricula without disruptive scrolling.
- Generous outer section margins (`space-xl`) are reserved solely for separating primary module boundaries, such as separating Course Overview from Learning Outcome Mappings.

## Elevation & Depth

Visual hierarchy is communicated through surgical border definition and subdued ambient lighting rather than heavy drop shadows.

- **Baseline Surfaces**: Background canvas `#F8FAFC` carries zero elevation. Cards (`#FFFFFF`) sit on top with a crisp 1px border (`#E2E8F0`) and an ambient micro-shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Hover & Interaction Tier**: Elevated table rows or selectable outcome items transition to `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)` with border color shifting to `#CBD5E1`.
- **Modals, Flyouts & Slide-overs**: Used for AI revision diffs and compliance alerts. Border: `1px solid #CBD5E1`, shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
- **Structural Separation**: Distinct functional sections within a single screen are delineated by vertical 1px hairline rules (`#E2E8F0`) rather than drop shadows.

## Shapes

The design system employs a restrained, soft-corner shape profile (`0.25rem` / `4px` baseline) to maintain institutional rigor:

- Inputs, buttons, status badges, and table cells use `rounded` (4px).
- Major container panels, audit cards, and modal sheets use `rounded-lg` (8px).
- Contextual preview dialogs and full-screen flyouts use `rounded-xl` (12px).
- Pill shapes are strictly prohibited except for micro-indicator counters within tab headers. Sharp, engineered geometry reflects precision and formal governance.

## Components

### Buttons
- **Primary Action**: Background `#0F172A`, text `#FFFFFF`, 4px radius, 8px 16px padding. Active hover: `#1E293B`. Focus: 2px ring `#4338CA` with 2px offset.
- **Secondary (Compliance / Secondary Action)**: Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#0F172A`. Hover: background `#F8FAFC`, border `#CBD5E1`.
- **AI Processing / Generative Trigger**: Background `#4338CA`, text `#FFFFFF`. Hover: `#3730A3`. Features an integrated prefix icon.

### Status Badges & Chips
- Form factor: Compact height (22px), `JetBrains Mono` at `label-sm`, all caps, padding 2px 8px, 4px border radius.
- **Draft**: Gray-slate token set.
- **Under Review**: Indigo token set.
- **Approved**: Teal token set.
- **Defect Alert**: Crimson token set with an explicit alert icon.

### Tabular Data Grids (Outcome Matrices & Syllabi Logs)
- **Header**: `#F1F5F9` background, `#475569` text, uppercase, tracking `0.05em`, height 36px, `JetBrains Mono` 11px font.
- **Rows**: Alternating hover state with `#F8FAFC`. Base row border is a hairline `1px solid #E2E8F0`. Vertical cell borders are optional but recommended for mapping matrices to align credit metrics and taxonomy columns.
- **Cells**: Compact vertical padding (8px), horizontal padding (12px), aligning numbers and codes via monospace styling.

### Input Fields & Controls
- **Text Inputs & Dropdowns**: Height 36px, border `1px solid #CBD5E1`, background `#FFFFFF`, text `#0F172A`. Focus state overrides border to `#4338CA` with zero lateral blur.
- **Checkboxes & Radios**: 16px square/circle, border `1.5px solid #64748B`. Checked state fills `#4338CA` with crisp white mark.

### Cards & Governance Panels
- Surface `#FFFFFF`, hairline border `#E2E8F0`, 16px internal padding. Header areas include integrated status badges and right-aligned action icon clusters.

### Specialized Component: Curriculum Diff & Audit Stream
- Split-pane layout comparing original instructor text with AI-standardized course outcome statements.
- Left lane highlights deletions (`#FEF2F2` background, `#991B1B` strikethrough), right lane highlights compliant standardizations (`#CCFBF1` background, `#0D9488` text).