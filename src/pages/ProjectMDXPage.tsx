import React, { useState, useEffect, useRef, ComponentType } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { MDXProvider } from "@mdx-js/react"
import { mdxComponents } from "../components/mdx/mdx-components"
import { DetailNav } from "./ProjectDetail"
import { ProjectSideNav } from "../components/project/ProjectSideNav"

// Eagerly register all MDX project files so Vite bundles them
const projectModules = import.meta.glob("../../content/projects/*.mdx")

// Ordered project list for next-project navigation
const PROJECT_ORDER = [
  { slug: "ai-composer",            title: "AI App Generation",          coverImage: "/images/ai-composer/cover-hero.webp" },
  { slug: "conditional-formatting", title: "Conditional Formatting",     coverImage: "/images/conditional-formatting/hero-image.webp" },
  { slug: "find-talent-dashboard",  title: "Find Talent Dashboard",      coverImage: "/images/find-talent-dashboard/hero-image.webp" },
  { slug: "influencer-data-metrics",title: "Influencer Data & Metrics",  coverImage: "/images/influencer-data-metrics/hero-image.webp" },
  { slug: "companion-website",      title: "Marketing Website Redesign", coverImage: "/images/companion-website/hero-image.webp" },
  { slug: "factory-composer",       title: "Operations Composer",        coverImage: "/images/factory-composer/hero-image.avif" },
]

interface MDXModule {
  default: ComponentType
  frontmatter?: {
    title?: string
    summary?: string
    tags?: string[]
    year?: string
    coverImage?: string
    client?: string
    introText?: string
    pullQuote?: string
  }
}

interface ProjectMDXPageProps {
  isDark: boolean
  toggleDark: (e: React.MouseEvent) => void
}

export function ProjectMDXPage({ isDark, toggleDark }: ProjectMDXPageProps) {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [mod, setMod] = useState<MDXModule | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [visible, setVisible] = useState(false)
  const fadingRef = useRef(false)

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Disable browser scroll restoration so it doesn't interfere with dissolve
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })

  // Determine next 2 projects (wrapping around)
  const currentIdx = PROJECT_ORDER.findIndex((p) => p.slug === slug)
  const nextProjects = currentIdx === -1
    ? []
    : [
        PROJECT_ORDER[(currentIdx + 1) % PROJECT_ORDER.length],
        PROJECT_ORDER[(currentIdx + 2) % PROJECT_ORDER.length],
      ]

  // Fade in on slug change
  useEffect(() => {
    setVisible(false)
    const t = requestAnimationFrame(() => requestAnimationFrame(() => {
      setVisible(true)
      fadingRef.current = false
    }))
    return () => cancelAnimationFrame(t)
  }, [slug])

  const navigateWithDissolve = (nextSlug: string) => {
    if (fadingRef.current) return
    fadingRef.current = true
    setVisible(false)
    setTimeout(() => {
      // 'instant' bypasses CSS scroll-behavior: smooth on <html>
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior })
      navigate(`/projects/${nextSlug}`)
    }, 310)
  }

  useEffect(() => {
    const key = `../../content/projects/${slug}.mdx`
    const loader = projectModules[key]
    if (!loader) {
      setNotFound(true)
      return
    }
    loader().then((m: unknown) => setMod(m as MDXModule))
  }, [slug])

  if (notFound) {
    return (
      <div className="pl-wrapper">
        <DetailNav isDark={isDark} toggleDark={toggleDark} />
        <div className="pl-content" style={{ textAlign: "center" }}>
          <p style={{ color: "var(--text-secondary)" }}>Project not found.</p>
          <button onClick={() => navigate("/")} style={{ marginTop: "1rem", color: "var(--text-primary)" }}>
            ← Back home
          </button>
        </div>
      </div>
    )
  }

  if (!mod) {
    return (
      <div className="pl-wrapper">
        <DetailNav isDark={isDark} toggleDark={toggleDark} />
        <div className="pl-content" style={{ textAlign: "center" }}>
          <span style={{ color: "var(--text-light)" }}>Loading…</span>
        </div>
      </div>
    )
  }

  const MDXContent = mod.default
  const fm = mod.frontmatter ?? {}

  // Hero renders above the grid — suppress it inside MDX to avoid duplication
  const bodyComponents = {
    ...mdxComponents,
    ProjectHero: () => null,
  }

  return (
    <div className="pl-wrapper" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.28s ease" }}>
      <DetailNav isDark={isDark} toggleDark={toggleDark} />

      {/* Hero: full-width, outside the sidebar grid */}
      <div className="pl-hero-zone">
        <mdxComponents.ProjectHero {...fm} />
      </div>

      {/* Body: sidebar + case study sections */}
      <div className="pl-page-body">
        <ProjectSideNav ready={true} />
        <main className="pl-content pl-body-content">
          {fm.pullQuote && (
            <blockquote className="pd-pull-quote">
              <span className="pd-quote-mark">"</span>
              <p>{fm.pullQuote}</p>
            </blockquote>
          )}
          <MDXProvider components={bodyComponents}>
            <MDXContent />
          </MDXProvider>
        </main>
      </div>

      {/* Next projects */}
      {nextProjects.length > 0 && (
        <section className="pl-next-projects">
          <div className="pl-next-projects-inner">
            <h2 className="pl-next-heading">See more projects</h2>
            <div className="pl-next-grid">
              {nextProjects.map((project) => (
                <button
                  key={project.slug}
                  className="pl-next-card"
                  onClick={() => navigateWithDissolve(project.slug)}
                >
                  <div className="pl-next-card-img">
                    {project.coverImage && (
                      <img src={project.coverImage} alt={project.title} />
                    )}
                  </div>
                  <p className="pl-next-card-title">{project.title}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Scroll to top */}
      <button
        className={`pl-scroll-top${showScrollTop ? " pl-scroll-top--visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </div>
  )
}
