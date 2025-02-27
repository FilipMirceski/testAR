import serve from "rollup-plugin-serve";
import livereload from "rollup-plugin-livereload";
import { name, fileName } from "./rollup.config";

const fs = require("fs");
const buildHelper = require("./config/build-helper");
const babel = require("rollup-plugin-babel");

const httpsAvailable = fs.existsSync("./localhost-key.pem") && fs.existsSync("./localhost.pem");
const httpsOption = httpsAvailable
  ? {
    key: fs.readFileSync("./localhost-key.pem"),
    cert: fs.readFileSync('./localhost.pem')
  } : undefined;

export default buildHelper([
  {
    name,
    input: "./src/index.umd.ts",
    output: `./demo/release/latest/dist/${fileName}.pkgd.js`,
    format: "umd",
    resolve: true,
    plugins: [
      babel({
        include: ["src/**", "node_modules/three/**"],
        configFile: "./babel.config.js"
      }),
      serve({
        open: true,
        host: "0.0.0.0",
        contentBase: "demo",
        https: httpsOption,
      }),
      livereload({
        watch: ".",
        https: httpsOption,
      }),
    ]
  }
]);
