import { addPropertyControls, ControlType } from "framer"

interface Props {
    heading: string
    bio: string
    image: string
    imageAlt: string
    accentColor: string
    backgroundColor: string
    textColor: string
}

export default function About({
    heading,
    bio,
    image,
    imageAlt,
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
            <div
                style={{
                    maxWidth: 1040,
                    margin: "0 auto",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 80,
                    alignItems: "center",
                }}
            >
                {/* Photo */}
                <div
                    style={{
                        aspectRatio: "4 / 5",
                        borderRadius: 12,
                        overflow: "hidden",
                        backgroundColor: "#E8E6E1",
                    }}
                >
                    {image ? (
                        <img
                            src={image}
                            alt={imageAlt}
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
                                color: "#999",
                                fontSize: 14,
                            }}
                        >
                            Your Photo
                        </div>
                    )}
                </div>

                {/* Text */}
                <div>
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
                        About
                    </p>
                    <h2
                        style={{
                            fontSize: "clamp(28px, 4vw, 44px)",
                            fontWeight: 700,
                            lineHeight: 1.15,
                            color: textColor,
                            margin: "0 0 28px",
                            letterSpacing: "-0.025em",
                        }}
                    >
                        {heading}
                    </h2>
                    <div
                        style={{
                            width: 40,
                            height: 3,
                            backgroundColor: accentColor,
                            borderRadius: 2,
                            marginBottom: 28,
                        }}
                    />
                    <p
                        style={{
                            fontSize: 17,
                            lineHeight: 1.75,
                            color: textColor,
                            opacity: 0.7,
                            margin: 0,
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {bio}
                    </p>
                </div>
            </div>
        </section>
    )
}

About.defaultProps = {
    heading: "Designing with intention.",
    bio: "I'm a product designer with a passion for creating clean, meaningful experiences. With a background in visual design and user research, I bridge the gap between aesthetics and function.\n\nWhen I'm not designing, you'll find me exploring type specimens, visiting galleries, or hunting for the perfect flat white.",
    image: "",
    imageAlt: "Portrait photo",
    accentColor: "#5B4EFF",
    backgroundColor: "#FFFFFF",
    textColor: "#111111",
}

addPropertyControls(About, {
    heading: { type: ControlType.String, title: "Heading" },
    bio: {
        type: ControlType.String,
        title: "Bio",
        displayTextArea: true,
    },
    image: {
        type: ControlType.Image,
        title: "Photo",
    },
    imageAlt: { type: ControlType.String, title: "Photo Alt Text" },
    accentColor: {
        type: ControlType.Color,
        title: "Accent Color",
        defaultValue: "#5B4EFF",
    },
    backgroundColor: {
        type: ControlType.Color,
        title: "Background",
        defaultValue: "#FFFFFF",
    },
    textColor: {
        type: ControlType.Color,
        title: "Text Color",
        defaultValue: "#111111",
    },
})
