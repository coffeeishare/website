import type { FilterableProject, EvidenceItem } from '../types/filter'
import type { SkillKey } from './skills-taxonomy'

// Raw frontmatter shape from MDX files — mirrors the schema in CLAUDE.md
interface MDXFrontmatter {
  title?: string
  client?: string
  summary?: string
  year?: string
  coverImage?: string
  pullQuote?: string
  skills?: SkillKey[]
  evidence?: EvidenceItem[]
  draft?: boolean
  order?: number
}

// Import only frontmatter from each MDX file — no component code loaded
const mdxModules = import.meta.glob<MDXFrontmatter>(
  '../../content/projects/*.mdx',
  { import: 'frontmatter' }
)

function slugFromPath(path: string): string {
  return path.split('/').pop()?.replace('.mdx', '') ?? ''
}

function pullQuoteToEvidence(text: string, skills: SkillKey[]): EvidenceItem[] {
  // One evidence item per skill so the quote surfaces under any active filter
  return skills.map(skill => ({
    type: 'quote' as const,
    skill,
    text,
  }))
}

export async function parseAllMDXProjects(): Promise<FilterableProject[]> {
  const entries = Object.entries(mdxModules)

  const settled = await Promise.all(
    entries.map(async ([path, loader]) => ({ path, fm: await loader() }))
  )

  const projects = settled
    .filter(({ fm }) => !fm.draft)
    .map(({ path, fm }) => {

      const slug = slugFromPath(path)
      const skills: SkillKey[] = fm.skills ?? []
      const frontmatterEvidence: EvidenceItem[] = fm.evidence ?? []

      const pullQuoteItems = fm.pullQuote
        ? pullQuoteToEvidence(fm.pullQuote, skills)
        : []

      return {
        slug,
        title: fm.title ?? slug,
        client: fm.client,
        year: fm.year,
        order: fm.order,
        coverImage: fm.coverImage,
        summary: fm.summary,
        skills,
        // frontmatter evidence first, then auto-derived pullQuote entries
        evidence: [...frontmatterEvidence, ...pullQuoteItems],
      } satisfies FilterableProject
    })

  // Newest first; within same year use explicit order, then slug
  return projects.sort((a, b) => {
    if (a.year && b.year && a.year !== b.year) return b.year.localeCompare(a.year)
    if (a.year && !b.year) return -1
    if (!a.year && b.year) return 1
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return a.slug.localeCompare(b.slug)
  })
}
