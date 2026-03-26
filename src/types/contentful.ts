import type { Entry, Asset } from "contentful"

// ── Field shapes ────────────────────────────────────────────────────────────

export interface ProjectDetailFields {
  slug: string
  title: string
  client: string
  year?: string
  teamRoles?: string[]
  skills?: string[]
  heroImage?: Asset
  introText?: string
  pullQuote?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bodySections?: any // Contentful RichText document
  closingQuote?: string
  relatedProjects?: Entry<ProjectDetailFields>[]
}

// ── Full Contentful Entry ───────────────────────────────────────────────────

export type ProjectDetailEntry = Entry<ProjectDetailFields>
