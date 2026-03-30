import React from "react"
import { Link } from "react-router-dom"

interface ProjectHeroProps {
  title?: string
  summary?: string
  tags?: string[]
  year?: string
  coverImage?: string
  client?: string
  introText?: string
  pullQuote?: string
}

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

export default function ProjectHero({ title, summary, tags, year, coverImage, client, introText, pullQuote }: ProjectHeroProps) {
  const hasStats = introText || summary || year || (tags && tags.length > 0)

  return (
    <>
      {/* ── Hero header ── */}
      <header className="pd-hero">
        <div className="pd-hero-inner fade-up">
          <div className="pd-breadcrumb">
            <Link to="/" className="pd-back-link">
              <BackArrow /> All work
            </Link>
          </div>
          <h1 className="pd-hero-title">
            {client && (
              <>
                <span className="pd-client">{client}</span>
                <span className="pd-title-sep"> / </span>
              </>
            )}
            <span className="pd-title">{title}</span>
          </h1>
        </div>
      </header>

      {/* ── Cover image + Stats bar (no gap between them) ── */}
      <div className="ph-image-stats">
      {coverImage && (
        <div className="pd-hero-frame">
          <div className="pd-hero-image">
            <img src={coverImage} alt={title ?? ""} />
          </div>
        </div>
      )}

      {/* ── Stats bar ── */}
      {hasStats && (
        <div className="pd-stats-bar">
          {(introText || summary) && (
            <div className="pd-stats-intro">
              <span className="pd-stats-label">Introduction</span>
              <p className="pd-intro">{introText ?? summary}</p>
            </div>
          )}

          {year && (
            <div className="pd-stats-group">
              <span className="pd-stats-label">Year</span>
              <p className="pd-meta-value">{year}</p>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div className="pd-stats-group">
              <span className="pd-stats-label">Skills</span>
              <div className="pd-skills">
                {tags.map((tag) => (
                  <span key={tag} className="pd-skill-tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      </div>

      {/* ── Pull quote ── */}
      {pullQuote && (
        <blockquote className="pd-pull-quote">
          <span className="pd-quote-mark">"</span>
          <p>{pullQuote}</p>
        </blockquote>
      )}
    </>
  )
}
