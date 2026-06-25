# AIDRIN Landing Page

Static marketing site for AIDRIN (AI Data Readiness Inspector), built with Astro + Tailwind.

## Develop
```bash
npm install
npm run dev
```

## Build & preview
```bash
npm run build && npm run preview
```

## Test
```bash
npm run test:unit   # data validation
npm run check       # types + content schemas
npm run test:e2e    # Playwright page tests + axe a11y
npm run links       # internal link check (after build)
```

## Deploy
Build output is static (`dist/`). Deploy to the aidrin.org / aidrin.io host by serving `dist/` (any static host or the existing web server). `site` in `astro.config.mjs` is set to `https://aidrin.org`.

## Content
- Fixed lists: `src/data/*.ts`
- Publications / use-cases / team: `src/content/` (collections; `draft: true` items are placeholders to be filled by maintainers).
- External links: `src/data/site.ts`.
