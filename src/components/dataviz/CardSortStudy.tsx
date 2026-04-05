import React from "react"

interface CardSortResult {
  label: string
  percentage: number
  alsoConsidered: string[]
  itemsGrouped: string
}

interface CardSortStudyProps {
  participants: number
  studyLabel: string
  results: CardSortResult[]
}

export default function CardSortStudy({ participants, studyLabel, results }: CardSortStudyProps) {
  return (
    <div className="cs-wrapper">
      <div className="cs-header">
        <span className="cs-participants">{participants}</span>
        <span className="cs-label">{studyLabel}</span>
      </div>
      <div className="cs-results">
        {results.map((result) => (
          <div key={result.label} className="cs-row">
            <div className="cs-row-top">
              <span className="cs-category">"{result.label}"</span>
              <span className="cs-percentage">{result.percentage}%</span>
            </div>
            <div className="cs-bar-track">
              <div className="cs-bar-fill" style={{ width: `${result.percentage}%` }} />
            </div>
            <div className="cs-row-bottom">
              <div className="cs-considered">
                <span className="cs-col-label">Also Considered</span>
                <div className="cs-tags">
                  {result.alsoConsidered.map((tag) => (
                    <span key={tag} className="ssp-chip">{tag}</span>
                  ))}
                </div>
              </div>
              <div className="cs-grouped">
                <span className="cs-col-label">Items Grouped</span>
                <span className="cs-items-text">{result.itemsGrouped}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
