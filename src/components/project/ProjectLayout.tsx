import React from "react"

interface ProjectLayoutProps {
  children: React.ReactNode
}

export default function ProjectLayout({ children }: ProjectLayoutProps) {
  return (
    <div className="pl-wrapper">
      <main className="pl-content">{children}</main>
    </div>
  )
}
