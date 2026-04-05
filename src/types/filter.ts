import type { SkillKey } from '../lib/skills-taxonomy'

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
  evidence: EvidenceItem[]  // merged: frontmatter + pullQuote auto-entry
}
