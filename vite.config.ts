import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// @mdx-js/rollup and remark plugins are ESM-only — use dynamic imports
export default defineConfig(async () => {
    const mdx = (await import("@mdx-js/rollup")).default
    const remarkFrontmatter = (await import("remark-frontmatter")).default
    const remarkMdxFrontmatter = (await import("remark-mdx-frontmatter")).default

    return {
        plugins: [
            mdx({
                providerImportSource: "@mdx-js/react",
                remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
            }),
            react(),
        ],
        resolve: {
            alias: {
                // Redirect `framer` imports to the local mock so components
                // render in plain React without the Framer canvas runtime.
                framer: path.resolve(__dirname, "src/framer-mock.ts"),
            },
            dedupe: ["react", "react-dom"],
        },
        server: {
            port: 5173,
        },
    }
})
