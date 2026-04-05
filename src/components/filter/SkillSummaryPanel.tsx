import summaryBg from '../../../content/images/summary_background.webp'
import { SKILL_TAXONOMY } from '../../lib/skills-taxonomy'
import type { SkillKey } from '../../lib/skills-taxonomy'
import type { FilterableProject } from '../../types/filter'

const CHIP_PALETTE: Array<{ bg: string; color: string }> = [
  { bg: '#f1d278', color: 'var(--background)' },
  { bg: '#7e5475', color: 'var(--text-primary)' },
  { bg: '#3d7a6a', color: 'var(--text-primary)' },
  { bg: '#4a6898', color: 'var(--text-primary)' },
]

interface SkillSummaryPanelProps {
  activeSkills: SkillKey[]
  // accepts array (current) or number (legacy matchedProjectCount) for HMR safety
  filteredProjects: FilterableProject[] | number
  onClear: () => void
}

export function SkillSummaryPanel({
  activeSkills,
  filteredProjects,
  onClear,
}: SkillSummaryPanelProps) {
  if (activeSkills.length === 0) return null

  const primarySkill = SKILL_TAXONOMY.find(s => s.key === activeSkills[0])
  const summary = primarySkill?.summary ?? ''

  const projects: FilterableProject[] = Array.isArray(filteredProjects) ? filteredProjects : []
  const count = Array.isArray(filteredProjects) ? filteredProjects.length : filteredProjects

  return (
    <div className="ssp-root">
      <img className="ssp-bg" src={summaryBg} alt="" aria-hidden="true" />

      <div className="ssp-header">
        <span className="ssp-icon" aria-hidden="true">✦</span>
        <span className="ssp-label">Result summary</span>
        <button className="ssp-clear" onClick={onClear} aria-label="Clear filter">✕</button>
      </div>

      <p className="ssp-summary">{summary}</p>

      <div className="ssp-footer">
        <span className="ssp-footer-label">
          Based on {count} project{count !== 1 ? 's' : ''}:
        </span>
        <div className="ssp-chips">
          {projects.map((p, i) => {
            const { bg, color } = CHIP_PALETTE[i % CHIP_PALETTE.length]
            return (
              <span key={p.slug} className="ssp-chip" style={{ background: bg, color }}>
                {p.title}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
