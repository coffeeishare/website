# PRD: Skill Evidence Filter
**Status:** Draft v3 · **Author:** Ula · **Date:** 2026-04-04

---

## Problem

Recruiters and hiring managers land on the portfolio and see project titles but have no way to quickly verify a specific claimed skill. If someone wants to understand "does she actually do user research, or just say she does?" — they have to read every case study manually. The cognitive load is too high and the signal is buried.

**Goal:** Let any visitor filter all portfolio content by a skill tag and immediately see curated evidence — projects, pull quotes, metrics, and artifacts — that substantiate that claim.

---

## What We're Building

A client-side skill filter system, surfaced on the homepage, that:

1. Displays a row of **skill tag chips** near the top of the homepage (below the hero)
2. On selection, filters the **project grid** to matching projects and reveals inline **evidence cards** beneath each matched project
3. A **skill summary panel** appears above results — written by Ula, styled to read like an AI-synthesised overview of her experience in that area
4. Evidence cards surface: pull quotes, research metrics, and process artifacts — all authored in MDX frontmatter
4. **Inline MDX evidence components** (e.g. `<StudyResult>`, `<Metric>`) used within case studies also carry skill tags and appear in filtered results
6. Supports multiple tags selected simultaneously (OR logic to start)
7. Is fully shareable via URL (`/?skills=user-research,interaction`)
8. All content is **MDX-only** — no CMS, no external API

---

## Stack (confirmed, actual)

> All MDX. No Contentful. The codebase uses Vite + React Router, not Next.js.

| Layer | Technology |
|---|---|
| Build | Vite 5 |
| Framework | React 18 + TypeScript |
| Routing | React Router DOM 6 |
| Styles | Vanilla CSS — single `src/style.css`, design tokens via CSS custom properties |
| Content | MDX files in `content/projects/*.mdx` |
| MDX | `@mdx-js/rollup` + `remark-frontmatter` + `remark-mdx-frontmatter` |
| MDX loading | `import.meta.glob("../../content/projects/*.mdx")` at build time |
| Dark mode | `.dark-mode` class on `<html>`, all values via CSS vars |

No server. No API. No Contentful. Everything is built from MDX files and static assets.

---

## Skill Taxonomy

Single source of truth. All valid skill keys live here. Each entry now includes a `summary` field — Ula-authored prose displayed in the `SkillSummaryPanel` when that skill is active. Add a tag only when at least two projects use it.

```ts
// src/lib/skills-taxonomy.ts

export interface SkillDefinition {
  key:     string
  label:   string
  summary: string   // 2–4 sentences. Reads like AI synthesis, authored by Ula.
}

export const SKILL_TAXONOMY: SkillDefinition[] = [
  {
    key:   'user-research',
    label: 'User Research',
    summary: `Across these projects I've conducted over 80 research sessions — interviews,
      card sorts, usability tests, and co-design workshops — spanning enterprise operators,
      consumer users, and internal stakeholders. Research wasn't a phase; it was a continuous
      thread that shaped scope, challenged assumptions, and validated decisions before
      engineering effort was committed.`,
  },
  {
    key:   'interaction',
    label: 'Interaction Design',
    summary: `My interaction work spans complex data-entry flows, AI-assisted interfaces,
      and consumer-facing navigation redesigns. I focus on reducing cognitive load at the
      moment of action — every state, transition, and error condition is considered as part
      of the design, not an afterthought.`,
  },
  {
    key:   'systems-thinking',
    label: 'Systems Thinking',
    summary: `I consistently work at the intersection of individual flows and the larger
      systems they live inside. Whether mapping a manufacturing process or designing a
      component library used by 12 product teams, I treat design decisions as systemic
      levers — not isolated screens.`,
  },
  {
    key:   'prototyping',
    label: 'Prototyping',
    summary: `I prototype to learn, not to present. These projects include high-fidelity
      Figma prototypes, coded proof-of-concepts, and lightweight paper sketches used to
      stress-test assumptions before committing to engineering cycles.`,
  },
  {
    key:   'information-architecture',
    label: 'Information Architecture',
    summary: `Navigation and structure decisions have been central to several of these
      projects. I've used card sorting, tree testing, and competitive audits to ground
      IA decisions in evidence — not intuition — and validated results with real users
      before handoff.`,
  },
  {
    key:   'ai-integration',
    label: 'AI Integration',
    summary: `I've designed interfaces that sit directly on top of AI systems — from
      prompt-driven composers to AI-suggested automation builders. The challenge is making
      uncertain, probabilistic outputs feel trustworthy and controllable for non-technical
      users in high-stakes workflows.`,
  },
  {
    key:   'design-systems',
    label: 'Design Systems',
    summary: `I've contributed to and maintained design systems used across multiple product
      teams. My focus is on token architecture, component API design, and documentation that
      makes the right pattern the easy path — not the aspirational one.`,
  },
  {
    key:   'strategy',
    label: 'Strategy',
    summary: `I've worked upstream of the brief — helping define scope, challenge assumptions
      about what to build, and frame design decisions in terms of business and user outcomes.
      These projects show what happens when design has a seat at the table before the
      solution is already decided.`,
  },
]

export type SkillKey = SkillDefinition['key']
```

> **Authoring note for Ula:** The `summary` field is the only place where you write in first person on the filter page. It should read like a confident, evidence-grounded synthesis — not a job description. 2–4 sentences. Reference the kinds of methods or outcomes visible in the filtered results below. Update as new projects are added.

---

## MDX Frontmatter Schema (extended)

Every case study MDX file must follow this structure. New fields (`skills`, `evidence`) are additive — existing fields are unchanged.

```yaml
---
title: "Operations Composer"
client: "Tulip"
summary: "One sentence description"
introText: "Longer paragraph shown in ProjectHero"
pullQuote: "The quote shown in the hero pull quote block"
tags: ["Product Design", "UX Research", "AI"]   # display tags (existing)
year: "2024"
coverImage: "/operations-composer-cover.webp"

# NEW — skill filter fields
skills:
  - user-research
  - interaction
  - systems-thinking

evidence:
  - type: quote
    skill: user-research
    text: "We ran 52 research sessions across 8 enterprise customers before opening Figma."
  - type: metric
    skill: user-research
    label: "Research sessions"
    value: "52"
    context: "Across 8 enterprise customers"
  - type: metric
    skill: interaction
    label: "Task completion improvement"
    value: "34%"
    context: "Measured in usability testing"
  - type: artifact
    skill: prototyping
    label: "High-fidelity prototype"
    image: "/images/projects/ops-composer-proto.webp"
---
```

### Evidence types

| type | Required fields | Renders as |
|---|---|---|
| `quote` | `skill`, `text` | Blockquote with `--accent-yellow` left border |
| `metric` | `skill`, `label`, `value` | Large stat value + label + optional context line |
| `artifact` | `skill`, `label`, `image` | Thumbnail image + label chip |

The `pullQuote` frontmatter field is automatically treated as a `quote` evidence item for all skills the project claims — no need to repeat it in the `evidence` array.

---

## Inline MDX Evidence Components (also filterable)

Beyond frontmatter, case studies can embed evidence inline using purpose-built components. These components accept a `skill` prop, which makes their content show up in filtered results on the homepage.

These components are already present in the design system (see screenshot variants: basic, gradient, with-icon, with-progress-bars). They need `skill` prop support added.

### `<StudyResult>`

Shows a research study card — participant count, study label, and a set of option rows. Matches the design system variants: basic (card grid), icon variant (with participant icon + progress bars), gradient variant.

```tsx
<StudyResult
  skill="user-research"
  participants={32}
  label="Internal Card Sort Study"
  options={[
    { label: "Option A", percentage: 24 },
    { label: "Option B", percentage: 24 },
  ]}
  variant="with-icon"   // "basic" | "with-icon" | "gradient"
/>
```

**Visual variants (from design system):**
- `basic` — white/dark card, 2-column option grid, no icon
- `with-icon` — participant group icon top-left, progress bar rows, skill tag chip at bottom
- `gradient` — same as `with-icon` but with a colourful mesh gradient background

### `<Metric>`

Single bold stat with label and optional context. Embeds inline between prose sections.

```tsx
<Metric
  skill="interaction"
  value="34%"
  label="Reduction in task completion time"
  context="Measured across 3 rounds of usability testing"
/>
```

### `<EvidenceQuote>`

A pull quote that is explicitly tagged to a skill, making it retrievable in filter results independently of the frontmatter `pullQuote`.

```tsx
<EvidenceQuote
  skill="strategy"
  text="We ran 12 co-design sessions with ML engineering before a single screen was designed."
  attribution="Project retrospective, 2024"
/>
```

### MDX component map additions

Add all three to `src/components/mdx/mdx-components.tsx`:

```ts
export const mdxComponents = {
  // existing
  CardSortStudy,
  CompetitiveAnalysis,
  ProcessBoard,
  FlowDiagram,
  SectionTitle,
  ProjectHero,
  // new
  StudyResult,
  Metric,
  EvidenceQuote,
}
```

---

## How Inline Evidence Gets Indexed

Inline `<StudyResult>`, `<Metric>`, and `<EvidenceQuote>` components are embedded in MDX body — they're not frontmatter. To make them filterable without parsing MDX at runtime, use a **build-time extraction pattern**:

Each component, when rendered inside a case study, registers itself into a shared React context (`EvidenceContext`). On the homepage, a lightweight version of each project MDX is pre-rendered into a hidden context provider during the data-loading phase. The context collects all evidence items emitted by inline components and merges them with frontmatter evidence.

```ts
// Simplified approach
// EvidenceContext.tsx — provides a collect() function
// Each evidence component calls collect({ type, skill, text/value/image, sourceProject: slug })
// Homepage reads from context after a silent render pass
```

Alternative (simpler): author inline evidence **both** as an inline component (for visual display in the case study) **and** as a frontmatter `evidence` entry (for filter indexing). This avoids the context complexity at the cost of some duplication. **Start here.** The context-based approach can be added later if frontmatter duplication becomes painful.

---

## Case Study Writing Guide

> This section informs how future case studies must be written so that quotes and evidence are extractable for the filter system. Share this with anyone contributing content.

### Principle: Evidence First

Every claim in a case study should have an extractable proof. Before writing prose, identify what evidence exists (session counts, usability test results, stakeholder quotes, artifacts) and register it in frontmatter first. The prose then elaborates on what the numbers mean.

### Frontmatter before prose

Start every MDX file by filling out the `evidence` array completely. Think of it as the structured data layer that powers the filter — the prose is the human layer that gives it context.

```yaml
evidence:
  # Each item answers: "what specifically did I do, and what was the result?"
  - type: metric
    skill: user-research
    label: "Discovery interviews"
    value: "18"
    context: "With operators, managers, and plant floor workers across 4 sites"
```

### Writing style rules for quote-extractable prose

1. **State numbers in the first sentence of any research or outcome section.** This makes them easy to spot and easy to copy into frontmatter. Bad: *"We spoke to many users."* Good: *"We interviewed 18 operators across 4 manufacturing sites."*

2. **Write pull quotes as standalone sentences that work out of context.** The `pullQuote` frontmatter field (and inline `<EvidenceQuote>` components) will be displayed without surrounding paragraphs. Bad: *"This led to a significant improvement."* Good: *"Redesigning the step editor reduced average task completion time by 34% in three rounds of usability testing."*

3. **Name the method before the finding.** This frames the evidence type clearly. Pattern: `[Method] revealed/showed/confirmed [finding with number if possible].`

4. **Tag each section implicitly.** The evidence system relies on `skill` keys. When writing a research section, all evidence in that section should be tagged `user-research`. When writing about interaction decisions, tag them `interaction`. Use one dominant skill per section — don't try to tag everything to everything.

5. **Use `<SectionTitle eyebrow="02 — Research" label="..." />` as a structural anchor.** Each eyebrow number corresponds roughly to a project phase, and phases map to skill clusters. This makes the case study scannable for both humans and future tooling.

### Section → skill mapping (suggested convention)

| Section eyebrow | Dominant skill keys |
|---|---|
| 01 — Discovery / Problem | `strategy`, `user-research` |
| 02 — Research | `user-research` |
| 03 — Information Architecture / Structure | `information-architecture`, `systems-thinking` |
| 04 — Design / Exploration | `interaction`, `prototyping` |
| 05 — Validation / Testing | `user-research`, `interaction` |
| 06 — Delivery / Implementation | `design-systems`, `systems-thinking` |
| 07 — Outcomes / Impact | all skills — metrics from every phase live here |

---

## Data Model

All filterable content normalises to one shape:

```ts
// src/types/filter.ts

export type EvidenceType = 'quote' | 'metric' | 'artifact'

export interface EvidenceItem {
  type: EvidenceType
  skill: SkillKey
  // quote
  text?: string
  attribution?: string
  // metric
  value?: string
  label?: string
  context?: string
  // artifact
  image?: string
}

export interface FilterableProject {
  slug: string
  title: string
  client?: string
  year?: string
  coverImage?: string
  summary?: string
  skills: SkillKey[]
  evidence: EvidenceItem[]    // merged: frontmatter + pullQuote auto-entry
}
```

MDX glob produces `FilterableProject[]` at build time. The `pullQuote` field is coerced into an `EvidenceItem` of type `quote` tagged to all of the project's `skills`.

---

## Components to Build

### `SkillSummaryPanel` — `src/components/filter/SkillSummaryPanel.tsx`

Appears between the filter bar and the project grid when one or more skills are active. Displays the authored `summary` from the taxonomy — styled to read like an AI-generated synthesis, but fully controlled by Ula.

**When visible:** Only when `activeSkills.length > 0`. Animates in (fade + slight upward translate) when skills become active; animates out on clear. Hidden when "All" is selected.

**When multiple skills are active:** Display the summary for the first active skill only (keep it focused), plus a subtle note like *"Showing work across [n] skills"* if `activeSkills.length > 1`.

**Content structure (layout TBD — design provided by Ula):**

```
[ ✦ Based on {n} projects ]         [ × Clear ]

  {summary text for primary active skill}

  [ "Showing work across {n} skills" — only if activeSkills.length > 1 ]
```

> ⚠️ Visual design — colours, typography, spacing, borders, animation — will be provided separately by Ula. Do not invent tokens or styles for this component. Implement as a structurally correct, unstyled shell first, then apply Ula's design spec.

**The "AI feel" without being dishonest:**

The label reads `✦ Based on {n} projects` — not `"AI Summary"` or `"Generated by Claude"`. The star glyph (✦) is ambient enough to suggest synthesis without making a technical claim. The text is authored by Ula, so it's accurate and on-brand. Evocative framing, honest content.

```tsx
// Usage — rendered by FilteredProjectGrid above the project cards
<SkillSummaryPanel
  activeSkills={activeSkills}         // SkillKey[]
  matchedProjectCount={filteredProjects.length}
  onClear={clearFilter}
/>
```

```tsx
// Internal logic
const primarySkill = SKILL_TAXONOMY.find(s => s.key === activeSkills[0])
const summary = primarySkill?.summary ?? ''
const projectCount = matchedProjectCount
```

### `SkillFilterBar` — `src/components/filter/SkillFilterBar.tsx`

Chip row on the homepage. Reads/writes `?skills=` URL param via React Router's `useSearchParams`.

- "All" chip is default (no param)
- Clicking a skill toggles it; multiple can be active simultaneously
- Active chips use `--accent-yellow` background
- Horizontal scroll on mobile (hidden scrollbar, matches existing logo carousel pattern)
- Scroll-reveal on entry (use existing `.reveal` + IntersectionObserver pattern)

### `useSkillFilter` hook — `src/hooks/useSkillFilter.ts`

Encapsulates all filter logic. Components stay clean.

```ts
function useSkillFilter(projects: FilterableProject[]) {
  // activeSkills: SkillKey[] — from URL param
  // filteredProjects: FilterableProject[] — OR match
  // matchingEvidence(project, activeSkills): EvidenceItem[] — skill-specific evidence
  // toggleSkill(key), clearFilter()
}
```

**Filter logic:** A project matches if `project.skills` includes **any** of `activeSkills` (OR). Evidence items shown are only those whose `skill` is in `activeSkills`.

### `EvidenceCard` — `src/components/filter/EvidenceCard.tsx`

Renders one evidence item. Visual design references the design system variants from the screenshot:

- **quote variant** — blockquote-style, `--accent-yellow` left border (3px), italic text, attribution line in `--text-light`
- **metric variant** — large bold `value` (display size), `label` below in `--text-secondary`, `context` in `--text-light` small caps. References the "with-icon + progress bar" design system card.
- **artifact variant** — thumbnail image with `border-radius: 8px`, `label` as a dark pill chip overlaid or below

All variants: `--bg-card` background, `1px solid var(--border)`, `border-radius: 12px`, responsive padding (`1.5rem` desktop, `1rem` mobile).

### `FilteredProjectGrid` — `src/components/filter/FilteredProjectGrid.tsx`

Wraps the existing project grid. When a filter is active:
- Shows only matching projects
- Renders `EvidenceCard` components below each project card (only evidence matching active skills)
- Non-matching projects are hidden (not dimmed)
- Empty state: friendly message + "clear filter" link

When no filter is active: renders identically to the current homepage project grid.

### New inline evidence components (for case studies)

`src/components/mdx/StudyResult.tsx` — research study card, variants: `basic`, `with-icon`, `gradient`
`src/components/mdx/Metric.tsx` — single stat inline block
`src/components/mdx/EvidenceQuote.tsx` — skill-tagged pull quote

All accept `skill: SkillKey` prop. Initially, this prop is passive (used for frontmatter authoring reference only, not runtime indexing). Full runtime indexing can be added later via EvidenceContext.

---

## Homepage Integration

Minimal changes to `App.tsx`. The filter bar slots between hero and project grid:

```tsx
{/* existing hero */}
<section className="hero-section">...</section>

{/* NEW */}
<section className="skill-filter-section reveal">
  <SkillFilterBar />
</section>

{/* replace existing project grid with filter-aware version */}
{/* SkillSummaryPanel is rendered inside FilteredProjectGrid above the cards */}
<FilteredProjectGrid projects={allFilterableProjects} />
```

`allFilterableProjects` is assembled once from the MDX glob, merging frontmatter `evidence` with the auto-derived `pullQuote` entry.

---

## Responsive Behaviour

| Breakpoint | Filter bar | Evidence cards |
|---|---|---|
| Mobile `< 768px` | Horizontal scroll, chips don't wrap | Full width, stacked |
| Tablet `768–1024px` | Wraps to 2 rows max | 2-column evidence grid |
| Desktop `> 1024px` | Single row | Inline below project card, up to 3 per row |

---

## URL & Shareability

```
https://yourportfolio.com/?skills=user-research,interaction
```

Use React Router's `useSearchParams`. No page reload. Browser back/forward works. A recruiter can be sent a pre-filtered link ("here's evidence for my UX research background").

---

## CSS Conventions

- **No new CSS files.** Append to `src/style.css` under a `/* === SKILL FILTER === */` section header.
- Use only existing CSS custom properties — no hardcoded hex values.
- New class prefix: `.sf-` for filter bar/chips, `.ev-` for evidence cards.
- Dark mode is automatic — CSS vars already swap under `.dark-mode`.
- Use the existing `.reveal` + IntersectionObserver pattern for scroll animations.

---

## Files to Create / Modify

### New files
```
src/
  types/
    filter.ts
  lib/
    skills-taxonomy.ts
    parse-mdx-projects.ts          ← MDX glob → FilterableProject[], merges pullQuote
  hooks/
    useSkillFilter.ts
  components/
    filter/
      SkillFilterBar.tsx
      SkillSummaryPanel.tsx          ← authored summary, styled as AI synthesis
      EvidenceCard.tsx
      FilteredProjectGrid.tsx
    mdx/
      StudyResult.tsx              ← design system card, variants: basic/with-icon/gradient
      Metric.tsx
      EvidenceQuote.tsx
```

### Modified files
```
src/App.tsx                        ← add SkillFilterBar + FilteredProjectGrid
src/style.css                      ← append /* === SKILL FILTER === */ section
src/components/mdx/mdx-components.tsx  ← add StudyResult, Metric, EvidenceQuote
content/projects/example-project.mdx  ← add skills + evidence frontmatter
```

### No changes needed
```
vite.config.ts
src/pages/ProjectMDXPage.tsx
src/components/dataviz/           ← existing components unchanged
src/components/project/           ← existing components unchanged
```

---

## Claude Code Model Recommendations

| Task | Model | Why |
|---|---|---|
| Designing types, hooks, filter logic | `claude-sonnet-4-6` | Reasoning-heavy |
| Writing component JSX + CSS | `claude-sonnet-4-6` | Long context, code quality |
| Adding `skills`/`evidence` to MDX files | `claude-haiku-4-5-20251001` | Repetitive, structured edits |
| Building `StudyResult`/`Metric`/`EvidenceQuote` | `claude-sonnet-4-6` | Needs design system awareness |
| Exploring files, reading code | `claude-haiku-4-5-20251001` | Fast, cheap for read-only tasks |
| Major architectural decisions only | `claude-opus-4-6` | Reserve — expensive |

**Session hygiene:**
- Scope each session to one component or one file group — not "build the whole filter system"
- Pass `--model claude-haiku-4-5-20251001` when tagging MDX files in bulk
- Use `/compact` before context gets large in long sessions
- Run exploration (file reads, grep) with Haiku; switch to Sonnet only when writing code

---

## Open Questions

1. **Inline component indexing:** The simplest approach is to duplicate evidence in both an inline component (for visual display) and in frontmatter (for filter indexing). Runtime indexing via EvidenceContext is the better long-term solution but adds complexity — defer to v2.
2. **AND vs OR filtering:** Starting with OR. Revisit after seeing real recruiter behaviour.
3. **Analytics:** Consider adding `window.plausible?.('filter', { props: { skill } })` to `toggleSkill()` to learn which skills people actually filter by.
4. **StudyResult gradient:** The gradient variant uses a colourful mesh background. Implement with CSS `radial-gradient` composited via `mix-blend-mode` so it works in both light and dark mode without separate dark variants.

---

## Definition of Done

- [ ] `SkillFilterBar` renders on homepage with all taxonomy tags; "All" is default
- [ ] `SkillSummaryPanel` appears when a skill is active; hidden when "All" is selected
- [ ] Panel shows correct authored summary from taxonomy for the primary active skill
- [ ] Panel displays correct matched project count (`✦ Based on {n} projects`)
- [ ] Panel entrance/exit animation works (fade + translate)
- [ ] "Clear" link in panel resets filter and hides panel
- [ ] Clicking a skill tag filters the project grid to matching projects only
- [ ] Each filtered project shows relevant `EvidenceCard` items beneath it
- [ ] Active skills persist in the URL and survive page refresh
- [ ] `StudyResult`, `Metric`, `EvidenceQuote` are available as MDX components in case studies
- [ ] All three evidence component variants render correctly in both light and dark mode
- [ ] `example-project.mdx` has `skills` and `evidence` frontmatter populated
- [ ] Empty state renders gracefully when no projects match a skill
- [ ] Mobile: filter bar scrolls horizontally; evidence cards stack cleanly at 375px
- [ ] All new CSS lives in `style.css` under the skill filter section header
- [ ] No hardcoded colours anywhere in new components
