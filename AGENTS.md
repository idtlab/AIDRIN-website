# AGENTS.md — maintaining the AIDRIN landing page

Guidance for anyone (human or AI) editing this site. Read this before changing layout, styling, or
content. The goal: keep the page **consistent, on-brand, accurate, and accessible**. See `README.md`
for the architecture overview.

## Golden rules

1. **Verify before you publish.** Every code example, function name, flag, and output shown on the
   page must actually work against the *published* package. The library example was verified by
   `pip install aidrin` and running it; CLI commands come from the real `aidrin.headless.cli`.
   Never invent APIs (a past draft showed a non-existent `aidrin.score()` / `aidrin inspect`).
2. **Edit data, not markup, for content.** Section copy lives in `src/data/*.ts` and
   `src/content/`. Only touch `index.astro`/components for *structure* changes.
3. **Keep the gates green.** After any change run `npm run check && npm run build && npm run test:unit && npm run test:e2e`.
   The axe a11y test fails on serious/critical violations — fix the cause, don't weaken the test.
4. **One page.** This is intentionally a single page (`index.astro`) with in-page anchors. Don't add
   routes/sub-pages unless explicitly asked (avoids duplicating content).

## Brand & naming

- **AIDRIN** = "AI Data Readiness Infrastructure" (the project). The **Inspector** = the hosted web
  app at `demo.aidrin.org`, one access mode among many. Don't conflate them.
- The primary CTA label is **"Demo"** (points to the Inspector). Keep it consistent across nav,
  hero, and closer.
- No em dashes ("—") in user-facing copy — use commas, periods, or colons. (They read as an AI tell
  and the team asked to avoid them.)
- External links come from `src/data/site.ts` only — never hardcode `aidrin.org`/GitHub URLs in
  markup.

## Design system (all in `src/styles/global.css`)

**Colors are matched to the live Inspector.**

| Token | Light | Notes |
| --- | --- | --- |
| `--bg` | `#FFFFFF` | page background |
| `--fg` | `#1A1A2E` | navy body text |
| `--muted` | `#5A5E6B` | secondary text |
| `--btn` / `--btn-hover` | `#5A4FD1` / `#4A40B8` | **solid** indigo primary button |
| spectrum | `#E96A50` → `#A85FBE` → `#4F86E8` | coral → magenta → blue |

Dark mode is the same tokens re-mapped under `html.dark` (class-based, no-FOUC script in
`BaseLayout`). Always check both modes.

### The signature gradient (`--grad` / `.text-gradient`)

The coral→magenta→blue spectrum is **meaning-bearing** (the not-ready → ready scale) and reserved
for *signature moments only*:

- Large display headings (the gradient word in the hero/closer), the section spectrum rules
  (`.grad-bar`, `.closer::before`, `.hero::after`), the dimension color-coding, the cross-cutting
  band, and decorative accents.
- **Never** use the gradient for the primary button (it's solid indigo) or for body/small text.
- `.text-gradient` is `inline-block` with a hair of right padding so descenders (e.g. the "y" in
  "ready") aren't clipped by `background-clip: text`. Keep that.

### Typography

- Font is **Roboto** (matches the Inspector). `.font-display` = Roboto 700 with tight tracking for
  headings; body is Roboto regular.

### Components & spacing

- Use `Section` for every band (gives consistent width via `.wrap`, eyebrow, heading level, lead,
  and the `bg="tint"` alternation). The **first** Section of the page that isn't the hero should set
  `headingLevel={1}` only if the hero has no `<h1>` — currently the hero owns the single `<h1>`, and
  Sections render `<h2>`. Keep exactly one `<h1>`.
- Cards use `.ui-card` / `Card`. Grids: `grid gap-5 sm:grid-cols-2 lg:grid-cols-3`.
- Code blocks: always `CodeTabs` (dark terminal styling, Shiki). If you add a `python` block, note
  the comment-token contrast override in `global.css` (`.code-tabs span[style*="6a737d" i]`) keeps
  comments AA.

## Accessibility (required)

- Exactly one `<main>` (enforced by e2e) and a single `<h1>` — the hero owns it; every `Section`
  renders an `<h2>`. The e2e test asserts one `<main>` and that an `<h1>` exists; keep the page to a
  single `<h1>`.
- WCAG-AA contrast. Watch small colored text: badges/status use AA-safe colors (`--badge-fg`,
  `.fg-status.issues` `#C2334B`, `.ok` `#1A7F37`). Don't drop these to brighter brand colors.
- All decorative animation/imagery is `aria-hidden` and pointer-events:none; everything respects
  `prefers-reduced-motion`. Preserve both when editing the hero/closer animations.
- Acknowledgement/partner logos are grayscale by default, color on hover; dark logos get a white
  chip in dark mode. Keep `alt` text = the institution name.

## How to make common edits

| Task | Where |
| --- | --- |
| Reword a section lead/heading | the `Section` props in `index.astro` |
| Add/edit a readiness dimension | `src/data/dimensions.ts` (six core have a `color`; the seventh is `crossCutting`). Update the unit test count if you change how many. |
| Add an access mode | `src/data/access-modes.ts` (`icon` from `Icon.astro`; `agentic: true` adds the "Agent-ready" badge) |
| Add an integration ("Built to extend") | `src/data/integrations.ts` (add a `logo` path for a real mark, else an icon) |
| Add a supported format | `src/data/formats.ts` (`name`, `icon`, `ext` shown only on hover). Don't list extensions inline. |
| Add a publication | new `src/content/publications/*.md` with schema frontmatter |
| Add/replace an acknowledgement logo | drop the file in `public/logos/`, set its path in `src/data/acknowledgements.ts` |
| Add an icon | add one `currentColor` path to the map in `Icon.astro` |
| Change a code example | edit in `index.astro`; **verify it runs first** (see Golden rule 1) |

## Animations — invariants

- The hero console story is **Inspect → Remediate → Transform** and the data grid must stay in sync
  (squares+issues → circles+cleared → green-random). The driving logic is the inline `<script>` at
  the bottom of `index.astro`; timings are plain `setTimeout`s. If you change the lines, keep the
  phase labels, meter targets, and grid steps aligned.
- The closer switcher cycles Web → CLI → Python → MCP showing the *same* result. Keep all four
  panels showing equivalent, accurate output.

## Don't

- Don't add the gradient to buttons or small text.
- Don't reintroduce em dashes.
- Don't hardcode external URLs (use `site.ts`).
- Don't show unverified CLI/library/API examples.
- Don't weaken or delete tests to make a change pass.
- Don't add sub-pages/routes without being asked.

## Pre-commit checklist

```bash
npm run check        # 0 errors
npm run build        # succeeds
npm run test:unit    # data invariants
npm run test:e2e     # behavior + a11y (no serious/critical)
npm run links        # after build; 0 broken internal links
```

Commit style: plain, human, present-tense subject. No "Generated with…" footers, no AI co-author
trailers, no robot emoji.
