import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SKILL_TAXONOMY } from '../../lib/skills-taxonomy'
import type { SkillKey } from '../../lib/skills-taxonomy'

const PARAM = 'skills'

function parseParam(value: string | null): SkillKey[] {
  if (!value) return []
  return value.split(',').filter(Boolean) as SkillKey[]
}

export function SkillFilterBar() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeSkills = parseParam(searchParams.get(PARAM))
  const barRef = useRef<HTMLDivElement>(null)

  // Scroll-reveal — matches existing IntersectionObserver pattern in App.tsx
  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('revealed') },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function toggle(key: SkillKey) {
    setSearchParams(prev => {
      const current = parseParam(prev.get(PARAM))
      // Single-select: clicking an active skill clears; clicking a new one replaces
      const next = current.includes(key) ? [] : [key]
      const params = new URLSearchParams(prev)
      if (next.length === 0) params.delete(PARAM)
      else params.set(PARAM, next[0])
      return params
    })
  }

  function clear() {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev)
      params.delete(PARAM)
      return params
    })
  }

  return (
    <div ref={barRef} className="sf-bar reveal">
      <div className="sf-track">
        <button
          className={`sf-chip${activeSkills.length === 0 ? ' sf-chip--active' : ''}`}
          onClick={clear}
        >
          All
        </button>
        {SKILL_TAXONOMY.map(skill => (
          <button
            key={skill.key}
            className={`sf-chip${activeSkills.includes(skill.key as SkillKey) ? ' sf-chip--active' : ''}`}
            onClick={() => toggle(skill.key as SkillKey)}
          >
            {skill.label}
          </button>
        ))}
      </div>
    </div>
  )
}
