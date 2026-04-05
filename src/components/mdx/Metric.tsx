import type { SkillKey } from '../../lib/skills-taxonomy'
import { SKILL_TAXONOMY } from '../../lib/skills-taxonomy'

interface MetricProps {
  skill: SkillKey
  value: string
  label: string
  context?: string
}

export function Metric({ skill, value, label, context }: MetricProps) {
  const skillDef = SKILL_TAXONOMY.find(s => s.key === skill)

  return (
    <div className="mdx-metric">
      <div className="mdx-metric-value">{value}</div>
      <div className="mdx-metric-label">{label}</div>
      {context && <div className="mdx-metric-context">{context}</div>}
      {skillDef && (
        <span className="mdx-skill-chip">{skillDef.label}</span>
      )}
    </div>
  )
}
