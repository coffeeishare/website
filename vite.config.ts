import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Redirect `framer` imports to the local mock so components
            // render in plain React without the Framer canvas runtime.
            framer: path.resolve(__dirname, "src/framer-mock.ts"),
            // Force a single copy of React — the main repo's — so that the
            // locally-installed new packages (react-router-dom, contentful…)
            // don't pull in a second React instance from the worktree's
            // node_modules and trigger "invalid hook call" errors.
            react: path.resolve(__dirname, "../../../node_modules/react"),
            "react-dom": path.resolve(__dirname, "../../../node_modules/react-dom"),
        },
        dedupe: ["react", "react-dom"],
    },
    server: {
        port: 5173,
    },
})
