import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { documentToReactComponents } from "@contentful/rich-text-react-renderer"
import { BLOCKS, MARKS } from "@contentful/rich-text-types"
import Lottie from "lottie-react"
import logoAnimation from "../../public/logo.json"
import { getProjectBySlug } from "../lib/contentful"
import type { ProjectDetailEntry } from "../types/contentful"

// ── Icons (shared with App.tsx visual style) ────────────────────────────────

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <rect x="2" y="2" width="20" height="20" rx="4" />
    <line x1="8" y1="11" x2="8" y2="16" />
    <line x1="8" y1="8" x2="8" y2="8.5" />
    <line x1="12" y1="16" x2="12" y2="11" />
    <path d="M12 13a2 2 0 0 1 4 0v3" />
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const BackArrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

// ── Nav for detail pages ─────────────────────────────────────────────────────

interface DetailNavProps {
  isDark: boolean
  toggleDark: (e: React.MouseEvent) => void
}

function DetailNav({ isDark, toggleDark }: DetailNavProps) {
  const navigate = useNavigate()
  return (
    <nav>
      <div
        className="nav-logo"
        onClick={() => navigate("/")}
        style={{ width: 80, height: 40, cursor: "pointer" }}
        aria-label="Back to home"
      >
        <Lottie animationData={logoAnimation} loop={false} autoplay style={{ width: "100%", height: "100%" }} />
      </div>

      <div className="nav-links">
        <button onClick={() => navigate("/")}>Work</button>
        <button
          onClick={() => {
            navigate("/")
            // Signal the main app to open the About page after navigation
            sessionStorage.setItem("pendingPage", "about")
          }}
        >
          About me
        </button>
        <button
          onClick={() => {
            navigate("/")
            sessionStorage.setItem("pendingPage", "other-work")
          }}
        >
          Other work
        </button>
      </div>

      <div className="nav-icons">
        <button className="dark-toggle" onClick={toggleDark} aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>
        <a href="https://www.linkedin.com/in/ulaksiazkiewicz/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <LinkedInIcon />
        </a>
        <a href="mailto:u.ksiazkiewicz@gmail.com" aria-label="Email">
          <EmailIcon />
        </a>
      </div>
    </nav>
  )
}

// ── Rich text renderer config ────────────────────────────────────────────────

const richTextOptions = {
  renderNode: {
    [BLOCKS.HEADING_4]: (_node: unknown, children: React.ReactNode) => (
      <h4 className="pd-section-heading">{children}</h4>
    ),
    [BLOCKS.PARAGRAPH]: (_node: unknown, children: React.ReactNode) => (
      <p className="pd-paragraph">{children}</p>
    ),
    [BLOCKS.UL_LIST]: (_node: unknown, children: React.ReactNode) => (
      <ul className="pd-list">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node: unknown, children: React.ReactNode) => (
      <ol className="pd-list pd-list--ordered">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node: unknown, children: React.ReactNode) => (
      <li className="pd-list-item">{children}</li>
    ),
    [BLOCKS.QUOTE]: (_node: unknown, children: React.ReactNode) => (
      <blockquote className="pd-blockquote pd-blockquote--inline">{children}</blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="pd-divider" />,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { file, title, description } = node.data.target.fields ?? {}
      if (!file?.url) return null
      const { width, height } = file.details?.image ?? {}
      return (
        <figure className="pd-inline-image">
          <img
            src={`https:${file.url}`}
            alt={description || title || ""}
            width={width}
            height={height}
            loading="lazy"
          />
          {description && <figcaption className="pd-image-caption">{description}</figcaption>}
        </figure>
      )
    },
  },
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
  },
}

// ── Related project card ─────────────────────────────────────────────────────

function RelatedCard({ project }: { project: ProjectDetailEntry }) {
  const { slug, title, client, heroImage } = project.fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageUrl = (heroImage as any)?.fields?.file?.url
  return (
    <Link to={`/work/${slug}`} className="pd-related-card">
      <div className="pd-related-image">
        {imageUrl ? (
          <img src={`https:${imageUrl}`} alt={title} loading="lazy" />
        ) : (
          <div className="pd-related-placeholder" />
        )}
      </div>
      <div className="pd-related-info">
        <span className="pd-related-client">{client}</span>
        <span className="pd-related-title">{title}</span>
      </div>
    </Link>
  )
}

// ── Main page component ──────────────────────────────────────────────────────

interface ProjectDetailProps {
  isDark: boolean
  toggleDark: (e: React.MouseEvent) => void
}

export function ProjectDetail({ isDark, toggleDark }: ProjectDetailProps) {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<ProjectDetailEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(null)
    window.scrollTo(0, 0)

    getProjectBySlug(slug)
      .then((entry) => {
        if (!entry) setError("Project not found.")
        else setProject(entry)
      })
      .catch(() => setError("Failed to load project. Please try again."))
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <>
      <DetailNav isDark={isDark} toggleDark={toggleDark} />

      {loading && (
        <div className="pd-state">
          <div className="pd-spinner" aria-label="Loading…" />
        </div>
      )}

      {error && (
        <div className="pd-state">
          <p className="pd-error">{error}</p>
          <Link to="/" className="pd-back-link">
            <BackArrow /> Back to work
          </Link>
        </div>
      )}

      {!loading && !error && project && <ProjectContent project={project} />}
    </>
  )
}

// ── Content renderer (extracted for clarity) ─────────────────────────────────

function ProjectContent({ project }: { project: ProjectDetailEntry }) {
  const {
    title,
    client,
    year,
    teamRoles,
    skills,
    heroImage,
    introText,
    pullQuote,
    bodySections,
    closingQuote,
    relatedProjects,
  } = project.fields

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heroUrl = (heroImage as any)?.fields?.file?.url

  return (
    <main className="pd-page">

      {/* ── Hero header ──────────────────────────────────────────────────── */}
      <header className="pd-hero">
        <div className="container">
          <div className="pd-hero-inner fade-up">
            <div className="pd-breadcrumb">
              <Link to="/" className="pd-back-link">
                <BackArrow /> All work
              </Link>
            </div>
            <h1 className="pd-hero-title">
              <span className="pd-client">{client}</span>
              <span className="pd-title-sep"> / </span>
              <span className="pd-title">{title}</span>
            </h1>
          </div>
        </div>
      </header>

      {/* ── Hero image ───────────────────────────────────────────────────── */}
      {heroUrl && (
        <div className="pd-hero-image">
          <img src={`https:${heroUrl}?w=1200&fm=webp&q=80`} alt={`${client} — ${title}`} />
        </div>
      )}

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <div className="container">
        <div className="pd-stats-bar">
          {introText && (
            <div className="pd-stats-intro">
              <span className="pd-stats-label">Introduction</span>
              <p className="pd-intro">{introText}</p>
            </div>
          )}

          {((teamRoles && teamRoles.length > 0) || year) && (
            <div className="pd-stats-group">
              {teamRoles && teamRoles.length > 0 && (
                <>
                  <span className="pd-stats-label">Team</span>
                  <ul className="pd-meta-list">
                    {teamRoles.map((role) => <li key={role}>{role}</li>)}
                  </ul>
                </>
              )}
              {year && (
                <div className="pd-stats-sub-group">
                  <span className="pd-stats-label">Year</span>
                  <p className="pd-meta-value">{year}</p>
                </div>
              )}
            </div>
          )}

          {skills && skills.length > 0 && (
            <div className="pd-stats-group">
              <span className="pd-stats-label">Skills</span>
              <div className="pd-skills">
                {skills.map((skill) => (
                  <span key={skill} className="pd-skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="container">
        <article className="pd-content">

          {/* Opening pull quote */}
          {pullQuote && (
            <blockquote className="pd-pull-quote">
              <span className="pd-quote-mark">"</span>
              <p>{pullQuote}</p>
            </blockquote>
          )}

          {/* Rich text body sections */}
          {bodySections && (
            <div className="pd-rich-text">
              {documentToReactComponents(bodySections, richTextOptions)}
            </div>
          )}

          {/* Closing testimonial quote */}
          {closingQuote && (
            <blockquote className="pd-closing-quote">
              <span className="pd-quote-mark">"</span>
              <p>{closingQuote}</p>
              <span className="pd-quote-mark pd-quote-mark--close">"</span>
            </blockquote>
          )}
        </article>
      </div>

      {/* ── Related projects ─────────────────────────────────────────────── */}
      {relatedProjects && relatedProjects.length > 0 && (
        <section className="pd-related">
          <div className="container">
            <h2 className="pd-related-heading">See more projects</h2>
            <div className="pd-related-grid">
              {relatedProjects.map((p) => (
                <RelatedCard key={p.sys.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer>
        <div className="container">
          <div className="footer-inner">
            <span className="footer-credit">Website design by Ula in 2025</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
