import { Group } from 'iconoir-react'
import type { SkillKey } from '../../lib/skills-taxonomy'
import { SKILL_TAXONOMY } from '../../lib/skills-taxonomy'

interface OptionRow {
  label: string
  percentage: number
}

interface CardItem {
  title: string
  description: string
}

interface StudyResultProps {
  skill: SkillKey
  participants: number
  label: string
  variant: 'with-icon' | 'basic' | 'gradient' | 'gradient-cards'
  options?: OptionRow[]
  cards?: CardItem[]
}

export function StudyResult({
  skill,
  participants,
  label,
  variant,
  options = [],
  cards = [],
}: StudyResultProps) {
  const skillDef = SKILL_TAXONOMY.find(s => s.key === skill)
  const showGradient = variant === 'gradient' || variant === 'gradient-cards'
  const showCards = variant === 'basic' || variant === 'gradient-cards'
  const showIcon = variant === 'with-icon' || variant === 'gradient'

  return (
    <div className={`sr-root ${showGradient ? 'sr-gradient' : ''}`}>
      {/* Header */}
      <div className="sr-header">
        {showIcon && participants > 0 && (
          <div className="sr-icon-bubble">
            <Group width={22} height={22} color="var(--background)" strokeWidth={1.5} />
          </div>
        )}
        <div className="sr-header-text">
          {participants > 0 && (
            <span className="sr-participants">{participants} Participants</span>
          )}
          <span className="sr-label">{label}</span>
        </div>
      </div>

      {/* Progress bars (with-icon / gradient) */}
      {!showCards && options.length > 0 && (
        <div className="sr-options">
          {options.map((opt, i) => (
            <div key={i} className="sr-option-row">
              <span className="sr-option-label">{opt.label}</span>
              <span className="sr-option-pct">{opt.percentage}%</span>
              <div className="sr-bar-track">
                <div
                  className="sr-bar-fill"
                  style={{ width: `${opt.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card grid (basic / gradient-cards) */}
      {showCards && cards.length > 0 && (
        <div className="sr-cards">
          {cards.map((card, i) => (
            <div key={i} className="sr-card">
              <div className="sr-card-title">{card.title}</div>
              <div className="sr-card-desc">{card.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* Skill chip */}
      {skillDef && (
        <span className="mdx-skill-chip">{skillDef.label}</span>
      )}
    </div>
  )
}
