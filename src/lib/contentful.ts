import { createClient } from "contentful"
import type { ProjectDetailEntry } from "../types/contentful"

// Lazily create the client so a missing .env.local doesn't crash the whole app.
// The client is only instantiated when one of the fetch functions is first called.
let _client: ReturnType<typeof createClient> | null = null

function getClient() {
  if (!_client) {
    const space = import.meta.env.VITE_CONTENTFUL_SPACE_ID as string
    const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN as string
    if (!space || !accessToken) {
      throw new Error(
        "Missing Contentful env vars. Copy .env.local.example → .env.local and fill in VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN."
      )
    }
    _client = createClient({ space, accessToken })
  }
  return _client
}

/**
 * Fetch a single project by its slug field.
 * Returns null if no matching entry is found.
 */
export async function getProjectBySlug(slug: string): Promise<ProjectDetailEntry | null> {
  const entries = await getClient().getEntries<any>({
    content_type: "projectDetail",
    "fields.slug": slug,
    include: 2,
    limit: 1,
  })
  return (entries.items[0] as ProjectDetailEntry) ?? null
}

/**
 * Fetch lightweight stubs of all projects — slug, title, client, heroImage.
 */
export async function getAllProjects(): Promise<ProjectDetailEntry[]> {
  const entries = await getClient().getEntries<any>({
    content_type: "projectDetail",
    select: ["fields.slug", "fields.title", "fields.client", "fields.introText", "fields.heroImage"],
    order: ["-sys.createdAt"],
  })
  return entries.items as ProjectDetailEntry[]
}
