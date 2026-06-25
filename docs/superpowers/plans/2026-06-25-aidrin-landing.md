# AIDRIN Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, distinctive marketing landing site for AIDRIN (AI Data Readiness Inspector) in Astro — home + sub-pages covering capabilities, the inspect→remediate→transform workflow, access modes, agentic eval, custom metrics, publications, get-started, and (content-gated) use-cases/team.

**Architecture:** Astro 5 static site, Tailwind v4 (via `@tailwindcss/vite`), MDX for code-bearing content, content collections (with Zod schemas) for publications/use-cases/team, and plain typed `src/data/*.ts` modules for fixed lists. One small client island for copy-to-clipboard; class-based dark mode with a no-FOUC inline script. Verification via Playwright (page behavior), vitest (data), `astro check`/`astro build` (types+schemas), and axe + linkinator (a11y + links).

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS v4, `@astrojs/mdx`, `@astrojs/sitemap`, `@fontsource-variable/inter`, `@fontsource/saira-condensed`, Shiki (built-in), Playwright + `@axe-core/playwright`, vitest, linkinator.

## Global Constraints

- **Name:** Use "AIDRIN — AI Data Readiness **Inspector**" everywhere. Never "Infrastructure" in user-facing copy.
- **Features-as-available:** Present all features as available; no status/maturity badges.
- **Confirmed features (feature confidently):** Web Inspector, Python library, CLI + agentic eval, MCP server, Globus remote data, LLM explanations, OpenTelemetry, custom metrics, APPFL.
- **Do NOT include ROOT** in the supported-formats list (unconfirmed). Formats list is exactly: CSV, Excel (.xls/.xlsx/.xlsm/.xlsb), JSON, NumPy (.npz), HDF5 (.h5).
- **CTA hierarchy:** exactly one primary CTA site-wide — "Launch Inspector" (gradient fill). "Get Started" secondary (outline). Docs/GitHub are tertiary (text/icon links, never primary buttons).
- **Signature gradient:** `#E96A50` → `#A85FBE` → `#4F86E8`. Restricted to large display text (≥24px), wordmark, decorative elements, and the primary CTA only — never body/small text.
- **Neutrals:** cream `#FBFBF2`, charcoal `#1C1E21`. Light + dark mode, class-based, no FOUC.
- **External links (single source of truth in `src/data/site.ts`):** Inspector `https://aidrin.org/inspector`, Docs `https://aidrin.readthedocs.io/en/latest/`, GitHub `https://github.com/idtlab/AIDRIN/`.
- **Accessibility:** WCAG-AA contrast, semantic HTML, visible focus, reduced-motion + forced-colors support.
- **Commits:** frequent, conventional-commit style. Do **not** add any Claude/Anthropic co-author trailer. Do not push unless the user asks.
- **Node:** 20+. Package manager: npm.

---

### Task 1: Scaffold project, design tokens, base layout, test harness

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `playwright.config.ts`, `vitest.config.ts`
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/ThemeToggle.astro`
- Create: `src/pages/index.astro` (temporary placeholder)
- Create: `public/logo.png` (copy from AIDRIN repo)
- Test: `tests/e2e/smoke.spec.ts`

**Interfaces:**
- Produces: `BaseLayout.astro` accepting props `{ title: string; description: string }` and a default `<slot/>`; global CSS custom properties `--grad-from/-via/-to`, `--color-cream`, `--color-charcoal`; a `.text-gradient` utility and `.btn-primary` / `.btn-secondary` classes; a working `html.dark` toggle.

- [ ] **Step 1: Initialize project and install dependencies**

```bash
npm create astro@latest . -- --template minimal --no-install --no-git --yes
npm install
npm install -D @tailwindcss/vite tailwindcss @astrojs/mdx @astrojs/sitemap \
  @fontsource-variable/inter @fontsource/saira-condensed \
  @playwright/test @axe-core/playwright vitest linkinator
npx playwright install chromium
```

- [ ] **Step 2: Configure Astro (Tailwind v4 vite plugin, MDX, sitemap, site URL)**

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aidrin.org',
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Write design tokens + Tailwind import in `src/styles/global.css`**

```css
@import "tailwindcss";

:root {
  --color-cream: #FBFBF2;
  --color-charcoal: #1C1E21;
  --grad-from: #E96A50;
  --grad-via: #A85FBE;
  --grad-to: #4F86E8;
  --bg: var(--color-cream);
  --fg: var(--color-charcoal);
}
html.dark {
  --bg: var(--color-charcoal);
  --fg: var(--color-cream);
}
html { background: var(--bg); color: var(--fg); font-family: "Inter Variable", system-ui, sans-serif; }
.font-display { font-family: "Saira Condensed", "Inter Variable", sans-serif; }

/* Gradient ONLY for large display text / decorative — never body text */
.text-gradient {
  background: linear-gradient(100deg, var(--grad-from), var(--grad-via), var(--grad-to));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
@media (forced-colors: active) { .text-gradient { color: CanvasText; -webkit-text-fill-color: CanvasText; } }

.btn-primary {
  display: inline-flex; align-items: center; gap: .5rem; font-weight: 600; color: #fff;
  padding: .75rem 1.25rem; border-radius: .75rem;
  background: linear-gradient(100deg, var(--grad-from), var(--grad-via), var(--grad-to));
}
.btn-secondary {
  display: inline-flex; align-items: center; gap: .5rem; font-weight: 600;
  padding: .75rem 1.25rem; border-radius: .75rem; border: 1.5px solid currentColor;
}
:focus-visible { outline: 3px solid var(--grad-via); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
```

- [ ] **Step 4: Create `BaseLayout.astro` with no-FOUC dark mode init**

```astro
---
import "../styles/global.css";
import "@fontsource-variable/inter";
import "@fontsource/saira-condensed/600.css";
import "@fontsource/saira-condensed/700.css";
import ThemeToggle from "../components/ThemeToggle.astro";
interface Props { title: string; description: string; }
const { title, description } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <script is:inline>
      // no-FOUC: apply theme before paint
      const t = localStorage.getItem("theme");
      if (t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches))
        document.documentElement.classList.add("dark");
    </script>
  </head>
  <body>
    <slot />
    <ThemeToggle />
  </body>
</html>
```

- [ ] **Step 5: Create `ThemeToggle.astro`**

```astro
<button id="theme-toggle" aria-label="Toggle dark mode" class="fixed bottom-4 right-4 rounded-full border p-2">🌓</button>
<script is:inline>
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  });
</script>
```

- [ ] **Step 6: Temporary `src/pages/index.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
---
<BaseLayout title="AIDRIN — AI Data Readiness Inspector" description="Is your data ready for AI?">
  <main><h1 class="font-display text-gradient" data-testid="placeholder">AIDRIN</h1></main>
</BaseLayout>
```

- [ ] **Step 7: Copy the logo asset into `public/`**

```bash
curl -sL https://raw.githubusercontent.com/idtlab/AIDRIN/main/aidrin/images/logoNoBackground.png -o public/logo.png
```

- [ ] **Step 8: Configure Playwright (`playwright.config.ts`) and vitest (`vitest.config.ts`)**

`playwright.config.ts`:

```ts
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  webServer: { command: 'npm run preview', url: 'http://localhost:4321', reuseExistingServer: true, timeout: 120000 },
  use: { baseURL: 'http://localhost:4321' },
});
```

`vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['tests/unit/**/*.test.ts'] } });
```

Add scripts to `package.json`: `"test:e2e": "playwright test"`, `"test:unit": "vitest run"`, `"check": "astro check"`, `"links": "linkinator ./dist --recurse --silent"`.

- [ ] **Step 9: Write the failing smoke test `tests/e2e/smoke.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
test('home renders wordmark and theme toggles', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('placeholder')).toHaveText('AIDRIN');
  const html = page.locator('html');
  const before = await html.getAttribute('class');
  await page.getByLabel('Toggle dark mode').click();
  await expect(html).not.toHaveClass(before ?? '');
});
```

- [ ] **Step 10: Build, then run the smoke test (expect PASS)**

```bash
npm run build && npm run test:e2e
```
Expected: build succeeds; smoke test PASSES (placeholder visible, toggle flips `html.dark`).

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "chore: scaffold Astro site, design tokens, base layout, test harness"
```

---

### Task 2: Site data, content collections, and schemas

**Files:**
- Create: `src/data/site.ts`, `src/data/nav.ts`, `src/data/workflow.ts`, `src/data/dimensions.ts`, `src/data/access-modes.ts`, `src/data/integrations.ts`, `src/data/formats.ts`
- Create: `src/content.config.ts`
- Create: `src/content/publications/*.md` (5 files), `src/content/use-cases/*.md` (3 placeholder files), `src/content/team/*.md` (1 placeholder file)
- Test: `tests/unit/data.test.ts`

**Interfaces:**
- Produces:
  - `site` object: `{ inspector: string; docs: string; github: string; name: string; tagline: string }`
  - `dimensions: { title: string; blurb: string }[]` (length 6)
  - `accessModes: { name: string; blurb: string; agentic?: boolean }[]` (length 6)
  - `integrations: { name: string; blurb: string }[]` (agentic, custom-metrics, OpenTelemetry, APPFL)
  - `formats: string[]` (length 5, no ROOT)
  - `workflowSteps: { step: string; blurb: string }[]` (length 3: Inspect/Remediate/Transform)
  - publications collection schema fields: `title, authors, venue, year, doi?, arxiv?, url?, bibtex?`

- [ ] **Step 1: Write `src/data/site.ts`**

```ts
export const site = {
  name: "AIDRIN — AI Data Readiness Inspector",
  tagline: "Is your data ready for AI?",
  inspector: "https://aidrin.org/inspector",
  docs: "https://aidrin.readthedocs.io/en/latest/",
  github: "https://github.com/idtlab/AIDRIN/",
} as const;
```

- [ ] **Step 2: Write `src/data/dimensions.ts`, `workflow.ts`, `access-modes.ts`, `integrations.ts`, `formats.ts`**

`dimensions.ts`:

```ts
export const dimensions = [
  { title: "Data Quality", blurb: "Completeness, outliers, duplicates, and overall integrity." },
  { title: "Data Governance", blurb: "Privacy, sensitivity, and responsible-use signals." },
  { title: "Understandability & Usability", blurb: "Documentation, metadata, and ease of reuse." },
  { title: "Fairness & Bias", blurb: "Class imbalance and representation across groups." },
  { title: "Impact on AI", blurb: "Feature relevance and correlation that shape model outcomes." },
  { title: "Structure & Organization", blurb: "Schema, formats, and structural consistency." },
];
```

`workflow.ts`:

```ts
export const workflowSteps = [
  { step: "Inspect", blurb: "Quantitatively assess readiness across six dimensions." },
  { step: "Remediate", blurb: "Apply built-in remedies to fix detected issues." },
  { step: "Transform", blurb: "Export a cleaned, AI-ready dataset." },
];
```

`access-modes.ts`:

```ts
export const accessModes = [
  { name: "Web Inspector", blurb: "Upload and assess datasets in your browser — no setup." },
  { name: "Python Library", blurb: "pip install and score datasets in scripts and notebooks." },
  { name: "CLI", blurb: "Headless command-line evaluation — scriptable and CI-friendly.", agentic: true },
  { name: "MCP Server", blurb: "Expose AIDRIN to AI agents via the Model Context Protocol.", agentic: true },
  { name: "Globus", blurb: "Run metrics on remote datasets without transferring files." },
  { name: "LLM Explanations", blurb: "Generate plain-language explanations of metric results." },
];
```

`integrations.ts`:

```ts
export const integrations = [
  { name: "Agentic Evaluation", blurb: "Let an AI agent inspect, remediate, and report autonomously via the CLI and MCP server." },
  { name: "Custom Metrics", blurb: "Define your own metrics and remedies through an extensible framework." },
  { name: "OpenTelemetry", blurb: "Emit traces and metrics for observability into evaluation runs." },
  { name: "APPFL", blurb: "Assess data readiness inside privacy-preserving federated learning workflows." },
];
```

`formats.ts`:

```ts
export const formats = ["CSV", "Excel (.xls/.xlsx/.xlsm/.xlsb)", "JSON", "NumPy (.npz)", "HDF5 (.h5)"];
```

- [ ] **Step 3: Write `src/data/nav.ts`**

```ts
export const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Integrations", href: "/integrations" },
  { label: "Get Started", href: "/get-started" },
  { label: "Publications", href: "/publications" },
];
```

- [ ] **Step 4: Define content collections in `src/content.config.ts`**

```ts
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const publications = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    year: z.number(),
    doi: z.string().optional(),
    arxiv: z.string().optional(),
    url: z.string().optional(),
    bibtex: z.string().optional(),
  }),
});
const useCases = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/use-cases" }),
  schema: z.object({ title: z.string(), domain: z.string(), summary: z.string(), draft: z.boolean().default(true) }),
});
const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: z.object({ name: z.string(), role: z.string(), affiliation: z.string().optional(), draft: z.boolean().default(true) }),
});
export const collections = { publications, useCases, team };
```

- [ ] **Step 5: Create the 5 publication markdown files**

`src/content/publications/2025-aidrin-toolset.md`:

```md
---
title: "AIDRIN: A Comprehensive Toolset for Automating Data Preparation for AI"
authors: "Hiniduma, J. L. Bez, R. Madduri, S. Byna"
venue: "SC25 (poster)"
year: 2025
url: "https://sc25.conference-program.com/presentation/?id=int_post104&sess=sess537"
---
```

`src/content/publications/2025-cadre.md`:

```md
---
title: "CADRE: Customizable Assurance of Data Readiness in Privacy-Preserving Federated Learning"
authors: "Hiniduma, Z. Li, A. Sinha, R. Madduri, S. Byna"
venue: "e-Science '25"
year: 2025
doi: "10.1109/eScience65000.2025.00023"
---
```

`src/content/publications/2025-aidrin-2.md`:

```md
---
title: "AIDRIN 2.0: A Framework to Assess Data Readiness for AI"
authors: "Hiniduma, D. Ryan, S. Byna, J. L. Bez, R. Madduri"
venue: "SSDBM 2025 (poster)"
year: 2025
arxiv: "2505.18213"
---
```

`src/content/publications/2025-360-survey.md`:

```md
---
title: "Data Readiness for AI: A 360-Degree Survey"
authors: "Hiniduma, S. Byna, J. L. Bez"
venue: "ACM Computing Surveys 57(9):219"
year: 2025
doi: "10.1145/3722214"
---
```

`src/content/publications/2024-aidrin.md`:

```md
---
title: "AI Data Readiness Inspector (AIDRIN) for Quantitative Assessment of Data Readiness for AI"
authors: "Hiniduma, S. Byna, J. L. Bez, R. Madduri"
venue: "SSDBM '24"
year: 2024
doi: "10.1145/3676288.3676296"
---
```

- [ ] **Step 6: Create placeholder use-case + team files (marked `draft: true`)**

`src/content/use-cases/_placeholder.md`:

```md
---
title: "TODO: confirm use case"
domain: "TODO"
summary: "TODO: stakeholder to provide a science-domain example."
draft: true
---
```

`src/content/team/_placeholder.md`:

```md
---
name: "TODO: confirm team member"
role: "TODO"
draft: true
---
```

- [ ] **Step 7: Write failing data test `tests/unit/data.test.ts`**

```ts
import { test, expect } from 'vitest';
import { dimensions } from '../../src/data/dimensions';
import { accessModes } from '../../src/data/access-modes';
import { formats } from '../../src/data/formats';
import { workflowSteps } from '../../src/data/workflow';
import { site } from '../../src/data/site';

test('six dimensions', () => expect(dimensions).toHaveLength(6));
test('six access modes', () => expect(accessModes).toHaveLength(6));
test('three workflow steps', () => expect(workflowSteps.map(w => w.step)).toEqual(['Inspect','Remediate','Transform']));
test('formats exclude ROOT', () => { expect(formats).toHaveLength(5); expect(formats.join()).not.toMatch(/ROOT/i); });
test('external links present', () => { for (const k of ['inspector','docs','github']) expect(site[k]).toMatch(/^https:\/\//); });
```

- [ ] **Step 8: Run unit tests + astro check (expect PASS)**

```bash
npm run test:unit && npm run check
```
Expected: 5 unit tests PASS; `astro check` reports 0 errors (collection schemas valid).

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: add site data modules and content collections"
```

---

### Task 3: Navigation and footer chrome

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Footer.astro`
- Modify: `src/layouts/BaseLayout.astro` (render Nav + Footer around slot)
- Test: `tests/e2e/chrome.spec.ts`

**Interfaces:**
- Consumes: `navLinks` from `src/data/nav.ts`, `site` from `src/data/site.ts`.
- Produces: `Nav.astro` (logo, nav links, icon cluster for Docs/GitHub, primary "Launch Inspector" CTA, mobile hamburger) and `Footer.astro` (grouped links + acks/funding line + copyright). BaseLayout now wraps content with both.

- [ ] **Step 1: Write `Nav.astro`**

```astro
---
import { navLinks } from "../data/nav.ts";
import { site } from "../data/site.ts";
---
<header class="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
  <a href="/" class="font-display font-bold text-2xl text-gradient">AIDRIN</a>
  <nav class="hidden md:flex items-center gap-6" aria-label="Primary">
    {navLinks.map(l => <a href={l.href} class="hover:opacity-70">{l.label}</a>)}
    <a href={site.docs} aria-label="Documentation" class="opacity-70 hover:opacity-100">Docs↗</a>
    <a href={site.github} aria-label="GitHub repository" class="opacity-70 hover:opacity-100">GitHub↗</a>
    <a href={site.inspector} class="btn-primary" data-testid="cta-primary">Launch Inspector</a>
  </nav>
  <button id="nav-toggle" class="md:hidden" aria-label="Open menu" aria-expanded="false">☰</button>
</header>
<nav id="mobile-menu" class="md:hidden hidden flex-col gap-4 px-6 pb-4" aria-label="Mobile">
  {navLinks.map(l => <a href={l.href}>{l.label}</a>)}
  <a href={site.inspector} class="btn-primary">Launch Inspector</a>
</nav>
<script is:inline>
  const b = document.getElementById("nav-toggle"), m = document.getElementById("mobile-menu");
  b?.addEventListener("click", () => {
    const open = m.classList.toggle("hidden") === false;
    m.classList.toggle("flex", open); b.setAttribute("aria-expanded", String(open));
  });
</script>
```

- [ ] **Step 2: Write `Footer.astro`**

```astro
---
import { site } from "../data/site.ts";
import { navLinks } from "../data/nav.ts";
---
<footer class="border-t mt-24 px-6 py-12 max-w-7xl mx-auto text-sm">
  <div class="grid gap-8 md:grid-cols-3">
    <div><span class="font-display text-gradient text-xl">AIDRIN</span><p class="opacity-70 mt-2">AI Data Readiness Inspector</p></div>
    <div><h3 class="font-semibold mb-2">Resources</h3>
      {navLinks.map(l => <a class="block opacity-70 hover:opacity-100" href={l.href}>{l.label}</a>)}
      <a class="block opacity-70 hover:opacity-100" href={site.docs}>Documentation</a>
    </div>
    <div><h3 class="font-semibold mb-2">Connect</h3>
      <a class="block opacity-70 hover:opacity-100" href={site.github}>GitHub</a>
      <a class="block opacity-70 hover:opacity-100" href={site.inspector}>Launch Inspector</a>
    </div>
  </div>
  <p class="opacity-60 mt-8">{/* TODO: confirm exact funding text */}Supported in part by the U.S. National Science Foundation and collaborating institutions.</p>
  <p class="opacity-60 mt-1">© {new Date().getFullYear()} AIDRIN. Open source on GitHub.</p>
</footer>
```

- [ ] **Step 3: Wire Nav + Footer into `BaseLayout.astro`**

Replace `<slot />` block in `BaseLayout.astro` body with:

```astro
    <Nav />
    <slot />
    <Footer />
    <ThemeToggle />
```
And add imports at top of frontmatter: `import Nav from "../components/Nav.astro";` and `import Footer from "../components/Footer.astro";`

- [ ] **Step 4: Write failing chrome test `tests/e2e/chrome.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
test('exactly one primary CTA in nav, pointing to inspector', async ({ page }) => {
  await page.goto('/');
  const cta = page.getByTestId('cta-primary');
  await expect(cta).toHaveText('Launch Inspector');
  await expect(cta).toHaveAttribute('href', 'https://aidrin.org/inspector');
});
test('footer has funding line', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer')).toContainText('National Science Foundation');
});
```

- [ ] **Step 5: Build + run test (expect PASS)**

```bash
npm run build && npm run test:e2e -- chrome.spec.ts
```
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat: add nav and footer chrome"
```

---

### Task 4: Reusable UI components (Section, Card, FormatChips, CodeTabs + CopyButton island)

**Files:**
- Create: `src/components/Section.astro`, `src/components/Card.astro`, `src/components/FormatChips.astro`, `src/components/CodeTabs.astro`, `src/components/CopyButton.astro`
- Test: `tests/e2e/components.spec.ts` (exercised via the home page in Task 5; this task verifies render in isolation through a scratch route)

**Interfaces:**
- Produces:
  - `Section.astro` props `{ id?: string; eyebrow?: string; heading: string }` + slot.
  - `Card.astro` props `{ title: string; accent?: boolean }` + slot.
  - `FormatChips.astro` (no props; reads `formats`).
  - `CodeTabs.astro` props `{ tabs: { label: string; code: string; lang: string }[] }`, renders Shiki-highlighted blocks with a `CopyButton`.
  - `CopyButton.astro` — client island copying its `data-code` to clipboard.

- [ ] **Step 1: Write `Section.astro`**

```astro
---
interface Props { id?: string; eyebrow?: string; heading: string; }
const { id, eyebrow, heading } = Astro.props;
---
<section id={id} class="max-w-7xl mx-auto px-6 py-16">
  {eyebrow && <p class="font-display uppercase tracking-widest text-sm opacity-60">{eyebrow}</p>}
  <h2 class="font-display font-bold text-3xl md:text-4xl mb-8">{heading}</h2>
  <slot />
</section>
```

- [ ] **Step 2: Write `Card.astro`**

```astro
---
interface Props { title: string; accent?: boolean; }
const { title, accent } = Astro.props;
---
<div class={`rounded-2xl border p-6 ${accent ? "ring-2 ring-[var(--grad-via)]" : ""}`}>
  <h3 class="font-semibold text-lg mb-2">{title}</h3>
  <slot />
</div>
```

- [ ] **Step 3: Write `FormatChips.astro`**

```astro
---
import { formats } from "../data/formats.ts";
---
<ul class="flex flex-wrap gap-2" data-testid="format-chips">
  {formats.map(f => <li class="rounded-full border px-3 py-1 text-sm">{f}</li>)}
</ul>
```

- [ ] **Step 4: Write `CopyButton.astro` (client island)**

```astro
---
interface Props { code: string; }
const { code } = Astro.props;
---
<button class="copy-btn text-xs opacity-70 hover:opacity-100" data-code={code} aria-label="Copy code">Copy</button>
<script>
  document.querySelectorAll(".copy-btn").forEach(b =>
    b.addEventListener("click", () => navigator.clipboard.writeText(b.getAttribute("data-code") ?? "")));
</script>
```

- [ ] **Step 5: Write `CodeTabs.astro` (Shiki via Astro's `<Code>`)**

```astro
---
import { Code } from "astro:components";
import CopyButton from "./CopyButton.astro";
interface Props { tabs: { label: string; code: string; lang: string }[]; }
const { tabs } = Astro.props;
---
<div class="rounded-xl border overflow-hidden" data-testid="code-tabs">
  <div class="flex gap-2 border-b px-3 py-2 text-sm">
    {tabs.map((t, i) => <button class="tab" data-i={i} aria-pressed={i === 0}>{t.label}</button>)}
  </div>
  {tabs.map((t, i) => (
    <div class="panel" data-i={i} hidden={i !== 0}>
      <div class="flex justify-end px-3 pt-2"><CopyButton code={t.code} /></div>
      <Code code={t.code} lang={t.lang} />
    </div>
  ))}
</div>
<script>
  document.querySelectorAll('[data-testid="code-tabs"]').forEach(box => {
    const tabs = box.querySelectorAll(".tab"), panels = box.querySelectorAll(".panel");
    tabs.forEach(tab => tab.addEventListener("click", () => {
      const i = tab.getAttribute("data-i");
      tabs.forEach(t => t.setAttribute("aria-pressed", String(t === tab)));
      panels.forEach(p => (p.hidden = p.getAttribute("data-i") !== i));
    }));
  });
</script>
```

- [ ] **Step 6: Create scratch route `src/pages/_scratch.astro` to render components, write failing test**

`src/pages/_scratch.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import FormatChips from "../components/FormatChips.astro";
import CodeTabs from "../components/CodeTabs.astro";
---
<BaseLayout title="scratch" description="scratch">
  <FormatChips />
  <CodeTabs tabs={[{label:"pip",code:"pip install aidrin",lang:"bash"},{label:"cli",code:"aidrin inspect data.csv",lang:"bash"}]} />
</BaseLayout>
```

`tests/e2e/components.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
test('format chips list 5 formats without ROOT', async ({ page }) => {
  await page.goto('/_scratch');
  const chips = page.getByTestId('format-chips').locator('li');
  await expect(chips).toHaveCount(5);
  await expect(page.getByTestId('format-chips')).not.toContainText('ROOT');
});
test('code tabs switch panels', async ({ page }) => {
  await page.goto('/_scratch');
  const box = page.getByTestId('code-tabs');
  await box.getByText('cli').click();
  await expect(box.locator('.panel[data-i="1"]')).toBeVisible();
});
```

- [ ] **Step 7: Build + run test (expect PASS), then delete scratch route**

```bash
npm run build && npm run test:e2e -- components.spec.ts
```
Expected: PASS. Then remove the scratch route and its test (no longer needed once home page exercises the components):

```bash
git rm src/pages/_scratch.astro tests/e2e/components.spec.ts
```

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat: add reusable UI components (Section, Card, FormatChips, CodeTabs)"
```

---

### Task 5: Home page assembly

**Files:**
- Modify: `src/pages/index.astro` (replace placeholder with full home page)
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: all of Task 2's data, Task 4's components, Task 3's chrome (via BaseLayout).
- Produces: the home page with sections in the spec's consolidated order. No new exported interface.

- [ ] **Step 1: Write the home page** (full content)

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Section from "../components/Section.astro";
import Card from "../components/Card.astro";
import FormatChips from "../components/FormatChips.astro";
import CodeTabs from "../components/CodeTabs.astro";
import { site } from "../data/site.ts";
import { dimensions } from "../data/dimensions.ts";
import { workflowSteps } from "../data/workflow.ts";
import { accessModes } from "../data/access-modes.ts";
import { getCollection } from "astro:content";
const pubs = (await getCollection("publications")).sort((a,b)=>b.data.year-a.data.year).slice(0,3);
---
<BaseLayout title="AIDRIN — AI Data Readiness Inspector" description="AIDRIN quantitatively assesses and improves your dataset's readiness for AI/ML.">
  <!-- 1. Hero -->
  <section class="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center" data-testid="hero">
    <h1 class="font-display font-bold text-5xl md:text-7xl text-gradient">Is your data ready for AI?</h1>
    <p class="mt-6 text-lg md:text-xl max-w-2xl mx-auto opacity-80">AIDRIN quantitatively assesses and improves your dataset's readiness for AI and machine learning.</p>
    <div class="mt-8 flex justify-center gap-4">
      <a href={site.inspector} class="btn-primary">Launch Inspector</a>
      <a href="/get-started" class="btn-secondary">Get Started</a>
    </div>
  </section>

  <!-- 2. What is AIDRIN + workflow -->
  <Section eyebrow="Workflow" heading="Inspect. Remediate. Transform.">
    <div class="grid gap-6 md:grid-cols-3" data-testid="workflow">
      {workflowSteps.map(w => <Card title={w.step}><p class="opacity-80">{w.blurb}</p></Card>)}
    </div>
  </Section>

  <!-- 3. Six dimensions -->
  <Section eyebrow="Assessment" heading="Six readiness dimensions">
    <div class="grid gap-6 md:grid-cols-3" data-testid="dimensions">
      {dimensions.map(d => <Card title={d.title}><p class="opacity-80">{d.blurb}</p></Card>)}
    </div>
  </Section>

  <!-- 4. How you use it -->
  <Section eyebrow="Access" heading="Use AIDRIN your way">
    <div class="grid gap-6 md:grid-cols-3" data-testid="access-modes">
      {accessModes.map(m => (
        <Card title={m.name} accent={m.agentic}>
          <p class="opacity-80">{m.blurb}</p>
          {m.agentic && <p class="mt-2 text-sm text-gradient font-semibold">Agent-ready</p>}
        </Card>
      ))}
    </div>
    <div class="mt-6">
      <a href="/integrations" class="btn-secondary">Custom metrics &amp; advanced integrations →</a>
    </div>
  </Section>

  <!-- 5. Supported formats strip -->
  <Section eyebrow="Formats" heading="Bring your data">
    <FormatChips />
  </Section>

  <!-- 6. Get started teaser -->
  <Section eyebrow="Get started" heading="Up and running in minutes">
    <CodeTabs tabs={[
      {label:"Library", code:"pip install aidrin\npython -c \"import aidrin; print(aidrin.__version__)\"", lang:"bash"},
      {label:"CLI", code:"aidrin inspect data.csv", lang:"bash"},
      {label:"Web", code:"# Open the hosted inspector — no install\nhttps://aidrin.org/inspector", lang:"bash"},
    ]} />
    <div class="mt-6"><a href="/get-started" class="btn-secondary">Full installation guide →</a></div>
  </Section>

  <!-- 7. Credibility band: publications -->
  <Section eyebrow="Research" heading="Backed by peer-reviewed research">
    <ul class="space-y-4" data-testid="pubs">
      {pubs.map(p => <li><span class="font-semibold">{p.data.title}</span><span class="opacity-70"> — {p.data.venue}, {p.data.year}</span></li>)}
    </ul>
    <div class="mt-6"><a href="/publications" class="btn-secondary">All publications →</a></div>
  </Section>

  <!-- 8. Final CTA -->
  <section class="max-w-7xl mx-auto px-6 py-20 text-center">
    <h2 class="font-display font-bold text-4xl text-gradient">Start inspecting your data</h2>
    <div class="mt-8 flex justify-center gap-4">
      <a href={site.inspector} class="btn-primary">Launch Inspector</a>
      <a href="/get-started" class="btn-secondary">Get Started</a>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Write failing home test `tests/e2e/home.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
test('all home sections present', async ({ page }) => {
  await page.goto('/');
  for (const id of ['hero','workflow','dimensions','access-modes','format-chips','pubs'])
    await expect(page.getByTestId(id)).toBeVisible();
});
test('exactly one gradient primary CTA style used for Launch Inspector', async ({ page }) => {
  await page.goto('/');
  const launches = page.getByRole('link', { name: 'Launch Inspector' });
  await expect(launches.first()).toHaveClass(/btn-primary/);
});
test('workflow shows Inspect/Remediate/Transform', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('workflow')).toContainText(['Inspect','Remediate','Transform']);
});
```

- [ ] **Step 3: Build + run test (expect PASS)**

```bash
npm run build && npm run test:e2e -- home.spec.ts
```
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: build home page"
```

---

### Task 6: /features page

**Files:**
- Create: `src/pages/features.astro`
- Test: `tests/e2e/features.spec.ts`

**Interfaces:**
- Consumes: `workflowSteps`, `dimensions`, `formats` (via FormatChips), `Section`, `Card`.
- Produces: `/features` route covering workflow + six dimensions (expanded) + full formats list.

- [ ] **Step 1: Write `features.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Section from "../components/Section.astro";
import Card from "../components/Card.astro";
import FormatChips from "../components/FormatChips.astro";
import { workflowSteps } from "../data/workflow.ts";
import { dimensions } from "../data/dimensions.ts";
---
<BaseLayout title="Features — AIDRIN" description="What AIDRIN evaluates: the inspect–remediate–transform workflow and six readiness dimensions.">
  <Section eyebrow="What it does" heading="The AIDRIN workflow">
    <div class="grid gap-6 md:grid-cols-3" data-testid="workflow">
      {workflowSteps.map(w => <Card title={w.step}><p class="opacity-80">{w.blurb}</p></Card>)}
    </div>
  </Section>
  <Section eyebrow="What it measures" heading="Six readiness dimensions">
    <div class="grid gap-6 md:grid-cols-2" data-testid="dimensions">
      {dimensions.map(d => <Card title={d.title}><p class="opacity-80">{d.blurb}</p></Card>)}
    </div>
  </Section>
  <Section eyebrow="Inputs" heading="Supported formats">
    <FormatChips />
  </Section>
</BaseLayout>
```

- [ ] **Step 2: Write failing test `tests/e2e/features.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
test('features lists 6 dimensions', async ({ page }) => {
  await page.goto('/features');
  await expect(page.getByTestId('dimensions').locator('> div')).toHaveCount(6);
});
```

- [ ] **Step 3: Build + run test (expect PASS)**

```bash
npm run build && npm run test:e2e -- features.spec.ts
```
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add features page"
```

---

### Task 7: /integrations page

**Files:**
- Create: `src/pages/integrations.astro`
- Test: `tests/e2e/integrations.spec.ts`

**Interfaces:**
- Consumes: `accessModes`, `integrations`, `Section`, `Card`, `CodeTabs`.
- Produces: `/integrations` route covering access modes + agentic + custom metrics + OpenTelemetry + APPFL, with code examples.

- [ ] **Step 1: Write `integrations.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Section from "../components/Section.astro";
import Card from "../components/Card.astro";
import CodeTabs from "../components/CodeTabs.astro";
import { accessModes } from "../data/access-modes.ts";
import { integrations } from "../data/integrations.ts";
---
<BaseLayout title="Integrations — AIDRIN" description="How you integrate AIDRIN: library, CLI, MCP, Globus, LLM explanations, agentic evaluation, custom metrics, OpenTelemetry, and APPFL.">
  <Section eyebrow="Access modes" heading="Six ways to run AIDRIN">
    <div class="grid gap-6 md:grid-cols-3" data-testid="access-modes">
      {accessModes.map(m => <Card title={m.name}><p class="opacity-80">{m.blurb}</p></Card>)}
    </div>
  </Section>
  <Section eyebrow="Agentic" heading="Let an agent do the work">
    <p class="opacity-80 max-w-2xl mb-4">Drive AIDRIN autonomously through the CLI or the MCP server — an agent can inspect, remediate, and report without manual steps.</p>
    <CodeTabs tabs={[
      {label:"CLI", code:"aidrin inspect data.csv --report report.json", lang:"bash"},
      {label:"MCP", code:"# Register the AIDRIN MCP server with your agent client\naidrin mcp serve", lang:"bash"},
    ]} />
  </Section>
  <Section eyebrow="Extend" heading="Custom metrics &amp; remedies">
    <p class="opacity-80 max-w-2xl mb-4">Define your own metrics and remedies through AIDRIN's extensible framework.</p>
    <CodeTabs tabs={[
      {label:"Python", code:"from aidrin import CustomDR\n\nclass MyMetric(CustomDR):\n    def metric(self, df): ...\n    def remedy(self, df): ...", lang:"python"},
    ]} />
  </Section>
  <Section eyebrow="Advanced" heading="Observability &amp; federated learning">
    <div class="grid gap-6 md:grid-cols-2" data-testid="integrations">
      {integrations.filter(i => ["OpenTelemetry","APPFL"].includes(i.name)).map(i => <Card title={i.name}><p class="opacity-80">{i.blurb}</p></Card>)}
    </div>
  </Section>
</BaseLayout>
```

- [ ] **Step 2: Write failing test `tests/e2e/integrations.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
test('integrations page lists 6 access modes and advanced integrations', async ({ page }) => {
  await page.goto('/integrations');
  await expect(page.getByTestId('access-modes').locator('> div')).toHaveCount(6);
  await expect(page.getByTestId('integrations')).toContainText('OpenTelemetry');
  await expect(page.getByTestId('integrations')).toContainText('APPFL');
});
```

- [ ] **Step 3: Build + run test (expect PASS)**

```bash
npm run build && npm run test:e2e -- integrations.spec.ts
```
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add integrations page"
```

---

### Task 8: /get-started page

**Files:**
- Create: `src/pages/get-started.astro`
- Test: `tests/e2e/get-started.spec.ts`

**Interfaces:**
- Consumes: `Section`, `CodeTabs`, `site`.
- Produces: `/get-started` route with install options (source, PyPI, hosted), CLI usage, MCP setup, verify snippet.

- [ ] **Step 1: Write `get-started.astro`** (install commands copied verbatim from AIDRIN docs)

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Section from "../components/Section.astro";
import CodeTabs from "../components/CodeTabs.astro";
import { site } from "../data/site.ts";
---
<BaseLayout title="Get Started — AIDRIN" description="Install AIDRIN from source or PyPI, or use the hosted inspector.">
  <Section eyebrow="Install" heading="Choose how to run AIDRIN">
    <CodeTabs tabs={[
      {label:"PyPI", code:"pip install aidrin\npython -c \"import aidrin; print(aidrin.__version__)\"", lang:"bash"},
      {label:"From source", code:"git clone https://github.com/idtlab/AIDRIN.git\ncd AIDRIN\nconda create -n aidrin-env python=3.10 -y\nconda activate aidrin-env\npython -m pip install -e .", lang:"bash"},
      {label:"Hosted", code:"# Zero setup — open the hosted inspector:\nhttps://aidrin.org/inspector", lang:"bash"},
    ]} />
  </Section>
  <Section eyebrow="Web app" heading="Run the web inspector locally">
    <CodeTabs tabs={[
      {label:"Redis", code:"redis-server --port 6379", lang:"bash"},
      {label:"Celery", code:"PYTHONPATH=. celery -A worker.make_celery worker --beat --loglevel=info", lang:"bash"},
      {label:"Flask", code:"flask --app 'web:create_app()' run --debug\n# open http://127.0.0.1:5000", lang:"bash"},
    ]} />
  </Section>
  <Section eyebrow="CLI &amp; agents" heading="Command line and MCP">
    <CodeTabs tabs={[
      {label:"CLI", code:"aidrin inspect data.csv --report report.json", lang:"bash"},
      {label:"MCP", code:"aidrin mcp serve", lang:"bash"},
    ]} />
    <p class="opacity-70 text-sm mt-4">See the <a class="underline" href={site.docs}>full documentation</a> for all options.</p>
  </Section>
</BaseLayout>
```

- [ ] **Step 2: Write failing test `tests/e2e/get-started.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
test('get-started shows pip install and from-source steps', async ({ page }) => {
  await page.goto('/get-started');
  await expect(page.locator('body')).toContainText('pip install aidrin');
  await page.getByText('From source').first().click();
  await expect(page.locator('body')).toContainText('conda create -n aidrin-env');
});
```

- [ ] **Step 3: Build + run test (expect PASS)**

```bash
npm run build && npm run test:e2e -- get-started.spec.ts
```
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add get-started page"
```

---

### Task 9: /publications page

**Files:**
- Create: `src/pages/publications.astro`
- Test: `tests/e2e/publications.spec.ts`

**Interfaces:**
- Consumes: `publications` collection, `Section`.
- Produces: `/publications` route listing all papers sorted by year desc, with DOI/arXiv/url links.

- [ ] **Step 1: Write `publications.astro`**

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import Section from "../components/Section.astro";
import { getCollection } from "astro:content";
const pubs = (await getCollection("publications")).sort((a,b)=>b.data.year-a.data.year);
function link(d){ if(d.doi) return `https://doi.org/${d.doi}`; if(d.arxiv) return `https://arxiv.org/abs/${d.arxiv}`; return d.url; }
---
<BaseLayout title="Publications — AIDRIN" description="Peer-reviewed publications behind AIDRIN, 2024–2025.">
  <Section eyebrow="Research" heading="Publications">
    <ul class="space-y-6" data-testid="pub-list">
      {pubs.map(p => (
        <li class="border-b pb-4">
          <p class="font-semibold">{p.data.title}</p>
          <p class="opacity-70 text-sm">{p.data.authors}</p>
          <p class="opacity-70 text-sm">{p.data.venue}, {p.data.year}</p>
          {link(p.data) && <a class="underline text-sm" href={link(p.data)}>Read →</a>}
        </li>
      ))}
    </ul>
  </Section>
</BaseLayout>
```

- [ ] **Step 2: Write failing test `tests/e2e/publications.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
test('publications lists all 5 papers, newest first', async ({ page }) => {
  await page.goto('/publications');
  const items = page.getByTestId('pub-list').locator('li');
  await expect(items).toHaveCount(5);
  await expect(items.first()).toContainText('2025');
});
```

- [ ] **Step 3: Build + run test (expect PASS)**

```bash
npm run build && npm run test:e2e -- publications.spec.ts
```
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add publications page"
```

---

### Task 10: Accessibility, links, responsive polish, and deploy docs

**Files:**
- Create: `tests/e2e/a11y.spec.ts`
- Create: `README.md`
- Modify: any component flagged by axe/contrast (as needed)

**Interfaces:**
- Consumes: all pages.
- Produces: passing axe smoke across all routes, passing internal link check, a README with dev/build/deploy instructions.

- [ ] **Step 1: Write axe a11y smoke `tests/e2e/a11y.spec.ts`**

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const path of ['/', '/features', '/integrations', '/get-started', '/publications']) {
  test(`no serious a11y violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa']).analyze();
    const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact ?? ''));
    expect(serious, JSON.stringify(serious.map(v=>v.id))).toEqual([]);
  });
}
```

- [ ] **Step 2: Build, run a11y test, fix any serious/critical violations**

```bash
npm run build && npm run test:e2e -- a11y.spec.ts
```
Expected: PASS. If violations appear (e.g., contrast on a gradient element, missing landmark, button without label), fix the offending component and re-run until the test passes. Verify both light and dark mode by adding `await page.emulateMedia({ colorScheme: 'dark' })` variants if contrast issues are theme-specific.

- [ ] **Step 3: Run internal link check on built site**

```bash
npm run build && npm run links
```
Expected: linkinator reports 0 broken internal links. Fix any broken hrefs.

- [ ] **Step 4: Manual responsive check**

Run `npm run preview`, open `http://localhost:4321`, and verify at 375px and 1280px widths: nav collapses to hamburger on mobile and the mobile menu opens; section grids reflow to single column; no horizontal overflow. Note results.

- [ ] **Step 5: Write `README.md`**

````md
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
````

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "test: add a11y + link checks; docs: add README and deploy notes"
```

---

## Notes for the implementer

- **Frontend-design pass:** This plan establishes structure and correct content. The `frontend-design` skill should be applied during/after Task 5 to elevate the visual execution (spacing rhythm, the shield/eye/sparkle motifs, hero treatment, typography scale) beyond the functional Tailwind here. Keep the Global Constraints intact while doing so.
- **Two-reviewer gate:** Per the spec, route the finished branch through code review with two reviewers before declaring done (`requesting-code-review`).
- **Stakeholder TODOs (do not block):** funding/acks exact text, team members, use-case domains, PyPI package name/version, ROOT support confirmation. These remain as clearly-marked placeholders (`draft: true` collection items, `TODO` comments).
