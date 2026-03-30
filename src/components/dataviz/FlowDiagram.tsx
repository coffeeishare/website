import React from "react"

interface FlowNode {
  id: string
  label: string
  type: "action" | "decision" | "outcome" | "start"
  x: number
  y: number
}

interface FlowEdge {
  from: string
  to: string
  label?: string
  color?: string
}

interface FlowDiagramProps {
  nodes: FlowNode[]
  edges: FlowEdge[]
}

// Mobile fallback: vertical list view
function FlowList({ nodes }: { nodes: FlowNode[] }) {
  return (
    <div className="fd-list">
      {nodes.map((node) => (
        <div key={node.id} className={`fd-list-item fd-list-item--${node.type}`}>
          {node.label}
        </div>
      ))}
    </div>
  )
}

export default function FlowDiagram({ nodes, edges }: FlowDiagramProps) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]))

  // Bounding box for SVG viewBox
  const NODE_W = 160
  const NODE_H = 48
  const padding = 40
  const xs = nodes.map((n) => n.x)
  const ys = nodes.map((n) => n.y)
  const minX = Math.min(...xs) - padding
  const minY = Math.min(...ys) - padding
  const maxX = Math.max(...xs) + NODE_W + padding
  const maxY = Math.max(...ys) + NODE_H + padding
  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`

  function edgeColor(color?: string) {
    if (color === "green") return "#22c55e"
    if (color === "red") return "#ef4444"
    return "var(--border)"
  }

  return (
    <div className="fd-wrapper">
      {/* Desktop: SVG diagram */}
      <div className="fd-diagram">
        <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg" className="fd-svg">
          {/* Edges */}
          {edges.map((edge, i) => {
            const from = nodeMap[edge.from]
            const to = nodeMap[edge.to]
            if (!from || !to) return null
            const x1 = from.x + NODE_W
            const y1 = from.y + NODE_H / 2
            const x2 = to.x
            const y2 = to.y + NODE_H / 2
            const mx = (x1 + x2) / 2
            const color = edgeColor(edge.color)
            return (
              <g key={i}>
                <path
                  d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="1.5"
                />
                {edge.label && (
                  <text
                    x={mx}
                    y={(y1 + y2) / 2 - 6}
                    textAnchor="middle"
                    fontSize="11"
                    fill={color}
                    fontFamily="var(--font-body)"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const isDecision = node.type === "decision"
            const cx = node.x + NODE_W / 2
            const cy = node.y + NODE_H / 2
            const hw = NODE_W / 2
            const hh = NODE_H / 2

            return (
              <g key={node.id}>
                {isDecision ? (
                  <polygon
                    points={`${cx},${cy - hh} ${cx + hw},${cy} ${cx},${cy + hh} ${cx - hw},${cy}`}
                    fill="var(--bg-card)"
                    stroke="var(--border)"
                    strokeWidth="1"
                  />
                ) : (
                  <rect
                    x={node.x}
                    y={node.y}
                    width={NODE_W}
                    height={NODE_H}
                    rx="8"
                    fill="var(--bg-card)"
                    stroke="var(--border)"
                    strokeWidth="1"
                  />
                )}
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fill="var(--text-primary)"
                  fontFamily="var(--font-body)"
                >
                  {node.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Mobile: list fallback */}
      <div className="fd-mobile">
        <FlowList nodes={nodes} />
      </div>
    </div>
  )
}
