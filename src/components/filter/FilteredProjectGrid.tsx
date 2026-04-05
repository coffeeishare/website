import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { parseAllMDXProjects } from '../../lib/parse-mdx-projects'
import { useSkillFilter } from '../../hooks/useSkillFilter'
import { EvidenceCard } from './EvidenceCard'
import { SkillSummaryPanel } from './SkillSummaryPanel'
import type { FilterableProject } from '../../types/filter'

// v2 — passes filteredProjects to SkillSummaryPanel
export function FilteredProjectGrid() {
  const [projects, setProjects] = useState<FilterableProject[]>([])

  useEffect(() => {
    parseAllMDXProjects().then(setProjects)
  }, [])

  // Re-run scroll reveal after async projects land in the DOM
  useEffect(() => {
    if (projects.length === 0) return
    const els = document.querySelectorAll<HTMLElement>('.reveal:not(.revealed)')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [projects])

  const { activeSkills, filteredProjects, matchingEvidence, clearFilter } =
    useSkillFilter(projects)

  const isFiltered = activeSkills.length > 0

  if (projects.length === 0) return null

  return (
    <div className="fpg-root">
      <SkillSummaryPanel
        activeSkills={activeSkills}
        filteredProjects={filteredProjects}
        onClear={clearFilter}
      />

      {filteredProjects.length === 0 ? (
        <div className="fpg-empty">
          <p>No projects match the selected skills.</p>
          <button className="fpg-empty-clear" onClick={clearFilter}>
            Clear filter
          </button>
        </div>
      ) : (
        <div className="fpg-list">
          {filteredProjects.map(project => {
            const evidence = isFiltered ? matchingEvidence(project) : []
            return (
              <div key={project.slug} className="fpg-item">
                <Link
                  to={`/projects/${project.slug}`}
                  className="project-card reveal"
                >
                  <div className="project-info">
                    <div className="project-company-logo" />
                    {project.client && (
                      <div className="project-company">{project.client}.</div>
                    )}
                    <h3 className="project-title">{project.title}</h3>
                    {project.summary && (
                      <p className="project-desc">{project.summary}</p>
                    )}
                  </div>
                  <div className="project-preview">
                    <div className="project-preview-image">
                      {project.coverImage && (
                        <img
                          src={project.coverImage}
                          alt={`${project.title} project cover`}
                        />
                      )}
                    </div>
                  </div>
                </Link>

                {evidence.length > 0 && (
                  <div className="fpg-evidence">
                    {evidence.map((item, i) => (
                      <EvidenceCard key={i} item={item} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
