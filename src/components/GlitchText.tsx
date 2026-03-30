import { useState, useRef, useEffect } from "react"

const SCRAMBLE_CHARS = "!@#%&?<>[]{}=+~^*$"

const GLITCH_COLORS = [
  "#f9a8d4", // pink
  "#bae6fd", // sky blue
  "#bbf7d0", // mint
  "#ddd6fe", // lavender
  "#fed7aa", // peach
  "#fde68a", // yellow
]

function useGlitch(text: string) {
  const settled = text.split("").map(c => ({ char: c, settled: true, color: undefined as string | undefined }))
  const [chars, setChars] = useState(settled)
  const busyRef  = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function applyGlitch(density: number) {
    setChars(
      settled.map(({ char }) =>
        char !== " " && Math.random() < density
          ? {
              char:    SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
              settled: false,
              color:   GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)],
            }
          : { char, settled: true, color: undefined }
      )
    )
  }

  function trigger() {
    if (busyRef.current) return
    busyRef.current = true
    applyGlitch(0.75)
    timerRef.current = setTimeout(() => {
      setChars(settled)
      timerRef.current = setTimeout(() => {
        applyGlitch(0.35)
        timerRef.current = setTimeout(() => {
          setChars(settled)
          busyRef.current = false
        }, 120)
      }, 60)
    }, 140)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return { chars, trigger }
}

export function GlitchText({ text }: { text: string }) {
  const { chars, trigger } = useGlitch(text)
  return (
    <span onMouseEnter={trigger} style={{ display: "inline-block", position: "relative" }}>
      {/* Invisible text locks the button width */}
      <span style={{ visibility: "hidden" }}>{text}</span>
      {/* Animated chars sit on top without affecting layout */}
      <span style={{ position: "absolute", inset: 0 }}>
        {chars.map((c, i) => (
          <span key={i} className={c.settled ? undefined : "scramble-char"}
            style={c.color ? { color: c.color } : undefined}>
            {c.char}
          </span>
        ))}
      </span>
    </span>
  )
}
