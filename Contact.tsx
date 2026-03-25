import { addPropertyControls, ControlType } from "framer"

interface Props {
    heading: string
    subtext: string
    email: string
    linkedinUrl: string
    dribbbleUrl: string
    githubUrl: string
    accentColor: string
    backgroundColor: string
    textColor: string
}

function SocialLink({
    href,
    label,
    accentColor,
}: {
    href: string
    label: string
    accentColor: string
}) {
    if (!href) return null
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 15,
                fontWeight: 500,
                color: accentColor,
                textDecoration: "none",
                borderBottom: `1px solid ${accentColor}`,
                paddingBottom: 2,
            }}
        >
            {label} →
        </a>
    )
}

export default function Contact({
    heading,
    subtext,
    email,
    linkedinUrl,
    dribbbleUrl,
    githubUrl,
    accentColor,
    backgroundColor,
    textColor,
}: Props) {
    return (
        <section
            style={{
                width: "100%",
                backgroundColor,
                padding: "100px 40px",
                boxSizing: "border-box",
                fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
            }}
        >
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
                <p
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: accentColor,
                        margin: "0 0 16px",
                    }}
                >
                    Contact
                </p>
                <h2
                    style={{
                        fontSize: "clamp(28px, 4vw, 48px)",
                        fontWeight: 700,
                        lineHeight: 1.15,
                        color: textColor,
                        margin: "0 0 20px",
                        letterSpacing: "-0.025em",
                    }}
                >
                    {heading}
                </h2>
                <p
                    style={{
                        fontSize: 18,
                        lineHeight: 1.7,
                        color: textColor,
                        opacity: 0.65,
                        margin: "0 0 48px",
                    }}
                >
                    {subtext}
                </p>

                {/* Email CTA */}
                {email && (
                    <a
                        href={`mailto:${email}`}
                        style={{
                            display: "inline-block",
                            padding: "14px 32px",
                            backgroundColor: accentColor,
                            color: "#fff",
                            fontWeight: 600,
                            fontSize: 15,
                            textDecoration: "none",
                            borderRadius: 6,
                            letterSpacing: "0.02em",
                            marginBottom: 48,
                        }}
                    >
                        {email}
                    </a>
                )}

                {/* Social Links */}
                <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                    <SocialLink
                        href={linkedinUrl}
                        label="LinkedIn"
                        accentColor={accentColor}
                    />
                    <SocialLink
                        href={dribbbleUrl}
                        label="Dribbble"
                        accentColor={accentColor}
                    />
                    <SocialLink
                        href={githubUrl}
                        label="GitHub"
                        accentColor={accentColor}
                    />
                </div>
            </div>
        </section>
    )
}

Contact.defaultProps = {
    heading: "Let's work together.",
    subtext:
        "I'm currently open to new opportunities. Whether you have a project in mind or just want to say hello — my inbox is always open.",
    email: "hello@yourname.com",
    linkedinUrl: "",
    dribbbleUrl: "",
    githubUrl: "",
    accentColor: "#5B4EFF",
    backgroundColor: "#111111",
    textColor: "#FFFFFF",
}

addPropertyControls(Contact, {
    heading: { type: ControlType.String, title: "Heading" },
    subtext: {
        type: ControlType.String,
        title: "Subtext",
        displayTextArea: true,
    },
    email: { type: ControlType.String, title: "Email" },
    linkedinUrl: { type: ControlType.String, title: "LinkedIn URL" },
    dribbbleUrl: { type: ControlType.String, title: "Dribbble URL" },
    githubUrl: { type: ControlType.String, title: "GitHub URL" },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#5B4EFF",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#111111",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#FFFFFF",
    },
})
