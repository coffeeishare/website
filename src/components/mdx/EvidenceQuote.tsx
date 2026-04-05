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
      <p className="mdx-quote-text">{text}</p>
      {attribution && (
        <footer className="mdx-quote-attr">— {attribution}</footer>
      )}
      {skillDef && (
        <span className="mdx-skill-chip">{skillDef.label}</span>
      )}
    </blockquote>
  )
}
