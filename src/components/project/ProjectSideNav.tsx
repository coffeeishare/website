import { useState, useEffect } from 'react'

interface SectionItem {
  id: string
  label: string
  number: string
}

interface ProjectSideNavProps {
  ready: boolean
}

export function ProjectSideNav({ ready }: ProjectSideNavProps) {
  const [sections, setSections] = useState<SectionItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  // Build section list once MDX has rendered
  useEffect(() => {
    if (!ready) return
    const timer = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('[data-section="true"]'))
      setSections(
        els.map(el => ({
          id: el.id,
          label: el.getAttribute('data-section-label') ?? '',
          number: el.getAttribute('data-section-number') ?? '',
        }))
      )
    }, 120)
    return () => clearTimeout(timer)
  }, [ready])

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-8% 0px -82% 0px', threshold: 0 }
    )

    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  if (sections.length === 0) return <aside className="pl-sidenav" />

  return (
    <aside className="pl-sidenav">
      <nav aria-label="Page sections">
        <ul className="pl-nav-list">
          {sections.map(s => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`pl-nav-item${activeId === s.id ? ' pl-nav-item--active' : ''}`}
                onClick={e => {
                  e.preventDefault()
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  setActiveId(s.id)
                }}
              >
                {s.number && <span className="pl-nav-num">{s.number}</span>}
                <span className="pl-nav-label">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
