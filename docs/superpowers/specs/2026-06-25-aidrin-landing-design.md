# AIDRIN Landing Page — Design Spec

**Date:** 2026-06-25
**Status:** Approved for planning
**Author:** Drafted with Claude Code

## 1. Purpose

Build a marketing landing site for **AIDRIN** (AI Data Readiness Inspector) — an open-source tool that quantitatively assesses whether datasets are ready for AI/ML across six readiness dimensions. ("Inspector" is the canonical, published expansion used across the marketing site; the repo README's "Infrastructure" framing is not used here, to avoid confusing first-time visitors.) The site highlights the tool's capabilities, access modes, publications, and how to get started, in the spirit of https://iowarp.ai/ but with a distinct layout and identity that matches AIDRIN.

References:
- Repo: https://github.com/idtlab/AIDRIN/
- Docs: https://aidrin.readthedocs.io/en/latest/
- Live inspector: https://aidrin.org/inspector

## 2. Goals & Non-Goals

**Goals**
- Communicate what AIDRIN is and the six readiness dimensions clearly.
- Convey AIDRIN as an end-to-end workflow, not just scoring: **Inspect → Remediate → Transform** — assess readiness, apply remedies to fix detected issues, and export an AI-ready dataset (cleaning & transformation). "Transform" is framed as the outcome of applying remedies, grounded in AIDRIN's metric/remedy model — not a separate engine.
- Highlight **agentic readiness evaluation** — AIDRIN can be driven autonomously by an AI agent (via CLI and MCP) to inspect, remediate, and report without manual steps. Kept prominent per stakeholder request.
- Highlight **custom metrics** — an extensible framework for defining your own evaluation metrics and remedies.
- Showcase all access modes as available capabilities: Web Inspector, Python Library, CLI (agentic eval), MCP server, Globus remote data, LLM explanations; plus OpenTelemetry observability and APPFL (privacy-preserving federated learning) integration as advanced/optional integrations.
- Provide clear get-started/install paths.
- Surface the 2024–2025 publication record.
- Present supported data formats, use cases, team, acknowledgements, and funding.
- Distinctive, polished visual identity derived from the AIDRIN logo (not a template).

**Non-Goals**
- Not rebuilding the inspector app itself (links out to the live app).
- No backend/server; static site only.
- No status/maturity badges — all features presented as available (per stakeholder decision).

## 3. Visual Identity

Derived from the AIDRIN logo (shield + inspector's eye + AI sparkle, coral→magenta→blue gradient).

- **Signature gradient:** coral `#E96A50` → magenta `#A85FBE` → blue `#4F86E8`. Restricted to **large display headlines (≥24px / AA-large), the wordmark, decorative line-art, and the single primary CTA** — never body text or small UI text.
- **Neutrals:** cream `#FBFBF2`, charcoal `#1C1E21` (continuity with the app UI). Light + dark mode.
- **Typography:** bold condensed display face for headlines (echoes the wordmark); Inter/Roboto for body; monospace for code.
- **Motifs:** shield (readiness/trust), eye (inspection), sparkle (AI). Subtle line-art + gradient as recurring threads — used sparingly so they read as identity, not decoration.
- **Accessibility:** semantic HTML, WCAG-AA contrast. Verify both gradient terminal colors **and the perceived midpoint** against cream and charcoal backgrounds; for gradient CTAs confirm the button *label* meets contrast (white-on-coral is the risk). Provide a solid-color fallback for `forced-colors` / high-contrast mode. Keyboard navigation, visible focus states, reduced-motion support, no-FOUC dark-mode init script.
- **CTA hierarchy:** one **primary** CTA site-wide — "Launch Inspector" (gradient fill, reserved exclusively for it). "Get Started" is **secondary** (outline). Docs and GitHub are **tertiary** utility links (text in nav / footer), not buttons.

## 4. Site Architecture

Astro static site; deployable to the aidrin.org / aidrin.io custom domain; host-agnostic static output.

Pages (launch set):
- **Home** — long-scroll landing
- **/features** — what AIDRIN evaluates (workflow + six dimensions)
- **/integrations** — how you integrate (access modes + agentic + custom metrics, with code)
- **/get-started** — install & access paths
- **/publications** — full paper list

**Content-gated pages** — built as home-page sections first; promoted to standalone routes only once real content exists (avoid shipping near-empty routes in primary nav):
- **/use-cases** — science domains
- **/team** — people behind AIDRIN

**Nav** kept lean: logo · Features · Integrations · Get Started · Publications · primary "Launch Inspector" CTA · dark-mode toggle. Docs↗ and GitHub↗ appear as a small icon cluster (not full nav text links) and in the footer. Use-cases/Team join the nav only once content-gated in. Mobile collapses to a hamburger with the same items.

**Footer** — links grouped Platform / Resources / Connect; acknowledgements + funding line; copyright.

## 5. Home Page Sections (top → bottom)

Consolidated to ~8 bands (per IA review) so the page reads as a coherent narrative — *What is it? Does it do what I need? Is it credible? How do I start?* — rather than competing capability lists.

1. **Hero** — Headline: "Is your data ready for AI?"; subhead leads with the outcome: "AIDRIN quantitatively assesses and improves your dataset's readiness for AI/ML." (The channel breadth — browser, library, CLI, AI agent — is deferred to the "How you use it" section so the hero stays focused on value.) CTAs: primary "Launch Inspector" (gradient), secondary "Get Started" (outline). Gradient/shield visual.
2. **What is AIDRIN + the workflow** — short framing of quantitative, automated readiness assessment, anchored by the three-step spine **Inspect → Remediate → Transform** (assess across six dimensions → apply remedies → export an AI-ready dataset).
3. **Six readiness dimensions** — card grid: Data Quality · Data Governance · Understandability & Usability · Fairness & Bias · Impact on AI · Structure & Organization.
4. **How you use it** — single consolidated access-mode grid (6 cards): Web Inspector · Python Library · CLI · MCP server · Globus remote data · LLM explanations. **Agentic evaluation** is surfaced as an accented framing on the CLI/MCP cards (one line) — the differentiator stays visible without a separate band; deep-links to /integrations. **Custom metrics** appears as a highlighted tile in/under this grid (teaser + deep-link to /integrations). OpenTelemetry and APPFL are *not* on the home grid — they live on /integrations as advanced integrations.
5. **Supported formats** — compact inline chip/logo strip (not a full-width band), attached to the workflow or access-mode section: CSV, Excel (.xls/.xlsx/.xlsm/.xlsb), JSON, NumPy (.npz), HDF5 (.h5). (ROOT support is in an open PR and not yet confirmed; omitted until verified — see Open Items.)
6. **Get started teaser** — tabbed code snippets (pip install / CLI / web), link to /get-started.
7. **Credibility band** — publications (featured papers + link to full list) alongside use-case highlights; trust signals grouped together. (Use-cases render here as home sections until the standalone page is content-gated in.)
8. **Acknowledgements & funding** — partner/institution credits and funding (e.g., NSF and supporting institutions — exact text to be confirmed).
9. **Final CTA** — two actions max: "Launch Inspector" (primary) + "Get Started" (secondary). Docs / Star-on-GitHub live in the footer, not as co-equal buttons here.
10. **Footer.**

## 6. Sub-Page Content

- **/features (what AIDRIN evaluates):** The Inspect → Remediate → Transform workflow explained; each of the six dimensions expanded; the supported-formats list in full. Kept focused on *what it assesses* so it doesn't become a second home page.
- **/integrations (how you integrate):** Each access mode (Web Inspector / Python Library / CLI / MCP / Globus / LLM explanations) with a short blurb + code/config example; **agentic evaluation** (CLI/MCP-driven autonomous runs) with an example; **custom-metrics** framework (defining metrics + remedies) with a code example; and the advanced integrations — **OpenTelemetry** observability and **APPFL** (privacy-preserving federated learning, tied to the CADRE paper).
- **/get-started:** Install options — from source (conda env, `pip install -e .`, Redis, Celery worker, Flask app), PyPI (`pip install aidrin`), hosted app. CLI usage. MCP server setup. Verify snippet.
- **/use-cases** *(content-gated — home sections until real content exists):* Science-domain example cards (HPC/scientific datasets; domains to be confirmed — e.g. climate, materials, genomics).
- **/publications:** All papers with authors, venue, year, DOI/arXiv links, and BibTeX where available:
  - AIDRIN: A Comprehensive Toolset for Automating Data Preparation for AI — SC25 (poster), 2025.
  - CADRE: Customizable Assurance of Data Readiness in Privacy-Preserving Federated Learning — e-Science '25, DOI 10.1109/eScience65000.2025.00023.
  - AIDRIN 2.0: A Framework to Assess Data Readiness for AI — SSDBM 2025 (poster), arXiv:2505.18213.
  - Data Readiness for AI: A 360-Degree Survey — ACM Computing Surveys 57(9):219, Sep 2025, DOI 10.1145/3722214.
  - AI Data Readiness Inspector (AIDRIN) for Quantitative Assessment of Data Readiness for AI — SSDBM '24, DOI 10.1145/3676288.3676296.
- **/team** *(content-gated — promoted from a home section once real content exists):* Contributors/authors (sourced from publication author lists + GitHub contributors), with roles/affiliations. Names/photos/affiliations to be confirmed by stakeholder.

## 7. Content Model

Content stored as editable data so non-developers can update. Use the right tool per data shape (per feasibility review):

**Astro content collections** (markdown/MDX bodies + schema validation) for the structured, body-bearing content:
- `publications` — with a **Zod schema** (title, authors, venue, year, doi/arxiv, bibtex)
- `use-cases`
- `team`

**Plain typed data files** (`src/data/*.ts`) for small fixed lists — simpler, no collection overhead:
- `workflow-steps` (Inspect / Remediate / Transform)
- `dimensions` (6 entries)
- `access-modes` (6 entries: Web Inspector, Library, CLI, MCP, Globus, LLM)
- `integrations` (agentic evaluation, custom metrics, OpenTelemetry, APPFL)
- `formats`
- `nav` / `footer` links
- `site` config: external links (inspector, docs, GitHub) centralized in one place

Code snippets via MDX with Shiki highlighting. Copy-to-clipboard is one small client island (`client:visible`).

## 8. Tech & Tooling

- **Framework:** Astro + Tailwind CSS.
- **Features:** class-based dark mode with a no-FOUC inline init script; responsive; MDX code blocks with Shiki syntax highlighting; copy-to-clipboard as a single small client island; static build to `dist/`.
- **Visual design:** built using the `frontend-design` skill for aesthetic direction and typography.
- **Quality:** implementation routed through code review (two reviewers, as requested) before completion — using `requesting-code-review` / `code-review`.
- **Deployment:** static output, host-agnostic; short deploy note for the aidrin.org / aidrin.io custom domain.

## 9. Open Items to Confirm During Implementation

- Exact acknowledgement + funding text (NSF grant numbers, institutions).
- Team member names, roles, affiliations, photos.
- Use-case domains and any metrics/quotes.
- PyPI package name/version once published (docs currently show TestPyPI).
- **ROOT file support** — in open PR #89 (uproot) but not confirmed by the stakeholder; omitted from the formats list until verified, then add to the chip strip + /features.
- **APPFL integration** details/links — confirm the framing and any setup docs for /integrations.

**Confirmed available (feature confidently):** MCP server and OpenTelemetry are real branch features (stakeholder-confirmed 2026-06-25); CLI + agentic eval (open PR #113); PyPI library (#117); Globus remote data and LLM explanations (live in the inspector).

These open items do not block starting the build; placeholders with clearly-marked TODOs will be used and flagged for stakeholder fill-in.
