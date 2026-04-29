import { copyFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";

const dev = process.env.ROLLUP_WATCH;
const deployPath =
  process.env.HA_DEPLOY_PATH ||
  "/Volumes/config/www/community/room-control-card/room-control-card.js";
const shouldDeploy = process.env.DEPLOY === "1";

const deployPlugin = () => ({
  name: "deploy-to-ha",
  async writeBundle(_options, bundle) {
    const file = Object.keys(bundle).find((f) => f.endsWith(".js"));
    if (!file) return;
    const src = `dist/${file}`;
    try {
      await mkdir(dirname(deployPath), { recursive: true });
      await copyFile(src, deployPath);
      console.log(`[deploy] ${src} → ${deployPath}`);
    } catch (err) {
      console.error(`[deploy] failed: ${err.message}`);
    }
  },
});

export default {
  input: "src/room-control-card.ts",
  output: {
    file: "dist/room-control-card.js",
    format: "es",
    inlineDynamicImports: true,
  },
  plugins: [
    resolve(),
    typescript(),
    !dev && terser({ format: { comments: false } }),
    shouldDeploy && deployPlugin(),
  ],
};
