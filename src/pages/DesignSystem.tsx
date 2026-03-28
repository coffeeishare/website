import React, { useState, useEffect, useRef } from "react"

// ── Types ─────────────────────────────────────────────────────────────────
type MainSection = "foundation" | "components" | "motion" | "patterns"

type SectionDef = {
  id: MainSection
  label: string
  icon: React.ReactNode
  children: { id: string; label: string }[]
}

// ── Icons ─────────────────────────────────────────────────────────────────
const IconPalette = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
  </svg>
)

const IconLayers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
)

const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)

const IconGrid = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)

const IconSun = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
)

const IconMoon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

// ── Nav structure ─────────────────────────────────────────────────────────
const sections: SectionDef[] = [
  {
    id: "foundation",
    label: "Foundation",
    icon: <IconPalette />,
    children: [
      { id: "tokens",      label: "Tokens" },
      { id: "typography",  label: "Typography" },
      { id: "colors",      label: "Colors" },
      { id: "iconography", label: "Iconography" },
      { id: "spacing",     label: "Spacing" },
      { id: "containers",  label: "Containers" },
      { id: "dividers",    label: "Dividers" },
    ],
  },
  {
    id: "components",
    label: "Components",
    icon: <IconLayers />,
    children: [
      { id: "comp-buttons", label: "Buttons" },
      { id: "comp-tabs",    label: "Tabs" },
      { id: "comp-cards",   label: "Cards" },
      { id: "comp-avatar",  label: "Avatar pill" },
    ],
  },
  {
    id: "motion",
    label: "Motion",
    icon: <IconZap />,
    children: [
      { id: "motion-tokens", label: "Animation tokens" },
      { id: "motion-easing", label: "Easing curves" },
    ],
  },
  {
    id: "patterns",
    label: "Patterns",
    icon: <IconGrid />,
    children: [
      { id: "patterns-layout",      label: "Layout" },
      { id: "patterns-interaction", label: "Interaction" },
    ],
  },
]

// ── Data ──────────────────────────────────────────────────────────────────
const semanticTokens: { label: string; var: string; light: string; dark: string; lightText?: boolean }[] = [
  { label: "Background",       var: "--white",              light: "#ffffff",                dark: "#1E1E1E",               lightText: false },
  { label: "Foreground",       var: "--text-primary",       light: "#1a1a1a",                dark: "#f0ede8",               lightText: true  },
  { label: "Card",             var: "--bg-card",            light: "#f0f4f8",                dark: "#1e1d1b",               lightText: false },
  { label: "Muted",            var: "--off-white",          light: "#fafafa",                dark: "#1a1917",               lightText: false },
  { label: "Muted foreground", var: "--text-secondary",     light: "#6b7280",                dark: "#9c9892",               lightText: true  },
  { label: "Border",           var: "--border",             light: "#e5e7eb",                dark: "#2d2b28",               lightText: false },
  { label: "Accent",           var: "--accent-yellow",      light: "rgba(255,210,100,0.45)", dark: "rgba(255,210,100,0.2)", lightText: false },
  { label: "Secondary",        var: "--accent-blue-light",  light: "#dbeafe",                dark: "#272522",               lightText: false },
]

const typeScale = [
  { name: "Display",  size: "48px", weight: "600", font: "DM Sans", usage: "Hero headline" },
  { name: "H1",       size: "40px", weight: "600", font: "DM Sans", usage: "Page title" },
  { name: "H2",       size: "28px", weight: "600", font: "DM Sans", usage: "Section heading" },
  { name: "H3",       size: "20px", weight: "600", font: "DM Sans", usage: "Card title" },
  { name: "Body L",   size: "18px", weight: "400", font: "DM Sans", usage: "Large body copy" },
  { name: "Body",     size: "16px", weight: "400", font: "DM Sans", usage: "Default body copy" },
  { name: "Body S",   size: "14px", weight: "400", font: "DM Sans", usage: "Nav links, captions" },
  { name: "Label",    size: "12px", weight: "500", font: "DM Sans", usage: "Badges, metadata" },
  { name: "Mono",     size: "14px", weight: "400", font: "DM Mono", usage: "Code, timestamps" },
]

const spacingScale = [
  { value: "4px",   usage: "Icon gap, tight inner padding" },
  { value: "8px",   usage: "Chip gap" },
  { value: "12px",  usage: "Small element gap" },
  { value: "16px",  usage: "Mobile page padding" },
  { value: "24px",  usage: "Card padding, section gap" },
  { value: "32px",  usage: "Component stack gap" },
  { value: "40px",  usage: "Desktop page padding" },
  { value: "48px",  usage: "Section padding" },
  { value: "64px",  usage: "Nav height, large gaps" },
  { value: "80px",  usage: "Section vertical rhythm" },
  { value: "120px", usage: "Hero top padding" },
]

const radiiTokens = [
  { value: "6px",    label: "sm",   usage: "Badges, chips" },
  { value: "12px",   label: "md",   usage: "Cards, inputs" },
  { value: "16px",   label: "lg",   usage: "Project cards" },
  { value: "24px",   label: "xl",   usage: "CTA buttons" },
  { value: "9999px", label: "full", usage: "Avatar pill" },
]

const iconList = [
  { name: "Moon / Sun",    usage: "Dark mode toggle",  path: "M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" },
  { name: "LinkedIn",      usage: "Social link",       path: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { name: "Email",         usage: "Contact link",      path: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" },
  { name: "Resume",        usage: "Download CV",       path: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
  { name: "Arrow right",   usage: "Navigation / CTA",  path: "M5 12h14 M12 5l7 7-7 7" },
  { name: "External link", usage: "Open in new tab",   path: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6 M15 3h6v6 M10 14L21 3" },
]

const animations = [
  { name: "fadeUp",           duration: "0.7s",               easing: "cubic-bezier(0.16, 1, 0.3, 1)",    usage: "Section reveal on scroll" },
  { name: "fade-up-delay",    duration: "0.7s + 0.1–0.4s",    easing: "cubic-bezier(0.16, 1, 0.3, 1)",    usage: "Staggered hero elements" },
  { name: "Theme transition", duration: "0.6s",               easing: "ease",                              usage: "Dark/light mode via View Transition API" },
  { name: "Nav blur",         duration: "instant",            easing: "—",                                 usage: "Sticky nav backdrop-filter on scroll" },
  { name: "Lottie logo",      duration: "~0.8s",              easing: "Path-based",                        usage: "Logo animation on load / nav click" },
  { name: "Pill expand",      duration: "0.4s",               easing: "cubic-bezier(0.34, 1.2, 0.64, 1)", usage: "Avatar pill hover expand" },
]

const TOKEN_CODE = `:root {
  /* Colour */
  --white:              #ffffff;
  --off-white:          #fafafa;
  --bg-card:            #f0f4f8;
  --text-primary:       #1a1a1a;
  --text-secondary:     #6b7280;
  --text-light:         #9ca3af;
  --accent-yellow:      rgba(255, 210, 100, 0.45);
  --accent-blue-light:  #dbeafe;
  --border:             #e5e7eb;

  /* Typography */
  --font-body: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;

  /* Layout */
  --max-width:   1400px;
  --nav-height:  64px;
}

[data-theme="dark"] {
  --white:              #1E1E1E;
  --off-white:          #1a1917;
  --bg-card:            #1e1d1b;
  --text-primary:       #f0ede8;
  --text-secondary:     #9c9892;
  --text-light:         #6b6864;
  --accent-yellow:      rgba(255, 210, 100, 0.2);
  --accent-blue-light:  #272522;
  --border:             #2d2b28;
}`

const tokenCategories = [
  { label: "COLORS",      desc: "Semantic backgrounds, text, border, accent",  count: 8  },
  { label: "TYPOGRAPHY",  desc: "Font families, sizes, weights, line height",   count: 9  },
  { label: "SPACING",     desc: "Consistent base-4 scale from 4px to 120px",   count: 11 },
  { label: "ANIMATION",   desc: "Easing functions, durations, stagger delays",  count: 6  },
  { label: "EFFECTS",     desc: "Border radius values, backdrop blur",           count: 5  },
  { label: "BREAKPOINTS", desc: "Responsive breakpoints for layout",            count: 4  },
]

// ── Shared primitives ─────────────────────────────────────────────────────
function TokenTag({ name }: { name: string }) {
  return <code className="ds-token-tag">{name}</code>
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="ds-section-header">
      <h2 className="ds-section-title">{title}</h2>
      {description && <p className="ds-section-desc">{description}</p>}
    </div>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <p className="ds-group-label">{children}</p>
}

// ── Foundation sub-sections ────────────────────────────────────────────────
function TokensSection({ isDark: _isDark }: { isDark: boolean }) {
  const [copied, setCopied] = React.useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(TOKEN_CODE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div>
      <SectionHeader
        title="Design Tokens"
        description="A single source of truth for all design decisions. These tokens power the entire system — from colours and typography to spacing and animation."
      />
      <div className="ds-token-table">
        {tokenCategories.map((cat, i) => (
          <div key={cat.label} className={`ds-token-table-row${i === tokenCategories.length - 1 ? " last" : ""}`}>
            <span className="ds-token-table-label">{cat.label}</span>
            <span className="ds-token-table-desc">{cat.desc}</span>
            <span className="ds-token-table-count">{cat.count}</span>
          </div>
        ))}
      </div>
      <div className="ds-code-header">
        <span className="ds-code-filename">tokens.css</span>
        <button className="ds-code-copy" onClick={handleCopy}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          {copied ? "COPIED!" : "COPY"}
        </button>
      </div>
      <pre className="ds-code-block"><code>{TOKEN_CODE}</code></pre>
    </div>
  )
}

function TypographySection() {
  return (
    <div>
      <SectionHeader
        title="Typography"
        description="Two typefaces form the type system — DM Sans for all UI text, and DM Mono for code and metadata."
      />
      <GroupLabel>Font families</GroupLabel>
      <div className="ds-font-grid">
        {[
          { family: "DM Sans", token: "--font-body", sample: "The quick brown fox", weight: "300–600", usage: "All UI text" },
          { family: "DM Mono", token: "monospace",   sample: "The quick brown fox", weight: "400",     usage: "Code, tabs, tags, metadata" },
        ].map((f) => (
          <div key={f.family} className="ds-font-card">
            <div className="ds-font-header">
              <span className="ds-font-name">{f.family}</span>
              <TokenTag name={f.token} />
            </div>
            <p className="ds-font-sample" style={{ fontFamily: f.family }}>{f.sample}</p>
            <span className="ds-font-detail">{f.weight} · {f.usage}</span>
          </div>
        ))}
      </div>
      <GroupLabel>Type scale</GroupLabel>
      <div className="ds-type-scale">
        {typeScale.map((s) => (
          <div key={s.name} className="ds-type-row">
            <div className="ds-type-meta">
              <span className="ds-type-name">{s.name}</span>
              <span className="ds-type-spec">{s.size} / {s.weight}</span>
            </div>
            <p
              className="ds-type-sample"
              style={{ fontFamily: s.font, fontSize: Math.min(parseInt(s.size), 34), fontWeight: parseInt(s.weight) }}
            >
              {s.font === "DM Mono" ? "design-system.tsx" : "The quick brown fox"}
            </p>
            <span className="ds-type-usage">{s.usage}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ColorsSection({ isDark }: { isDark: boolean }) {
  return (
    <div>
      <SectionHeader
        title="Colors"
        description="Semantic colour tokens that adapt between light and dark themes. Values shown reflect the active theme."
      />
      <div className="ds-swatch-grid">
        {semanticTokens.map((t) => {
          const value = isDark ? t.dark : t.light
          const needsDarkText = isDark ? t.lightText : !t.lightText
          return (
            <div key={t.var} className="ds-swatch-tile">
              <div
                className="ds-swatch-block"
                style={{
                  background: value,
                  color: needsDarkText ? "#1a1a1a" : "#f0ede8",
                }}
              >
                <span className="ds-swatch-hex">{value}</span>
              </div>
              <div className="ds-swatch-info">
                <span className="ds-swatch-label">{t.label}</span>
                <TokenTag name={t.var} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function IconographySection() {
  return (
    <div>
      <SectionHeader
        title="Iconography"
        description="All icons are inline SVGs at 18×18px, using currentColor for theming. Stroke weight: 1.6–2px."
      />
      <GroupLabel>Icon set</GroupLabel>
      <div className="ds-icon-grid">
        {iconList.map((icon) => (
          <div key={icon.name} className="ds-icon-card">
            <div className="ds-icon-preview">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={icon.path} />
              </svg>
            </div>
            <span className="ds-icon-name">{icon.name}</span>
            <span className="ds-icon-usage">{icon.usage}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpacingSection() {
  return (
    <div>
      <SectionHeader
        title="Spacing"
        description="A base-4 scale. Values are used directly as pixel values in CSS — no tokenised spacing variables yet."
      />
      <GroupLabel>Spacing scale</GroupLabel>
      <div className="ds-spacing-list">
        {spacingScale.map((s) => {
          const px = parseInt(s.value)
          return (
            <div key={s.value} className="ds-spacing-row">
              <code className="ds-spacing-value">{s.value}</code>
              <div className="ds-spacing-bar-track">
                <div className="ds-spacing-bar" style={{ width: Math.min(px * 1.8, 320) }} />
              </div>
              <span className="ds-spacing-usage">{s.usage}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ContainersSection() {
  return (
    <div>
      <SectionHeader
        title="Containers"
        description="Max-width constraints and border radius values used across all layout containers."
      />
      <GroupLabel>Layout tokens</GroupLabel>
      <div className="ds-token-list" style={{ marginBottom: 40 }}>
        {[
          { name: "--max-width",  value: "1400px", label: "Global max container width" },
          { name: "--nav-height", value: "64px",   label: "Sticky nav height" },
        ].map((t) => (
          <div key={t.name} className="ds-token-row">
            <div className="ds-token-swatches">
              <div className="ds-swatch" style={{ background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 8, color: "var(--text-secondary)" }}>{t.value}</span>
              </div>
            </div>
            <div className="ds-token-info">
              <TokenTag name={t.name} />
              <span className="ds-token-label">{t.label}</span>
            </div>
            <div className="ds-token-values">
              <span className="ds-token-hex">{t.value}</span>
            </div>
          </div>
        ))}
      </div>
      <GroupLabel>Border radius</GroupLabel>
      <div className="ds-radius-grid">
        {radiiTokens.map((r) => (
          <div key={r.value} className="ds-radius-card">
            <div className="ds-radius-preview" style={{ borderRadius: r.value === "9999px" ? "9999px" : r.value }} />
            <span className="ds-radius-label">{r.label}</span>
            <span className="ds-radius-value">{r.value}</span>
            <span className="ds-radius-usage">{r.usage}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DividersSection() {
  return (
    <div>
      <SectionHeader
        title="Dividers"
        description="Border styles used for separating sections, cards, and navigation elements."
      />
      <GroupLabel>Border styles</GroupLabel>
      <div className="ds-divider-list">
        {[
          { label: "Default border",   style: "1px solid var(--border)",       value: "1px solid --border" },
          { label: "Nav bottom",       style: "1px solid var(--border)",       value: "1px solid --border" },
          { label: "Card border",      style: "1px solid var(--border)",       value: "1px solid --border" },
          { label: "Section rule",     style: "1px solid var(--border)",       value: "1px solid --border" },
          { label: "Active left rule", style: "2px solid var(--text-primary)", value: "2px solid --text-primary" },
        ].map((d) => (
          <div key={d.label} className="ds-divider-row">
            <div className="ds-divider-preview">
              <div style={{ width: "100%", borderBottom: d.style }} />
            </div>
            <span className="ds-divider-label">{d.label}</span>
            <code className="ds-divider-value">{d.value}</code>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Components sub-sections ────────────────────────────────────────────────
function ComponentsContent() {
  return (
    <div>
      <section id="comp-buttons" className="ds-sub-section">
        <SectionHeader title="Buttons" description="Core interactive elements. Three variants cover the majority of use cases." />
        <div className="ds-component-canvas" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <button className="ds-btn-default">Default</button>
          <button className="ds-btn-cta">CTA / Primary</button>
          <button className="ds-btn-ghost">Ghost / Nav link</button>
          <span className="ds-btn-badge">Badge</span>
        </div>
      </section>

      <div className="ds-section-rule" />

      <section id="comp-tabs" className="ds-sub-section">
        <SectionHeader title="Tabs" description="Filter controls used in the work grid and project detail pages." />
        <div className="ds-component-canvas">
          <div style={{ display: "flex", gap: 4 }}>
            {["All work", "Product", "Brand", "Web"].map((tab, i) => (
              <button key={tab} className={`ds-tab-btn${i === 0 ? " active" : ""}`}>{tab}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="ds-section-rule" />

      <section id="comp-cards" className="ds-sub-section">
        <SectionHeader title="Cards" description="Project card used in the main grid. Hover reveals the arrow link." />
        <div className="ds-component-canvas">
          <div className="ds-project-card-preview">
            <div className="ds-card-image"><span>Cover image</span></div>
            <div className="ds-card-body">
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {["Product design", "2024"].map((tag) => (
                  <span key={tag} className="ds-card-tag">{tag}</span>
                ))}
              </div>
              <p className="ds-card-title">Project title</p>
              <p className="ds-card-desc">Short description of the project and the problem it solves for users.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="ds-section-rule" />

      <section id="comp-avatar" className="ds-sub-section">
        <SectionHeader title="Avatar pill" description="Expandable identity element in the navigation bar." />
        <div className="ds-component-canvas">
          <div className="ds-avatar-pill">
            <div className="ds-avatar-circle" />
            <span className="ds-avatar-name">Ula Ksiazkiewicz</span>
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Motion sub-sections ────────────────────────────────────────────────────
function MotionContent() {
  return (
    <div>
      <section id="motion-tokens" className="ds-sub-section">
        <SectionHeader title="Animation tokens" description="Animations and transitions that bring the portfolio to life. All motion respects prefers-reduced-motion." />
        <GroupLabel>Timing &amp; easing</GroupLabel>
        <div className="ds-motion-list">
          {animations.map((a) => (
            <div key={a.name} className="ds-motion-row">
              <div className="ds-motion-preview">
                <div className="ds-motion-dot" />
              </div>
              <div className="ds-motion-info">
                <span className="ds-motion-name">{a.name}</span>
                <span className="ds-motion-meta">{a.duration} · {a.easing}</span>
              </div>
              <span className="ds-motion-usage">{a.usage}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="ds-section-rule" />

      <section id="motion-easing" className="ds-sub-section">
        <SectionHeader title="Easing curves" description="Named easing values referenced across all transitions." />
        <div className="ds-easing-grid">
          {[
            { name: "Spring",   value: "cubic-bezier(0.34, 1.2, 0.64, 1)", desc: "Pill expand, playful bounce" },
            { name: "Smooth",   value: "cubic-bezier(0.16, 1, 0.3, 1)",    desc: "Scroll reveals, fade-ups" },
            { name: "Standard", value: "ease",                              desc: "Theme transitions" },
            { name: "Linear",   value: "0.2s",                             desc: "Colour / opacity hovers" },
          ].map((e) => (
            <div key={e.name} className="ds-easing-card">
              <span className="ds-easing-name">{e.name}</span>
              <code className="ds-easing-value">{e.value}</code>
              <span className="ds-easing-desc">{e.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── Patterns sub-sections ──────────────────────────────────────────────────
const layoutPatterns = [
  { name: "Sticky nav",      desc: "Nav stays fixed at top with a frosted glass backdrop (backdrop-filter: blur(12px))." },
  { name: "Full-bleed hero", desc: "Hero section spans the full viewport width with a centred content column." },
  { name: "Card grid",       desc: "2-column responsive grid for project cards, collapsing to 1 column at 900px." },
  { name: "Logo carousel",   desc: "Infinite horizontal scroll of client logos, paused on hover." },
]

const interactionPatterns = [
  { name: "Dark mode toggle", desc: "View Transition API radial reveal from the click point, with a fallback class-based transition." },
  { name: "Scroll reveal",    desc: "Elements fade + slide up into view using IntersectionObserver and the .reveal / .revealed class pair." },
  { name: "Splash screen",    desc: "Full-viewport Lottie animation shown once per session via sessionStorage." },
]

function PatternsContent() {
  return (
    <div>
      <section id="patterns-layout" className="ds-sub-section">
        <SectionHeader title="Layout" description="Recurring structural layout patterns used across all pages." />
        <div className="ds-pattern-list">
          {layoutPatterns.map((p) => (
            <div key={p.name} className="ds-pattern-row">
              <span className="ds-pattern-name">{p.name}</span>
              <p className="ds-pattern-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="ds-section-rule" />

      <section id="patterns-interaction" className="ds-sub-section">
        <SectionHeader title="Interaction" description="Behaviour and animation patterns for UI interactions." />
        <div className="ds-pattern-list">
          {interactionPatterns.map((p) => (
            <div key={p.name} className="ds-pattern-row">
              <span className="ds-pattern-name">{p.name}</span>
              <p className="ds-pattern-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ── Foundation wrapper ─────────────────────────────────────────────────────
function FoundationContent({ isDark }: { isDark: boolean }) {
  return (
    <div>
      <section id="tokens" className="ds-sub-section">
        <TokensSection isDark={isDark} />
      </section>
      <div className="ds-section-rule" />
      <section id="typography" className="ds-sub-section">
        <TypographySection />
      </section>
      <div className="ds-section-rule" />
      <section id="colors" className="ds-sub-section">
        <ColorsSection isDark={isDark} />
      </section>
      <div className="ds-section-rule" />
      <section id="iconography" className="ds-sub-section">
        <IconographySection />
      </section>
      <div className="ds-section-rule" />
      <section id="spacing" className="ds-sub-section">
        <SpacingSection />
      </section>
      <div className="ds-section-rule" />
      <section id="containers" className="ds-sub-section">
        <ContainersSection />
      </section>
      <div className="ds-section-rule" />
      <section id="dividers" className="ds-sub-section">
        <DividersSection />
      </section>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export default function DesignSystemPage({
  isDark,
  toggleDark,
}: {
  isDark: boolean
  toggleDark: (e: React.MouseEvent) => void
}) {
  const [activeSection, setActiveSection] = useState<MainSection>("foundation")
  const [activeChild, setActiveChild] = useState<string>("tokens")
  const contentRef = useRef<HTMLElement>(null)
  const isScrollingToRef = useRef(false)

  // Scrollspy: track which sub-section is in view
  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingToRef.current) return
        // Pick the topmost visible section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length > 0) setActiveChild(visible[0].target.id)
      },
      { root: content, threshold: 0.25 }
    )

    content.querySelectorAll("section[id]").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [activeSection])

  const handleSectionClick = (section: SectionDef) => {
    if (activeSection === section.id) return
    setActiveSection(section.id)
    setActiveChild(section.children[0].id)
    if (contentRef.current) contentRef.current.scrollTop = 0
  }

  const handleChildClick = (childId: string) => {
    setActiveChild(childId)
    isScrollingToRef.current = true
    const el = document.getElementById(childId)
    el?.scrollIntoView({ behavior: "smooth" })
    setTimeout(() => { isScrollingToRef.current = false }, 800)
  }

  return (
    <div className="ds-page">
      {/* ── Sidebar ── */}
      <aside className="ds-sidebar">
        <div className="ds-sidebar-header">
          <p className="ds-sidebar-wordmark">Ula</p>
          <div className="ds-sidebar-meta">
            <span className="ds-sidebar-system-label">DESIGN SYSTEM</span>
            <button className="ds-sidebar-theme-badge" onClick={toggleDark} aria-label="Toggle theme">
              {isDark ? <IconMoon /> : <IconSun />}
              {isDark ? "DARK" : "LIGHT"}
            </button>
          </div>
        </div>

        <nav className="ds-sidebar-nav">
          {sections.map((section) => {
            const isOpen = activeSection === section.id
            return (
              <div key={section.id} className={`ds-nav-group${isOpen ? " open" : ""}`}>
                <button
                  className={`ds-nav-parent${isOpen ? " active" : ""}`}
                  onClick={() => handleSectionClick(section)}
                >
                  <span className="ds-nav-icon">{section.icon}</span>
                  {section.label}
                </button>
                {isOpen && (
                  <div className="ds-nav-children">
                    {section.children.map((child) => (
                      <button
                        key={child.id}
                        className={`ds-nav-child${activeChild === child.id ? " active" : ""}`}
                        onClick={() => handleChildClick(child.id)}
                      >
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* ── Content ── */}
      <main className="ds-content" ref={contentRef}>
        {activeSection === "foundation" && <FoundationContent isDark={isDark} />}
        {activeSection === "components" && <ComponentsContent />}
        {activeSection === "motion"     && <MotionContent />}
        {activeSection === "patterns"   && <PatternsContent />}
      </main>
    </div>
  )
}
