import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import commonjsExternals from "vite-plugin-commonjs-externals";

const commonjsPackages = ["path", "electron", "electron/main", "electron/common", "electron/renderer"];

export default defineConfig({
	base: "./",
	plugins: [commonjsExternals({ externals: commonjsPackages }), solidPlugin()],
	server: {
		port: 3000,
	},
	build: {
		target: "esnext",
	},
	optimizeDeps: {
		exclude: commonjsPackages,
	},
});
