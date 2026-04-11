import type { SkillKey } from '../../lib/skills-taxonomy'
import { SKILL_TAXONOMY } from '../../lib/skills-taxonomy'

interface StickyNotesProps {
  skill: SkillKey
  participants?: number
  label: string
  notes: string[]
}

const STICKY_PALETTE = [
  { background: '#f1d278', rotation: 0,     color: '#201c18' },
  { background: 'linear-gradient(142deg, rgb(114,157,225) 45%, rgb(36,87,168) 85%, rgb(114,157,225) 100%)', rotation: 2.59,  color: '#201c18' },
  { background: '#d88a9c', rotation: 0,     color: '#201c18' },
  { background: '#7e5475', rotation: -2.83, color: '#201c18' },
]

export function StickyNotes({ skill, participants, label, notes }: StickyNotesProps) {
  const skillDef = SKILL_TAXONOMY.find(s => s.key === skill)

  return (
    <div className="sn-root">
      <div className="sn-header">
        {participants !== undefined && participants > 0 && (
          <span className="sn-participants">{participants} Participants</span>
        )}
        <span className="sn-label">{label}</span>
      </div>

      <div className="sn-row">
        {notes.map((note, i) => {
          const p = STICKY_PALETTE[i % STICKY_PALETTE.length]
          return (
            <div
              key={i}
              className="sn-card"
              style={{
                background: p.background,
                transform: `rotate(${p.rotation}deg)`,
                color: p.color,
              }}
            >
              <span className="sn-card-text">{note}</span>
            </div>
          )
        })}
      </div>

      {skillDef && (
        <div className="sn-chip-wrap">
          <span className="mdx-skill-chip">{skillDef.label}</span>
        </div>
      )}
    </div>
  )
}
