import React, { useState, useEffect, useRef } from "react"
import { flushSync } from "react-dom"
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import Lottie from "lottie-react"
import logoAnimation from "../public/logo.json"
import logoSplashAnimation from "../public/logo-splash.json"
import helloAnimation from "../public/hello.json"
import "./style.css"
import { ProjectDetail } from "./pages/ProjectDetail"
import { getAllProjects } from "./lib/contentful"

interface ProjectStub {
  slug: string
  title: string
  client: string
  description: string
  imageUrl: string
}

const FALLBACK_PROJECTS: ProjectStub[] = [
  {
    slug: "ai-composer",
    title: "AI app generation",
    client: "Tulip",
    description: "Designed AI Composer – a smart tool for manufacturing work instructions that cut app-building time by 75%. Collaborated with ML engineers and PMs to create a scalable, intuitive experience adopted widely by users.",
    imageUrl: "/ai-app-generation-cover.webp",
  },
  {
    slug: "conditional-formatting",
    title: "Conditional formatting",
    client: "Tulip",
    description: "Introduced dynamic formatting for Tulip's table components to improve data clarity and speed up decision-making. Co-led with PM and engineering to deliver a performant, scalable solution shaped by user demand and system constraints.",
    imageUrl: "/conditional-formatting-cover.webp",
  },
  {
    slug: "find-talent-dashboard",
    title: "Find talent dashboard",
    client: "Companion",
    description: "Designed a new talent discovery dashboard that reduced reliance on third-party tools like CreatorIQ and Upfluence by surfacing smarter, context-aware creator suggestions within the Companion platform.",
    imageUrl: "",
  },
  {
    slug: "influencer-data-metrics",
    title: "Influencer data & metrics",
    client: "Companion",
    description: "Redesigned influencer profiles to streamline discovery, reduce tool-hopping, and surface key metrics – boosting adoption and user trust.",
    imageUrl: "/influencer-data-metrics-cover.webp",
  },
  {
    slug: "marketing-website-redesign",
    title: "Marketing website redesign",
    client: "Companion",
    description: "Full redesign of Companion's marketing website to better reflect the product's value, increase user trust, and convert high-intent visitors. The new site drove a 43% increase in traffic and boosted client sign-ups, directly supporting growth-stage business goals.",
    imageUrl: "/marketing-website-cover.webp",
  },
]

function clientLogo(client: string) {
  const name = client.toLowerCase()
  if (name.includes("tulip")) return <TulipLogo />
  if (name.includes("companion")) return <CompanionLogo />
  return null
}

type Page = "home" | "about" | "other-work"

function useScrollReveal(dep?: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal")
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [dep])
}

const LOGOS = [
  "svg-1218397804_10949.svg",
  "svg-1518711081_3613.svg",
  "svg-1532226745_3888.svg",
  "svg-1605430578_2007.svg",
  "svg-1655299502_7251.svg",
  "svg-1735344295_2826.svg",
  "svg-1850168078_2558.svg",
  "svg-1910216720_1155.svg",
  "svg-237391502_3452.svg",
  "svg-609159605_7282.svg",
  "svg-814214056_5190.svg",
  "svg-846875243_1968.svg",
  "svg1055874330_2651.svg",
  "svg154817157_1277.svg",
  "svg1699087806_7657.svg",
  "svg2002313413_6126.svg",
  "svg556547200_1831.svg",
  "svg718225278_463.svg",
  "svg728162136_1983.svg",
  "svg790562871_5528.svg",
]

const ORBIT_LOGOS = LOGOS.slice(0, 8)
// Doubled for seamless CSS marquee loop
const CAROUSEL_ITEMS = [...LOGOS, ...LOGOS]

const ROTATING_PHRASES = [
  "solves complex processes",
  "adapts to new AI workflows",
  "builds AI integrations",
  "builds with Claude Code",
  "pushes code to monorepos",
]

// Symbols used during the glitch flash
const SCRAMBLE_CHARS = "!@#%&?<>[]{}=+~^*$"

// Soft pastel colours for the glitch symbols
const GLITCH_COLORS = [
  "#f9a8d4", // pink
  "#bae6fd", // sky blue
  "#bbf7d0", // mint
  "#ddd6fe", // lavender
  "#fed7aa", // peach
  "#fde68a", // yellow
]

interface ScrambleChar {
  char: string
  settled: boolean
  color?: string
}

function RotatingText({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0)
  const [chars, setChars] = useState<ScrambleChar[]>([])
  const [done, setDone] = useState(false)
  const activeRef = useRef(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    activeRef.current = true
    setChars([])
    setDone(false)
    const phrase = phrases[index]
    const settled = phrase.split("").map(c => ({ char: c, settled: true }))

    // Phase 1: plain typewriter — no scramble during typing
    function typeNext(pos: number) {
      if (!activeRef.current) return
      setChars(settled.slice(0, pos + 1))
      if (pos + 1 < phrase.length) {
        timeoutRef.current = setTimeout(() => typeNext(pos + 1), 45)
      } else {
        // Phase 2: brief pause then glitch
        timeoutRef.current = setTimeout(glitch, 350)
      }
    }

    // Scramble helper — replace a portion of non-space chars with pastel-coloured symbols
    function applyGlitch(density: number) {
      setChars(
        settled.map(({ char }) =>
          char !== " " && Math.random() < density
            ? {
                char: SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
                settled: false,
                color: GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)],
              }
            : { char, settled: true }
        )
      )
    }

    // Phase 2: two deliberate flashes — heavy then light — then settle
    function glitch() {
      if (!activeRef.current) return
      // Flash 1: most chars scramble
      applyGlitch(0.75)
      timeoutRef.current = setTimeout(() => {
        if (!activeRef.current) return
        // Brief restore between flashes
        setChars(settled)
        timeoutRef.current = setTimeout(() => {
          if (!activeRef.current) return
          // Flash 2: fewer chars scramble
          applyGlitch(0.35)
          timeoutRef.current = setTimeout(() => {
            if (!activeRef.current) return
            setChars(settled)
            setDone(true)
            timeoutRef.current = setTimeout(() => {
              if (activeRef.current) setIndex(i => (i + 1) % phrases.length)
            }, 1800)
          }, 120)
        }, 60)
      }, 140)
    }

    timeoutRef.current = setTimeout(() => typeNext(0), 80)

    return () => {
      activeRef.current = false
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [index, phrases])

  return (
    <span className="rotating-text">
      <span className="rotating-text-word">
        {chars.map((c, i) => (
          <span key={i} className={c.settled ? undefined : "scramble-char"} style={c.color ? { color: c.color, opacity: 1 } : undefined}>
            {c.char}
          </span>
        ))}
      </span>
      <span className={`tw-cursor${done ? " tw-cursor--done" : ""}`}>▎</span>
    </span>
  )
}


function HeroOrbit() {
  const n = ORBIT_LOGOS.length
  const radius = 310
  return (
    <div className="hero-orbit">
      {ORBIT_LOGOS.map((file, i) => {
        const angle = (i / n) * 2 * Math.PI - Math.PI / 2
        const x = Math.round(Math.cos(angle) * radius)
        const y = Math.round(Math.sin(angle) * radius)
        return (
          <div
            key={i}
            className="hero-orbit-item"
            style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
          >
            <div className="hero-orbit-item-inner">
              <img src={`/${file}`} alt="" aria-hidden="true" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function LogoCarousel() {
  return (
    <div className="logo-carousel">
      <div className="logo-track">
        {CAROUSEL_ITEMS.map((file, i) => (
          <div className="logo-item" key={i}>
            <img src={`/${file}`} alt="" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  )
}

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="4" />
    <line x1="8" y1="11" x2="8" y2="16" />
    <line x1="8" y1="8" x2="8" y2="8.5" />
    <line x1="12" y1="16" x2="12" y2="11" />
    <path d="M12 13a2 2 0 0 1 4 0v3" />
  </svg>
)

// Filled variant used for "view on LinkedIn" links
const LinkedInIconFilled = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

const ResumeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
)

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

const TulipLogo = () => (
  <img src="/tulip-logo.webp" alt="Tulip" />
)

const CompanionLogo = () => (
  <img src="/companion-logo.webp" alt="Companion" />
)

const MockWindow = ({ accentColor }: { accentColor?: string }) => (
  <div className="preview-mock">
    <div className="mock-bar">
      <span className="mock-dot red" />
      <span className="mock-dot yellow" />
      <span className="mock-dot green" />
    </div>
    <div className="mock-content">
      <div className="mock-line short" style={accentColor ? { background: accentColor } : undefined} />
      <div className="mock-line long" />
      <div className="mock-line medium" style={accentColor ? { background: accentColor } : undefined} />
      <div className="mock-line long" />
      <div className="mock-line short" />
    </div>
  </div>
)

const CTA = () => (
  <section className="cta-section">
    <span className="cta-emoji">🤘</span>
    <span className="cta-heading">Let's chat more!</span>
    <a href="mailto:u.ksiazkiewicz@gmail.com" className="cta-email">u.ksiazkiewicz@gmail.com</a>
    <div className="cta-links">
      <a href="mailto:u.ksiazkiewicz@gmail.com" className="cta-btn">
        <EmailIcon /> Let's Talk
      </a>
      <a href="https://www.linkedin.com/in/ulaksiazkiewicz/" target="_blank" rel="noreferrer" className="cta-btn">
        <LinkedInIcon /> LinkedIn
      </a>
      <a href="#" className="cta-btn">
        <ResumeIcon /> Download resume
      </a>
    </div>
  </section>
)

const Footer = () => (
  <footer>
    <div className="container">
      <div className="footer-inner">
        <span className="footer-credit">Website design by Ula in 2025</span>
      </div>
    </div>
  </footer>
)

function Nav({ page, setPage, isDark, toggleDark }: { page: Page; setPage: (p: Page) => void; isDark: boolean; toggleDark: (e: React.MouseEvent) => void }) {
  const navigate = useNavigate()
  return (
    <nav>
      <div className="nav-logo" onClick={() => { navigate("/"); setPage("home") }} style={{ width: 80, height: 40, cursor: "pointer" }}>
        <Lottie animationData={logoAnimation} loop={false} autoplay style={{ width: "100%", height: "100%" }} />
      </div>
      <div className="nav-links">
        <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}>Work</button>
        <button className={page === "about" ? "active" : ""} onClick={() => setPage("about")}>About me</button>
        <button className={page === "other-work" ? "active" : ""} onClick={() => setPage("other-work")}>Other work</button>
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
        <a href="#" aria-label="Download resume">
          <ResumeIcon />
        </a>
      </div>
    </nav>
  )
}

function HomePage({ onOtherWork }: { onOtherWork: () => void }) {
  const [activeTab, setActiveTab] = useState<"work" | "experience" | "references">("work")
  const [projects, setProjects] = useState<ProjectStub[]>(FALLBACK_PROJECTS)
  useScrollReveal([activeTab, projects])

  useEffect(() => {
    getAllProjects()
      .then((entries) => {
        if (!entries.length) return
        const mapped: ProjectStub[] = entries.map((e) => ({
          slug: e.fields.slug,
          title: e.fields.title,
          client: e.fields.client,
          description: (e.fields as any).introText ?? "",
          imageUrl: (e.fields.heroImage as any)?.fields?.file?.url
            ? `https:${(e.fields.heroImage as any).fields.file.url}`
            : "",
        }))
        setProjects(mapped)
      })
      .catch(() => {
        // env vars not set – keep fallback data
      })
  }, [])

  return (
    <div className="container">
      <section className="hero fade-up">
        <HeroOrbit />
        <div className="hero-content">
          <div className="hero-greeting">
            <h2>Hi, I'm Ula</h2>
            <div className="hero-pill">
              <div className="hero-pill-photo">
                {/* Replace src with your photo: <img src="/avatar.jpg" alt="Ula" /> */}
                <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="42" cy="34" r="16" fill="#bfdbfe" />
                  <path d="M8 80c0-18.8 15.2-34 34-34s34 15.2 34 34" fill="#bfdbfe" />
                </svg>
              </div>
              <span className="hero-pill-emoji">👋</span>
            </div>
          </div>
          <h1>
            {"I'm a senior product designer that".split(" ").map((word, i) => (
              <React.Fragment key={i}>
                <span className="hero-word" style={{ animationDelay: `${0.05 + i * 0.06}s` }}>{word}</span>
                {" "}
              </React.Fragment>
            ))}
            <RotatingText phrases={ROTATING_PHRASES} />
          </h1>
          <p className="hero-subtitle fade-up-delay-1">Experienced in designing web, mobile &amp; desktop solutions for B2B and B2B2C SaaS products.</p>
        </div>
      </section>

      <div className="fade-up-delay-2">
        <div className="tabs-nav">
          <button className={`tab-btn${activeTab === "work" ? " active" : ""}`} onClick={() => setActiveTab("work")}>Work</button>
          <button className={`tab-btn${activeTab === "experience" ? " active" : ""}`} onClick={() => setActiveTab("experience")}>Experience</button>
          <button className={`tab-btn${activeTab === "references" ? " active" : ""}`} onClick={() => setActiveTab("references")}>References</button>
        </div>

        {/* WORK TAB */}
        <div className={`tab-panel${activeTab === "work" ? " active" : ""}`}>
          <div className="projects-list">
            {projects.map((project) => (
              <Link key={project.slug} to={`/work/${project.slug}`} className="project-card reveal">
                <div className="project-info">
                  <div className="project-company-logo">{clientLogo(project.client)}</div>
                  <div className="project-company">{project.client}.</div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-desc">{project.description}</p>
                </div>
                <div className="project-preview">
                  <div className="project-preview-image">
                    {project.imageUrl && (
                      <img src={project.imageUrl} alt={`${project.title} project cover`} />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="see-more">
            <button onClick={onOtherWork}>…there's more &nbsp; See more work →</button>
          </div>
        </div>

        {/* EXPERIENCE TAB */}
        <div className={`tab-panel${activeTab === "experience" ? " active" : ""}`}>
          <div className="experience-list">
            {[
              { role: "Senior Product Designer.", company: "Tulip Interfaces.", date: "Jul 2024 – Present" },
              { role: "Lead Product Designer.", company: "Companion.", date: "Sep 2022 – Jul 2024" },
              { role: "Lead Product Designer.", company: "383 Project.", date: "Aug 2021 – Sep 2022" },
              { role: "Senior Designer.", company: "Marks.", date: "May 2019 – Aug 2021" },
              { role: "Product Designer.", company: "Euro Packaging.", date: "Oct 2017 – May 2019" },
            ].map((item) => (
              <div className="exp-item" key={item.date}>
                <div className="exp-left">
                  <span className="exp-role">{item.role}</span>
                  <span className="exp-company">{item.company}</span>
                </div>
                <span className="exp-date">{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* REFERENCES TAB */}
        <div className={`tab-panel${activeTab === "references" ? " active" : ""}`}>
          <ReferencesGrid />
          <a href="https://www.linkedin.com/in/ulaksiazkiewicz/" target="_blank" rel="noreferrer" className="linkedin-link">
            <LinkedInIconFilled />
            Full quotes available on LinkedIn
          </a>
        </div>
      </div>

      <CTA />
    </div>
  )
}

const references = [
  {
    quote: "Working with Ula has been an absolute delight. She has been a driving force in transforming our platform's design and overall direction. Her impact on our organization – both the platform and the team – has been remarkable.",
    author: "Ariel Kendall", title: "Product Manager at Companion", type: "manager",
    highlights: ["driving force", "remarkable"],
  },
  {
    quote: "To say that Ula is exceptional is really an understatement. She has, for our team, been absolutely key to the elevation in design quality and excellence – intrinsic to our overall success.",
    author: "Kashif Amin", title: "Global Experience Design Manager at Haleon", type: "manager",
    highlights: ["exceptional", "elevation in design quality and excellence"],
  },
  {
    quote: "Ula is a rare, incredible talent. Although she is off-the-charts artistically gifted, she is also technical and analytical. She is knowledgeable and experienced in design but her raw talent is immeasurable.",
    author: "Joy Radachy Bannister", title: "Quality Control Specialist at Marks", type: "colleague",
    highlights: ["rare, incredible talent", "raw talent is immeasurable"],
  },
  {
    quote: "Ula's most valued strength is her ability to take complete ownership of any design task and consistently deliver high-quality creative output which not only nails the requirements of the brief, but exceeds expectations and adds genuine, well-considered value.",
    author: "Craig Bainton", title: "Associate Creative Director at Marks", type: "colleague",
    highlights: ["complete ownership", "exceeds expectations and adds genuine, well-considered value"],
  },
  {
    quote: "I had the privilege to work with Ula for a year and a half on a very demanding global client. Ula is one of the most hardworking and diligent creatives I have ever encountered. Her commitment to quality and ability to apply design thinking to every project made it very easy working with her.",
    author: "Evgueni Spiridonov", title: "Global Client Lead at Marks", type: "colleague",
    highlights: ["most hardworking and diligent creatives", "apply design thinking to every project"],
  },
  {
    quote: "Beyond her technical skills, Ula carried herself with a professionalism that was above her position at the time; her confidence and capability were clear and she quickly earned the respect of both senior colleagues and her peers.",
    author: "Natalie Saint", title: "Senior Operations Manager at 383 Project", type: "colleague",
    highlights: ["above her position", "quickly earned the respect of both senior colleagues and her peers"],
  },
]

function useTypewriter(text: string, speed = 16) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const full = `"${text}"`
        // Start already at 75% so only the last quarter types in on scroll
        let i = Math.floor(full.length * 0.75)
        setDisplayed(full.slice(0, i))
        intervalRef.current = setInterval(() => {
          i++
          setDisplayed(full.slice(0, i))
          if (i >= full.length) {
            clearInterval(intervalRef.current!)
            intervalRef.current = null
            setDone(true)
          }
        }, speed)
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [text, speed])

  return { displayed, done, ref }
}

/** Escapes special regex characters in a string */
function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Splits `text` by the given highlight phrases and returns React nodes,
 * wrapping matched phrases in a `.quote-highlight` span.
 * Runs on every typewriter tick — phrases turn blue the moment they're fully typed.
 */
function renderHighlighted(text: string, highlights: string[]): React.ReactNode {
  if (!highlights.length) return text
  const pattern = highlights.map(escapeRegex).join('|')
  const regex = new RegExp(`(${pattern})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    highlights.some(h => h.toLowerCase() === part.toLowerCase())
      ? <span key={i} className="quote-highlight">{part}</span>
      : part
  )
}

function TypewriterQuote({ text, highlights = [] }: { text: string; highlights?: string[] }) {
  const { displayed, done, ref } = useTypewriter(text)
  return (
    <p className="reference-quote" ref={ref}>
      {renderHighlighted(displayed, highlights)}
      <span className={`tw-cursor${done ? " tw-cursor--done" : ""}`}>▎</span>
    </p>
  )
}

// Pastel palette for avatar backgrounds — cycles by index
const AVATAR_COLORS = ['#fde68a', '#bae6fd', '#bbf7d0', '#ddd6fe', '#fed7aa', '#f9a8d4']

/** Extracts up to 2 initials from a full name */
function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0].slice(0, 2).toUpperCase()
}

function ReferencesGrid() {
  return (
    <div className="references-grid">
      {references.map((r, i) => (
        /* Outer wrap is flex-col items-end so badge sits above card top-right */
        <div className="reference-card-wrap" key={r.author}>

          {/* Badge floats above the card, filling its top-right corner */}
          <span className="reference-badge">Quote={r.type}</span>

          <div className="reference-card">
            {/* Quote section with bottom border acting as divider */}
            <div className="reference-quote-section">
              <TypewriterQuote text={r.quote} highlights={r.highlights} />
            </div>

            {/* Author row */}
            <div className="reference-author">
              <div
                className="reference-avatar"
                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                aria-hidden="true"
              >
                {getInitials(r.author)}
              </div>
              <div className="reference-author-info">
                <strong>{r.author}</strong>
                <span>{r.title}</span>
              </div>
            </div>
          </div>

        </div>
      ))}
    </div>
  )
}

function AboutPage() {
  useEffect(() => {
    const bio = document.querySelector(".about-bio")
    if (!bio) return
    const marks = bio.querySelectorAll("mark")
    marks.forEach(el => el.classList.remove("highlight-animated"))
    const timeouts: ReturnType<typeof setTimeout>[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll("mark").forEach((el, i) => {
              timeouts.push(setTimeout(() => el.classList.add("highlight-animated"), i * 400))
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(bio)
    return () => {
      observer.disconnect()
      timeouts.forEach(clearTimeout)
      marks.forEach(el => el.classList.remove("highlight-animated"))
    }
  }, [])

  return (
    <div className="container">
      <section className="about-hero fade-up">
        <div className="about-photo-wrap">
          <div className="hello-bubble">
          <Lottie animationData={helloAnimation} loop={false} autoplay style={{ width: "100%", height: "100%" }} />
        </div>
          <div className="about-photo">
            <div className="about-photo-placeholder">
              <svg width="120" height="160" viewBox="0 0 120 160" fill="none">
                <circle cx="60" cy="55" r="32" fill="#93c5fd" />
                <path d="M10 145c0-27.6 22.4-50 50-50s50 22.4 50 50" fill="#93c5fd" />
              </svg>
            </div>
          </div>
        </div>
        <div className="about-content">
          <h1>About me</h1>
          <div className="about-bio">
            <p>Hi, I'm Ula, currently a Senior Designer at Tulip.</p>
            <p>I specialise in <mark>making complex experiences intuitive</mark> and delightful, with a strong focus on research, collaboration, and craft.</p>
            <p>I've led design for <mark>B2B, B2C and B2B2C products</mark>, built design systems from the ground up, and thrive when working closely with cross-functional teams. I love diving into new domains, especially where AI has the potential to <mark>empower users</mark> and simplify how we work.</p>
          </div>
          <div className="about-meta">
            <div className="about-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>Polish, English &amp; German (B1)</span>
            </div>
            <div className="about-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>Drawing, painting, videography &amp; video editing</span>
            </div>
            <div className="about-meta-item">
              <a href="https://www.linkedin.com/in/ulaksiazkiewicz/" target="_blank" rel="noreferrer">
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <LogoCarousel />

      <section className="about-section">
        <h2>Collaboration and workshops</h2>
        <p>One of my favorite parts of being a product designer is seeing how people actually interact with what we create. It's often a humbling experience, but always a powerful way to learn and improve quickly. I've especially enjoyed running workshops and speaking publicly – two things I'm excited to keep growing in.</p>
      </section>

      <section className="about-section">
        <h2>Forever curious</h2>
        <p>I'm always exploring new areas of craft and believe that what I do outside of work deeply informs my design practice. Whether it's photography, video editing, or travel, these hobbies keep my creative thinking sharp and help me connect with new perspectives. I actively seek out community through these interests and carry that same mindset into my work. I care deeply about inclusivity and accessibility – values that can only be achieved by designing with, and learning from, people of diverse backgrounds.</p>
      </section>

      <section className="refs-section">
        <h2>Colleague's references</h2>
        <ReferencesGrid />
        <a href="https://www.linkedin.com/in/ulaksiazkiewicz/" target="_blank" rel="noreferrer" className="linkedin-link">
          <LinkedInIconFilled />
          Full quotes and more available on LinkedIn
        </a>
      </section>

      <CTA />
    </div>
  )
}

const workTiles = [
  { title: "Profile Comments", desc: "Quick, contextual input to streamline decision-making on talent fit.", bg: undefined, accent: undefined },
  { title: "Feature Highlight", desc: "Engaging visual cues to drive understanding and adoption.", bg: "linear-gradient(135deg,#e0f2fe,#bae6fd)", accent: "#7dd3fc" },
  { title: "Smart Error Hub", desc: "Prioritised by validation level, built for fast, frictionless access.", bg: "linear-gradient(135deg,#fef3c7,#fde68a)", accent: "#fbbf24" },
  { title: "Toolbar Pattern", desc: "Streamlined design and interaction model for hierarchical item control.", bg: undefined, accent: undefined },
  { title: "Branding Overhaul", desc: "A visual narrative of the end-to-end transformation I designed.", bg: "linear-gradient(135deg,#fce7f3,#fbcfe8)", accent: "#f9a8d4" },
  { title: "Talent Profiles on Mobile", desc: "Designed for anytime access, enabling quicker insights and actions.", bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", accent: "#c4b5fd" },
  { title: "Pricing Modal Revamp", desc: "Enhanced clarity and user understanding through smarter component design.", bg: "linear-gradient(135deg,#d1fae5,#a7f3d0)", accent: "#6ee7b7" },
  { title: "Campaign Wizard", desc: "Guided input flow to deliver hyper-relevant talent recommendations.", bg: "linear-gradient(135deg,#ede9fe,#ddd6fe)", accent: "#d8b4fe" },
  { title: "HYER App Concept", desc: "Content-led design focused on safety, with clear, purposeful messaging at every touchpoint.", bg: "linear-gradient(135deg,#1e293b,#334155)", dark: true },
  { title: "Smart TV Concept for Hilton", desc: "Intuitive content navigation and clear info architecture tailored for short-stay guests.", bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)", accent: "#6ee7b7" },
  { title: "Feature Drop: Dark Mode", desc: "Token coverage achieved and Dark Mode launched in Companion.", bg: "linear-gradient(135deg,#1e293b,#0f172a)", dark: true, accent: "#a78bfa" },
  { title: "Airlines HUD Concept Pitch", desc: "Designed within system constraints, delivering visual delight through thoughtful UI choices. Business won.", bg: "linear-gradient(135deg,#fef9c3,#fef08a)", accent: "#fbbf24" },
]

function OtherWorkPage() {
  return (
    <div className="container">
      <section className="other-hero fade-up">
        <h1>Client work beyond the case studies</h1>
        <p>A selection of UX projects that weren't included in full case studies, showcasing my experience designing for web, desktop SaaS, mobile applications, and airplane HMI systems.</p>
      </section>

      <div className="work-grid fade-up-delay-1">
        {workTiles.map((tile) => (
          <div className="work-tile" key={tile.title}>
            <div className="work-tile-img" style={tile.bg ? { background: tile.bg } : undefined}>
              <div className="work-tile-inner" style={tile.dark ? { background: "#1e293b" } : undefined}>
                <div className="tile-bar" style={tile.dark ? { background: "#334155", borderColor: "#475569" } : undefined} />
                <div className="tile-content">
                  <div className="tile-line m" style={tile.accent ? { background: tile.accent } : tile.dark ? { background: "#475569" } : undefined} />
                  <div className="tile-line l" style={tile.dark ? { background: "#3b82f6" } : undefined} />
                  <div className="tile-line s" style={tile.accent ? { background: tile.accent } : tile.dark ? { background: "#475569" } : undefined} />
                  <div className="tile-line m" style={tile.dark ? { background: "#475569" } : undefined} />
                </div>
              </div>
            </div>
            <div className="work-tile-label">
              <h3>{tile.title}</h3>
              <p>{tile.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <CTA />
    </div>
  )
}

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false)
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 2500)
    const doneTimer = setTimeout(() => onDone(), 3800)
    return () => { clearTimeout(fadeTimer); clearTimeout(doneTimer) }
  }, [onDone])
  return (
    <div className={`splash${fading ? " splash--fade" : ""}`}>
      <div className="splash-logo">
        <Lottie animationData={logoSplashAnimation} loop={false} autoplay />
      </div>
    </div>
  )
}

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark")
  const [showSplash, setShowSplash] = useState(() => !sessionStorage.getItem("splashSeen"))

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light")
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }, [isDark])

  const toggleDark = (e: React.MouseEvent) => {
    const x = e.clientX
    const y = e.clientY
    const root = document.documentElement
    root.style.setProperty("--toggle-x", `${x}px`)
    root.style.setProperty("--toggle-y", `${y}px`)

    if (!("startViewTransition" in document)) {
      root.classList.add("theme-transitioning")
      setIsDark(d => !d)
      setTimeout(() => root.classList.remove("theme-transitioning"), 600)
      return
    }

    ;(document as any).startViewTransition(() => {
      flushSync(() => setIsDark(d => !d))
    })
  }

  const handleSplashDone = React.useCallback(() => {
    sessionStorage.setItem("splashSeen", "1")
    setShowSplash(false)
  }, [])

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <Routes>
        {/* Project detail pages — full-page layout with own nav */}
        <Route
          path="/work/:slug"
          element={<ProjectDetail isDark={isDark} toggleDark={toggleDark} />}
        />

        {/* Main portfolio pages */}
        <Route
          path="*"
          element={
            <>
              <Nav page={page} setPage={setPage} isDark={isDark} toggleDark={toggleDark} />
              {page === "home" && <HomePage onOtherWork={() => setPage("other-work")} />}
              {page === "about" && <AboutPage />}
              {page === "other-work" && <OtherWorkPage />}
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  )
}
