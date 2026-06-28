# AIDRIN Landing Page

Marketing site for **AIDRIN — AI Data Readiness Infrastructure**. A single, static, content-driven
page built with **Astro 5** and **Tailwind CSS v4**.

- **Live tool (the Inspector web app):** https://aidrin.org/inspector
- **Docs:** https://aidrin.readthedocs.io/en/latest/
- **Source:** https://github.com/idtlab/AIDRIN/

> Naming: **AIDRIN** = "AI Data Readiness Infrastructure" (the project). The **Inspector** is the
> hosted web app — one of several interfaces, not the whole project. Keep this distinction in copy.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:4321
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve the built `dist/` |
| `npm run check` | `astro check` — types + content-collection schemas |
| `npm run test:unit` | Vitest — validates `src/data` (counts, no ROOT, links, etc.) |
| `npm run test:e2e` | Playwright — page behavior + axe accessibility |
| `npm run links` | linkinator over `dist/` (a few bot-blocking hosts are `--skip`ped; other external links are still checked) |

The build output in `dist/` is fully static — deploy it to any static host (or serve alongside the
existing aidrin.org infrastructure). `site` in `astro.config.mjs` is `https://aidrin.org`.

---

## How the page is built

It is **one page** (`src/pages/index.astro`) assembled from small components and data files.
Nearly all copy lives in `src/data/*` so you can edit content without touching markup.

### Section order (top → bottom, all in `index.astro`)

1. **Hero** — headline + the animated "agent console" and data-grid (see *Animations*).
2. **Workflow** — Inspect → Remediate → Transform (`src/data/workflow.ts`).
3. **Dimensions** (`#dimensions`) — the seven readiness dimensions: six color-coded core
   dimensions (`src/data/dimensions.ts`) plus the cross-cutting *AI Application-Specific* band.
4. **Capabilities** (`#capabilities`) — the six access modes (`src/data/access-modes.ts`) and a
   "Built to extend" row of integrations (`src/data/integrations.ts`).
5. **Formats** — supported input formats as icon chips (`src/data/formats.ts`).
6. **Get started** (`#get-started`) — install/usage tabs (`CodeTabs`).
7. **Research** (`#research`) — publications (content collection, see below).
8. **Closer** — the editorial CTA and the cycling **interface switcher**.

Nav links (`src/data/nav.ts`) are in-page anchors to these section ids.

### Layout & components

`src/layouts/BaseLayout.astro` is the page shell; the rest live in `src/components/`.

| File | Role |
| --- | --- |
| `layouts/BaseLayout.astro` | `<head>`, no-FOUC dark-mode init, fonts, wraps `Nav` + `<main>` + `Footer` |
| `Nav.astro` | Logo, in-page links, GitHub/Docs, theme toggle, primary CTA, mobile menu |
| `Footer.astro` | Link columns + acknowledgement logos + copyright |
| `Section.astro` | Standard band: eyebrow + heading (`h1`/`h2`) + lead + slot; `bg="tint"` variant |
| `Card.astro` | Icon + title + slot card used in grids |
| `FormatChips.astro` | Icon chips for `formats` (extension shown only on hover) |
| `CodeTabs.astro` | Tabbed terminal-style code blocks (Shiki highlight + copy button) |
| `Icon.astro` | Inline-SVG icon set (one `currentColor` path per name) |
| `ThemeToggle.astro` | Light/dark switch (class-based, persisted to `localStorage`) |

### Content model

- **Fixed lists** → `src/data/*.ts` (plain typed modules): `dimensions`, `access-modes`,
  `integrations`, `formats`, `workflow`, `nav`, `acknowledgements`, and `site` (external links +
  canonical name).
- **Publications** → `src/content/publications/*.md` — an Astro **content collection** with a Zod
  schema in `src/content.config.ts`. Add a paper by dropping in a new markdown file with the
  frontmatter fields (`title`, `authors`, `venue`, `year`, optional `doi`/`arxiv`/`url`/`bibtex`).
- **Logos** → `public/logos/`. Acknowledgement logos are wired in `src/data/acknowledgements.ts`
  (an entry with no `logo` path falls back to a text wordmark).

### Styling

All design tokens and custom classes live in **`src/styles/global.css`** (CSS custom properties for
light/dark, plus classes like `btn-primary`, `text-gradient`, `eyebrow`, `ui-card`). Markup uses a
mix of those classes and Tailwind v4 utilities. See `AGENTS.md` for the design system and rules.

### Animations (no framework — CSS + small inline scripts)

Both live in `index.astro` (markup) + `global.css` (styles) + an inline `<script>` at the bottom of
`index.astro`:

- **Hero "agent console" + data grid** — the console streams `inspect → remediate → transform`
  while a readiness meter fills and a phase label advances (Inspecting → Remediating →
  Transforming → Ready). In sync, the data grid shows square dots with red/amber issues
  (inspect), morphs to circles with issues cleared (remediate), then fills light green in random
  order (transform). Loops.
- **Closer "interface switcher"** — one window cycles the same result through Web Inspector → CLI →
  Python Library → MCP Agent, to show "one engine, every interface."

Both respect `prefers-reduced-motion` (they settle to a static end state).

---

## Accessibility & quality gates

- `npm run test:e2e` includes an **axe** check that fails on any *serious/critical* violation, plus
  a check that there is exactly one `<main>` and at least one `<h1>`. Keep these green. (The page is
  built so the hero owns the single `<h1>` and every `Section` renders an `<h2>`.)
- The signature gradient is for large display text only — see `AGENTS.md` for the contrast rules.

## Content accuracy

Code examples must actually run against the published package. The library snippet was verified by
installing `aidrin` from PyPI and executing it; CLI commands match the real `aidrin.headless.cli`.
**Do not invent function names, flags, or output** — verify before adding. See `AGENTS.md`.

## Open items

- **Parquet** is listed in `formats`; confirm reader support in the shipped package before relying on it.
- **CLI / MCP / agentic eval** are shown as available but are not yet in the released PyPI package
  (they live in open PRs / the `cli-integration` branch). Commands shown match that source.
