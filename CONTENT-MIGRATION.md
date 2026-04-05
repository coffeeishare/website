# Content Migration Brief
**Purpose:** Reference for rewriting each project MDX file with inline evidence components and filterable skill structure.
**Inline components available:** `<Metric>`, `<StudyResult>`, `<EvidenceQuote>` — and the existing `<ProcessBoard>`, `<CompetitiveAnalysis>`, `<CardSortStudy>`, `<FlowDiagram>`.

> **How to use this doc:** For each project, fill the frontmatter first (skills + evidence array), then work section by section placing inline components where marked. Rewrite prose following the case study writing guide in `PRD-skill-filter.md`.

---

## Component quick reference

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
    { label: "Unaware of built-in tools", percentage: 58 },
  ]}
  variant="with-icon"
/>

<EvidenceQuote
  skill="strategy"
  text="..."
  attribution="Source or context"
/>
```

---

## 1 — `factory-composer` · Operations Composer · Tulip · 2025–Present

**Status:** In progress. No outcome metrics yet — this project's evidence is research depth and strategic scope.

### Frontmatter to add

```yaml
skills:
  - ai-integration
  - interaction
  - strategy
  - user-research
  - prototyping

evidence:
  - type: quote
    skill: strategy
    text: "Tulip can digitise almost any process on the shop floor. But when you're sitting across from someone who has never seen the platform, that breadth is exactly what makes it hard to explain."
  - type: quote
    skill: ai-integration
    text: "Operations Composer is now a foundation project at Tulip, actively shaping how the company approaches onboarding and customer-facing AI."
  - type: quote
    skill: interaction
    text: "This is fantastic. Wildly powerful. Soooo many ideas. Sensational."
    attribution: "Commercial team, post-demo"
  - type: artifact
    skill: prototyping
    label: "Figma Make prototype — used to secure internal buy-in"
```

### Inline component placements

**Discovery & Research section → `<StudyResult>`**

```tsx
<StudyResult
  skill="user-research"
  participants={3}
  label="Sales shadowing + customer interviews"
  options={[
    { label: "Sales demos stalled on platform breadth", percentage: 100 },
    { label: "Customers sold but struggling with internal sign-off", percentage: 100 },
  ]}
  variant="with-icon"
/>
```
> ⚠️ Ula to confirm participant counts from research. The CSV mentions "customer interviews" and "sales team shadowing" without specific numbers.

**Strategy section → `<EvidenceQuote>`**

```tsx
<EvidenceQuote
  skill="strategy"
  text="The scope shifted from a website feature to a core sales tool once we saw where conversations were actually stalling."
  attribution="Discovery synthesis"
/>
```

**Impact section → note**
No metrics yet. Write a clear "in progress" framing: *"Metrics are being established as Composer rolls out internally."* Include the commercial team quote as an `<EvidenceQuote skill="ai-integration">`.

### Prose rewrite notes
- **Intro:** Lead with the strategic problem, not the feature name. The tension is: Tulip's breadth is its pitch *and* its blocker.
- **Discovery:** Name research methods with participant counts. *"We shadowed [n] sales demos and interviewed [n] customers who had already purchased but were struggling with internal adoption."*
- **Decisions:** Each decision is a design principle with a reason. The CSV has good material — surface the *why* more explicitly.
- **Impact:** The commercial team's response is the evidence. Quote it fully.

---

## 2 — `ai-composer` · AI App Generation · Tulip · 2024–Present

**Status:** Shipped. Strong outcome metrics + rich research depth.

### Frontmatter to add

```yaml
skills:
  - ai-integration
  - interaction
  - prototyping
  - user-research
  - systems-thinking

evidence:
  - type: metric
    skill: ai-integration
    label: "Faster app creation"
    value: "75%"
    context: "Measured in internal testing vs. manual workflow"
  - type: metric
    skill: user-research
    label: "Customer work instructions reviewed"
    value: "100+"
    context: "To identify standard formats and edge cases"
  - type: quote
    skill: interaction
    text: "I'm responsible for building over 200 apps, and the process is incredibly time-consuming and repetitive. With the current app editor, it's difficult to scale up and manage this volume efficiently."
  - type: quote
    skill: ai-integration
    text: "I've already created a couple apps using the Composer AI and the translation is perfect."
    attribution: "Customer, post-launch"
  - type: artifact
    skill: prototyping
    label: "Interaction-first Figma prototype — co-designed with ML engineering"
```

### Inline component placements

**Discovery & Research section → `<StudyResult>` + `<Metric>`**

```tsx
<StudyResult
  skill="user-research"
  participants={0}
  label="Workflow audit — customer work instructions reviewed"
  options={[
    { label: "Instructions followed standard step formats", percentage: 80 },
    { label: "Required edge-case handling", percentage: 40 },
  ]}
  variant="with-icon"
/>
```
> ⚠️ Ula to replace placeholder percentages with real findings if available. The "100+" figure is confirmed from the CSV.

```tsx
<Metric
  skill="user-research"
  value="100+"
  label="Real customer work instructions reviewed"
  context="To map standard formats and surface edge cases before designing output structure"
/>
```

**Impact section → `<Metric>`**

```tsx
<Metric
  skill="ai-integration"
  value="75%"
  label="Faster app creation"
  context="Measured in internal testing against the manual workflow"
/>
```

**Decisions section → `<EvidenceQuote>`**

```tsx
<EvidenceQuote
  skill="interaction"
  text="Users wanted help, not hand-holding. Finding that line — between automation and control — was the central design challenge."
/>
```

### Prose rewrite notes
- **Intro:** The scale problem is the hook — 200 apps is a number that lands. Lead with that.
- **Discovery:** "Multi-pronged" is vague. Rewrite as: *"We ran [n] internal interviews, reviewed 100+ real work instructions, and held weekly co-design sessions with ML engineering."*
- **Strategy:** The "clarity over magic" principle is strong — make it the section headline.
- **Decisions:** The confidence indicators and scaffold-first model are distinctive. Give each one a sentence on *why* it was chosen over the alternative.

---

## 3 — `conditional-formatting` · Conditional Formatting · Tulip · 2025

**Status:** Shipped. Best metric coverage of all six projects.

### Frontmatter to add

```yaml
skills:
  - interaction
  - user-research
  - systems-thinking
  - strategy

evidence:
  - type: metric
    skill: interaction
    label: "Builder adoption rate"
    value: "47%"
    context: "Builders integrating conditional formatting into new and existing tables"
  - type: metric
    skill: user-research
    label: "User awareness increase"
    value: "52%"
    context: "Reducing reliance on manual workarounds and custom widgets"
  - type: quote
    skill: user-research
    text: "I'm constantly second-guessing what the data is telling me. Without clear visual cues, tables feel cluttered and hard to read."
  - type: quote
    skill: interaction
    text: "It's way easier to spot what matters now. The visual cues cut through the noise — I don't have to dig or build custom workarounds anymore."
    attribution: "Builder, post-launch"
  - type: quote
    skill: strategy
    text: "Delivered a positioning advantage, closing a key feature gap with platforms like Tableau and Retool."
```

### Inline component placements

**Discovery & Research section → `<StudyResult>`**

The research here was largely desk-based (tickets, community posts, competitive benchmarking) rather than moderated interviews. Use a `<StudyResult>` to show the breadth:

```tsx
<StudyResult
  skill="user-research"
  participants={0}
  label="Multi-source discovery — tickets, interviews, usage metrics"
  options={[
    { label: "Feature appeared in community requests", percentage: 100 },
    { label: "Users relying on workarounds (variable-based colouring)", percentage: 100 },
    { label: "Competitive tools benchmarked", percentage: 100 },
  ]}
  variant="basic"
/>
```
> ⚠️ `participants={0}` with `variant="basic"` suppresses the participant icon — use this when the research was non-interview-based. Ula to confirm if there's a variant that fits better.

**Impact section → two `<Metric>` blocks**

```tsx
<Metric
  skill="interaction"
  value="47%"
  label="Builder adoption rate"
  context="Builders integrating conditional formatting within 60 days of launch"
/>

<Metric
  skill="user-research"
  label="Reduction in manual workarounds"
  value="52%"
  context="Users no longer relying on variable-based colouring and custom widgets"
/>
```

**Strategy section → `<EvidenceQuote>`**

```tsx
<EvidenceQuote
  skill="strategy"
  text="We intentionally delayed function-writing complexity. The goal was to ship something builders would actually use, then let real usage patterns inform what came next."
/>
```

### Prose rewrite notes
- **Overview:** The comparison to Tableau/Google Sheets is a clear positioning claim — move it earlier and make it explicit.
- **Discovery:** Rewrite as a numbered list of research inputs with the method named first: *"Customer ticket analysis revealed..."*, *"Competitive benchmarking against Sigma, Tableau, and Retool showed..."*
- **Strategy:** The phased rollout decision is genuinely interesting design strategy — give it its own paragraph with the explicit rationale.
- **Impact:** The 52% awareness stat needs a clearer antecedent — *"52% of users who previously relied on workarounds moved to conditional formatting within [timeframe]."*

---

## 4 — `find-talent-dashboard` · Find Talent Dashboard · Companion · 2024

**Status:** Shipped. Strong metrics + the most interview-based research of the Companion projects.

### Frontmatter to add

```yaml
skills:
  - user-research
  - information-architecture
  - interaction
  - strategy

evidence:
  - type: metric
    skill: user-research
    label: "Drop-off during talent discovery"
    value: "~30%"
    context: "Identified via session analytics — users switching tabs or logging into other platforms"
  - type: metric
    skill: information-architecture
    label: "Decrease in external tool use"
    value: "42%"
    context: "Users exiting Companion to use third-party discovery platforms"
  - type: metric
    skill: interaction
    label: "Increase in built-in tool use"
    value: "25%+"
    context: "Find Similar and Database tools, post-redesign"
  - type: metric
    skill: interaction
    label: "More creators added to campaigns"
    value: "23%"
    context: "Post-redesign, attributed to improved discovery workflow"
  - type: quote
    skill: user-research
    text: "I keep switching tabs and tools and losing track of where I was. It's like juggling five apps just to shortlist five creators."
  - type: quote
    skill: information-architecture
    text: "It finally feels like Companion understands how we work. I can stay in one place, find the right creators faster, and actually trust the results."
    attribution: "Agency user, post-launch"
```

### Inline component placements

**Discovery & Research section → `<StudyResult>` + `<Metric>`**

```tsx
<StudyResult
  skill="user-research"
  participants={12}
  label="Agency user interviews — talent discovery phase"
  options={[
    { label: "Switched to external tools during campaign setup", percentage: 72 },
    { label: "Unaware of built-in discovery tools", percentage: 58 },
    { label: "Felt creator suggestions were untrustworthy", percentage: 50 },
  ]}
  variant="with-icon"
/>
```
> ⚠️ Ula: the CSV confirms 12 interviews. Replace option percentages with real findings if you have them — these are illustrative placeholders.

```tsx
<Metric
  skill="user-research"
  value="~30%"
  label="Drop-off rate during talent discovery"
  context="Identified from session analytics before the redesign"
/>
```

**Impact section → `<Metric>` blocks**

```tsx
<Metric
  skill="information-architecture"
  value="42%"
  label="Fewer users leaving for external tools"
  context="Compared to pre-redesign session data"
/>

<Metric
  skill="interaction"
  value="25%+"
  label="Increase in built-in tool use"
  context="Find Similar and Database features, post-launch"
/>
```

**Overview section → `<EvidenceQuote>`**

```tsx
<EvidenceQuote
  skill="information-architecture"
  text="Users weren't switching tools because Companion's features were worse — they were switching because they didn't know the features existed."
/>
```

### Prose rewrite notes
- **Intro:** The stat comes early in the CSV but not the intro — move *"~30% of users were dropping off during discovery"* to sentence one.
- **Discovery:** Lead with the method: *"We interviewed 12 agency users, reviewed session analytics showing ~30% drop-off, and audited all four of Companion's native discovery tools."*
- **Strategy:** The "centralization + transparency" framing is solid. Name it explicitly as the guiding principle.
- **Decisions:** The "Smart suggestions panel" with trust tags (Fits budget, Audience match) is a specific interaction decision worth a full paragraph — why trust signals mattered here, given the research finding.

---

## 5 — `influencer-data-metrics` · Influencer Data & Metrics · Companion · 2024

**Status:** Shipped. Highest outcome metrics of all projects + introduced new design system patterns.

### Frontmatter to add

```yaml
skills:
  - interaction
  - user-research
  - information-architecture
  - design-systems

evidence:
  - type: metric
    skill: interaction
    label: "Increase in internal profile viewer use"
    value: "62%"
    context: "During campaign planning, within first two months of release"
  - type: metric
    skill: user-research
    label: "Reduction in third-party tool switching"
    value: "36%"
    context: "Users switching to tools like CreatorIQ and Upfluence for research"
  - type: metric
    skill: design-systems
    label: "Profile insights adoption growth"
    value: "28%"
    context: "Within first two months; UI patterns later reused across campaign builder and analytics"
  - type: quote
    skill: user-research
    text: "I'm constantly jumping between tools just to figure out if someone's a good fit. It's hard to tell at a glance what really matters, and honestly, I'm not even sure I trust half the metrics I'm seeing."
  - type: quote
    skill: interaction
    text: "I used to jump into other platforms for serious research, but now I can get what I need right here. It's faster, clearer, and just works better for planning."
    attribution: "Campaign manager, post-launch"
  - type: quote
    skill: design-systems
    text: "This project marked a pivotal shift toward data-driven, decision-led design at Companion — and the UI patterns established here were reused across the platform."
```

### Inline component placements

**Discovery & Research section → `<StudyResult>`**

```tsx
<StudyResult
  skill="user-research"
  participants={7}
  label="Moderated user interviews — influencer profile review"
  options={[
    { label: "Switched to third-party tools for serious research", percentage: 86 },
    { label: "Exported to spreadsheets to compare profiles", percentage: 71 },
    { label: "Found profile layout inconsistent or hard to scan", percentage: 100 },
  ]}
  variant="with-icon"
/>
```
> ⚠️ Ula: 7 participants confirmed. Replace option percentages with real findings.

**Impact section → `<Metric>` blocks**

```tsx
<Metric
  skill="interaction"
  value="62%"
  label="Increase in internal profile viewer use"
  context="Campaign planning sessions, within first two months"
/>

<Metric
  skill="user-research"
  value="36%"
  label="Fewer users switching to third-party tools"
  context="CreatorIQ, Upfluence — measured post-redesign"
/>

<Metric
  skill="design-systems"
  value="28%"
  label="Profile insights adoption growth"
  context="First two months post-release; patterns reused across campaign builder"
/>
```

**Decisions section → `<EvidenceQuote>`**

```tsx
<EvidenceQuote
  skill="information-architecture"
  text="Restructuring content hierarchy wasn't a visual decision — it was grounded in which signals users actually used to make decisions, ranked through direct observation."
/>
```

### Prose rewrite notes
- **Intro:** *"Despite rich profile data, users routinely left Companion to do research elsewhere"* — this is the hook. Lead with it.
- **Discovery:** The "signal prioritisation" work with internal stakeholders is an underrated piece of process — give it a dedicated paragraph. This is what makes the IA decision defensible.
- **Strategy:** Design system mention is brief in the CSV. Elevate it: *"I used this redesign as the vehicle to introduce new design system components that later became the foundation for Companion's campaign builder and analytics."*
- **Impact:** The 62% figure is the headline — biggest outcome metric in the whole portfolio. It should be the first thing in the impact section.

---

## 6 — `companion-website` · Marketing Website Redesign · Companion · 2024

**Status:** Shipped. Unique — this is a brand/strategy project, not a product UX project. Skills differ accordingly.

### Frontmatter to add

```yaml
skills:
  - strategy
  - design-systems
  - interaction
  - user-research

evidence:
  - type: metric
    skill: strategy
    label: "Increase in site traffic"
    value: "43%"
    context: "Within two months of launch"
  - type: metric
    skill: design-systems
    label: "Outcome of shared token system"
    value: "Faster"
    context: "Design and development cycles enabled by reusable components"
  - type: quote
    skill: strategy
    text: "The product's great but the site made it feel outdated. Your competition seemed to make more effort so I looked into their offering first."
  - type: quote
    skill: design-systems
    text: "The old site felt super corporate — like it wasn't meant for someone like me. The new one's clear, fun."
    attribution: "Agency lead, post-launch"
  - type: quote
    skill: user-research
    text: "Stakeholder interviews revealed a misalignment between the site's messaging and the evolved product offering — the site was not doing justice to the product or brand."
```

### Inline component placements

**Discovery & Research section → `<StudyResult>`**

This project's research was desk-based and stakeholder-led, not user interviews. Use a `basic` variant without participant count:

```tsx
<StudyResult
  skill="user-research"
  participants={0}
  label="Structured discovery — heuristics, analytics, stakeholder interviews"
  options={[
    { label: "Stakeholder messaging misaligned with product", percentage: 100 },
    { label: "Drop-off at weak CTA points (session recordings)", percentage: 100 },
    { label: "Accessibility gaps — contrast, semantic structure", percentage: 100 },
  ]}
  variant="basic"
/>
```

**Impact section → `<Metric>`**

```tsx
<Metric
  skill="strategy"
  value="43%"
  label="Increase in site traffic"
  context="Within two months of launch, attributed to clearer messaging and improved structure"
/>
```

**Strategy section → `<EvidenceQuote>`**

```tsx
<EvidenceQuote
  skill="strategy"
  text="I framed the redesign as a growth lever backed by data — not a visual refresh. That framing was what got stakeholder buy-in despite limited resources."
/>
```

### Prose rewrite notes
- **Intro:** The stakeholder skepticism angle is interesting and underused — lead with the tension: *"The data said the site was failing. Stakeholders weren't convinced a redesign would fix it."*
- **Discovery:** The SEO opportunity sizing mentioned briefly in the CSV — give it a sentence. It was part of what made the business case.
- **Strategy:** The "token system" decision is a design systems move — name it explicitly and connect it to the speed outcome in the impact section.
- **Impact:** *"Uplift in client sign-ups"* needs a number or it reads like filler. If you have one, add it. If not, remove it and lean harder on the 43% traffic stat + the qualitative stakeholder confidence shift.

---

## Skill → project coverage map

Use this to check whether the taxonomy has enough coverage per skill before writing summaries.

| Skill | Projects |
|---|---|
| `user-research` | all 6 |
| `interaction` | all 6 |
| `ai-integration` | factory-composer, ai-composer |
| `prototyping` | factory-composer, ai-composer |
| `strategy` | factory-composer, conditional-formatting, find-talent-dashboard, companion-website |
| `information-architecture` | find-talent-dashboard, influencer-data-metrics |
| `design-systems` | influencer-data-metrics, companion-website |
| `systems-thinking` | ai-composer, conditional-formatting |
---

## Execution order (suggested)

Start with the richest data and clearest metrics — builds momentum and establishes the pattern.

1. `influencer-data-metrics` — best metrics, clean scope
2. `conditional-formatting` — two strong metrics, well-structured CSV content
3. `find-talent-dashboard` — rich research, good outcomes
4. `ai-composer` — strong hook, needs some number-filling
5. `companion-website` — different project type, good for variety
6. `factory-composer` — last, because it's in progress and needs the most prose judgment
