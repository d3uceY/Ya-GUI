# Product

<!-- impeccable:product-schema 1 -->

## Platform

web — Wails v3 desktop shell (Windows / macOS / Linux) rendering a React + TypeScript frontend in a native webview; the design language is web-based, single dark theme.

## Stack

Existing codebase: Wails v3 (Go backend) + React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui-style components (Radix primitives) + lucide-react icons + react-router-dom. Wails-generated bindings in `frontend/wailsjs`.

## Users

Developers and CLI power-users who manage a personal library of command aliases for the `ya` CLI tool. They work in a terminal context, want fast access to frequently used commands, and prefer keyboard-driven, low-ceremony tooling over GUI-formalism.

## Product Purpose

Ya-GUI is a desktop companion for the `ya` CLI: it lets users create, edit, search, tag, pin, duplicate, and run command-line shortcuts — with variable substitution (`{placeholder}`), saved workspace directories, a preferred-terminal setting, start-on-boot, run history, and JSON import/export. Success means the user can find and run the right command in seconds without memorizing or hand-editing config.

## Positioning

A GUI front-end over a real CLI config file — shortcuts created here are saved to and synced with the `ya` CLI's own configuration, so the GUI and terminal stay in lockstep rather than being a separate silo.

## Operating Context

- Desktop app (dark UI) sitting alongside a real terminal; running a shortcut opens a new terminal window in the chosen directory and executes the command interactively.
- Three core surfaces today: Shortcuts (primary), Run History, Settings. User has approved a full IA/visual restructure.
- Commands use `{placeholder}` syntax; tags are comma-separated; shortcuts can be pinned (favourited) to sort to the top.
- Configuration is stored in `config` on the Go side (`utils/config.go`) and exposed via Wails bindings.
- App checks GitHub for the latest release and for `ya` CLI presence on the PATH; shows an install prompt when missing.

## Capabilities and Constraints

Confirmed functionality:
- CRUD on shortcuts (name, command, description, tags); duplicate; pin/unpin.
- Search across name, command, description, tags; tag pill filtering.
- Run with variable substitution dialog, then directory picker (saved dirs or OS browse).
- Settings: preferred terminal (auto/wt/powershell/cmd/bash), start-on-boot, saved directories, export/import JSON, about/version/update.
- Run history with clear-all.
- `window.setTitle` per route via Wails runtime.

Constraints / facts:
- Desktop window; Wails webview (Chromium WebView2 on Windows, WKWebView on macOS). No cross-origin fetch restrictions beyond GitHub API.
- Frontend is React SPA with client-side routing; no server.
- Dark-only theme confirmed by user for this redesign (light theme tokens in CSS are legacy/unused).
- Hybrid typography confirmed: proportional UI font for labels/body, monospace reserved for commands, aliases, and code.
- Color theme is a binding constraint: keep the same slate + blue character (dark backgrounds, blue accents).

## Brand Commitments

- Product name: "Ya" / "Ya-GUI", branding mark `ya.png`.
- Binding visual constraints from user: reuse the same color themes (dark slate + blue accent family); the result must keep a utilitarian feel; design system must be coherent and make sense.
- User approved a full restructure of IA/layout, dark-only theming, and hybrid typography.

## Evidence on Hand

- README.md documents the full feature set and includes real screenshots of the incumbent UI (dark slate + blue).
- `frontend/src` contains the full current implementation (layout, pages, dialogs, ui components).
- No user testimonials, analytics, or design tokens documentation exist; do not fabricate.

## Product Principles

1. **Speed to command**: the primary job is find-and-run; search, filtering, and the run flow must be effortless.
2. **Low ceremony**: a desktop utility should feel like tooling, not paperwork — dense but calm, minimal chrome.
3. **Terminal-native honesty**: commands and aliases are the hero; present them in monospace with a truthful, readable treatment.
4. **Consistency that scales**: every surface is built from the same token system and components, so the app stays coherent as features grow.
5. **Graceful failure**: missing CLI, failed launches, and empty states are designed, not afterthoughts.

## Accessibility & Inclusion

No product-specific standard is established; the redesign must keep reasonable contrast on dark backgrounds, keyboard-accessible controls, and focus visibility as a baseline.
