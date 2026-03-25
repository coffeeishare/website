import { addPropertyControls, ControlType } from "framer"

interface Project {
    title: string
    description: string
    image: string
    url: string
    tag: string
}

interface Props {
    heading: string
    projects: Project[]
    accentColor: string
    backgroundColor: string
    textColor: string
    cardBackground: string
}

function ProjectCard({
    title,
    description,
    image,
    url,
    tag,
    accentColor,
    textColor,
    cardBackground,
}: Project & {
    accentColor: string
    textColor: string
    cardBackground: string
}) {
    return (
        <a
            href={url || "#"}
            style={{
                textDecoration: "none",
                display: "flex",
                flexDirection: "column",
                backgroundColor: cardBackground,
                borderRadius: 12,
                overflow: "hidden",
                transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(-4px)"
            }}
            onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.transform =
                    "translateY(0)"
            }}
        >
            {/* Image */}
            <div
                style={{
                    width: "100%",
                    aspectRatio: "16 / 10",
                    backgroundColor: "#E8E6E1",
                    overflow: "hidden",
                }}
            >
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#bbb",
                            fontSize: 13,
                        }}
                    >
                        Project Image
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: "24px 28px 28px" }}>
                {tag && (
                    <span
                        style={{
                            display: "inline-block",
                            fontSize: 11,
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: accentColor,
                            marginBottom: 10,
                        }}
                    >
                        {tag}
                    </span>
                )}
                <h3
                    style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: textColor,
                        margin: "0 0 10px",
                        letterSpacing: "-0.02em",
                    }}
                >
                    {title}
                </h3>
                <p
                    style={{
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: textColor,
                        opacity: 0.6,
                        margin: 0,
                    }}
                >
                    {description}
                </p>
            </div>
        </a>
    )
}

export default function Projects({
    heading,
    projects,
    accentColor,
    backgroundColor,
    textColor,
    cardBackground,
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
            <div style={{ maxWidth: 1040, margin: "0 auto" }}>
                {/* Header */}
                <div style={{ marginBottom: 56 }}>
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
                        Work
                    </p>
                    <h2
                        style={{
                            fontSize: "clamp(28px, 4vw, 44px)",
                            fontWeight: 700,
                            lineHeight: 1.15,
                            color: textColor,
                            margin: 0,
                            letterSpacing: "-0.025em",
                        }}
                    >
                        {heading}
                    </h2>
                </div>

                {/* Grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 28,
                    }}
                >
                    {projects.map((project, i) => (
                        <ProjectCard
                            key={i}
                            {...project}
                            accentColor={accentColor}
                            textColor={textColor}
                            cardBackground={cardBackground}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

Projects.defaultProps = {
    heading: "Selected Projects",
    accentColor: "#5B4EFF",
    backgroundColor: "#F9F8F6",
    textColor: "#111111",
    cardBackground: "#FFFFFF",
    projects: [
        {
            title: "Project One",
            description:
                "A brief description of this project and the problem it solves.",
            image: "",
            url: "#",
            tag: "UX Design",
        },
        {
            title: "Project Two",
            description:
                "A brief description of this project and the problem it solves.",
            image: "",
            url: "#",
            tag: "Visual Design",
        },
        {
            title: "Project Three",
            description:
                "A brief description of this project and the problem it solves.",
            image: "",
            url: "#",
            tag: "Product Design",
        },
    ],
}

addPropertyControls(Projects, {
    heading: { type: ControlType.String, title: "Section Heading" },
    projects: {
        type: ControlType.Array,
        title: "Projects",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                description: {
                    type: ControlType.String,
                    title: "Description",
                    displayTextArea: true,
                },
                image: { type: ControlType.Image, title: "Image" },
                url: { type: ControlType.String, title: "URL" },
                tag: { type: ControlType.String, title: "Tag / Category" },
            },
        },
        maxCount: 6,
    },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#5B4EFF",
    },
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
    cardBackground: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#FFFFFF",
    },
})
