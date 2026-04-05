import type { EvidenceItem } from '../../types/filter'

interface EvidenceCardProps {
  item: EvidenceItem
}

export function EvidenceCard({ item }: EvidenceCardProps) {
  if (item.type === 'quote') {
    return (
      <div className="ev-card ev-card--quote">
        <blockquote className="ev-quote-text">{item.text}</blockquote>
        {item.attribution && (
          <cite className="ev-quote-attr">{item.attribution}</cite>
        )}
      </div>
    )
  }

  if (item.type === 'metric') {
    return (
      <div className="ev-card ev-card--metric">
        <span className="ev-metric-value">{item.value}</span>
        <span className="ev-metric-label">{item.label}</span>
        {item.context && (
          <span className="ev-metric-context">{item.context}</span>
        )}
      </div>
    )
  }

  if (item.type === 'artifact') {
    return (
      <div className="ev-card ev-card--artifact">
        {item.image && (
          <img
            src={item.image}
            alt={item.label ?? 'Artifact'}
            className="ev-artifact-img"
          />
        )}
        {item.label && (
          <span className="ev-artifact-label">{item.label}</span>
        )}
      </div>
    )
  }

  return null
}
