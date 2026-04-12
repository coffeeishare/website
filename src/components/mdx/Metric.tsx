import { useEffect, useRef, useState } from 'react'
import type { SkillKey } from '../../lib/skills-taxonomy'
import { SKILL_TAXONOMY } from '../../lib/skills-taxonomy'
import { useGlitch } from '../GlitchText'

interface MetricProps {
  skill: SkillKey
  value: string
  label: string
  context?: string
}

// Parse "47%", "25%+", "100+", "3x", "$2M" → { numeric: 47, prefix: "", suffix: "%" }
function parseValue(raw: string): { numeric: number; prefix: string; suffix: string } {
  const match = raw.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/)
  if (!match) return { numeric: 0, prefix: '', suffix: raw }
  return {
    prefix: match[1],
    numeric: parseFloat(match[2]),
    suffix: match[3],
  }
}

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) return
    const start = performance.now()
    let raf: number

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setDone(true)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active, target, duration])

  return { count, done }
}

// Renders glitch chars inline (same logic as GlitchText but without wrapper span)
function GlitchValue({ text }: { text: string }) {
  const { chars, trigger } = useGlitch(text)
  return (
    <span onMouseEnter={trigger} style={{ display: 'inline-block', position: 'relative' }}>
      <span style={{ visibility: 'hidden' }}>{text}</span>
      <span style={{ position: 'absolute', inset: 0 }}>
        {chars.map((c, i) => (
          <span key={i} className={c.settled ? undefined : 'scramble-char'}
            style={c.color ? { color: c.color } : undefined}>
            {c.char}
          </span>
        ))}
      </span>
    </span>
  )
}

export function Metric({ skill, value, label, context }: MetricProps) {
  const skillDef = SKILL_TAXONOMY.find(s => s.key === skill)
  const cardRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const { numeric, prefix, suffix } = parseValue(value)
  const { count, done } = useCountUp(numeric, active)
  const { chars, trigger } = useGlitch(value)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect() } },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const displayValue = active ? `${prefix}${count}${suffix}` : value

  return (
    <div className="mdx-metric" ref={cardRef} onMouseEnter={done ? trigger : undefined}>
      <div className="mdx-metric-value">
        {done ? (
          <span style={{ display: 'inline-block', position: 'relative' }}>
            <span style={{ visibility: 'hidden' }}>{value}</span>
            <span style={{ position: 'absolute', inset: 0 }}>
              {chars.map((c, i) => (
                <span key={i} className={c.settled ? undefined : 'scramble-char'}
                  style={c.color ? { color: c.color } : undefined}>
                  {c.char}
                </span>
              ))}
            </span>
          </span>
        ) : displayValue}
      </div>
      <div className="mdx-metric-label">{label}</div>
      {context && <div className="mdx-metric-context">{context}</div>}
      {skillDef && (
        <span className="mdx-skill-chip">{skillDef.label}</span>
      )}
    </div>
  )
}
