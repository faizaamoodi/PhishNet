// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "dist/bundle.js",
  output: {
    file: "dist/bundle.js",
    format: "esm"
  },
  plugins: [
    resolve()
  ]
};
