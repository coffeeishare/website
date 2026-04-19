import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ReferencesGrid, LogoCarousel } from '../App'
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'

// ─────────────────────────────────────────────────────────────────────────────
// SPACES LOADER
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_LINES = [
  'INTERFACE/DIGITAL SPACE',
  'EXPLORATION 2026',
  'LOADING SYNTAX SUGAR...',
]

function slDelay(ms: number) {
  return new Promise<void>(r => setTimeout(r, ms))
}

function StarBurst({ svgRef }: { svgRef: React.RefObject<SVGSVGElement | null> }) {
  const count = 22
  const cx = 63, cy = 63, inner = 16, outer = 52
  return (
    <svg
      ref={svgRef}
      className="sl-starburst"
      width="126" height="126"
      viewBox="0 0 126 126"
      fill="none"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => {
        const angle = (i * 360) / count
        const rad = (angle * Math.PI) / 180
        return (
          <line
            key={i}
            x1={cx + Math.cos(rad) * inner}
            y1={cy + Math.sin(rad) * inner}
            x2={cx + Math.cos(rad) * outer}
            y2={cy + Math.sin(rad) * outer}
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1"
            opacity={0}
          />
        )
      })}
    </svg>
  )
}

interface SpacesLoaderProps {
  onDone: () => void
}

function SpacesLoader({ onDone }: SpacesLoaderProps) {
  const overlayRef   = useRef<HTMLDivElement>(null)
  const textLayerRef = useRef<HTMLDivElement>(null)
  const starburstRef = useRef<SVGSVGElement>(null)
  const [typedLines, setTypedLines] = useState(['', '', ''])
  const [activeLineIdx, setActiveLineIdx] = useState(0)
  const expandedRef = useRef(false)

  // Draw starburst lines in one-by-one on mount
  useEffect(() => {
    const svg = starburstRef.current
    if (!svg) return
    const lines = svg.querySelectorAll('line')
    gsap.to(lines, {
      opacity: 0.55,
      duration: 0.06,
      stagger: { each: 0.07, from: 'start' },
      ease: 'none',
    })
  }, [])

  // Typewriter
  useEffect(() => {
    let cancelled = false
    async function run() {
      for (let li = 0; li < STATUS_LINES.length; li++) {
        setActiveLineIdx(li)
        const full = STATUS_LINES[li]
        for (let ci = 1; ci <= full.length; ci++) {
          if (cancelled) return
          setTypedLines(prev => {
            const next = [...prev]
            next[li] = full.slice(0, ci)
            return next
          })
          await slDelay(30 + Math.random() * 18)
        }
        if (li < STATUS_LINES.length - 1) await slDelay(160)
      }
      setActiveLineIdx(-1)
      await slDelay(150)
      if (!cancelled) triggerExpand()
    }
    run()
    return () => { cancelled = true }
  }, [])

  function triggerExpand() {
    if (expandedRef.current) return
    expandedRef.current = true

    const overlay   = overlayRef.current
    const textLayer = textLayerRef.current
    if (!overlay) { onDone(); return }

    // 1. Dissolve text layer
    if (textLayer) {
      gsap.to(textLayer, { opacity: 0, duration: 0.3, ease: 'power2.out' })
    }

    // 2. Dissolve whole overlay — no scaling, just a clean fade
    gsap.to(overlay, {
      opacity: 0,
      delay: 0.2,
      duration: 0.55,
      ease: 'power2.out',
      onComplete: onDone,
    })
  }

  return (
    <div className="sl-overlay" ref={overlayRef}>
      <div className="sl-card">
        <StarBurst svgRef={starburstRef} />
      </div>

      {/* Text layer lives outside the card in the dark surround */}
      <div className="sl-text-layer" ref={textLayerRef}>
        <div className="sl-status">
          {typedLines.map((line, i) => (
            <p key={i} className="sl-status-line">
              {line}
              {i === activeLineIdx && <span className="sl-cursor" aria-hidden="true" />}
            </p>
          ))}
        </div>

        <p className="sl-welcome">Welcome to the sandbox. Explore. Find. 0001</p>

        <p className="sl-code-ref">013-23132</p>
      </div>
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'about' | 'home' | 'photos' | 'game'

// ─── Game constants ───────────────────────────────────────────────────────────
const CW = 900
const CH = 340
const GROUND = CH - 64       // y of ground line (character bottom rests here)
const CHAR_X = 80
const CHAR_SZ = 46
const GRAV = 0.74
const JUMP_V = -15.5
const BASE_SPD = 5.2

interface Obs { x: number; w: number; h: number; color: string }
interface GS {
  started: boolean; dead: boolean
  cy: number; vy: number; onGround: boolean
  obs: Obs[]; frame: number; score: number; speed: number
}

function mkGS(): GS {
  return { started: false, dead: false, cy: GROUND, vy: 0, onGround: true, obs: [], frame: 0, score: 0, speed: BASE_SPD }
}

const OBS_POOL = [
  { w: 22, h: 44, color: 'rgba(255,180,50,0.9)' },
  { w: 18, h: 70, color: 'rgba(180,100,255,0.9)' },
  { w: 28, h: 36, color: 'rgba(80,200,255,0.9)' },
  { w: 22, h: 56, color: 'rgba(255,100,120,0.9)' },
  { w: 52, h: 38, color: 'rgba(120,220,150,0.9)' },
]

function drawRR(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((ctx as any).roundRect) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(ctx as any).roundRect(x, y, w, h, r)
  } else {
    ctx.rect(x, y, w, h)
  }
  ctx.closePath()
}

// ─── Photo data ───────────────────────────────────────────────────────────────
interface Photo { filename: string; bg: string; caption: string | null }

const PHOTOS: Photo[] = [
  { filename: '3wdOehqIY6GcppSnUIwtKUURUwI.avif', bg: '#2a2a2a', caption: 'Shot on film, somewhere warm' },
  { filename: 'O6O23k2nBtDTb0aw70ED7K9Mqoc.avif', bg: '#2e2e2e', caption: 'Golden hour, no filter' },
  { filename: 'PCL6WIITSJASqrhyAxKQzIRRxyY.avif', bg: '#303030', caption: 'A moment worth keeping' },
  { filename: 'U8Msjoq65Gzmx2ul9D9z0ykRT0.avif',  bg: '#333333', caption: 'Quiet and still' },
  { filename: 'sFdz7ZRllSK4UQjRmrphJuLonE.avif',  bg: '#2c2c2c', caption: 'Light, always light' },
]

// ─── Loves data ───────────────────────────────────────────────────────────────
const LOVES = [
  { icon: '🎨', label: 'Drawing & painting',  desc: 'Watercolour, gouache, anything slow' },
  { icon: '📹', label: 'Videography',          desc: 'Capturing moments before they\'re gone' },
  { icon: '✂️', label: 'Video editing',        desc: 'The craft of telling stories in cuts' },
  { icon: '🐱', label: 'Cats',                 desc: 'Beans specifically, but cats generally' },
  { icon: '🍵', label: 'Matcha',               desc: 'Ritual, not just caffeine' },
  { icon: '🌍', label: 'Travel',               desc: 'Tokyo changed me. More places to go.' },
  { icon: '🎵', label: 'Music',                desc: 'Always on, rarely silent' },
  { icon: '📚', label: 'Design books',         desc: 'Physical, dog-eared, embarrassingly many' },
  { icon: '🏙️', label: 'Urbanism',             desc: 'How cities think about people' },
  { icon: '🇵🇱', label: 'Polish language',     desc: 'Home in my first tongue' },
]


// ─── Dock icons (inline SVG) ──────────────────────────────────────────────────
function DockIcon({ id }: { id: Tab }) {
  switch (id) {
    case 'about':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
    case 'home':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    case 'photos':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>
    case 'game':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="6"/><path d="M6 12h4M8 10v4"/><circle cx="17" cy="11" r="0.5" fill="currentColor"/><circle cx="14" cy="13" r="0.5" fill="currentColor"/></svg>
  }
}

const TAB_LABELS: Record<Tab, string> = {
  about: 'About me', home: 'Love', photos: 'Photos', game: 'Game',
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export function AboutV2Page() {
  const [tab, setTab] = useState<Tab>('about')
  const [loaded, setLoaded] = useState(false)
  const dockRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const tabs: Tab[] = ['about', 'home', 'photos', 'game']

  const handleLoaderDone = useCallback(() => {
    setLoaded(true)
    // Animate dock in from left
    if (dockRef.current) {
      gsap.fromTo(dockRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out', delay: 0.05 }
      )
    }
    // Animate panel in from below
    if (panelRef.current) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out', delay: 0.15 }
      )
    }
  }, [])

  return (
    <div className="av2-root">
      <div className="av2-outer" data-tab={tab}>
        {!loaded && <SpacesLoader onDone={handleLoaderDone} />}

        <div className="av2-layout" style={{ display: loaded ? 'flex' : 'none' }}>
          {/* left dock */}
          <nav className="av2-dock" ref={dockRef} aria-label="About sections">
            {tabs.map(t => (
              <button
                key={t}
                className={`av2-dock-btn${tab === t ? ' av2-dock-btn--active' : ''}`}
                onClick={() => setTab(t)}
                title={TAB_LABELS[t]}
                aria-pressed={tab === t}
              >
                <DockIcon id={t} />
              </button>
            ))}
          </nav>

          {/* main panel */}
          <div className="av2-panel" ref={panelRef} data-tab={tab}>
            {tab === 'about'  && <AboutPanel />}
            {tab === 'home'   && <LovesPanel />}
            {tab === 'photos' && <PhotosPanel />}
            {tab === 'game'   && <GamePanel />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PHOTOS
// ─────────────────────────────────────────────────────────────────────────────

const getStackTransform = (depth: number) => ({
  x: depth * 52,
  y: depth * -34,
  skewY: 6,
  scale: 1 - depth * 0.02,
  opacity: depth < 5 ? 1 : Math.max(0, 1 - (depth - 4) * 0.22),
})

const N = PHOTOS.length

function PhotosPanel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const animatingRef = useRef(false)
  // orderRef[i] = depth of card i (0 = front)
  const orderRef = useRef<number[]>(PHOTOS.map((_, i) => i))
  const [frontIdx, setFrontIdx] = useState(0) // which card index is currently at depth 0

  const handleCardClick = useCallback((cardIdx: number) => {
    if (animatingRef.current) return
    const order = orderRef.current
    const depth = order[cardIdx]
    if (depth === 0) return // already front

    animatingRef.current = true

    const newOrder = order.map((d, i) => {
      if (i === cardIdx) return 0
      if (d < depth) return d + 1
      return d
    })

    orderRef.current = newOrder

    cardRefs.current.forEach((c, i) => {
      if (!c) return
      gsap.set(c, { zIndex: N - newOrder[i] })
    })

    let completed = 0
    cardRefs.current.forEach((c, i) => {
      if (!c) return
      gsap.to(c, {
        ...getStackTransform(newOrder[i]),
        duration: 0.45,
        ease: 'power2.out',
        onComplete: () => {
          completed++
          if (completed === N) animatingRef.current = false
        },
      })
    })

    setFrontIdx(cardIdx)
  }, [])

  useEffect(() => {
    // Set initial transforms
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      gsap.set(card, { ...getStackTransform(i), zIndex: N - i })
    })

    const advance = () => {
      if (animatingRef.current) return
      animatingRef.current = true

      const order = orderRef.current
      // Find which card is at depth 0 (front)
      const frontCardIdx = order.indexOf(0)
      const card = cardRefs.current[frontCardIdx]
      if (!card) return

      gsap.to(card, {
        x: -860,
        y: 210,
        skewY: 6,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          const backDepth = N - 1
          gsap.set(card, {
            ...getStackTransform(backDepth),
            x: getStackTransform(backDepth).x + 300,
            zIndex: 1,
            opacity: 0,
          })

          const newOrder = order.map(d => (d === 0 ? N - 1 : d - 1))
          orderRef.current = newOrder

          cardRefs.current.forEach((c, i) => {
            if (!c) return
            gsap.set(c, { zIndex: N - newOrder[i] })
          })

          cardRefs.current.forEach((c, i) => {
            if (!c || i === frontCardIdx) return
            gsap.to(c, { ...getStackTransform(newOrder[i]), duration: 0.45, ease: 'power2.out' })
          })

          gsap.to(card, { ...getStackTransform(N - 1), duration: 0.45, ease: 'power2.out' })

          setFrontIdx(newOrder.indexOf(0))
          animatingRef.current = false
        },
      })
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY > 0) advance()
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') advance()
    }

    const el = containerRef.current
    el?.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)

    return () => {
      gsap.killTweensOf(cardRefs.current.filter(Boolean))
      el?.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const frontPhoto = PHOTOS[frontIdx]

  return (
    <div className="av2-photos" ref={containerRef}>
      <div className="av2-photo-scene">
        <div className="av2-photo-stack">
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              className="av2-photo-win"
              onClick={() => handleCardClick(i)}
              style={{ cursor: i === frontIdx ? 'default' : 'pointer' }}
            >
              <div className="av2-photo-bar">
                <div className="av2-photo-filename">
                  <span>{photo.filename.split('.')[0].slice(0, 12)}</span>
                  <span>.{photo.filename.split('.').pop()}</span>
                </div>
                <svg className="av2-photo-xmark" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="av2-photo-body">
                <img
                  className="av2-photo-img"
                  src={`/images/photos/${photo.filename}`}
                  alt=""
                  style={{ background: photo.bg }}
                />
              </div>
            </div>
          ))}
        </div>


      </div>

      {frontPhoto.caption && (
        <p className="av2-photo-caption">{frontPhoto.caption}</p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GAME
// ─────────────────────────────────────────────────────────────────────────────
function GamePanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gsRef     = useRef<GS>(mkGS())
  const rafRef    = useRef(0)
  const imgRef    = useRef<HTMLImageElement | null>(null)
  // stable ref to the tick function so we can call it recursively inside RAF
  const tickRef   = useRef<FrameRequestCallback>(() => {})

  const startLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width  = CW * dpr
    canvas.height = CH * dpr
    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)

    tickRef.current = () => {
      const gs = gsRef.current
      ctx.clearRect(0, 0, CW, CH)

      // background — match --background token
      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--background').trim() || '#1E1E1E'
      ctx.fillRect(0, 0, CW, CH)

      // ground line
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(CW, GROUND); ctx.stroke()

      const img = imgRef.current
      const imgReady = img?.complete && img.naturalWidth > 0

      // ── idle screen ──
      if (!gs.started) {
        if (imgReady) ctx.drawImage(img!, CHAR_X, GROUND - CHAR_SZ, CHAR_SZ, CHAR_SZ)
        else { ctx.fillStyle = '#ffd264'; drawRR(ctx, CHAR_X, GROUND - CHAR_SZ, CHAR_SZ, CHAR_SZ, 8); ctx.fill() }

        ctx.fillStyle = 'rgba(255,255,255,0.28)'
        ctx.font = '13px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('press Space or tap to start', CW / 2, GROUND - 80)

        rafRef.current = requestAnimationFrame(tickRef.current)
        return
      }

      // ── game over screen ──
      if (gs.dead) {
        // draw frozen obstacles
        gs.obs.forEach(o => {
          ctx.fillStyle = o.color
          drawRR(ctx, o.x, GROUND - o.h, o.w, o.h, 5)
          ctx.fill()
        })
        // dead character (faded)
        ctx.globalAlpha = 0.35
        if (imgReady) ctx.drawImage(img!, CHAR_X, gs.cy - CHAR_SZ, CHAR_SZ, CHAR_SZ)
        else { ctx.fillStyle = '#ffd264'; drawRR(ctx, CHAR_X, gs.cy - CHAR_SZ, CHAR_SZ, CHAR_SZ, 8); ctx.fill() }
        ctx.globalAlpha = 1

        ctx.fillStyle = 'rgba(255,255,255,0.88)'
        ctx.font = 'bold 22px monospace'
        ctx.textAlign = 'center'
        ctx.fillText('GAME OVER', CW / 2, CH / 2 - 18)
        ctx.font = '13px monospace'
        ctx.fillStyle = 'rgba(255,255,255,0.38)'
        ctx.fillText(`score: ${gs.score}  ·  tap or space to restart`, CW / 2, CH / 2 + 12)
        return // no next RAF — loop ends here
      }

      // ── physics ──
      gs.vy += GRAV
      gs.cy += gs.vy
      if (gs.cy >= GROUND) { gs.cy = GROUND; gs.vy = 0; gs.onGround = true }

      // ── progression ──
      gs.frame++
      gs.score = Math.floor(gs.frame / 6)
      gs.speed = BASE_SPD + Math.floor(gs.score / 300) * 0.6

      // ── spawn ──
      const interval = Math.max(46, 90 - Math.floor(gs.score / 120) * 4)
      if (gs.frame % interval === 0) {
        const t = OBS_POOL[Math.floor(Math.random() * OBS_POOL.length)]
        gs.obs.push({ x: CW + 24, ...t })
      }

      // ── move + cull ──
      gs.obs = gs.obs.filter(o => { o.x -= gs.speed; return o.x > -80 })

      // ── draw obstacles ──
      gs.obs.forEach(o => {
        ctx.fillStyle = o.color
        drawRR(ctx, o.x, GROUND - o.h, o.w, o.h, 5)
        ctx.fill()
      })

      // ── draw character ──
      const charTop = gs.cy - CHAR_SZ
      if (imgReady) {
        ctx.drawImage(img!, CHAR_X, charTop, CHAR_SZ, CHAR_SZ)
      } else {
        ctx.fillStyle = '#ffd264'
        drawRR(ctx, CHAR_X, charTop, CHAR_SZ, CHAR_SZ, 8)
        ctx.fill()
      }

      // ── collision ──
      const cL = CHAR_X + 6, cR = CHAR_X + CHAR_SZ - 6, cT = charTop + 8, cB = gs.cy
      for (const o of gs.obs) {
        if (cR > o.x && cL < o.x + o.w && cB > GROUND - o.h && cT < GROUND) {
          gs.dead = true
          break
        }
      }

      // ── score display ──
      ctx.fillStyle = 'rgba(255,255,255,0.28)'
      ctx.font = '13px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(String(gs.score).padStart(5, '0'), CW - 20, 32)

      if (!gs.dead) rafRef.current = requestAnimationFrame(tickRef.current)
    }

    rafRef.current = requestAnimationFrame(tickRef.current)
  }, [])

  const jump = useCallback(() => {
    const gs = gsRef.current
    if (!gs.started) gs.started = true
    if (gs.onGround && !gs.dead) { gs.vy = JUMP_V; gs.onGround = false }
  }, [])

  const restart = useCallback(() => {
    gsRef.current = mkGS()
    gsRef.current.started = true
    startLoop()
  }, [startLoop])

  const handleInput = useCallback(() => {
    if (gsRef.current.dead) restart()
    else jump()
  }, [jump, restart])

  // mount: load image + start loop
  useEffect(() => {
    const img = new Image()
    img.src = '/beans/beans.png'
    imgRef.current = img
    startLoop()
    return () => cancelAnimationFrame(rafRef.current)
  }, [startLoop])

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); handleInput() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleInput])

  return (
    <div className="av2-game">
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        className="av2-game-canvas"
        onClick={handleInput}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT ME
// ─────────────────────────────────────────────────────────────────────────────

const EXPERIENCE = [
  { role: 'Senior Product Designer', company: 'Tulip Interfaces', city: 'Munich, Germany',    date: 'Jul 2024 – Present',  coords: [11.58,  48.14] as [number, number] },
  { role: 'Lead Product Designer',   company: 'Companion',        city: 'London, UK',         date: 'Sep 2022 – Jul 2024', coords: [-0.12,  51.50] as [number, number] },
  { role: 'Lead Product Designer',   company: '383 Project',      city: 'Birmingham, UK',     date: 'Aug 2021 – Sep 2022', coords: [-1.89,  52.49] as [number, number] },
  { role: 'Senior Designer',         company: 'Marks',            city: 'Birmingham, UK',     date: 'May 2019 – Aug 2021', coords: [-1.84,  52.46] as [number, number] },
  { role: 'Product Designer',        company: 'Euro Packaging',   city: 'Birmingham, UK',     date: 'Oct 2017 – May 2019', coords: [-1.94,  52.52] as [number, number] },
]

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

function WorkMap({ activeIdx }: { activeIdx: number | null }) {
  return (
    <div className="ab-map">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [2, 52], scale: 1600 }}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                style={{
                  default: { outline: 'none', fill: 'var(--map-geo-fill)', stroke: 'var(--map-border)', strokeWidth: 0.6 },
                  hover:   { outline: 'none', fill: 'var(--map-geo-fill)', stroke: 'var(--map-border)', strokeWidth: 0.6 },
                  pressed: { outline: 'none', fill: 'var(--map-geo-fill)', stroke: 'var(--map-border)', strokeWidth: 0.6 },
                }}
              />
            ))
          }
        </Geographies>

        {EXPERIENCE.map((loc, i) => {
          const isActive = activeIdx === i
          // Munich is east — label goes left; UK markers label goes right
          const labelLeft = loc.coords[0] > 8
          return (
            <Marker key={i} coordinates={loc.coords}>
              <rect
                x={-4} y={-4}
                width={8} height={8}
                fill={isActive ? '#9D6A9C' : '#4a4541'}
                style={{ transition: 'fill 0.15s' }}
              />
              {isActive && (
                <text
                  x={labelLeft ? -12 : 12}
                  y={4}
                  textAnchor={labelLeft ? 'end' : 'start'}
                  style={{
                    fontFamily: "'DM Mono', 'Courier New', monospace",
                    fontSize: 30,
                    fill: '#9D6A9C',
                    pointerEvents: 'none',
                  }}
                >
                  {loc.company}, {loc.city}
                </text>
              )}
            </Marker>
          )
        })}
      </ComposableMap>
    </div>
  )
}

type AboutSubTab = 'experience' | 'references'

function AboutPanel() {
  const [subTab, setSubTab] = useState<AboutSubTab>('experience')
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = rootRef.current?.closest('.av2-panel') as HTMLElement | null
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 8)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="ab-root" ref={rootRef}>
      <div className={`ab-top-fade${scrolled ? ' ab-top-fade--visible' : ''}`} />
      {/* ── Info card ── */}
      <div className="ab-card">
        <div className="ab-photo-col">
          <img className="ab-photo" src="/splash-photo.webp" alt="Ula Ksiazkiewicz" />
        </div>
        <div className="ab-bio-col">
          <h2 className="ab-title">About me</h2>
          <p className="ab-text">Hi, I'm Ula, currently a Senior Designer at Tulip.</p>
          <p className="ab-text">I specialise in making complex experiences intuitive and delightful, with a strong focus on research, collaboration, and craft.</p>
          <p className="ab-text">I've led design for B2B, B2C and B2B2C products, built design systems from the ground up, and thrive when working closely with cross-functional teams. I love diving into new domains, especially where AI has the potential to empower users and simplify how we work.</p>
          <div className="ab-meta">
            <div className="ab-meta-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>Polish, English &amp; German (B1)</span>
            </div>
            <div className="ab-meta-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span>Drawing, painting, videography &amp; video editing</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub-tabs ── */}
      <div className="ab-tabs">
        <button
          className={`ab-tab-btn${subTab === 'experience' ? ' ab-tab-btn--active' : ''}`}
          onClick={() => setSubTab('experience')}
        >Experience</button>
        <button
          className={`ab-tab-btn${subTab === 'references' ? ' ab-tab-btn--active' : ''}`}
          onClick={() => setSubTab('references')}
        >References</button>
      </div>

      {/* ── Experience ── */}
      {subTab === 'experience' && (
        <>
          <LogoCarousel />
          <div className="experience-list ab-exp-list">
            {EXPERIENCE.map((item, i) => (
              <div
                key={item.date}
                className={`experience-item${activeIdx === i ? ' experience-item--active' : ''}`}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                <div className="experience-left">
                  <span className="experience-role">{item.role}</span>
                  <span className="experience-company">{item.company}</span>
                </div>
                <span className="experience-date">{item.date}</span>
              </div>
            ))}
          </div>
          <WorkMap activeIdx={activeIdx} />
        </>
      )}

      {/* ── References ── */}
      {subTab === 'references' && (
        <div className="ab-refs-wrap">
          <ReferencesGrid />
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOVES
// ─────────────────────────────────────────────────────────────────────────────

function StickyNoteCard({ text, tooltip, style, onMouseDown }: {
  text: string
  tooltip: string
  style: React.CSSProperties
  onMouseDown: (e: React.MouseEvent) => void
}) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  return (
    <div className="mb-item mb-sticky mb-sticky-note" data-tooltip={tooltip} draggable={false} onMouseDown={onMouseDown} style={style}>
      <audio ref={audioRef} src="/audio/note.mp3" onEnded={() => setPlaying(false)} />
      <p className="mb-sticky-text">{text}</p>
      <button className={`mb-play-btn${playing ? ' mb-play-btn--playing' : ''}`} onClick={togglePlay}>
        {playing
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1"/><rect x="15" y="4" width="4" height="16" rx="1"/></svg>
          : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l15 8-15 8V4z"/></svg>
        }
        {playing ? 'pause' : 'play note'}
      </button>
    </div>
  )
}
const MOODBOARD_ITEMS: Array<{ src?: string; text?: string; cls: string; alt: string; left: number; top: number; rotate: number }> = [
  { text: `I'm always exploring new areas of craft and believe that what I do outside of work deeply informs my design practice. Whether it's photography, video editing, or travel, these hobbies keep my creative thinking sharp and help me connect with new perspectives.\n\nI actively seek out community through these interests and carry that same mindset into my work. I care deeply about inclusivity and accessibility—values that can only be achieved by designing with, and learning from, people of diverse backgrounds.`, cls: 'mb-sticky', alt: 'About me note', left: 3.2, top: -3.8, rotate: -2 },
  { src: '/images/favourites/image 25.png',               cls: 'mb-camera',     alt: 'Canon G7X camera',           left: 31.8, top: -8.4,  rotate:  4 },
  { src: '/images/favourites/Frame 21173.png',            cls: 'mb-movie',      alt: 'Movie still',                left: 67,   top:  4.9,  rotate:  1 },
  { src: '/images/favourites/image 29.png',               cls: 'mb-vinyl',      alt: 'Pink Floyd',                 left: 84.4, top: 15.1,  rotate:  4 },
  { src: '/images/favourites/img20260412_22333122 3.png', cls: 'mb-boarding',   alt: 'Boarding pass',              left: 36,   top: 16.6,  rotate:-11 },
  { src: '/images/favourites/img20260412_22333122 1.png', cls: 'mb-shinkansen', alt: 'Shinkansen ticket',          left: 50.9, top: 31.8,  rotate: -7 },
  { src: '/images/favourites/img20260412_22333122 2.png', cls: 'mb-temple',     alt: 'Temple pass',                left: 47.1, top: 44.6,  rotate: -4 },
  { src: '/images/favourites/image 27.png',               cls: 'mb-crane',      alt: 'Red origami crane',          left: 73.1, top: 27,    rotate:  6 },
  { src: '/images/favourites/image 26.png',               cls: 'mb-crumpled',   alt: 'Crumpled note',              left: -1.5, top: 39,    rotate:-12 },
  { src: '/images/favourites/img20260412_22233526 2.png', cls: 'mb-journal',    alt: 'Hobonichi journal',          left: -6.2, top: 45.9,  rotate: -4 },
  { src: '/images/favourites/Open-1.png',                 cls: 'mb-cat',        alt: 'Cat sketch',                 left: 54.7, top: 66.7,  rotate:  1 },
  { src: '/images/favourites/Open.png',                   cls: 'mb-anime',      alt: 'Anime illustration',         left: 69.5, top: 54.3,  rotate:  5 },
]

function LovesPanel() {
  const boardRef = useRef<HTMLDivElement>(null)
  const [positions, setPositions] = useState(() =>
    MOODBOARD_ITEMS.map(item => ({ left: item.left, top: item.top, rotate: item.rotate }))
  )
  const [zOrders, setZOrders] = useState(() => MOODBOARD_ITEMS.map((_, i) => i === 1 ? 10 : i + 1))
  const drag = useRef<{ idx: number; startMouseX: number; startMouseY: number; startLeft: number; startTop: number } | null>(null)

  const onMouseDown = useCallback((e: React.MouseEvent, idx: number) => {
    e.preventDefault()
    const board = boardRef.current
    if (!board) return
    const { left, top, rotate } = positions[idx]
    drag.current = { idx, startMouseX: e.clientX, startMouseY: e.clientY, startLeft: left, startTop: top }
    setZOrders(prev => {
      const max = Math.max(...prev)
      return prev.map((z, i) => i === idx ? max + 1 : z)
    })
    // suppress rotate during drag
    setPositions(prev => prev.map((p, i) => i === idx ? { ...p, rotate: rotate * 0.3 } : p))
  }, [positions])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!drag.current || !boardRef.current) return
      const { idx, startMouseX, startMouseY, startLeft, startTop } = drag.current
      const { width, height } = boardRef.current.getBoundingClientRect()
      const dx = ((e.clientX - startMouseX) / width) * 100
      const dy = ((e.clientY - startMouseY) / height) * 100
      setPositions(prev => prev.map((p, i) =>
        i === idx ? { ...p, left: startLeft + dx, top: startTop + dy } : p
      ))
    }
    const onUp = () => {
      if (!drag.current) return
      const idx = drag.current.idx
      drag.current = null
      setPositions(prev => prev.map((p, i) =>
        i === idx ? { ...p, rotate: MOODBOARD_ITEMS[idx].rotate } : p
      ))
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <div className="av2-loves" ref={boardRef}>
      {MOODBOARD_ITEMS.map((item, i) => {
        const sharedStyle: React.CSSProperties = {
          left: `${positions[i].left}%`,
          top: `${positions[i].top}%`,
          transform: `rotate(${positions[i].rotate}deg)`,
          zIndex: zOrders[i],
          cursor: drag.current?.idx === i ? 'grabbing' : 'grab',
          transition: drag.current?.idx === i ? 'none' : 'transform 0.2s ease',
        }
        if (item.text) {
          return (
            <StickyNoteCard
              key={item.cls}
              text={item.text}
              tooltip={item.alt}
              style={sharedStyle}
              onMouseDown={e => onMouseDown(e, i)}
            />
          )
        }
        return (
          <div
            key={item.cls}
            className={`mb-item ${item.cls}`}
            data-tooltip={item.alt}
            draggable={false}
            onMouseDown={e => onMouseDown(e, i)}
            style={sharedStyle}
          >
            <img src={item.src} alt={item.alt} draggable={false} style={{ width: '100%', display: 'block', pointerEvents: 'none' }} />
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INSPO
// ─────────────────────────────────────────────────────────────────────────────
function InspoPanel() {
  return (
    <div className="av2-inspo">
      <h2 className="av2-section-title">Inspo board</h2>
      <p className="av2-inspo-note">Curating. Come back soon.</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCES
// ─────────────────────────────────────────────────────────────────────────────
function RefsPanel() {
  return (
    <div className="av2-refs">
      <h2 className="av2-section-title">What people say</h2>
      <div className="av2-refs-grid">
        {REFS.map((r, i) => (
          <div key={i} className="av2-ref-card">
            <span className={`ssp-chip ssp-chip--${r.badge === 'manager' ? 'violet' : 'sky'}`}>{r.badge}</span>
            <p className="av2-ref-quote">"{r.quote}"</p>
            <div className="av2-ref-author">
              <strong>{r.author}</strong>
              <span>{r.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
