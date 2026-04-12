import React from "react"

interface MetricGroupProps {
  children: React.ReactNode
}

export function MetricGroup({ children }: MetricGroupProps) {
  return <div className="mdx-metric-group">{children}</div>
}
