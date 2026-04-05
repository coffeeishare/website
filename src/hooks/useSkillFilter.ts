import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { FilterableProject, EvidenceItem } from '../types/filter'
import type { SkillKey } from '../lib/skills-taxonomy'

const PARAM = 'skills'

function parseParam(value: string | null): SkillKey[] {
  if (!value) return []
  return value.split(',').filter(Boolean) as SkillKey[]
}

function serializeParam(keys: SkillKey[]): string {
  return keys.join(',')
}

export interface UseSkillFilterResult {
  activeSkills: SkillKey[]
  filteredProjects: FilterableProject[]
  matchingEvidence: (project: FilterableProject) => EvidenceItem[]
  toggleSkill: (key: SkillKey) => void
  clearFilter: () => void
}

export function useSkillFilter(projects: FilterableProject[]): UseSkillFilterResult {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeSkills = parseParam(searchParams.get(PARAM))

  const filteredProjects =
    activeSkills.length === 0
      ? projects
      : projects.filter(p => p.skills.some(s => activeSkills.includes(s)))

  const matchingEvidence = useCallback(
    (project: FilterableProject): EvidenceItem[] => {
      if (activeSkills.length === 0) return []
      return project.evidence.filter(e => activeSkills.includes(e.skill))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSkills.join(',')]
  )

  const toggleSkill = useCallback(
    (key: SkillKey) => {
      setSearchParams(prev => {
        const current = parseParam(prev.get(PARAM))
        // Single-select: clicking an active skill clears; clicking a new one replaces
        const next = current.includes(key) ? [] : [key]

        const params = new URLSearchParams(prev)
        if (next.length === 0) {
          params.delete(PARAM)
        } else {
          params.set(PARAM, next[0])
        }
        return params
      })
    },
    [setSearchParams]
  )

  const clearFilter = useCallback(() => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      params.delete(PARAM)
      return params
    })
  }, [setSearchParams])

  return { activeSkills, filteredProjects, matchingEvidence, toggleSkill, clearFilter }
}
