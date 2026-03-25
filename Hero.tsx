import { addPropertyControls, ControlType } from "framer"

// ── Inline SVG logos ──────────────────────────────────────────────────────────

const FigmaIcon = () => (
    <svg viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" width="22" height="32">
        <path d="M19 28.5A9.5 9.5 0 1 1 28.5 19H19v9.5Z" fill="#1ABCFE"/>
        <path d="M9.5 47.5a9.5 9.5 0 0 1 9.5-9.5v9.5a9.5 9.5 0 0 1-9.5 9.5 9.5 9.5 0 0 1 0-19Z" fill="#0ACF83"/>
        <path d="M9.5 9.5A9.5 9.5 0 0 1 19 0v19H9.5A9.5 9.5 0 0 1 0 9.5 9.5 9.5 0 0 1 9.5 0Z" fill="#FF7262"/>
        <path d="M9.5 28.5A9.5 9.5 0 0 1 19 19v19H9.5A9.5 9.5 0 0 1 0 28.5Z" fill="#F24E1E"/>
        <path d="M28.5 19a9.5 9.5 0 1 1 0 19A9.5 9.5 0 0 1 19 28.5V19h9.5Z" fill="#A259FF"/>
    </svg>
)

const NotionIcon = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
        <rect width="100" height="100" rx="16" fill="#fff"/>
        <path d="M22 18.6c3.1 2.5 4.3 2.3 10.2 1.9l55.5-3.3c1.2 0 .2-1.2-.2-1.4L80 10.5c-1.9-1.5-4.5-3.1-9.4-2.7L17.1 11.5c-2 .2-2.4 1.2-1.6 2l6.5 5.1Zm2.7 10.5V96c0 3.1 1.6 4.3 5.1 4.1l61-3.5c3.5-.2 3.9-2.3 3.9-4.9V26.6c0-2.5-.9-3.9-3.1-3.7l-63.8 3.7c-2.4.1-3.1 1.4-3.1 2.5Zm58.5 2.5c.4 1.8 0 3.5-1.8 3.7l-3.1.6v45.4c-2.7 1.4-5.1 2.2-7.2 2.2-3.3 0-4.1-1-6.6-4.1L46.8 54v29.8l6.2 1.4s0 3.5-4.9 3.5L35.8 90c-.4-1-.2-3.3 1.4-3.7l3.7-1V44l-5.1-.4c-.4-1.8.6-4.5 3.5-4.7l12.3-.8 19 29.1V40.2l-5.1-.6c-.4-2.2 1.2-3.7 3.1-3.9l13.3-.8.2.7Z" fill="#37352F"/>
    </svg>
)

const AdobeIcon = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <rect width="100" height="100" rx="16" fill="#FF0000"/>
        <path d="M38 20 L16 80 H30 L35 65 H52 L57 80 H71 L49 20 Z M38 53 L43.5 36 L49 53 Z" fill="#fff"/>
        <path d="M63 32 V80 H76 V59 C76 59 84 60 84 45 C84 32 76 32 63 32 Z M76 47 C76 53 72 53 72 53 V43 C72 43 76 42 76 47 Z" fill="#fff"/>
    </svg>
)

const FramerIcon = () => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <rect width="100" height="100" rx="16" fill="#0A0A0A"/>
        <path d="M20 15 H80 L50 50 H80 L20 85 V50 H50 Z" fill="#fff"/>
    </svg>
)

// Claude Code little walking character
const ClaudeCodeCharacter = () => (
    <svg
        width="36" height="46"
        viewBox="0 0 36 46"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
    >
        {/* Antenna */}
        <line x1="18" y1="0" x2="18" y2="5" stroke="#CC785C" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="18" cy="0" r="2.5" fill="#CC785C"/>

        {/* Body */}
        <rect x="1" y="5" width="34" height="26" rx="7" fill="#CC785C"/>

        {/* Screen */}
        <rect x="5" y="9" width="26" height="17" rx="3" fill="#1C1C1C"/>

        {/* > _ prompt */}
        <text
            x="8" y="21"
            fill="#39FF14"
            fontFamily="'Courier New', monospace"
            fontSize="9"
            fontWeight="bold"
        >{"> _"}</text>

        {/* Left leg */}
        <rect
            className="cc-leg-l"
            x="7" y="31" width="8" height="11" rx="4"
            fill="#CC785C"
            style={{ transformBox: "fill-box", transformOrigin: "center top" }}
        />

        {/* Right leg */}
        <rect
            className="cc-leg-r"
            x="21" y="31" width="8" height="11" rx="4"
            fill="#CC785C"
            style={{ transformBox: "fill-box", transformOrigin: "center top" }}
        />

        {/* Eyes */}
        <circle cx="12" cy="15" r="2" fill="#FAF0E6" opacity="0.9"/>
        <circle cx="24" cy="15" r="2" fill="#FAF0E6" opacity="0.9"/>

        {/* Tiny pupils */}
        <circle cx="12.5" cy="15.5" r="0.9" fill="#1C1C1C"/>
        <circle cx="24.5" cy="15.5" r="0.9" fill="#1C1C1C"/>
    </svg>
)

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
    name: string
    role: string
    tagline: string
    ctaLabel: string
    ctaUrl: string
    backgroundColor: string
    textColor: string
    accentColor: string
}

// ── Logo pill ─────────────────────────────────────────────────────────────────

function LogoPill({
    icon,
    label,
    textColor,
}: {
    icon: React.ReactNode
    label: string
    textColor: string
}) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 16px 8px 12px",
                borderRadius: 100,
                border: `1.5px solid ${textColor}18`,
                backgroundColor: `${textColor}08`,
            }}
        >
            {icon}
            <span
                style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: textColor,
                    opacity: 0.7,
                    whiteSpace: "nowrap",
                }}
            >
                {label}
            </span>
        </div>
    )
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Hero({
    name,
    role,
    tagline,
    ctaLabel,
    ctaUrl,
    backgroundColor,
    textColor,
    accentColor,
}: Props) {
    const animId = "claude-walk-in"

    return (
        <section
            style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "80px 40px",
                boxSizing: "border-box",
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
                overflow: "hidden",
            }}
        >
            {/* Keyframes */}
            <style>{`
                @keyframes ${animId} {
                    0%   { transform: translateX(220px) translateY(0px);   opacity: 0; }
                    8%   { opacity: 1; }
                    20%  { transform: translateX(154px) translateY(-9px);  }
                    35%  { transform: translateX(88px)  translateY(0px);   }
                    50%  { transform: translateX(44px)  translateY(-7px);  }
                    65%  { transform: translateX(12px)  translateY(0px);   }
                    75%  { transform: translateX(0px)   translateY(-4px);  }
                    85%  { transform: translateX(0px)   translateY(0px);   }
                    91%  { transform: translateX(0px)   translateY(-2px);  }
                    100% { transform: translateX(0px)   translateY(0px);   }
                }
                @keyframes claude-settle-glow {
                    0%   { box-shadow: 0 0 0px 0px ${accentColor}00; }
                    50%  { box-shadow: 0 0 18px 4px ${accentColor}55; }
                    100% { box-shadow: 0 0 0px 0px ${accentColor}00; }
                }
                /* Leg stepping — left leg swings forward first */
                @keyframes cc-leg-l {
                    0%,100% { transform: rotate(0deg); }
                    25%     { transform: rotate(-22deg); }
                    75%     { transform: rotate(22deg); }
                }
                @keyframes cc-leg-r {
                    0%,100% { transform: rotate(0deg); }
                    25%     { transform: rotate(22deg); }
                    75%     { transform: rotate(-22deg); }
                }
                .cc-leg-l {
                    animation: cc-leg-l 0.32s ease-in-out 0.65s 5 both;
                }
                .cc-leg-r {
                    animation: cc-leg-r 0.32s ease-in-out 0.65s 5 both;
                }
            `}</style>

            <div style={{ maxWidth: 780, width: "100%" }}>
                {/* Role label */}
                <p
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: accentColor,
                        margin: "0 0 20px",
                    }}
                >
                    {role}
                </p>

                {/* Name */}
                <h1
                    style={{
                        fontSize: "clamp(48px, 8vw, 96px)",
                        fontWeight: 700,
                        lineHeight: 1.05,
                        color: textColor,
                        margin: "0 0 28px",
                        letterSpacing: "-0.03em",
                    }}
                >
                    {name}
                </h1>

                {/* Tagline */}
                <p
                    style={{
                        fontSize: "clamp(17px, 2.2vw, 22px)",
                        fontWeight: 400,
                        lineHeight: 1.55,
                        color: textColor,
                        opacity: 0.6,
                        margin: "0 0 44px",
                        maxWidth: 520,
                    }}
                >
                    {tagline}
                </p>

                {/* CTA */}
                <a
                    href={ctaUrl}
                    style={{
                        display: "inline-block",
                        padding: "13px 30px",
                        backgroundColor: accentColor,
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: 15,
                        textDecoration: "none",
                        borderRadius: 6,
                        letterSpacing: "0.02em",
                        marginBottom: 64,
                    }}
                >
                    {ctaLabel}
                </a>

                {/* ── Logo strip ────────────────────────────────────────── */}
                <div>
                    <p
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: textColor,
                            opacity: 0.35,
                            margin: "0 0 14px",
                        }}
                    >
                        Tools I use
                    </p>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 10,
                        }}
                    >
                        <LogoPill icon={<FigmaIcon />} label="Figma" textColor={textColor} />
                        <LogoPill icon={<NotionIcon />} label="Notion" textColor={textColor} />
                        <LogoPill icon={<AdobeIcon />} label="Adobe CC" textColor={textColor} />
                        <LogoPill icon={<FramerIcon />} label="Framer" textColor={textColor} />

                        {/* Claude walks in */}
                        <div
                            style={{
                                animation: `${animId} 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s both`,
                            }}
                        >
                            <div
                                style={{
                                    animation: `claude-settle-glow 1s ease-out 2.5s both`,
                                    borderRadius: 100,
                                }}
                            >
                                <LogoPill
                                    icon={<ClaudeCodeCharacter />}
                                    label="Claude Code"
                                    textColor={textColor}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

Hero.defaultProps = {
    name: "Your Name",
    role: "Product Designer",
    tagline:
        "I craft thoughtful digital experiences that connect people with the products they love.",
    ctaLabel: "View My Work",
    ctaUrl: "#projects",
    backgroundColor: "#F9F8F6",
    textColor: "#111111",
    accentColor: "#5B4EFF",
}

addPropertyControls(Hero, {
    name: { type: ControlType.String, title: "Name" },
    role: { type: ControlType.String, title: "Role / Title" },
    tagline: {
        type: ControlType.String,
        title: "Tagline",
        displayTextArea: true,
    },
    ctaLabel: { type: ControlType.String, title: "CTA Label" },
    ctaUrl: { type: ControlType.String, title: "CTA URL" },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#F9F8F6",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#111111",
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#5B4EFF",
    },
})
