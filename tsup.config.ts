import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    core: "src/core.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "jalaali-js"],
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
  onSuccess: async () => {
    const { copyFile } = await import("node:fs/promises");
    await copyFile("src/styles.css", "dist/styles.css");
  },
});
