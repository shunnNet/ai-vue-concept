// Configure Vitest (https://vitest.dev/config/)
/// <reference types="vitest" />
import { configDefaults } from "vitest/config"

import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  plugins: [
    vue(),
    dts({ rollupTypes: true }),
    // msw({ handlers, mode: "browser" }),
  ],
  test: {
    environment: "happy-dom",
    exclude: [...configDefaults.exclude, "**/src/experimental/**"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/pacakge/index.ts"),
      name: "llm",
      fileName: "index",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
      },
    },
  },
})
