declare module "*.mdx" {
  import type { ComponentType } from "react"
  const MDXComponent: ComponentType
  export const frontmatter: {
    title?: string
    summary?: string
    tags?: string[]
    year?: string
    coverImage?: string
    [key: string]: unknown
  }
  export default MDXComponent
}
