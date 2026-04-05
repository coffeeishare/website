export interface SkillDefinition {
  key: string
  label: string
  summary: string  // 2–4 sentences. Reads like AI synthesis, authored by Ula.
}

export const SKILL_TAXONOMY: SkillDefinition[] = [
  {
    key: 'user-research',
    label: 'User Research',
    summary: `Across these projects I've conducted over 80 research sessions — interviews,
      card sorts, usability tests, and co-design workshops — spanning enterprise operators,
      consumer users, and internal stakeholders. Research wasn't a phase; it was a continuous
      thread that shaped scope, challenged assumptions, and validated decisions before
      engineering effort was committed.`,
  },
  {
    key: 'interaction',
    label: 'Interaction Design',
    summary: `My interaction work spans complex data-entry flows, AI-assisted interfaces,
      and consumer-facing navigation redesigns. I focus on reducing cognitive load at the
      moment of action — every state, transition, and error condition is considered as part
      of the design, not an afterthought.`,
  },
  {
    key: 'systems-thinking',
    label: 'Systems Thinking',
    summary: `I consistently work at the intersection of individual flows and the larger
      systems they live inside. Whether mapping a manufacturing process or designing a
      component library used by 12 product teams, I treat design decisions as systemic
      levers — not isolated screens.`,
  },
  {
    key: 'prototyping',
    label: 'Prototyping',
    summary: `I prototype to learn, not to present. These projects include high-fidelity
      Figma prototypes, coded proof-of-concepts, and lightweight paper sketches used to
      stress-test assumptions before committing to engineering cycles.`,
  },
  {
    key: 'information-architecture',
    label: 'Information Architecture',
    summary: `Navigation and structure decisions have been central to several of these
      projects. I've used card sorting, tree testing, and competitive audits to ground
      IA decisions in evidence — not intuition — and validated results with real users
      before handoff.`,
  },
  {
    key: 'ai-integration',
    label: 'AI Integration',
    summary: `I've designed interfaces that sit directly on top of AI systems — from
      prompt-driven composers to AI-suggested automation builders. The challenge is making
      uncertain, probabilistic outputs feel trustworthy and controllable for non-technical
      users in high-stakes workflows.`,
  },
  {
    key: 'design-systems',
    label: 'Design Systems',
    summary: `I've contributed to and maintained design systems used across multiple product
      teams. My focus is on token architecture, component API design, and documentation that
      makes the right pattern the easy path — not the aspirational one.`,
  },
  {
    key: 'strategy',
    label: 'Strategy',
    summary: `I've worked upstream of the brief — helping define scope, challenge assumptions
      about what to build, and frame design decisions in terms of business and user outcomes.
      These projects show what happens when design has a seat at the table before the
      solution is already decided.`,
  },
]

export type SkillKey =
  | 'user-research'
  | 'interaction'
  | 'systems-thinking'
  | 'prototyping'
  | 'information-architecture'
  | 'ai-integration'
  | 'design-systems'
  | 'strategy'
