import { useState, useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'

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
        <div className="sl-card-grain" aria-hidden="true" />
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
  { filename: 'tokyo_cherry_blossoms.jpg', bg: '#3a3a3a', caption: 'Beautiful sunset in Japan. I loved exploring Tokyo.' },
  { filename: 'ueno_temple_gate.jpg',      bg: '#333333', caption: 'Ueno temple gate. One of my favourite walks.' },
  { filename: 'shibuya_apartments.jpg',    bg: '#2e2e2e', caption: 'Shibuya apartments. I love how dense it all is.' },
  { filename: 'yoyogi_park_trees.jpg',     bg: '#383838', caption: 'Yoyogi Park. Green in the middle of the city.' },
  { filename: 'street_corner_dusk.jpg',   bg: '#303030', caption: 'A street corner at dusk. Tokyo golden hour.' },
  { filename: 'akihabara_evening.jpg',     bg: '#2a2a2a', caption: 'Akihabara in the evening. Neon everywhere.' },
  { filename: 'shinjuku_rain.jpg',         bg: '#353535', caption: 'Shinjuku in the rain. Still beautiful.' },
  { filename: 'asakusa_lanterns.jpg',      bg: '#2c2c2c', caption: 'Asakusa lanterns. Classic Tokyo.' },
  { filename: 'harajuku_street.jpg',       bg: '#323232', caption: 'Harajuku street. Fashion and chaos.' },
  { filename: 'odaiba_bridge.jpg',         bg: '#2f2f2f', caption: 'Odaiba bridge. Views of the bay.' },
  { filename: 'meiji_shrine.jpg',          bg: '#363636', caption: 'Meiji Shrine. Quiet in the middle of the city.' },
  { filename: 'nakameguro_canal.jpg',      bg: '#2d2d2d', caption: 'Nakameguro canal. Cherry blossoms in bloom.' },
  { filename: 'roppongi_night.jpg',        bg: '#313131', caption: 'Roppongi at night. The city never sleeps.' },
  { filename: 'shimokitazawa_cafe.jpg',    bg: '#393939', caption: 'A cafe in Shimokitazawa. My favourite neighbourhood.' },
  { filename: 'yanaka_cemetery.jpg',       bg: '#2b2b2b', caption: 'Yanaka cemetery. Peaceful and full of history.' },
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

// ─── References data ──────────────────────────────────────────────────────────
const REFS = [
  { quote: "Working with Ula has been an absolute delight. She has been a driving force in transforming our platform's design and overall direction. Her impact on our organization – both the platform and the team – has been remarkable.", author: 'Ariel Kendall', title: 'Product Manager, Companion', badge: 'manager' },
  { quote: "To say that Ula is exceptional is really an understatement. She has, for our team, been absolutely key to the elevation in design quality and excellence – intrinsic to our overall success.", author: 'Kashif Amin', title: 'Global Experience Design Manager, Haleon', badge: 'manager' },
  { quote: "Ula is a rare, incredible talent. Although she is off-the-charts artistically gifted, she is also technical and analytical. Her raw talent is immeasurable.", author: 'Joy Radachy Bannister', title: 'Quality Control Specialist, Marks', badge: 'colleague' },
  { quote: "Ula's most valued strength is her ability to take complete ownership of any design task and consistently deliver high-quality creative output which exceeds expectations.", author: 'Craig Bainton', title: 'Associate Creative Director, Marks', badge: 'colleague' },
  { quote: "Ula is one of the most hardworking and diligent creatives I have ever encountered. Her commitment to quality and ability to apply design thinking to every project made it very easy working with her.", author: 'Evgueni Spiridonov', title: 'Global Client Lead, Marks', badge: 'colleague' },
  { quote: "Beyond her technical skills, Ula carried herself with a professionalism that was above her position at the time; her confidence and capability were clear and she quickly earned the respect of both senior colleagues and her peers.", author: 'Natalie Saint', title: 'Senior Operations Manager, 383 Project', badge: 'colleague' },
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

        <div className="av2-layout" style={{ visibility: loaded ? 'visible' : 'hidden' }}>
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
                  <span>{photo.filename.split('_')[0]}</span>
                  <span>{'_' + photo.filename.split('_').slice(1).join('_')}</span>
                </div>
                <svg className="av2-photo-xmark" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="av2-photo-body">
                <div className="av2-photo-img" style={{ background: photo.bg }} />
              </div>
            </div>
          ))}
        </div>

        <p className="av2-photo-scroll-hint">scroll to browse</p>
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
    const ctx = canvas.getContext('2d')!

    tickRef.current = () => {
      const gs = gsRef.current
      ctx.clearRect(0, 0, CW, CH)

      // background
      ctx.fillStyle = '#080808'
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
// ABOUT ME (default tab — content coming soon)
// ─────────────────────────────────────────────────────────────────────────────
function AboutPanel() {
  return <div className="av2-about" />
}

// ─────────────────────────────────────────────────────────────────────────────
// LOVES
// ─────────────────────────────────────────────────────────────────────────────
function LovesPanel() {
  return <div className="av2-loves" />
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
