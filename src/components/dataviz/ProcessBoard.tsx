import React, { useState } from "react"

interface ProcessItem {
  label: string
  detail?: string
}

interface Phase {
  label: string
  color: string
  items: ProcessItem[]
}

interface ProcessBoardProps {
  title?: string
  phases: Phase[]
}

const COLOR_MAP: Record<string, string> = {
  purple: "#7c3aed",
  yellow: "#d97706",
  teal: "#0d9488",
}

function resolveColor(color: string): string {
  return COLOR_MAP[color] ?? color
}

export default function ProcessBoard({ title = "Process", phases }: ProcessBoardProps) {
  const [tooltip, setTooltip] = useState<string | null>(null)

  return (
    <div className="pb-wrapper">
      <h2 className="pb-title">{title}</h2>
      <div className="pb-board">
        {phases.map((phase) => (
          <div key={phase.label} className="pb-column">
            <div className="pb-column-header">
              <span className="pb-dot" style={{ backgroundColor: resolveColor(phase.color) }} />
              <span className="pb-phase-label">{phase.label}</span>
            </div>
            <div className="pb-items">
              {phase.items.map((item) => (
                <div key={item.label} className="pb-item">
                  <span className="pb-item-label">{item.label}</span>
                  {item.detail && (
                    <div className="pb-info-wrap">
                      <button
                        className="pb-info-btn"
                        aria-label="More info"
                        onClick={() => setTooltip(tooltip === item.detail ? null : item.detail!)}
                      >
                        ⓘ
                      </button>
                      {tooltip === item.detail && (
                        <div className="pb-tooltip">{item.detail}</div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
