---
name: Ya-GUI
description: A terminal-native command palette for managing ya CLI shortcuts — slate ground, blue accent, hybrid Inter + JetBrains Mono type.
colors:
  ground: "#0a0f1a"
  panel: "#0e1526"
  panel-raised: "#111c30"
  panel-hover: "#17233c"
  hairline: "#1d2a42"
  hairline-strong: "#2b3a56"
  text: "#dbe3ef"
  text-strong: "#f4f7fb"
  text-muted: "#93a2b8"
  text-faint: "#7b8aa3"
  accent: "#3b82f6"
  accent-strong: "#2563eb"
  accent-soft: "#60a5fa"
  accent-deep: "#1d4ed8"
  accent-tint: "#132d52"
  success: "#34d399"
  warning: "#fbbf24"
  danger: "#f87171"
  danger-strong: "#dc2626"
  pin: "#facc15"
typography:
  ui:
    fontFamily: "Inter Variable, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "JetBrains Mono Variable, ui-monospace, 'SF Mono', 'Cascadia Code', 'Segoe UI Mono', Menlo, Consolas, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent-strong}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    height: "36px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.accent}"
  button-outline:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    borderColor: "{colors.hairline-strong}"
    rounded: "{rounded.sm}"
    height: "36px"
    padding: "0 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    height: "32px"
  button-danger-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.danger}"
    rounded: "{rounded.sm}"
    height: "32px"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.sm}"
    height: "36px"
    padding: "0 12px"
  badge-secondary:
    backgroundColor: "{colors.accent-tint}"
    textColor: "{colors.accent-soft}"
    rounded: "9999px"
  tag-pill:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text-faint}"
    borderColor: "{colors.hairline-strong}"
    rounded: "9999px"
    height: "24px"
  panel:
    backgroundColor: "{colors.panel}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.lg}"
  kbd:
    backgroundColor: "{colors.panel-raised}"
    textColor: "{colors.text-muted}"
    borderColor: "{colors.hairline-strong}"
    rounded: "5px"
    height: "20px"
---

# Design System: Ya-GUI

## Overview

**Creative North Star: "The Command Palette"**

Ya-GUI presents itself as a terminal-native command palette rather than a dashboard. The search field is the front door — a developer lands, types any fragment of an alias or command, and runs it with a keystroke. Every surface is a searchable list (shortcuts, run history, settings rows), read the same way: dense rows on flat panels, hairline rules instead of cards, and a slim status bar that teaches the keyboard affordances.

The personality is utilitarian and quiet: dark slate ground, one blue accent reserved for the primary action, current selection, and focus, and nothing decorative. Commands, aliases, and values are set in JetBrains Mono with tabular figures; UI labels and prose in Inter. Depth is conveyed by tonal layering and hairlines, not heavy shadow.

**Key Characteristics:**
- Search is the primary interaction; keyboard navigation (↑↓, ↵, esc) is a first-class citizen.
- One panel per surface — no nested cards, no card-grid scaffolding.
- Hairline borders define structure; a soft, offset shadow lifts only dialogs and overlays.
- Blue appears only where it means something: primary actions, selection, focus, links.
- Monospace is reserved for data (commands, aliases, paths, timestamps), never as decoration.

## Colors

The palette is a slate ground with a single blue accent family. All surfaces are dark; there is no light theme.

### Primary

- **Accent Blue** (#3b82f6): primary button fill on hover, selected-row tint, focus rings, active nav text. The accent carries meaning — never decoration.
- **Accent Strong** (#2563eb): primary button fill at rest (white text on it reads ≥4.5:1).
- **Accent Soft** (#60a5fa): emphasis text on dark — the `ya` wordmark, the `❯` prompt, links, variable labels.
- **Accent Deep** (#1d4ed8): input/select focus border, selected tag-pill border.
- **Accent Tint** (#132d52): the blue-tinted fill for selected nav rows, alias chips (`secondary` badges), and the update banner.

### Neutral

- **Ground** (#0a0f1a): the app background.
- **Panel** (#0e1526): the standard surface for panels, cards, sidebar, title/status bars.
- **Panel Raised** (#111c30): inputs, chips, kbd caps — anything that sits "on" a panel.
- **Panel Hover** (#17233c): hover state for rows, buttons, nav items.
- **Hairline** (#1d2a42): 1px borders between rows, panels, bars.
- **Hairline Strong** (#2b3a56): interactive borders (buttons, chips, kbd).
- **Text Strong** (#f4f7fb): headings and primary labels.
- **Text** (#dbe3ef): body copy.
- **Text Muted** (#93a2b8): secondary text — commands, descriptions, secondary labels.
- **Text Faint** (#7b8aa3): tertiary micro-labels — tags, run counts, timestamps, hints, placeholders.

### Named Rules

**The One Accent Rule.** Blue is used only for primary actions, selection, focus, and links. Its rarity is the point — a screen where blue is scattered is a screen that has stopped deciding.

## Typography

**UI Font:** Inter Variable (with ui-sans-serif / system fallbacks)
**Mono Font:** JetBrains Mono Variable (with ui-monospace fallbacks)

**Character:** A workhorse sans paired with a developer's mono. Inter handles every UI label, heading, and paragraph at a tight 13px base; JetBrains Mono with tabular figures carries all data — commands, aliases, paths, timestamps — so columns and run counts line up.

### Hierarchy

- **Headline** (Inter, 600, 15px, tracking -0.01em): page-level card/section titles (`text-fg-strong`).
- **Title** (Inter, 600, 13px, tracking -0.01em): panel headers, dialog titles, row titles.
- **Body** (Inter, 400, 13px): default text and controls (`text-fg`). Prose measure stays ~65–75ch on the settings page.
- **Label** (Inter, 500, 11px, +0.08em, uppercase): section labels (`Terminal & Startup`, `Data`, `About`) and table column heads — the man-page register.
- **Mono** (JetBrains Mono, 400, 12–14px): the palette search input, commands, aliases, paths, timestamps, kbd hints, version numbers.

### Named Rules

**The Data-in-Mono Rule.** Monospace is reserved for command data and measurement. If a string is a command, alias, path, timestamp, or keycap, it is mono; everything else is Inter.

## Layout

The app is a fixed desktop shell: title bar (48px) over a body row of sidebar (56px icon-rail at small widths, 208px with labels at ≥768px) plus main, over a status bar (28px). The body is `h-screen` with internal scroll regions — panels scroll, the shell never does.

- Each page owns one centered panel: Shortcuts and History fill the main column edge-to-edge with internal scrolling; Settings uses a `max-w-3xl` column with section labels (Terminal & Startup / Saved Directories / Data / About) separating stacked panels.
- Spacing rhythm: 4px micro gaps, 8px inside controls, 16px page padding and panel gutters, 24px between major blocks. More space above a section label than below it.
- The command list rows are aligned columns: alias chip (fixed 150–240px) · command/meta (fluid, truncates) · actions (right-aligned, fixed).

## Elevation & Depth

The system is flat by default: depth comes from tonal layering (surface above ground, raised above surface) and 1px hairlines. Shadows are reserved for floating layers and are soft with an offset — never a zero-blur colored halo.

### Shadow Vocabulary

- **Panel** (`0 1px 0 rgba(0,0,0,0.25), 0 6px 20px -12px rgba(0,0,0,0.7)`): the single content panel per page — a barely-there lift over the ground.
- **Pop** (`0 0 0 1px #1d2a42, 0 24px 64px -16px rgba(0,0,0,0.85)`): dialogs, select menus, overlays that must separate from everything beneath.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat and hairline-bordered at rest. Elevation is tonal first; shadows appear only for floating layers (dialogs, menus).

## Shapes

Radius comes from a 10px base (`--radius: 0.625rem`): 8px for controls (buttons, inputs, chips, kbd), 10px for small panels, 12px for panels/cards, 16px for dialogs and the palette panel, and 9999px pills for tags and badges. Pills are for small single-line labels only; panels and controls stay at 8–16px.

## Components

- **Button** — variants: `default` (blue fill, white text), `outline` (raised panel + strong hairline), `secondary` (panel-raised), `ghost` (transparent, muted text), `danger-ghost` (transparent, red text for destructive icons), `success-ghost` (transparent, green text for run), `link`. Sizes: default 36px, sm 32px, lg 40px, icon 36px, icon-sm 32px. Hover darkens/lightens one step; focus shows the blue outline ring.
- **Input** — raised panel, 1px hairline, inset top shadow, 36px tall. Focus: accent-deep border + 2px accent ring at 25%. Placeholder at text-faint. Text inputs that hold commands use the mono face.
- **Select / Switch** — Select trigger matches input treatment; content is a raised panel pop. Switch thumb is slate when off, blue fill with white thumb when on.
- **Badge (alias chip)** — pill, `secondary` variant: accent-tint fill, accent-soft text, accent-deep border, mono 12px semibold. Pinned aliases prepend a filled amber star.
- **Tag pill** — pill, raised panel, strong hairline, faint text, 11px. Active filter tag inverts to blue fill/white.
- **Kbd** — 20px raised keycap with strong hairline and an inset bottom shadow, mono 10px; used for `↑↓`, `↵`, `esc`, and inline command hints.
- **Table/list row** — flat rows separated by hairlines, hover = panel-hover tint, keyboard-selected row = blue 12% tint with a 2px accent bar at the left edge. Pinned rows carry a faint accent-tint wash.
- **Dialog** — raised panel (surface-2) in the pop shadow, 16px radius, title at 15px/600, body copy 13px. Action row right-aligned: outline cancel + solid primary/danger confirm. Overlay is black at 60% with a 2px backdrop blur.
- **Status bar** — 28px bar with a success/warning dot + CLI state on the left, and key hints (`↑↓ navigate · ↵ run · esc clear search`) on the right at ≥640px.
- **Empty states** — centered icon in a bordered raised tile, a one-line primary message, and a one-line hint that teaches the action (e.g. "Create one with New Shortcut — or add aliases with `ya` in your terminal").

### Named Rules

**The Consistent-Vocabulary Rule.** The same button shape, form-control treatment, and row grammar on every screen. If "save" or "run" looks different in two places, one of them is wrong.

## Do's and Don'ts

**Do:**
- Make the search field the most prominent element on the Shortcuts surface.
- Use mono with tabular figures for every command, alias, path, and timestamp.
- Reserve blue for primary actions, selection, focus, and links.
- Use skeleton rows for loading lists; keep the shell chrome static.
- Let panels scroll internally; never let the app shell scroll.

**Don't:**
- Don't add cards inside cards, or card-grid scaffolding around the palette.
- Don't use monospace as a stylistic costume for "technical" copy.
- Don't put gradient text, glowing edges, or zero-offset colored shadows in this world.
- Don't introduce a light theme — the product is dark by decision.
- Don't ship a display face for headings; Inter at weight 600 is the ceiling.
