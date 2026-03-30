# CLAUDE.md — Portfolio Project Pages

## What We're Building

Adding a **project case study system** to an existing Next.js portfolio site. Each project page is authored in **MDX** — prose is written directly in the file, and rich custom components are embedded wherever needed. No CMS involved.

The goal is a system where:
- New project pages can be created by adding a new `.mdx` file
- Rich data-viz components (card sort, competitive analysis, etc.) can be dropped in with props
- All components use the existing design system tokens
- Everything is fully responsive: mobile (< 768px), tablet (768–1024px), desktop (> 1024px)

---

## Existing Design System

All components **must** use these CSS custom properties. Do not hardcode colour or spacing values.

```css
:root {
  /* Colour */
  --background:         #ffffff;
  --background-subtle:  #fafafa;
  --bg-card:            #f0f4f8;
  --text-primary:       #1a1a1a;
  --text-secondary:     #6b7280;
  --text-light:         #9ca3af;
  --accent-yellow:      rgba(255, 210, 100, 0.45);
  --accent-secondary:   #dbeafe;
  --border:             #e5e7eb;

  /* Typography */
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Layout */
  --max-width:   1400px;
  --nav-height:  64px;
}

[data-theme="dark"] {
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

Dark mode is toggled via `data-theme="dark"` on the `<html>` element. All components must support both themes automatically via CSS variables.

---

## File Structure to Create

```
content/
  projects/
    example-project.mdx        ← example/template file

components/
  mdx/
    MDXRenderer.jsx             ← renders MDX with component map
    mdx-components.js           ← exports all MDX-available components

  project/
    ProjectLayout.jsx           ← wraps every project page (header, nav, spacing)
    ProjectHero.jsx             ← title, tags, cover image, metadata row
    RichText.jsx                ← styled prose wrapper (headings, p, ul, etc.)
    SectionTitle.jsx            ← labelled section divider used between components

  dataviz/
    CardSortStudy.jsx           ← card sort results with progress bars
    CompetitiveAnalysis.jsx     ← competitor table with strengths/weaknesses
    ProcessBoard.jsx            ← kanban-style phase board
    FlowDiagram.jsx             ← user flow / decision tree diagram

app/
  projects/
    [slug]/
      page.jsx                  ← dynamic route, reads MDX by slug
```

---

## Page & Routing Setup

### `app/projects/[slug]/page.jsx`

- Read the MDX file from `content/projects/[slug].mdx`
- Use `next-mdx-remote/rsc` for server-side MDX rendering
- Pass all components from `mdx-components.js` to `MDXRemote`
- Wrap output in `<ProjectLayout>`
- Generate static params from all files in `content/projects/`

```bash
npm install next-mdx-remote gray-matter
```

### Frontmatter shape (every `.mdx` file starts with this)

```yaml
---
title: "Project Title"
summary: "One sentence description"
tags: ["UX Research", "Information Architecture"]
year: "2024"
coverImage: "/images/projects/cover.jpg"   # optional
---
```

---

## Component Specs

### `ProjectLayout.jsx`
- Max width: `var(--max-width)`, horizontally centred, padded
- Top padding accounts for `var(--nav-height)`
- Single column layout
- Responsive padding: `1rem` mobile, `2rem` tablet, `4rem` desktop

### `ProjectHero.jsx`
Props: `title`, `summary`, `tags[]`, `year`, `coverImage?`
- Large title (display size), summary in `--text-secondary`
- Tags rendered as small pill chips using `--bg-card` + `--border`
- Cover image full-width with `border-radius`, optional
- On mobile: stacks vertically, image below text

### `SectionTitle.jsx`
Props: `label`, `eyebrow?`
- Small spaced uppercase eyebrow in `--text-light`
- Larger section heading in `--text-primary`
- Subtle top border using `--border`

---

## Dataviz Component Specs

All dataviz components share these rules:
- Background: `var(--bg-card)`
- Border: `1px solid var(--border)`
- Border radius: `12px`
- Padding: `1.5rem` desktop, `1rem` mobile
- All text uses design system colour tokens
- Full width within their container
- Must work in both light and dark mode

---

### `CardSortStudy.jsx`

Displays results of a card sort user research study.

**Props:**
```js
participants: number
studyLabel: string          // e.g. "Internal Card Sort Study"
results: Array<{
  label: string             // category name e.g. "Vehicles"
  percentage: number        // agreement percentage 0–100
  alsoConsidered: string[]  // alternative names considered
  itemsGrouped: string      // comma-separated items in this group
}>
```

**Visual design (based on screenshot):**
- Header row: participant count (large, bold) + study label (small caps, `--text-light`)
- Each result row is a card with:
  - Left: category label in quotes + percentage in `--accent-yellow` (or a purple/violet tint)
  - Progress bar: filled portion uses accent colour, track uses `--border`, full width
  - Middle: "ALSO CONSIDERED" label (small caps) + tags as dark pill chips
  - Right: "ITEMS GROUPED" label (small caps) + item list in `--text-secondary`
- On mobile: stack middle and right columns below the progress bar
- On tablet: middle and right side by side below bar
- On desktop: three columns in one row

---

### `CompetitiveAnalysis.jsx`

Displays a competitive audit across multiple companies.

**Props:**
```js
competitors: Array<{
  name: string              // e.g. "BMW"
  navType: string           // e.g. "Mega Menu", "Dropdown"
  topNavItems: string[]     // navigation labels
  strengths: string[]
  weaknesses: string[]
}>
```

**Visual design (based on screenshot):**
- Section heading: "Competitive Analysis" with optional intro text slot
- Each competitor is a card containing:
  - Left column: company name (large) + nav type label (small caps, `--text-light`)
  - Top nav items: rendered as dark pill chips in a row
  - Two columns below: Strengths (green dot + label) and Weaknesses (red dot + label)
- Cards separated by visible border
- On mobile: everything stacks to single column
- Strength/weakness columns stack on mobile

---

### `ProcessBoard.jsx`

Kanban-style board showing project phases and tasks.

**Props:**
```js
title?: string              // defaults to "Process"
phases: Array<{
  label: string             // e.g. "Research & Strategy"
  color: string             // dot colour: "purple" | "yellow" | "teal" | string hex
  items: Array<{
    label: string           // task name
    detail?: string         // optional tooltip/info content
  }>
}>
```

**Visual design (based on screenshot):**
- Title: large "Process" heading
- Horizontal scroll container on mobile (snap scroll between columns)
- Each phase is a column card with:
  - Header: coloured dot + phase label in small caps
  - Items: each item is a card with label + optional info icon (ⓘ)
  - Info icon opens a small tooltip/popover with `detail` text
- Columns equal width on desktop, full width stacked or horizontal scroll on mobile
- Column border: `1px solid var(--border)`, rounded `12px`

---

### `FlowDiagram.jsx`

Renders a user flow / decision tree using React Flow or a lightweight SVG-based approach.

**Props:**
```js
nodes: Array<{
  id: string
  label: string
  type: "action" | "decision" | "outcome" | "start"
  x: number                 // position
  y: number
}>
edges: Array<{
  from: string              // node id
  to: string                // node id
  label?: string            // e.g. "YES", "NO"
  color?: string            // e.g. "green" | "red" | default
}>
```

**Visual design (based on screenshot):**
- Dark card background for nodes
- Action nodes: rounded rectangles, `--bg-card` fill, purple/indigo tint for primary actions
- Decision nodes: diamond shape
- Edges: lines with optional labels, coloured green/red for yes/no paths
- Link icon on nodes that have external destinations
- On mobile: render a simplified vertical list view instead of the spatial diagram (diagram layout is complex on small screens)
- Recommend using **React Flow** (`@xyflow/react`) for this component:

```bash
npm install @xyflow/react
```

---

## MDX Component Map

`components/mdx/mdx-components.js` should export all available components:

```js
import CardSortStudy from '@/components/dataviz/CardSortStudy'
import CompetitiveAnalysis from '@/components/dataviz/CompetitiveAnalysis'
import ProcessBoard from '@/components/dataviz/ProcessBoard'
import FlowDiagram from '@/components/dataviz/FlowDiagram'
import SectionTitle from '@/components/project/SectionTitle'
import ProjectHero from '@/components/project/ProjectHero'

export const mdxComponents = {
  CardSortStudy,
  CompetitiveAnalysis,
  ProcessBoard,
  FlowDiagram,
  SectionTitle,
  ProjectHero,
}
```

---

## Example MDX File

Create this as `content/projects/example-project.mdx` as a working template:

```mdx
---
title: "Tesla Mega Menu Redesign"
summary: "Redesigning Tesla's navigation to improve information architecture and findability."
tags: ["UX Research", "Information Architecture", "Navigation"]
year: "2024"
coverImage: "/images/projects/tesla-cover.jpg"
---

<ProjectHero />

<SectionTitle eyebrow="01 — Research" label="Understanding the Problem" />

This project began with an audit of Tesla's existing navigation patterns and a series of user research activities to validate hypotheses about findability issues.

<SectionTitle eyebrow="02 — Process" label="How We Got Here" />

<ProcessBoard phases={[
  {
    label: "Research & Strategy",
    color: "purple",
    items: [
      { label: "Research Key Topics" },
      { label: "Create Automations" },
      { label: "Propose IA" },
      { label: "Audit Competitors", detail: "Reviewed BMW, Porsche, Rivian, and Lucid navigation patterns" }
    ]
  },
  {
    label: "Design & Iteration",
    color: "purple",
    items: [
      { label: "Consolidate Chat UI" },
      { label: "Create Chat Components" },
      { label: "Mock Up Key Flows" },
      { label: "Align on Copy" },
      { label: "Iterate on Designs" }
    ]
  },
  {
    label: "Scoping & Approval",
    color: "yellow",
    items: [
      { label: "Define MVP" },
      { label: "Get Approvals" }
    ]
  },
  {
    label: "Implementation",
    color: "teal",
    items: [
      { label: "Support Engineering" },
      { label: "Conduct Design QA" },
      { label: "Launch It! 🚀" }
    ]
  }
]} />

<SectionTitle eyebrow="03 — Research" label="Competitive Analysis" />

Before defining the new information architecture, I researched navigation patterns across automotive and tech brands.

<CompetitiveAnalysis competitors={[
  {
    name: "BMW",
    navType: "Mega Menu",
    topNavItems: ["Models", "Build", "Shopping", "Electric", "Owners"],
    strengths: ["Clear vehicle categorization (SUV, Sedan, Coupe)", "Dedicated electric section"],
    weaknesses: ["Dense subcategories", "Separate shopping flow"]
  },
  {
    name: "Porsche",
    navType: "Mega Menu",
    topNavItems: ["Models", "Experience", "Ownership", "Porsche Finder"],
    strengths: ["Model-centric navigation", "Lifestyle content integrated"],
    weaknesses: ["Limited top-level categories", "Complex model variants"]
  },
  {
    name: "Rivian",
    navType: "Dropdown",
    topNavItems: ["Vehicles", "Gear Shop", "Charging", "Discover", "Ownership"],
    strengths: ["Clean, minimal structure", "Action-oriented CTAs per vehicle"],
    weaknesses: ["Gear shop prominent (e-commerce focus)", "Less scalable for larger lineup"]
  }
]} />

<SectionTitle eyebrow="04 — Validation" label="Card Sort Study" />

To validate our proposed navigation structure, we ran an internal card sort study with 32 participants.

<CardSortStudy
  participants={32}
  studyLabel="Internal Card Sort Study"
  results={[
    { label: "Vehicles", percentage: 94, alsoConsidered: ["Cars", "Models", "Products"], itemsGrouped: "Model S, Model 3, Model X +4 more" },
    { label: "Energy", percentage: 78, alsoConsidered: ["Solar", "Power", "Home"], itemsGrouped: "Solar Panels, Solar Roof, Powerwall +1 more" },
    { label: "Charging", percentage: 88, alsoConsidered: ["Supercharger", "Power Up", "Fuel"], itemsGrouped: "Supercharger Network, Home Charging, Charging Calculator" },
    { label: "Discover", percentage: 72, alsoConsidered: ["Explore", "Learn", "About"], itemsGrouped: "About Tesla, Careers, News +2 more" },
    { label: "Shop", percentage: 91, alsoConsidered: ["Store", "Buy", "Accessories"], itemsGrouped: "Vehicle Accessories, Apparel, Lifestyle" }
  ]}
/>

<SectionTitle eyebrow="05 — Design" label="Chat Flow Architecture" />

<FlowDiagram
  nodes={[
    { id: "start", label: "Open Chat", type: "start", x: 50, y: 300 },
    { id: "prev", label: "Help With Previous Purchases", type: "action", x: 250, y: 150 },
    { id: "buying", label: "Buying Tesla Products", type: "action", x: 250, y: 300 },
    { id: "delivery", label: "Questions About Delivery", type: "action", x: 250, y: 480 },
    { id: "demo", label: "Schedule Demo Drive", type: "action", x: 250, y: 650 },
    { id: "advisor", label: "Advisor Online?", type: "decision", x: 520, y: 225 },
    { id: "contact", label: "Contact Form", type: "outcome", x: 750, y: 150 },
    { id: "redirect", label: "Advisor Redirect", type: "outcome", x: 750, y: 300 }
  ]}
  edges={[
    { from: "start", to: "prev" },
    { from: "start", to: "buying" },
    { from: "start", to: "delivery" },
    { from: "start", to: "demo" },
    { from: "prev", to: "advisor", color: "green" },
    { from: "buying", to: "advisor", color: "green" },
    { from: "advisor", to: "contact", label: "NO" },
    { from: "advisor", to: "redirect", label: "YES" }
  ]}
/>
```

---

## Responsive Breakpoints

Use these consistently across all components:

```css
/* Mobile first */
/* Base styles: mobile < 768px */

@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
```

---

## Packages to Install

```bash
npm install next-mdx-remote gray-matter @xyflow/react
```

---

## Definition of Done

- [ ] `app/projects/[slug]/page.jsx` renders any MDX file from `content/projects/`
- [ ] All 4 dataviz components render correctly with the example data above
- [ ] All components support light and dark mode via CSS variables
- [ ] All components are responsive at mobile (375px), tablet (768px), desktop (1440px)
- [ ] `content/projects/example-project.mdx` renders as a complete working page
- [ ] No hardcoded colours — all values use `var(--token-name)`
