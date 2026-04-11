import type { SkillKey } from '../../lib/skills-taxonomy'
import { SKILL_TAXONOMY } from '../../lib/skills-taxonomy'

interface EvidenceQuoteProps {
  skill: SkillKey
  text: string
  attribution?: string
}

export function EvidenceQuote({ skill, text, attribution }: EvidenceQuoteProps) {
  const skillDef = SKILL_TAXONOMY.find(s => s.key === skill)

  return (
    <blockquote className="mdx-quote">
      <div className="mdx-quote-body">
        <span className="mdx-quote-mark">"</span>
        <p className="mdx-quote-text">{text}</p>
      </div>
      {(attribution || skillDef) && (
        <div className="mdx-quote-footer">
          {attribution && <span className="mdx-quote-attr">— {attribution}</span>}
          {skillDef && <span className="mdx-skill-chip">{skillDef.label}</span>}
        </div>
      )}
    </blockquote>
  )
}
