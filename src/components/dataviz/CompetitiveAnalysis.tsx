import React from "react"

interface Competitor {
  name: string
  navType: string
  topNavItems: string[]
  strengths: string[]
  weaknesses: string[]
}

interface CompetitiveAnalysisProps {
  competitors: Competitor[]
}

export default function CompetitiveAnalysis({ competitors }: CompetitiveAnalysisProps) {
  return (
    <div className="ca-wrapper">
      {competitors.map((competitor) => (
        <div key={competitor.name} className="ca-card">
          <div className="ca-card-header">
            <div className="ca-identity">
              <span className="ca-name">{competitor.name}</span>
              <span className="ca-nav-type">{competitor.navType}</span>
            </div>
            <div className="ca-nav-items">
              {competitor.topNavItems.map((item) => (
                <span key={item} className="ssp-chip">{item}</span>
              ))}
            </div>
          </div>
          <div className="ca-card-body">
            <div className="ca-col">
              <span className="ca-col-label">Strengths</span>
              <ul className="ca-list">
                {competitor.strengths.map((s) => (
                  <li key={s} className="ca-list-item ca-list-item--strength">
                    <span className="ca-dot ca-dot--green" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ca-col">
              <span className="ca-col-label">Weaknesses</span>
              <ul className="ca-list">
                {competitor.weaknesses.map((w) => (
                  <li key={w} className="ca-list-item ca-list-item--weakness">
                    <span className="ca-dot ca-dot--red" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
