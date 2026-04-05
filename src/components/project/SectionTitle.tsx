import React from "react"

interface SectionTitleProps {
  label: string
  eyebrow?: string
}

function makeId(eyebrow: string): string {
  // "01 — Problem" → "section-01"
  if (eyebrow.includes('—')) {
    const num = eyebrow.split('—')[0].trim().replace(/\s/g, '')
    return `section-${num}`
  }
  return `section-${eyebrow.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
}

function parseEyebrow(eyebrow: string): { number: string; shortLabel: string } {
  if (eyebrow.includes('—')) {
    const parts = eyebrow.split('—')
    return {
      number: parts[0].trim(),
      shortLabel: parts[1].trim(),
    }
  }
  return { number: '', shortLabel: eyebrow }
}

export default function SectionTitle({ label, eyebrow }: SectionTitleProps) {
  const id = eyebrow ? makeId(eyebrow) : undefined
  const { number, shortLabel } = eyebrow ? parseEyebrow(eyebrow) : { number: '', shortLabel: label }

  return (
    <div
      className="st-wrapper"
      id={id}
      {...(id ? {
        'data-section': 'true',
        'data-section-label': shortLabel,
        'data-section-number': number,
      } : {})}
    >
      {eyebrow && <span className="st-eyebrow">{eyebrow}</span>}
      <h2 className="st-label">{label}</h2>
    </div>
  )
}
