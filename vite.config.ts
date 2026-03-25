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
        },
        dedupe: ["react", "react-dom"],
    },
    server: {
        port: 5173,
    },
})
