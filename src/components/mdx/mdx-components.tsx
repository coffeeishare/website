import CardSortStudy from "../dataviz/CardSortStudy"
import CompetitiveAnalysis from "../dataviz/CompetitiveAnalysis"
import ProcessBoard from "../dataviz/ProcessBoard"
import FlowDiagram from "../dataviz/FlowDiagram"
import SectionTitle from "../project/SectionTitle"
import ProjectHero from "../project/ProjectHero"
import { Metric } from "./Metric"
import { EvidenceQuote } from "./EvidenceQuote"
import { StudyResult } from "./StudyResult"
import { StickyNotes } from "./StickyNotes"

interface ProjectImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
}

function ProjectImage({ src, alt, style, ...props }: ProjectImageProps) {
  const isResearch = src.toLowerCase().includes("research")
  if (isResearch) {
    return <img src={src} alt={alt} style={style} {...props} />
  }
  const { margin, borderRadius, ...imgStyle } = (style as React.CSSProperties) ?? {}
  return (
    <div style={{ border: "1px solid var(--border)", padding: "8px", borderRadius: borderRadius ?? "12px", margin: margin ?? "1.5rem 0" }}>
      <img src={src} alt={alt} style={{ ...imgStyle, width: "100%", borderRadius: "6px", display: "block" }} {...props} />
    </div>
  )
}

export const mdxComponents = {
  CardSortStudy,
  CompetitiveAnalysis,
  ProcessBoard,
  FlowDiagram,
  SectionTitle,
  ProjectHero,
  Metric,
  EvidenceQuote,
  StudyResult,
  StickyNotes,
  ProjectImage,
}
