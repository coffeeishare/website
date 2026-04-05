# CLAUDE.md — Portfolio Site

## Stack (read this first)

This is a **Vite + React 18 + TypeScript** single-page application. It is **not Next.js**. Do not use `next-mdx-remote`, `app/` routing, or any Next.js APIs.

| Layer | Technology |
|---|---|
| Build | Vite 5 |
| Framework | React 18 + TypeScript |
| Routing | React Router DOM 6 — `src/main.tsx` wraps app in `<BrowserRouter>` |
| Styles | Single file: `src/style.css` — vanilla CSS, no preprocessor, no CSS-in-JS |
| MDX | `@mdx-js/rollup` in `vite.config.ts` + `remark-frontmatter` + `remark-mdx-frontmatter` |
| MDX loading | `import.meta.glob("../../content/projects/*.mdx")` — build-time, no server |
| Dark mode | `.dark-mode` class on `<html>` — **not** `data-theme` |
| Entry point | `src/App.tsx` — contains homepage, routing logic, and all page-level components |

No server. No API. No Contentful (ignore `src/lib/contentful.ts` — legacy, unused).

---

## What's already built

```
src/
  App.tsx                          ← homepage, router, all routes
  style.css                        ← all styles (~90KB), design tokens, dark mode
  components/
    dataviz/
      CardSortStudy.tsx
      CompetitiveAnalysis.tsx
      ProcessBoard.tsx
      FlowDiagram.tsx
    project/
      ProjectLayout.tsx
      ProjectHero.tsx
      SectionTitle.tsx
    mdx/
      mdx-components.tsx           ← component map passed to MDX renderer
  pages/
    ProjectMDXPage.tsx             ← renders a .mdx file by slug
    DesignSystem.tsx               ← component showcase
  lib/
    contentful.ts                  ← ignore, legacy
  types/
    contentful.ts                  ← ignore, legacy
    mdx.d.ts

content/
  projects/
    example-project.mdx            ← original template
    ai-composer.mdx                ← first migrated case study (use as reference)
```

---

## Active feature: Skill Evidence Filter

Full spec in **`PRD-skill-filter.md`** — read it before building anything in this feature.
Content migration plan in **`CONTENT-MIGRATION.md`** — maps all 6 projects to skills, evidence, and component placements.
Working MDX example in **`content/projects/ai-composer.mdx`** — shows the target frontmatter structure and inline component usage.

### What needs building (in order)

```
src/
  types/
    filter.ts                      ← FilterableProject, EvidenceItem types
  lib/
    skills-taxonomy.ts             ← SKILL_TAXONOMY array (8 skills, no facilitation)
    parse-mdx-projects.ts          ← MDX glob → FilterableProject[]
  hooks/
    useSkillFilter.ts              ← filter state, URL sync, toggle logic
  components/
    filter/
      SkillFilterBar.tsx           ← chip row, reads/writes ?skills= URL param
      SkillSummaryPanel.tsx        ← ⚠️ UNSTYLED SHELL ONLY — design pending from Ula
      EvidenceCard.tsx             ← quote / metric / artifact variants
      FilteredProjectGrid.tsx      ← filter-aware project grid
    mdx/
      StudyResult.tsx              ← research study card (basic / with-icon / gradient)
      Metric.tsx                   ← single stat block
      EvidenceQuote.tsx            ← skill-tagged pull quote
      DotSurvey.tsx                ← dot matrix isotype chart + N/total stat row
      PriorityRanking.tsx          ← most important / least important two-column list
      ImportanceMatrix.tsx         ← attribute × importance-level table with % values
      Demographics.tsx             ← person silhouette icons with % + age range labels
      SiteMap.tsx                  ← sticky-note style IA / sitemap spatial layout
      RecruitmentSources.tsx       ← horizontal bar chart with platform icons + %
```

All MDX components accept a `skill` prop (`SkillKey`) for filter indexing.

Then modify:
- `src/App.tsx` — add `<SkillFilterBar>` and `<FilteredProjectGrid>` to homepage
- `src/style.css` — append new styles under `/* === SKILL FILTER === */`
- `src/components/mdx/mdx-components.tsx` — register all new MDX components

### SkillSummaryPanel — build shell only

Do **not** invent styles for `SkillSummaryPanel`. Build the component structure and logic (reads taxonomy summary, shows project count, exposes `onClear`), but leave it unstyled. Ula will provide the design separately.

---

## Design system

All components must use these CSS custom properties. No hardcoded colour or spacing values.

```css
:root {
  --background:         #ffffff;
  --background-subtle:  #fafafa;
  --bg-card:            #f0f4f8;
  --text-primary:       #1a1a1a;
  --text-secondary:     #6b7280;
  --text-light:         #9ca3af;
  --accent-yellow:      rgba(255, 210, 100, 0.45);
  --accent-secondary:   #dbeafe;
  --border:             #e5e7eb;
  --font-body:          'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --max-width:          1400px;
  --nav-height:         64px;
}

.dark-mode {
  --background:         #1E1E1E;
  --background-subtle:  #1a1917;
  --bg-card:            #1e1d1b;
  --text-primary:       #f0ede8;
  --text-secondary:     #9c9892;
  --text-light:         #6b6864;
  --accent-yellow:      rgba(255, 210, 100, 0.2);
  --accent-secondary:   #272522;
  --border:             #2d2b28;
}
```

Dark mode: toggled by adding/removing `.dark-mode` on `<html>`. All new components get dark mode for free if they only use CSS vars.

---

## Tag / chip system

**Rule: do not create a new badge class.** Two canonical tag classes exist. If neither fits, ask Ula.

**Documentation rule: whenever you add or update a component spec in this file, show the exact JSX syntax — not just class names.**

### Canonical classes

**`.ssp-chip`** — general-purpose tag/chip. Default appearance uses CSS vars (works in light + dark). Apply a colour modifier class for named palette colours.
```tsx
{/* default */}
<span className="ssp-chip">{label}</span>

{/* coloured — modifier classes: olive · maroon · violet · sky · mauve · slate · crimson · amber · sand · rose · gold */}
<span className="ssp-chip ssp-chip--gold">{label}</span>
```

**`.mdx-skill-chip`** — skill attribution inside any MDX evidence component (bottom-left of viz cards)
```tsx
{skillDef && <span className="mdx-skill-chip">{skillDef.label}</span>}
```

**Tag sizing rule:** Both classes use `width: fit-content` + `align-self: flex-start`. Never let a tag fill container width.

**`.sf-chip` / `.sf-chip--active`** — interactive filter toggle (`SkillFilterBar` only)
```tsx
<button
  className={`sf-chip${isActive ? ' sf-chip--active' : ''}`}
  onClick={toggle}
>
  {skill.label}
</button>
```

**`.project-badge`** — overlay on project cover images (component-scoped)
```tsx
<span className="project-badge">{text}</span>
```

### Component-scoped — do not reuse outside their component
`.hero-pill`, `.hero-v2-pill` · `.reference-badge` · `.ds-sidebar-theme-badge`, `.ds-token-tag`, `.ds-card-tag` · `.project-badge`

### Viz components — skill chip pattern
All dataviz and research viz components that accept a `skill` prop must render the skill attribution using `.mdx-skill-chip`:
```tsx
// Bottom-left of every viz card — DotSurvey, PriorityRanking, ImportanceMatrix,
// Demographics, SiteMap, RecruitmentSources, StudyResult, Metric, EvidenceQuote
{skillDef && <span className="mdx-skill-chip">{skillDef.label}</span>}
```

---

## CSS conventions

- **No new CSS files.** All styles go in `src/style.css`.
- New filter feature styles go under the `/* === SKILL FILTER === */` section header.
- Class prefix for new components: `.sf-` (filter bar/chips), `.ev-` (evidence cards).
- Follow mobile-first breakpoints already used in the file:

```css
/* base = mobile < 768px */
@media (min-width: 768px)  { /* tablet  */ }
@media (min-width: 1024px) { /* desktop */ }
```

- Use the existing `.reveal` class + IntersectionObserver pattern for scroll animations — search `reveal` in `App.tsx` to see how it's wired.

---

## MDX frontmatter shape

Every case study MDX file uses this structure. The `skills` and `evidence` fields power the filter system.

```yaml
---
title: "Project Title"
client: "Company"
summary: "One sentence description"
introText: "Longer intro shown in ProjectHero"
pullQuote: "Standalone quote — must work out of context"
tags: ["Product Design", "UX Research"]
year: "2024"
coverImage: "/cover.webp"

skills:
  - user-research
  - interaction

evidence:
  - type: quote
    skill: user-research
    text: "Exact quote text."
  - type: metric
    skill: interaction
    label: "Stat label"
    value: "47%"
    context: "Optional explanatory line"
  - type: artifact
    skill: prototyping
    label: "Artifact label"
    image: "/images/artifact.webp"
---
```

See `content/projects/ai-composer.mdx` for a complete working example.

---

## Inline MDX evidence components

These are the three new components available for use inside case study MDX files:

```tsx
<Metric
  skill="interaction"
  value="47%"
  label="Builder adoption rate"
  context="Within 60 days of launch"
/>

<StudyResult
  skill="user-research"
  participants={12}
  label="Agency user interviews"
  options={[
    { label: "Switched to external tools", percentage: 72 },
  ]}
  variant="with-icon"   // "basic" | "with-icon" | "gradient"
/>

<EvidenceQuote
  skill="strategy"
  text="Quote text here."
  attribution="Optional source"
/>
```

---

## Research visualisation MDX components

These components are purpose-built for embedding research findings inline in case studies. All accept a `skill: SkillKey` prop — the skill key is rendered as a pill chip at the bottom-left of the card.

`StudyResult` has full visual design spec below. The remaining five components (`DotSurvey`, `PriorityRanking`, `ImportanceMatrix`, `Demographics`, `SiteMap`, `RecruitmentSources`) — build structure and logic only, Ula will provide design separately.

### `<StudyResult>`

The primary evidence card. Four visual variants, controlled by the `variant` prop. All share the same outer card shape: `border-radius: 16px`, dark background, `padding: 1.5rem`.

**Variant: `with-icon`** *(screenshot 1)*
- Header row: yellow circle (~48px) with white people SVG icon (use `UsersIcon` from `iconoir-react`), then "**N Participants**" bold white + subtitle in `--text-light` monospace
- Body: stacked rows — each row is `[label] [percentage in yellow] [progress bar]`
  - Progress bar: full width, ~8px tall, yellow fill (`rgba(255, 210, 100, 1)`) on `--bg-card` track, `border-radius: 4px`
  - Percentage value: monospace, yellow
  - Label: monospace, `--text-primary`
- Background: `--background` (plain dark)
- Skill chip at bottom-left: `border: 1px solid var(--border)`, monospace, small, `border-radius: 6px`

**Variant: `basic`** *(screenshot 2, top)*
- Header: "**N Participants**" bold + subtitle monospace, no icon
- Body: 2-column card grid — each card is `--bg-card` background, `border-radius: 12px`, padding `1rem`, with a bold title and muted body text
- Background: colorful noise/grain mesh gradient (see gradient spec below)
- No skill chip on this variant

**Variant: `gradient`** *(screenshot 2, middle)*
- Same layout as `with-icon` (icon + participant count + progress bars + skill chip)
- Background: colorful noise/grain mesh gradient instead of plain dark

**Variant: `gradient-cards`** *(screenshot 2, bottom)*
- Same layout as `basic` (2-column card grid, no icon)
- Background: colorful noise/grain mesh gradient
- Lighter gradient saturation than `gradient`

**Gradient background spec:**
The gradient is a noise-textured mesh — multiple radial gradients composited with a grain overlay. Implement as:
```css
.sr-gradient {
  background:
    radial-gradient(ellipse at 20% 50%, rgba(120, 80, 180, 0.6) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(60, 120, 180, 0.5) 0%, transparent 55%),
    radial-gradient(ellipse at 60% 80%, rgba(80, 140, 80, 0.4) 0%, transparent 50%),
    var(--background);
  position: relative;
}
.sr-gradient::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise filter */
  opacity: 0.15;
  border-radius: inherit;
  pointer-events: none;
}
```

**Full prop interface:**
```tsx
interface StudyResultProps {
  skill: SkillKey
  participants: number
  label: string                          // subtitle / study description
  variant: 'with-icon' | 'basic' | 'gradient' | 'gradient-cards'
  // for with-icon / gradient variants (progress bars):
  options?: Array<{
    label: string
    percentage: number
  }>
  // for basic / gradient-cards variants (card grid):
  cards?: Array<{
    title: string
    description: string
  }>
}
```

```tsx
// Progress bar variant
<StudyResult
  skill="user-research"
  participants={5}
  label="Subtitle goes here and explains what this content portrays"
  variant="with-icon"
  options={[
    { label: "Option 1 goes here", percentage: 24 },
    { label: "Option 2 goes here", percentage: 24 },
  ]}
/>

// Card grid variant
<StudyResult
  skill="user-research"
  participants={5}
  label="Subtitle goes here and explains what this content portrays"
  variant="gradient"
  cards={[
    { title: "Option 1", description: "Subtitle goes here and explains what this content portrays" },
    { title: "Option 2", description: "Subtitle goes here and explains what this content portrays" },
  ]}
/>
```

---

### `<DotSurvey>`

Isotype dot-matrix chart. Shows participant count as a grid of filled/unfilled dots, with a row of N/total stat cards below and an optional description.

```tsx
<DotSurvey
  skill="user-research"
  participants={29}
  description="From our survey of 29 participants, we found that a large majority engage in online communities and access them using their mobile device."
  stats={[
    { value: 26, label: "Engage in online communities" },
    { value: 25, label: "Access via mobile device" },
    { value: 17, label: "Would meet nearby members" },
  ]}
/>
```

Each stat renders as `N / {participants}` with the label below. Dots fill left-to-right proportionally to N.

---

### `<PriorityRanking>`

Two-column ranked list: most important items on the left (filled star icon), least important on the right (outline star icon).

```tsx
<PriorityRanking
  skill="user-research"
  mostImportant={[
    "Discuss specific diagnosis",
    "Educational resources",
    "Safe space to share ideas",
    "Check any time",
    "Low sodium diet info",
  ]}
  leastImportant={[
    "Intimacy discussions",
    "Religious support",
    "Unmoderated community",
  ]}
/>
```

---

### `<ImportanceMatrix>`

Table showing attributes rated across importance levels. Rows = attributes, columns = importance tiers. Cells contain percentage values; highlighted cells indicate the dominant tier for each row.

```tsx
<ImportanceMatrix
  skill="user-research"
  label="Top 8 Community Attributes"
  columns={["Very Important", "Important", "Somewhat Important", "Least Important", "Unsorted"]}
  rows={[
    { label: "Ability to discuss your diagnosis", values: [60, 27, 7, 7, 7], highlight: 0 },
    { label: "Educational resources",             values: [57, 40, 3, null, null], highlight: 0 },
    { label: "Health advice",                     values: [53, 23, 10, 10, 10], highlight: 0 },
    { label: "Safe space to share ideas",         values: [53, 27, 10, 10, null], highlight: 0 },
    { label: "An accessible online community",    values: [50, 23, 10, 10, 10], highlight: 0 },
    { label: "Sharing personal health experiences", values: [43, 33, 20, 3, null], highlight: 0 },
    { label: "Low-sodium recipes",                values: [20, 40, 30, 10, null], highlight: 1 },
    { label: "Friendships",                       values: [20, 37, 27, 13, 3], highlight: 1 },
  ]}
/>
```

`highlight` is the column index to emphasise for that row.

---

### `<Demographics>`

Person-silhouette icon row showing audience age/demographic breakdown. The highlighted group uses an accent colour; others are muted.

```tsx
<Demographics
  skill="user-research"
  groups={[
    { label: "Age 19–34", percentage: 5.1 },
    { label: "Age 35–39", percentage: 7.6 },
    { label: "Age 40–54", percentage: 48.7, highlight: true },
    { label: "Age 55–75", percentage: 38.4 },
  ]}
/>
```

---

### `<SiteMap>`

Sticky-note style IA map with named sections and grouped items. Renders as a spatial grid on desktop, stacked sections on mobile.

```tsx
<SiteMap
  skill="information-architecture"
  sections={[
    {
      label: "Universal Features",
      color: "yellow",
      items: ["Search", "Chat"],
    },
    {
      label: "Pages",
      color: "teal",
      items: ["Messages (Inbox)", "Community", "Resources", "Home", "Account",
              "Meet-up / Interest Groups", "Articles", "Settings", "User Info",
              "Forum", "Recipes", "Profile"],
    },
    {
      label: "Onboarding",
      color: "pink",
      items: ["Welcome Screen with Topics", "Suggestions to Similar Users"],
    },
  ]}
/>
```

`color` maps to a sticky-note background tint — use CSS vars, not hardcoded values.

---

### `<RecruitmentSources>`

Horizontal bar chart showing where research participants were recruited from. Each row has a platform icon, label, and percentage bar.

```tsx
<RecruitmentSources
  skill="user-research"
  label="Where we recruited participants"
  sources={[
    { label: "Facebook Groups",       icon: "facebook",  percentage: 55 },
    { label: "Reddit",                icon: "reddit",    percentage: 31 },
    { label: "Personal Networks",     icon: "people",    percentage: 10 },
    { label: "Catalia Health Patients", icon: "heart",   percentage: 4  },
  ]}
/>
```

`icon` accepts a string key mapped to an icon from the existing Iconoir React library already installed (`iconoir-react`).

---

## Packages already installed

```
@mdx-js/rollup
@mdx-js/react
remark-frontmatter
remark-mdx-frontmatter
react-router-dom
```

Do not install `next-mdx-remote`, `gray-matter`, or any Next.js packages.

---

## Model recommendations

| Task | Model |
|---|---|
| Types, hooks, filter logic | `claude-sonnet-4-6` |
| Component JSX + CSS | `claude-sonnet-4-6` |
| Adding frontmatter to MDX files in bulk | `claude-haiku-4-5-20251001` |
| File exploration / reading code | `claude-haiku-4-5-20251001` |
| Major architectural decisions only | `claude-opus-4-6` |
