import React, { useState, useEffect, ComponentType } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MDXProvider } from "@mdx-js/react"
import { mdxComponents } from "../components/mdx/mdx-components"
import { DetailNav } from "./ProjectDetail"
import { ProjectSideNav } from "../components/project/ProjectSideNav"

// Eagerly register all MDX project files so Vite bundles them
const projectModules = import.meta.glob("../../content/projects/*.mdx")

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
    <div className="pl-wrapper">
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
    </div>
  )
}
