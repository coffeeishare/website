import React from "react"

interface SectionTitleProps {
  label: string
  eyebrow?: string
}

export default function SectionTitle({ label, eyebrow }: SectionTitleProps) {
  return (
    <div className="st-wrapper">
      {eyebrow && <span className="st-eyebrow">{eyebrow}</span>}
      <h2 className="st-label">{label}</h2>
    </div>
  )
}
